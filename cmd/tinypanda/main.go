package main

import (
	"os"

	"tinypanda/internal/repl"
)

func main() {
	repl.Start(os.Stdin, os.Stdout)
}
