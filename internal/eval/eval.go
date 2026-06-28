package eval

import (
	"tinypanda/internal/ast"
	"tinypanda/internal/object"
)

var (
	// These represents the global single memory reference for the Null, Boolean True and Boolean False primitive.
	NULL  = &object.Null{}
	TRUE  = &object.Boolean{Value: true}
	FALSE = &object.Boolean{Value: false}
)

// Eval is the entry point for the TinyPanda tree-walking interpreter.
func Eval(node ast.Node) object.Object {
	switch node := node.(type) {

	case *ast.Program:
		return evalStatements(node.Statements)

	case *ast.ExpressionStatement:
		return Eval(node.Expression)

	case *ast.IntegerLiteral:
		return &object.Integer{Value: node.Value}

	case *ast.Boolean:
		return nativeBoolToBooleanObject(node.Value)

	case *ast.PrefixExpression:
		right := Eval(node.Right)
		return evalPrefixExpression(node.Operator, right)

	case *ast.InfixExpression:
		left := Eval(node.Left)
		right := Eval(node.Right)

		return evalInfixExpression(node.Operator, left, right)
	}

	return nil
}

// evalStatements iterates sequentially through a block of statements
func evalStatements(stmts []ast.Statement) object.Object {
	var result object.Object

	for _, stmt := range stmts {
		result = Eval(stmt)
	}

	return result
}

// evalPrefixExpression evaluates prefix operators '!' and '-'
func evalPrefixExpression(operator string, right object.Object) object.Object {
	switch operator {
	case "!":
		return evalExclamOperatorExpression(right)
	case "-":
		return evalMinusOperatorExpression(right)
	}

	return NULL
}

// evalInfixExpression processes binary operations sitting between two node expressions
func evalInfixExpression(operator string, left, right object.Object) object.Object {
	switch {
	// If both left and right are intiger
	case left.Type() == object.INTEGER_OBJ && right.Type() == object.INTEGER_OBJ:
		return evalIntegerInfixExpression(operator, left, right)

	// if operator is `==`
	case operator == "==":
		return nativeBoolToBooleanObject(left == right)

	case operator == "!=":
		return nativeBoolToBooleanObject(left != right)

	default:
		return NULL
	}
}

// evalIntegerInfixExpression executes mathematical operations (+, -, *, /) and comparison operations (<, >, ==, !=)
func evalIntegerInfixExpression(operator string, left, right object.Object) object.Object {
	leftVal := left.(*object.Integer).Value
	rightVal := right.(*object.Integer).Value

	switch operator {
	case "+":
		return &object.Integer{Value: leftVal + rightVal}

	case "-":
		return &object.Integer{Value: leftVal - rightVal}

	case "*":
		return &object.Integer{Value: leftVal * rightVal}

	case "/":
		return &object.Integer{Value: leftVal / rightVal}

	case ">":
		return nativeBoolToBooleanObject(leftVal > rightVal)

	case "<":
		return nativeBoolToBooleanObject(leftVal < rightVal)

	case "==":
		return nativeBoolToBooleanObject(leftVal == rightVal)

	case "!=":
		return nativeBoolToBooleanObject(leftVal != rightVal)

	default:
		return NULL
	}
}

// evalExclamOperatorExpression evaluates the expression after the '!' operator.
func evalExclamOperatorExpression(right object.Object) object.Object {
	switch right {
	case TRUE:
		return FALSE
	case FALSE:
		return TRUE
	case NULL:
		return TRUE
	default:
		return FALSE
	}
}

// evalMinusOperatorExpression extracts the raw value of a numerical object and assigns negative value to new integer object.
func evalMinusOperatorExpression(right object.Object) object.Object {
	if right.Type() != object.INTEGER_OBJ {
		return NULL
	}

	value := right.(*object.Integer).Value
	return &object.Integer{Value: -value}
}

func nativeBoolToBooleanObject(input bool) *object.Boolean {
	if input {
		return TRUE
	}
	return FALSE
}
