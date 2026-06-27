package repl

import (
	"bufio"
	"fmt"
	"io"

	"tinypanda/internal/lexer"
)

const Green = "\033[32m"
const White = "\033[37m"

const BANNER = `																					 
  _______             ____                  __   
 /_  __(_)___  __  __/ __ \____ _____  ____/ /___ _
  / / / / __ \/ / / / /_/ / __ '/ __ \/ __  / __ '/
 / / / / / / / /_/ / ____/ /_/ / / / / /_/ / /_/ / 
/_/ /_/_/ /_/\__, /_/    \__,_/_/ /_/\__,_/\__,_/  
            /____/


`

const PROMPT = ">> "

func Start(in io.Reader, out io.Writer) {
	fmt.Fprintf(out, Green+BANNER)
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
		l := lexer.New(line)

		for tok := l.NextToken(); tok.Type != lexer.EOF; tok = l.NextToken() {
			fmt.Fprintf(out, "%v \n", tok)
		}
	}

}
