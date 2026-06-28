package repl

import (
	"bufio"
	"fmt"
	"io"

	"tinypanda/internal/eval"
	"tinypanda/internal/lexer"
	"tinypanda/internal/parser"
)

const Green = "\033[32m"
const White = "\033[37m"
const Red = "\033[31m"

const BANNER = `%v
  _______             ____                  __   
 /_  __(_)___  __  __/ __ \____ _____  ____/ /___ _
  / / / / __ \/ / / / /_/ / __ '/ __ \/ __  / __ '/
 / / / / / / / /_/ / ____/ /_/ / / / / /_/ / /_/ / 
/_/ /_/_/ /_/\__, /_/    \__,_/_/ /_/\__,_/\__,_/  
            /____/

`

const PROMPT = ">> "

func Start(in io.Reader, out io.Writer, lexerMode, parserMode bool) {
	if lexerMode {
		fmt.Fprintf(out, Green+BANNER, "(Lexer Mode)")
	} else if parserMode {
		fmt.Fprintf(out, Green+BANNER, "(Parser Mode)")
	} else {
		fmt.Fprintf(out, Green+BANNER, "")
	}

	sc := bufio.NewScanner(in)

	for {
		fmt.Fprint(out, White+PROMPT)

		scanned := sc.Scan()
		if !scanned {
			if err := sc.Err(); err != nil {
				fmt.Fprintf(out, "Scanner error: %v\n", err)
			}
			return
		}

		line := sc.Text()
		if line == "" {
			continue
		}

		if lexerMode {
			runLexerDebug(line, out)
			continue
		} else if parserMode {
			runParserDebug(line, out)
			continue
		} else {
			runEvalator(line, out)
			continue
		}

	}
}

func runLexerDebug(line string, out io.Writer) {
	l := lexer.New(line)
	for {
		tok := l.NextToken()

		if tok.Type == "EOF" || tok.Type == "" {
			break
		}
		fmt.Fprintf(out, "{Type: %s, Value: %q}\n", tok.Type, tok.Literal)
	}
}

func runParserDebug(line string, out io.Writer) {
	l := lexer.New(line)
	p := parser.New(l)

	program := p.ParseProgram()
	if len(p.Errors()) != 0 {
		printParserErrors(out, p.Errors())
		return
	}

	io.WriteString(out, program.String())
	io.WriteString(out, "\n")
}

func runEvalator(line string, out io.Writer) {
	l := lexer.New(line)
	p := parser.New(l)

	program := p.ParseProgram()
	if len(p.Errors()) != 0 {
		printParserErrors(out, p.Errors())
	}

	evaluated := eval.Eval(program)
	if evaluated != nil {
		io.WriteString(out, evaluated.Inspect())
		io.WriteString(out, "\n")
	}
}

func printParserErrors(out io.Writer, errors []string) {
	fmt.Fprintf(out, "%sWoops! Looks like some syntax errors!%s\n", Red, White)

	for _, msg := range errors {
		fmt.Fprintf(out, "   %s%s%s\n", Red, msg, White)
	}
}
