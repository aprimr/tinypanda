package main

import (
	"bytes"
	"flag"
	"fmt"
	"io"
	"os"
	"path/filepath"

	"tinypanda/internal/eval"
	"tinypanda/internal/lexer"
	"tinypanda/internal/object"
	"tinypanda/internal/parser"
	"tinypanda/internal/repl"
)

const (
	Reset = "\033[0m"
	Red   = "\033[31m"
)

const Version = "1.0.0"

func runTinyPandaJS(input string) string {
	l := lexer.New(input)
	p := parser.New(l)
	program := p.ParseProgram()

	// Catch Parsing Syntax Errors
	if len(p.Errors()) != 0 {
		var errBuffer bytes.Buffer
		fmt.Fprintf(&errBuffer, "Woops! Looks like some syntax errors!\n")
		for _, msg := range p.Errors() {
			fmt.Fprintf(&errBuffer, "  %s\n", msg)
		}
		return errBuffer.String()
	}

	env := object.NewEnvironment()
	evaluated := eval.Eval(program, env)

	// Catch Runtime Engine Errors
	if evaluated != nil && evaluated.Type() == object.ERROR_OBJ {
		return fmt.Sprintf("Runtime Error:\n  %s", evaluated.Inspect())
	}

	// If the last expression evaluates to something that isn't null, return it
	if evaluated != nil && evaluated.Type() != object.NULL_OBJ {
		return evaluated.Inspect()
	}

	return ""
}

func main() {
	// This function initializes your WASM bridge safely
	setupWasmBridge()

	// Native cli code
	flag.Usage = func() {
		fmt.Fprintf(os.Stderr, "Usage: tinypanda [options] or tinypanda run <file.tp>\n\n")
		fmt.Fprintf(os.Stderr, "Commands:\n")
		fmt.Fprintf(os.Stderr, "run \tExecute a .tp file\n\n")
		fmt.Fprintf(os.Stderr, "REPL options:\n")
		flag.PrintDefaults()
	}

	lexerFlag := flag.Bool("lexer", false, "Run REPL in lexer debug mode")
	parserFlag := flag.Bool("parser", false, "Run REPL in parser debug mode")
	versionFlag := flag.Bool("version", false, "Print installed version of tinypanda and exit")

	flag.Parse()

	if *versionFlag {
		fmt.Printf("TinyPanda v%s\n", Version)
		return
	}

	args := flag.Args()

	if len(args) > 0 && args[0] == "run" {
		runCmd := flag.NewFlagSet("run", flag.ExitOnError)
		runCmd.Parse(args[1:])
		runArgs := runCmd.Args()

		if len(runArgs) == 0 {
			fmt.Fprintf(os.Stderr, "error: <file.tp> argument is required\n")
			os.Exit(1)
		}

		filename := runArgs[0]
		ext := filepath.Ext(filename)
		if ext != ".tp" {
			fmt.Fprintf(os.Stderr, "error: invalid file extension '%s'.\n", ext)
			os.Exit(1)
		}

		runFile(runArgs[0])
		return
	}

	if len(args) == 0 {
		repl.Start(os.Stdin, os.Stdout, *lexerFlag, *parserFlag)
	} else {
		flag.Usage()
		os.Exit(1)
	}
}

func runFile(path string) {
	bytes, err := os.ReadFile(path)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error reading file %s: %s\n", path, err)
		os.Exit(1)
	}
	input := string(bytes)
	l := lexer.New(input)
	p := parser.New(l)
	program := p.ParseProgram()

	if len(p.Errors()) != 0 {
		printParserErrors(os.Stderr, p.Errors())
		os.Exit(1)
	}

	env := object.NewEnvironment()
	evaluated := eval.Eval(program, env)

	if evaluated != nil && evaluated.Type() == object.ERROR_OBJ {
		fmt.Fprintf(os.Stderr, "%sRuntime Error:\n  %s%s\n", Red, evaluated.Inspect(), Reset)
		os.Exit(1)
	}
}

func printParserErrors(out io.Writer, errors []string) {
	fmt.Fprintf(out, "%sWoops! Looks like some syntax errors!%s\n", Red, Reset)
	for _, msg := range errors {
		fmt.Fprintf(out, "  %s%s%s\n", Red, msg, Reset)
	}
}
