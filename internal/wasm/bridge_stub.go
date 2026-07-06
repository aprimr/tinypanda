//go:build !js || !wasm

package wasm

// Setup does nothing on native platforms
// This is the stub for Windows, Linux, and Mac builds
func Setup() {
	// No-op for native builds
}
