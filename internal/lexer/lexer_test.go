package lexer

import (
	"testing"
)

func TestNextToken(t *testing.T) {
	input := `bamboo x = 5;
		bamboo y = 10;

		bamboo add = fn(a, b) {
			a + b;
		}
		
		bamboo res = add(x, y);`

	tests := []struct {
		expectedType    TokenType
		expectedLiteral string
	}{
		{BAMBOO, "bamboo"},
		{IDENT, "x"},
		{ASSIGN, "="},
		{INT, "5"},
		{SEMICOLON, ";"},

		{BAMBOO, "bamboo"},
		{IDENT, "y"},
		{ASSIGN, "="},
		{INT, "10"},
		{SEMICOLON, ";"},

		{BAMBOO, "bamboo"},
		{IDENT, "add"},
		{ASSIGN, "="},
		{FN, "fn"},
		{LPAREN, "("},
		{IDENT, "a"},
		{COMMA, ","},
		{IDENT, "b"},
		{RPAREN, ")"},
		{LBRACE, "{"},
		{IDENT, "a"},
		{PLUS, "+"},
		{IDENT, "b"},
		{SEMICOLON, ";"},
		{RBRACE, "}"},

		{BAMBOO, "bamboo"},
		{IDENT, "res"},
		{ASSIGN, "="},
		{IDENT, "add"},
		{LPAREN, "("},
		{IDENT, "x"},
		{COMMA, ","},
		{IDENT, "y"},
		{RPAREN, ")"},
		{SEMICOLON, ";"},
	}

	l := New(input)

	for i, tt := range tests {

		tok := l.NextToken()

		if tok.Type != tt.expectedType {
			t.Fatalf("tests[%d] - tokentype wrong. expected=%q, got=%q",
				i, tt.expectedType, tok.Type)
		}
		if tok.Literal != tt.expectedLiteral {
			t.Fatalf("tests[%d] - literal wrong. expected=%q, got=%q",
				i, tt.expectedLiteral, tok.Literal)
		}
	}
}
