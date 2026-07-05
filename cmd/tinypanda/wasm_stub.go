//go:build !js || !wasm

package main

func setupWasmBridge() {
	// Do nothing when compiling for Windows, Mac, or Linux
}
