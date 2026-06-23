package main

import (
	"os"

	"github.com/aprimr/tinypanda/internal/repl"
)

func main() {
	repl.Start(os.Stdin, os.Stdout)
}
