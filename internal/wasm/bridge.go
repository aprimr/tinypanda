//go:build js && wasm

package wasm

import (
	"bytes"
	"fmt"
	"syscall/js"
	"tinypanda/internal/eval"
	"tinypanda/internal/lexer"
	"tinypanda/internal/object"
	"tinypanda/internal/parser"
)

// Setup initializes the WASM bridge and exports functions to JavaScript
func Setup() {
	js.Global().Set("runTinyPanda", js.FuncOf(runTinyPanda))
	js.Global().Set("runTinyPandaDebug", js.FuncOf(runTinyPandaDebug))
	js.Global().Set("getTinyPandaVersion", js.FuncOf(getVersion))
	select {} // Keep WASM alive
}

// runTinyPanda is the main exported function for JavaScript
func runTinyPanda(this js.Value, args []js.Value) any {
	if len(args) < 1 {
		return "Error: No code provided"
	}

	input := args[0].String()
	l := lexer.New(input)
	p := parser.New(l)
	program := p.ParseProgram()

	// Catch parsing syntax errors
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

	// Catch runtime engine errors
	if evaluated != nil && evaluated.Type() == object.ERROR_OBJ {
		return fmt.Sprintf("Runtime Error:\n  %s", evaluated.Inspect())
	}

	// If the last expression evaluates to something that isn't null, return it
	if evaluated != nil && evaluated.Type() != object.NULL_OBJ {
		return evaluated.Inspect()
	}

	return ""
}

// runTinyPandaDebug is a debug version that returns more detailed information
func runTinyPandaDebug(this js.Value, args []js.Value) any {
	if len(args) < 1 {
		return "Error: No code provided"
	}

	input := args[0].String()

	// Lexer debug
	l := lexer.New(input)
	tokens := []string{}
	for {
		tok := l.NextToken()
		tokens = append(tokens, fmt.Sprintf("%s(%s)", tok.Type, tok.Literal))
		if tok.Type == lexer.EOF {
			break
		}
	}

	// Parser debug
	p := parser.New(lexer.New(input))
	program := p.ParseProgram()

	if len(p.Errors()) != 0 {
		return map[string]interface{}{
			"tokens": tokens,
			"errors": p.Errors(),
			"ast":    nil,
		}
	}

	return map[string]interface{}{
		"tokens": tokens,
		"errors": nil,
		"ast":    program.String(),
	}
}

// getVersion returns the current version of TinyPanda
func getVersion(this js.Value, args []js.Value) any {
	return "1.0.0"
}
