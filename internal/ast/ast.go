package ast

import (
	"bytes"
	"tinypanda/internal/lexer"
)

type Node interface {
	TokenLiteral() string
	String() string
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

func (p *Program) String() string {
	var out bytes.Buffer

	for _, s := range p.Statements {
		out.WriteString(s.String())
	}

	return out.String()
}

// BambooStatement represents a variable creation: "bamboo <name> = <expression>;"
type BambooStatement struct {
	Token lexer.Token
	Name  *Identifier
	Value Expression
}

func (bs *BambooStatement) statementNode()       {}
func (bs *BambooStatement) TokenLiteral() string { return bs.Token.Literal }
func (bs *BambooStatement) String() string {
	var out bytes.Buffer

	out.WriteString(bs.TokenLiteral())
	out.WriteString(" ")
	out.WriteString(bs.Name.String())
	out.WriteString(" = ")
	if bs.Value != nil {
		out.WriteString(bs.Value.String())
	}
	out.WriteString(";")

	return out.String()
}

// ReturnStatement: "return <expression>;". e.g: return 2; return x; or return a+b;
type ReturnStatement struct {
	Token       lexer.Token
	ReturnValue Expression
}

func (rs *ReturnStatement) statementNode()       {}
func (rs *ReturnStatement) TokenLiteral() string { return rs.Token.Literal }
func (rs *ReturnStatement) String() string {
	var out bytes.Buffer

	out.WriteString(rs.TokenLiteral())
	out.WriteString(" ")
	if rs.ReturnValue != nil {
		out.WriteString(rs.ReturnValue.String())
	}
	out.WriteString(";")

	return out.String()
}

// ExpressionStatement: e.g: 5 + 5, x + y, etc
type ExpressionStatement struct {
	Token      lexer.Token // The first token of the expression (e.g: x for x + y)
	Expression Expression  // The actual expression (x + y)
}

func (es *ExpressionStatement) statementNode()       {}
func (es *ExpressionStatement) TokenLiteral() string { return es.Token.Literal }
func (es *ExpressionStatement) String() string {
	if es.Expression != nil {
		return es.Expression.String()
	} else {
		return ""
	}
}

// Identifier represents a variable name (e.g., 'x', 'myAge').
// Even though it's a name, it is an Expression because we can assign a variable with value of another variable.
type Identifier struct {
	Token lexer.Token
	Value string
}

func (i *Identifier) expressionNode()      {}
func (i *Identifier) TokenLiteral() string { return i.Token.Literal }
func (i *Identifier) String() string       { return i.Value }

// IntegerLiteral: e.g: 5;
type IntegerLiteral struct {
	Token lexer.Token
	Value int64
}

func (il *IntegerLiteral) expressionNode()      {}
func (il *IntegerLiteral) TokenLiteral() string { return il.Token.Literal }
func (il *IntegerLiteral) String() string       { return il.Token.Literal }

// PrefixExpression: e.g: - 5, - a.
type PrefixExpression struct {
	Token    lexer.Token
	Operator string
	Right    Expression
}

func (pe *PrefixExpression) expressionNode()      {}
func (pe *PrefixExpression) TokenLiteral() string { return pe.Token.Literal }
func (pe *PrefixExpression) String() string {
	var out bytes.Buffer

	out.WriteString("(")
	out.WriteString(pe.Operator)
	out.WriteString(pe.Right.String())
	out.WriteString(")")

	return out.String()
}

// InfixExpression: e.g: 5 + 5.
type InfixExpression struct {
	Token    lexer.Token // The operator token e.g: + , -
	Left     Expression
	Operator string
	Right    Expression
}

func (ie *InfixExpression) expressionNode()      {}
func (ie *InfixExpression) TokenLiteral() string { return ie.Token.Literal }
func (ie *InfixExpression) String() string {
	var out bytes.Buffer

	out.WriteString("(")
	out.WriteString(ie.Left.String())
	out.WriteString(" ")
	out.WriteString(ie.Operator)
	out.WriteString(" ")
	out.WriteString(ie.Right.String())
	out.WriteString(")")

	return out.String()
}
