//go:build js && wasm

package main

import "syscall/js"

func setupWasmBridge() {
	js.Global().Set("runTinyPanda", js.FuncOf(func(this js.Value, args []js.Value) any {
		if len(args) < 1 {
			return "Error: No code provided"
		}
		return runTinyPandaJS(args[0].String())
	}))
	select {} // Keep WASM alive
}
