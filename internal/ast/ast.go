package ast

import (
	"tinypanda/internal/lexer"
)

type Node interface {
	TokenLiteral() string
}

// Statement represents an instruction (e.g: bamboo x = 10;).
// It performs an action but donot calculate or return a value.
type Statement interface {
	Node
	statementNode()
}

// Expression is a piece of code that represents a value (e.g: 5, 10+2, add(2,5), etc.)
type Expression interface {
	Node
	expressionNode()
}

// Program is the root node of the Abstract Syntax Tree.
// Every single line of code parsed gets stored in this struct at last.
type Program struct {
	Statements []Statement
}

func (p *Program) TokenLiteral() string {
	if len(p.Statements) > 0 {
		return p.Statements[0].TokenLiteral()
	} else {
		return ""
	}
}

// BambooStatement represents a variable creation: "bamboo <name> = <expression>;"
type BambooStatement struct {
	Token lexer.Token
	Name  *Identifier
	Value Expression
}

func (bs *BambooStatement) statementNode()       {}
func (bs *BambooStatement) TokenLiteral() string { return bs.Token.Literal }

// ReturnStatement: "return <expression>;". e.g: return 2; return x; or return a+b;
type ReturnStatement struct {
	Token       lexer.Token
	ReturnValue Expression
}

func (rs *ReturnStatement) statementNode()       {}
func (rs *ReturnStatement) TokenLiteral() string { return rs.Token.Literal }

// Identifier represents a variable name (e.g., 'x', 'myAge').
// Even though it's a name, it is an Expression because we can assign a variable with value of another variable.
type Identifier struct {
	Token lexer.Token
	Value string
}

func (i *Identifier) expressionNode()      {}
func (i *Identifier) TokenLiteral() string { return i.Token.Literal }
