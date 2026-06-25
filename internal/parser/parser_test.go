// parser/parser_test.go
package parser

import (
	"testing"
	"tinypanda/internal/ast"
	"tinypanda/internal/lexer"
)

func TestBambooStatements(t *testing.T) {
	input := `
		bamboo x  5;
		bamboo = 10;
		bamboo 838383;
	`

	// Initialize lexer and parser
	l := lexer.New(input)
	p := New(l)

	program := p.ParseProgram()
	checkParserErrors(t, p)
	if program == nil {
		t.Fatalf("ParseProgram() returned nil")
	}

	if len(program.Statements) != 3 {
		t.Fatalf("program.Statements does not contain 3 statements. got=%d",
			len(program.Statements))
	}

	tests := []struct {
		expectedIdentifier string
	}{
		{"x"},
		{"y"},
		{"foobar"},
	}
	for i, tt := range tests {
		stmt := program.Statements[i]
		if !testBambooStatement(t, stmt, tt.expectedIdentifier) {
			return
		}
	}
}

func testBambooStatement(t *testing.T, s ast.Statement, name string) bool {
	if s.TokenLiteral() != "bamboo" {
		t.Errorf("s.TokenLiteral not 'bamboo'. got=%q", s.TokenLiteral())
		return false
	}

	bambooStmt, ok := s.(*ast.BambooStatement)
	if !ok {
		t.Errorf("s not *ast.BambooStatement. got=%T", s)
		return false
	}

	if bambooStmt.Name.Value != name {
		t.Errorf("bambooStmt.Name.Value not '%s'. got=%s", name, bambooStmt.Name.Value)
		return false
	}

	if bambooStmt.Name.TokenLiteral() != name {
		t.Errorf("s.Name not '%s'. got=%s", name, bambooStmt.Name)
		return false
	}

	return true
}

func TestReturnStatements(t *testing.T) {
	input := `
		return 5;
		return 10;
		return 993322;
	`
	l := lexer.New(input)
	p := New(l)
	program := p.ParseProgram()
	checkParserErrors(t, p)
	if len(program.Statements) != 3 {
		t.Fatalf("program.Statements does not contain 3 statements. got=%d",

			len(program.Statements))
	}
	for _, stmt := range program.Statements {
		returnStmt, ok := stmt.(*ast.ReturnStatement)
		if !ok {
			t.Errorf("stmt not *ast.returnStatement. got=%T", stmt)
			continue
		}
		if returnStmt.TokenLiteral() != "return" {
			t.Errorf("returnStmt.TokenLiteral not 'return', got %q",
				returnStmt.TokenLiteral())
		}
	}
}

func checkParserErrors(t *testing.T, p *Parser) {
	errors := p.Errors()

	if len(errors) == 0 {
		return
	}
	t.Errorf("parser has %d errors", len(errors))
	for _, msg := range errors {
		t.Errorf("parser error: %q", msg)
	}
	t.FailNow()
}
