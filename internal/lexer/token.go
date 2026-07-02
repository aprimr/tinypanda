package lexer

// TokenType represents the category og a lexical token
// (eg. IDENT, INT, PLUS, BAMBOO)
type TokenType string

const (
	ILLEGAL TokenType = "ILLEGAL"
	EOF     TokenType = "EOF"

	// Identifiers
	IDENT  TokenType = "IDENT"
	INT    TokenType = "INT"
	STRING TokenType = "STRING"

	// Operators
	ASSIGN   TokenType = "ASSIGN"
	PLUS     TokenType = "PLUS"
	MINUS    TokenType = "MINUS"
	ASTERISK TokenType = "ASTERISK"
	SLASH    TokenType = "SLASH"
	EXCLAM   TokenType = "EXCLAM"

	// Comparision
	LT        TokenType = "LT"
	GT        TokenType = "GT"
	LT_EQUALS TokenType = "LT_EQUALS"
	GT_EQUALS TokenType = "GT_EQUALS"
	EQUALS    TokenType = "EQUALS"
	NOTEQUALS TokenType = "NOTEQUALS"

	// Others
	COMMA     TokenType = "COMMA"
	SEMICOLON TokenType = "SELMICOLON"

	LPAREN TokenType = "("
	RPAREN TokenType = ")"
	LBRACE TokenType = "{"
	RBRACE TokenType = "}"

	// Keywords
	BAMBOO    TokenType = "BAMBOO"    // let
	FN        TokenType = "FN"        // function
	IFF       TokenType = "IFF"       // if
	OTHERWISE TokenType = "OTHERWISE" // else
	TRUE      TokenType = "TRUE"
	FALSE     TokenType = "FALSE"
	RETURN    TokenType = "RETURN"
)

// Token represents a single unit produced by the Lexer.
// It contains the type of token and the actual value from the source code.
type Token struct {
	Type    TokenType // category of token
	Literal string    // actual string value from source code
}

// A dictionary of string keyowrds to their corresponding TokenType.
var keywords = map[string]TokenType{
	"bamboo":    BAMBOO,
	"fn":        FN,
	"iff":       IFF,
	"otherwise": OTHERWISE,
	"true":      TRUE,
	"false":     FALSE,
	"return":    RETURN,
}

// LookupIdent maps an identifier literal string to its corresponding TokenType.
// It returns a keyword TokenType if matched, or IDENT for user-defined identifiers.
func LookupIdent(ident string) TokenType {
	if tok, ok := keywords[ident]; ok {
		return tok
	}
	return IDENT
}
