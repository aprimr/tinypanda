package main

import (
	"flag"
	"os"

	"tinypanda/internal/repl"
)

func main() {
	// Define flags
	lexerFlag := flag.Bool("lexer", false, "Run REPL in lexer debug mode")
	parserFlag := flag.Bool("parser", false, "Run REPL in parser debug mode")

	flag.Parse()

	repl.Start(os.Stdin, os.Stdout, *lexerFlag, *parserFlag)
}
