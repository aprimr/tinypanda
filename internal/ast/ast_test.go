package ast

import (
	"testing"
	"tinypanda/internal/lexer"
)

func TestString(t *testing.T) {
	program := &Program{
		Statements: []Statement{
			&BambooStatement{
				Token: lexer.Token{Type: lexer.BAMBOO, Literal: "bamboo"},
				Name: &Identifier{
					Token: lexer.Token{Type: lexer.IDENT, Literal: "myVar"},
					Value: "myVar",
				},
				Value: &Identifier{
					Token: lexer.Token{Type: lexer.IDENT, Literal: "anotherVar"},
					Value: "anotherVar",
				},
			},
		},
	}
	if program.String() != "bamboo myVar = anotherVar;" {
		t.Errorf("program.String() wrong. got=%q", program.String())
	}
}
