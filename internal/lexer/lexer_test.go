package lexer

import (
	"testing"
)

func TestNextToken(t *testing.T) {
	input := `bamboo x = 5;
		bamboo y = 10;
		bamboo pi = 3.16;
		bamboo z = 10 >= 10;

		bamboo add = fn(a, b) {
			a + b;
		}
		
		bamboo res = add(x, y);
		
		!*-/5;
		5 < 10 > 5;

		iff (5 < 10) {
			return true;
		} otherwise {
			return false;
		}

		10 == 10;
		10 != 9;
		5 % 2;

		"Hello World";
		"aprim.dev";
		"aprim \nregmi";
		"Hello \tWorld";
		"Hello \\World";

		[1, 2];
		x = 5 % 2 == 0 ? true : false;
		x = x++;
		y = y--;

		loop(x<10) { x++; }
		for(i=0; i<10; i++){}
		`

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
		{IDENT, "pi"},
		{ASSIGN, "="},
		{FLOAT, "3.16"},
		{SEMICOLON, ";"},

		{BAMBOO, "bamboo"},
		{IDENT, "z"},
		{ASSIGN, "="},
		{INT, "10"},
		{GT_EQUALS, ">="},
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

		{EXCLAM, "!"},
		{ASTERISK, "*"},
		{MINUS, "-"},
		{SLASH, "/"},
		{INT, "5"},
		{SEMICOLON, ";"},

		{INT, "5"},
		{LT, "<"},
		{INT, "10"},
		{GT, ">"},
		{INT, "5"},
		{SEMICOLON, ";"},

		{IFF, "iff"},
		{LPAREN, "("},
		{INT, "5"},
		{LT, "<"},
		{INT, "10"},
		{RPAREN, ")"},
		{LBRACE, "{"},
		{RETURN, "return"},
		{TRUE, "true"},
		{SEMICOLON, ";"},
		{RBRACE, "}"},
		{OTHERWISE, "otherwise"},
		{LBRACE, "{"},
		{RETURN, "return"},
		{FALSE, "false"},
		{SEMICOLON, ";"},
		{RBRACE, "}"},

		{INT, "10"},
		{EQUALS, "=="},
		{INT, "10"},
		{SEMICOLON, ";"},
		{INT, "10"},
		{NOTEQUALS, "!="},
		{INT, "9"},
		{SEMICOLON, ";"},
		{INT, "5"},
		{MOD, "%"},
		{INT, "2"},
		{SEMICOLON, ";"},

		{STRING, "Hello World"},
		{SEMICOLON, ";"},
		{STRING, "aprim.dev"},
		{SEMICOLON, ";"},
		{STRING, "aprim \nregmi"},
		{SEMICOLON, ";"},
		{STRING, "Hello \tWorld"},
		{SEMICOLON, ";"},
		{STRING, "Hello \\World"},
		{SEMICOLON, ";"},

		{LBRACKET, "["},
		{INT, "1"},
		{COMMA, ","},
		{INT, "2"},
		{RBRACKET, "]"},
		{SEMICOLON, ";"},

		{IDENT, "x"},
		{ASSIGN, "="},
		{INT, "5"},
		{MOD, "%"},
		{INT, "2"},
		{EQUALS, "=="},
		{INT, "0"},
		{QUESTION, "?"},
		{TRUE, "true"},
		{COLON, ":"},
		{FALSE, "false"},
		{SEMICOLON, ";"},

		{IDENT, "x"},
		{ASSIGN, "="},
		{IDENT, "x"},
		{INCREMENT, "++"},
		{SEMICOLON, ";"},

		{IDENT, "y"},
		{ASSIGN, "="},
		{IDENT, "y"},
		{DECREMENT, "--"},
		{SEMICOLON, ";"},

		{LOOP, "loop"},
		{LPAREN, "("},
		{IDENT, "x"},
		{LT, "<"},
		{INT, "10"},
		{RPAREN, ")"},
		{LBRACE, "{"},
		{IDENT, "x"},
		{INCREMENT, "++"},
		{SEMICOLON, ";"},
		{RBRACE, "}"},

		{FOR, "for"},
		{LPAREN, "("},
		{IDENT, "i"},
		{ASSIGN, "="},
		{INT, "0"},
		{SEMICOLON, ";"},
		{IDENT, "i"},
		{LT, "<"},
		{INT, "10"},
		{SEMICOLON, ";"},
		{IDENT, "i"},
		{INCREMENT, "++"},
		{RPAREN, ")"},
		{LBRACE, "{"},
		{RBRACE, "}"},

		{EOF, ""},
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
