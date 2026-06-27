package parser

import (
	"fmt"
	"strconv"
	"tinypanda/internal/ast"
	"tinypanda/internal/lexer"
)

const (
	// iota  give the following constants incrementing numbers as values
	_ int = iota
	LOWEST
	EQUALS      // ==
	LESSGREATER // < or >
	SUM         // +
	PRODUCT     // *
	PREFIX      // +X or !X
	CALL        // myFn(X)
)

// This is the precedence table, it associates token types with their precedence.
var precedences = map[lexer.TokenType]int{
	lexer.EQUALS:    EQUALS,
	lexer.NOTEQUALS: EQUALS,
	lexer.GT:        LESSGREATER,
	lexer.LT:        LESSGREATER,
	lexer.PLUS:      SUM,
	lexer.MINUS:     SUM,
	lexer.SLASH:     PRODUCT,
	lexer.ASTERISK:  PRODUCT,
	lexer.LPAREN:    CALL,
}

type prefixParseFn func() ast.Expression
type infixParseFn func(ast.Expression) ast.Expression

type Parser struct {
	l         *lexer.Lexer
	errors    []string
	curToken  lexer.Token // Current token we are looking at
	peekToken lexer.Token // The next token

	prefixParseFns map[lexer.TokenType]prefixParseFn
	infixParseFns  map[lexer.TokenType]infixParseFn
}

func New(l *lexer.Lexer) *Parser {
	p := &Parser{
		l:      l,
		errors: []string{}, // Initialize error field in the parser
	}

	// Initialize prefix map: Routes tokens found at the start of an expression to their parser functions.
	p.prefixParseFns = make(map[lexer.TokenType]prefixParseFn)
	p.registerPrefix(lexer.IDENT, p.parseIdentifier)
	p.registerPrefix(lexer.INT, p.parseIntegerLiteral)
	p.registerPrefix(lexer.EXCLAM, p.parsePrefixExpression) // handles '!true', '!x'
	p.registerPrefix(lexer.MINUS, p.parsePrefixExpression)  // handles '-5', '-x'
	p.registerPrefix(lexer.TRUE, p.parseBoolean)
	p.registerPrefix(lexer.FALSE, p.parseBoolean)
	p.registerPrefix(lexer.LPAREN, p.parseGroupedExpression)
	p.registerPrefix(lexer.IFF, p.parseIffExpression)
	p.registerPrefix(lexer.FN, p.parseFunctionLiteral)

	// Initialize infix map: Routes tokens found in the middle of an expression to their parser functions.
	p.infixParseFns = make(map[lexer.TokenType]infixParseFn)
	p.registerInfix(lexer.PLUS, p.parseInfixExpression)
	p.registerInfix(lexer.MINUS, p.parseInfixExpression)
	p.registerInfix(lexer.SLASH, p.parseInfixExpression)
	p.registerInfix(lexer.ASTERISK, p.parseInfixExpression)
	p.registerInfix(lexer.EQUALS, p.parseInfixExpression)
	p.registerInfix(lexer.NOTEQUALS, p.parseInfixExpression)
	p.registerInfix(lexer.LT, p.parseInfixExpression)
	p.registerInfix(lexer.GT, p.parseInfixExpression)
	p.registerInfix(lexer.LPAREN, p.parseCallExpression)

	// Read two tokens to initialize both curToken and peekToken
	p.nextToken()
	p.nextToken()
	return p
}

// Errors returns the list of errors found during parsing.
func (p *Parser) Errors() []string {
	return p.errors
}

// peekError push an error to the Errors slice.
// Called if the next token type doesn't match the expected token type.
func (p *Parser) peekError(t lexer.TokenType) {
	msg := fmt.Sprintf("expected next token to be %v, got %v instead", t, p.peekToken.Type)
	p.errors = append(p.errors, msg)
}

// noPrefixParseFnError push an error to the Errors slice.
// Called if an expression starts with an undefined token.
func (p *Parser) noPrefixParseFnError(t lexer.TokenType) {
	msg := fmt.Sprintf("no prefix parse function for %s found", t)
	p.errors = append(p.errors, msg)
}

// nextToken increments the curToken and peekToken pointer by one position.
func (p *Parser) nextToken() {
	p.curToken = p.peekToken
	p.peekToken = p.l.NextToken()
}

// ParseProgram is the entry point. It loops through the entire token stream until EOF token to build the root AST Program node.
func (p *Parser) ParseProgram() *ast.Program {
	program := &ast.Program{}
	program.Statements = []ast.Statement{}

	for !p.curTokenIs(lexer.EOF) {
		stmt := p.parseStatement()
		if stmt != nil {
			program.Statements = append(program.Statements, stmt)
		}
		p.nextToken()
	}

	return program
}

// parseStatement checks the current token and routes it to the respective statement parser
func (p *Parser) parseStatement() ast.Statement {
	switch p.curToken.Type {
	case lexer.BAMBOO:
		return p.parseBambooStatement()
	case lexer.RETURN:
		return p.parseReturnStatement()
	default:
		return p.parseExpressionStatement()
	}
}

// parseIdentifier creates an AST node for a variable name or identifier.
func (p *Parser) parseIdentifier() ast.Expression {
	return &ast.Identifier{Token: p.curToken, Value: p.curToken.Literal}
}

// parseExpression is the core Pratt parser engine. It parses expressions
// based on operator priority (precedence).
func (p *Parser) parseExpression(precedence int) ast.Expression {
	prefix := p.prefixParseFns[p.curToken.Type]

	if prefix == nil {
		p.noPrefixParseFnError(p.curToken.Type)
		return nil
	}
	leftExp := prefix()

	for !p.peekTokenIs(lexer.SEMICOLON) && precedence < p.peekPrecedence() {
		infix := p.infixParseFns[p.peekToken.Type]
		if infix == nil {
			return leftExp
		}
		p.nextToken()

		leftExp = infix(leftExp)
	}

	return leftExp
}

// parseBambooStatement parses a variable assignment line (e.g., 'bamboo x = 5;').
func (p *Parser) parseBambooStatement() *ast.BambooStatement {
	stmt := &ast.BambooStatement{Token: p.curToken}

	if !p.expectPeek(lexer.IDENT) {
		return nil
	}

	stmt.Name = &ast.Identifier{Token: p.curToken, Value: p.curToken.Literal}

	if !p.expectPeek(lexer.ASSIGN) {
		return nil
	}

	// TODO: skipping the expression  part

	// Call nextToken until semicolon is found
	for !p.curTokenIs(lexer.SEMICOLON) {
		p.nextToken()
	}
	return stmt
}

// parseReturnStatement parses a return statement (e.g., 'return 5;').
func (p *Parser) parseReturnStatement() *ast.ReturnStatement {
	stmt := &ast.ReturnStatement{Token: p.curToken}
	p.nextToken()

	// TODO: Implement expression part; skipping it for now

	// Call nextToken until semicolon is found
	for !p.curTokenIs(lexer.SEMICOLON) {
		p.nextToken()
	}

	return stmt
}

// parseExpressionStatement parses expression (e.g., '5 + 5;' or 'x;').
func (p *Parser) parseExpressionStatement() *ast.ExpressionStatement {
	stmt := &ast.ExpressionStatement{Token: p.curToken}

	stmt.Expression = p.parseExpression(LOWEST)

	if p.peekTokenIs(lexer.SEMICOLON) {
		p.nextToken()
	}

	return stmt
}

// parseIntegerLiteral converts the current token text into a valid number AST node.
func (p *Parser) parseIntegerLiteral() ast.Expression {
	lit := &ast.IntegerLiteral{Token: p.curToken}

	value, err := strconv.ParseInt(p.curToken.Literal, 0, 64)
	if err != nil {
		msg := fmt.Sprintf("could ot parse %v as integer", p.curToken.Literal)
		p.errors = append(p.errors, msg)
		return nil
	}

	lit.Value = value
	return lit
}

// parsePrefixExpression handles '!' or '-' operators.
// It saves the operator, moves after operator, and then parses whatever comes next.
// e.g: -5
// first it saves the operator '-' and moves after it and then parse the expression '5' in this case
func (p *Parser) parsePrefixExpression() ast.Expression {
	expr := &ast.PrefixExpression{
		Token:    p.curToken,
		Operator: p.curToken.Literal,
	}

	p.nextToken()
	// Parse the expression after the operator
	expr.Right = p.parseExpression(PREFIX)
	return expr
}

// parseInfixExpression handles operators between two expressions (e.g., '5 + 10').
func (p *Parser) parseInfixExpression(left ast.Expression) ast.Expression {
	expr := &ast.InfixExpression{
		Token:    p.curToken,
		Operator: p.curToken.Literal,
		Left:     left,
	}

	precedence := p.curPrecedence()
	p.nextToken()
	expr.Right = p.parseExpression(precedence)

	return expr
}

// parseBoolean handles the boolean tokens `true` and `false`
func (p *Parser) parseBoolean() ast.Expression {
	return &ast.Boolean{Token: p.curToken, Value: p.curTokenIs(lexer.TRUE)}
}

// parseGroupedExpression parses an expression enclosed in parentheses, e.g., (expression).
func (p *Parser) parseGroupedExpression() ast.Expression {
	p.nextToken()

	exp := p.parseExpression(LOWEST)

	if !p.expectPeek(lexer.RPAREN) {
		return nil
	}

	return exp
}

// parseIfExpression parses conditional 'iff' expression and constructs its AST node.
// Expected syntax: iff (condition) { <consequence> } otherwise { <alternative> }
func (p *Parser) parseIffExpression() ast.Expression {
	expr := &ast.IffExpression{Token: p.curToken}

	// Check for '(' after iff token
	if !p.expectPeek(lexer.LPAREN) {
		return nil
	}

	p.nextToken()
	expr.Condition = p.parseExpression(LOWEST)

	// Check for ')' after the if condition
	if !p.expectPeek(lexer.RPAREN) {
		return nil
	}

	// Check for '{' after the '(' token
	if !p.expectPeek(lexer.LBRACE) {
		return nil
	}

	// Parse block statements after IFF parenthesis
	expr.Consequence = p.parseBlockStatement()

	// Parse otherwise block if present
	if p.peekTokenIs(lexer.OTHERWISE) {
		p.nextToken()

		// Check for '{' after the OTHERWISE token
		if !p.expectPeek(lexer.LBRACE) {
			return nil
		}

		// Parse block statements after OTHERWISE parenthesis
		expr.Alternative = p.parseBlockStatement()
	}

	return expr
}

// parseFunctionLiteral parses function and constructs its AST node.
// Expected syntax : fn (<params>) {<statements>}
func (p *Parser) parseFunctionLiteral() ast.Expression {
	lit := &ast.FunctionLiteral{Token: p.curToken}

	// check if expected token is '('
	if !p.expectPeek(lexer.LPAREN) {
		return nil
	}

	// function parameters:  fn (a, b, c) ...
	lit.Params = p.parseFunctionParams()

	// check if expected token is '{' and if so parse the function body
	if !p.expectPeek(lexer.LBRACE) {
		return nil
	}

	lit.Body = p.parseBlockStatement()

	return lit
}

// parseFunctionParams parses the parameter list of a function declaration, e.g., (x, y, z).
func (p *Parser) parseFunctionParams() []*ast.Identifier {
	identifiers := []*ast.Identifier{}

	//  if the fn declaration is like fn(){...}
	//  return empty params list
	if p.peekTokenIs(lexer.RPAREN) {
		p.nextToken()
		return identifiers
	}

	p.nextToken()

	ident := &ast.Identifier{Token: p.curToken, Value: p.curToken.Literal}
	identifiers = append(identifiers, ident)

	for p.peekTokenIs(lexer.COMMA) {
		p.nextToken()
		p.nextToken()
		ident := &ast.Identifier{Token: p.curToken, Value: p.curToken.Literal}
		identifiers = append(identifiers, ident)
	}

	// Check if the ')' is present
	if !p.expectPeek(lexer.RPAREN) {
		return nil
	}

	return identifiers
}

// parseBlockStatement parses statements enclosed in the braces.
// e.g: { stmt1; stmt2; }
func (p *Parser) parseBlockStatement() *ast.BlockStatement {
	block := &ast.BlockStatement{Token: p.curToken}
	block.Statements = []ast.Statement{}

	p.nextToken()

	for !p.curTokenIs(lexer.RBRACE) && !p.curTokenIs(lexer.EOF) {
		stmt := p.parseStatement()
		if stmt != nil {
			block.Statements = append(block.Statements, stmt)
		}
		p.nextToken()
	}

	return block
}

// parseCallExpression parses a function call invocation expression in the AST.
func (p *Parser) parseCallExpression(function ast.Expression) ast.Expression {
	exp := &ast.CallExpression{Token: p.curToken, Function: function}
	exp.Arguments = p.parseCallArguments()
	return exp
}

// parseCallArguments
func (p *Parser) parseCallArguments() []ast.Expression {
	args := []ast.Expression{}

	if p.peekTokenIs(lexer.RPAREN) {
		p.nextToken()
		return args
	}

	p.nextToken()
	args = append(args, p.parseExpression(LOWEST))

	for p.peekTokenIs(lexer.COMMA) {
		p.nextToken()
		p.nextToken()
		args = append(args, p.parseExpression(LOWEST))
	}

	if !p.expectPeek(lexer.RPAREN) {
		return nil
	}

	return args
}

// curTokenIs checks if the token parser is looking at matches a specific token type.
func (p *Parser) curTokenIs(t lexer.TokenType) bool {
	return p.curToken.Type == t
}

// peekTokenIs looks at the next token after curToken and checks if it matches a specific token type
func (p *Parser) peekTokenIs(t lexer.TokenType) bool {
	return p.peekToken.Type == t
}

// expectPeek checks if the next token is of the expected type.
// If yes, it moves to next token and returns true.
// If no, it logs syntax error and returns false.
func (p *Parser) expectPeek(t lexer.TokenType) bool {
	if p.peekTokenIs(t) {
		p.nextToken()
		return true
	} else {
		p.peekError(t)
		return false
	}
}

func (p *Parser) registerPrefix(tokenType lexer.TokenType, fn prefixParseFn) {
	p.prefixParseFns[tokenType] = fn
}

func (p *Parser) registerInfix(tokenType lexer.TokenType, fn infixParseFn) {
	p.infixParseFns[tokenType] = fn
}

// peekPrecedence lookup precedences table and return precedence value for next token.
// If it doesn’t find a precedence for p.peekToken it defaults to LOWEST
func (p *Parser) peekPrecedence() int {
	if p, ok := precedences[p.peekToken.Type]; ok {
		return p
	}

	return LOWEST
}

// curPrecedence lookup precedences table and return precedence value for current token.
// If it doesn’t find a precedence for p.curToken it defaults to LOWEST
func (p *Parser) curPrecedence() int {
	if p, ok := precedences[p.curToken.Type]; ok {
		return p
	}

	return LOWEST
}
