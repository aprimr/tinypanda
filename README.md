<h1 align="left" style="display: flex; gap: 20px">
  <img src="https://raw.githubusercontent.com/aprimr/tinypanda/main/website/static/img/logo.svg" height="38" alt="TinyPanda logo" />
  <p>TinyPanda</p>
</h1>

<p align="center">
  <img src="https://raw.githubusercontent.com/aprimr/tinypanda/main/website/static/img/mascot-01.svg" width="200" alt="tinypanda mascot"/>
</p>

<h4 align="center">
  <a href="https://tinypanda.netlify.app/">Website</a> |
  <a href="https://tinypanda.netlify.app/download">Download</a> |
  <a href="https://tinypanda.netlify.app/playground">Playground</a>
</h4>

<p align="center">
  <a href="https://github.com/aprimr/tinypanda/blob/master/LICENSE.md">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="tinypanda is released under the MIT license." />
  </a>
  <a href="https://tinypanda.netlify.app/docs/intro">
    <img src="https://img.shields.io/badge/documentation-docs" alt="tinypanda docs" />
  </a>
  <a href="https://github.com/aprimr/tinypanda/releases">
    <img src="https://img.shields.io/github/v/release/aprimr/tinypanda.svg" alt="Latest Release" />
  </a>
</p>

<p align="center">
  A minimalist, small, interpreted programming language written entirely in Go. Designed to run natively as a lightweight CLI tool and seamlessly in the browser via WebAssembly.
</p>

## Features

- **Fast execution** — leverages Go's runtime to execute interpreted scripts efficiently.
- **Lightweight & self-contained** — distributed as a single compiled binary for the CLI. No heavy dependencies or virtual machines required..
- **No complex setup** — no environment configs to fight with. Download the executable or run it online to start coding instantly.
- **Simple & fun syntax** — a readable syntax with keywords like `bamboo`, `iff`/`otherwise`, and functions like `echo`/`echoln`.


## CLI Commands

* `tinypanda` — Run the interactive TinyPanda REPL.
* `tinypanda run <file.tp>` — Execute a script natively on your system.
* `tinypanda --lexer` — Run the TinyPanda REPL in lexer mode.
* `tinypanda --parser` — Run the TinyPanda REPL in parser mode.
* `tinypanda --help` — Display usage instructions, options, and available flags.
* `tinypanda --version` — Print the current version of the TinyPanda interpreter.

## Quick Start

### 1. Try it in the browser

No installation required. Head over to the web-based playground powered by WebAssembly:

[Launch the tinypanda Playground](https://tinypanda.netlify.app/playground)

### 2. Installation (CLI)

Download the latest binary for your OS from the [Releases page](https://github.com/aprimr/tinypanda/releases) or [download](https://tinypanda.netlify.app/download) latest binary.

### 3. Your first script

Create a file named `main.tp`:

```
bamboo name = "TinyPanda";

echoln(name + " is fun!!!");

bamboo sayhello = fn(x) {
    echoln("Hello ", x);
    return "This is fasttt!!";
};

bamboo msg = sayhello(name);
echoln(msg);
```

Run it locally via the CLI:

```bash
tinypanda run main.tp
```

## Documentation

For the complete reference manual and language specification, see the [tinypanda documentation](https://tinypanda.netlify.app/docs/intro).

## License

Released under the [MIT License](https://github.com/aprimr/tinypanda/blob/master/LICENSE.md).