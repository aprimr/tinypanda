// Lexer implements lexical analysis for Tiny Panda programming language.
// It converts source code into a stream of tokens for the parser.

package lexer

type Lexer struct {
	input        string // raw source code to be tokenized
	position     int    // index of current character
	readPosition int    // index of next immediate character
	char         byte   // current character under examination
}

func New(input string) *Lexer {
	l := &Lexer{input: input}
	l.readChar()
	return l
}

func (l *Lexer) readChar() {
	if l.readPosition >= len(l.input) {
		l.char = 0
	} else {
		l.char = l.input[l.readPosition]
	}

	l.position = l.readPosition
	l.readPosition++
}

// NextToken scans the next token from the input. It automatically skips
// whitespace and handles both single-character operators and multi-character identifiers.
func (l *Lexer) NextToken() Token {
	var tok Token
	l.skipWhitespace()

	switch l.char {
	case '=':
		if l.peekChar() == '=' {
			char := l.char
			l.readChar()
			tok = Token{Type: EQUALS, Literal: string(char) + string(l.char)}
		} else {
			tok = newToken(ASSIGN, l.char)
		}
	case '+':
		tok = newToken(PLUS, l.char)
	case '-':
		tok = newToken(MINUS, l.char)
	case '*':
		tok = newToken(ASTERISK, l.char)
	case '/':
		tok = newToken(SLASH, l.char)
	case '!':
		if l.peekChar() == '=' {
			char := l.char
			l.readChar()
			tok = Token{Type: NOTEQUALS, Literal: string(char) + string(l.char)}
		} else {
			tok = newToken(EXCLAM, l.char)
		}
	case '<':
		tok = newToken(LT, l.char)
	case '>':
		tok = newToken(GT, l.char)
	case ',':
		tok = newToken(COMMA, l.char)
	case ';':
		tok = newToken(SEMICOLON, l.char)
	case '(':
		tok = newToken(LPAREN, l.char)
	case ')':
		tok = newToken(RPAREN, l.char)
	case '{':
		tok = newToken(LBRACE, l.char)
	case '}':
		tok = newToken(RBRACE, l.char)
	case 0:
		tok.Type = EOF
		tok.Literal = ""

	default:
		if isLetter(l.char) {
			tok.Literal = l.readIdentfier()
			tok.Type = LookupIdent(tok.Literal)
			return tok
		} else if isDigit(l.char) {
			tok.Type = INT
			tok.Literal = l.readNumber()
			return tok
		} else {
			tok = newToken(ILLEGAL, l.char)
		}
	}

	l.readChar()
	return tok
}

// skipWhitespace skips spaces, tabs, and newline formatting to find next valid token.
func (l *Lexer) skipWhitespace() {
	for l.char == ' ' || l.char == '\n' || l.char == '\t' || l.char == '\r' {
		l.readChar()
	}
}

func newToken(tokenType TokenType, char byte) Token {
	return Token{Type: tokenType, Literal: string(char)}
}

// readIdentifier reads characters until a non letter character is reached, returing the complete string literal.
func (l *Lexer) readIdentfier() string {
	position := l.position

	for isLetter(l.char) {
		l.readChar()
	}
	return l.input[position:l.position]
}

// isLetter checks if the character is valid for identifier or keyword name.
// It allows albhabetical characters and underscores.
func isLetter(char byte) bool {
	return char >= 'a' && char <= 'z' || char >= 'A' && char <= 'Z' || char == '_'
}

// readNumber reads characters until a non digit character is reached.
func (l *Lexer) readNumber() string {
	position := l.position

	for isDigit(l.char) {
		l.readChar()
	}

	return l.input[position:l.position]
}

func isDigit(char byte) bool {
	return char >= '0' && char <= '9'
}

// peekChar returns the next character in the input without incrementing the lexer's position.
// It is used to peek one step to check multi-character operators.
func (l *Lexer) peekChar() byte {
	if l.readPosition >= len(l.input) {
		return 0
	} else {
		return l.input[l.readPosition]
	}
}
