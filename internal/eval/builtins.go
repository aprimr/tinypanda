package eval

import (
	"fmt"
	"strconv"
	"strings"
	"tinypanda/internal/object"
)

var builtins = map[string]*object.Builtin{
	// len returns the no of characters in a string
	"len": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got=%d, expected=1", len(args))
			}

			switch arg := args[0].(type) {
			case *object.String:
				return &object.Integer{Value: int64(len(arg.Value))}

			case *object.List:
				return &object.Integer{Value: int64(len(arg.Elements))}

			default:
				return newError("argument to `len` not supported, got %s", args[0].Type())
			}
		},
	},

	// num converts a string integer or float to integer or float and returns it
	"num": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got=%d, expected=1", len(args))
			}

			switch arg := args[0].(type) {
			case *object.Integer:
				return arg

			case *object.Float:
				return &object.Integer{Value: int64(arg.Value)}

			case *object.String:
				// if arg is empty string, return new error
				if arg.Value == "" {
					return newError("argument to `num` not supported, got EMPTY_STRING")
				}

				if strings.Contains(arg.Value, ".") { // If the string is float
					converted, err := strconv.ParseFloat(arg.Value, 64)
					if err == nil { // if err is nil return the float object with converted value
						return &object.Float{Value: converted}
					}
				} else { // If the string is int
					converted, err := strconv.ParseInt(arg.Value, 10, 64)
					if err == nil { // if err is nil return the int object with converted value
						return &object.Integer{Value: converted}
					}
				}

				// if err occurs parsing string like "abc" return a newError
				return newError("argument to `num` not supported, got %s", args[0].Type())

			default:
				return newError("argument to `num` not supported, got %s", args[0].Type())
			}
		},
	},

	// str converts a integer into string and returns a string object
	"str": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got=%d, expected=1", len(args))
			}

			switch arg := args[0].(type) {
			case *object.String:
				return arg

			case *object.Integer:
				converted := strconv.FormatInt(arg.Value, 10)
				return &object.String{Value: converted}

			case *object.Float:
				converted := fmt.Sprintf("%g", arg.Value)
				return &object.String{Value: converted}

			default:
				return newError("argument to `str` not supported, got %s", args[0].Type())
			}
		},
	},

	// what returns the type of the data it gets
	"what": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got=%d, expected=1", len(args))
			}

			return &object.String{Value: string(args[0].Type())}
		},
	},

	// upper converts a string to Uppercase
	"upper": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got=%d, expected=1", len(args))
			}

			switch arg := args[0].(type) {
			case *object.String:
				converted := strings.ToUpper(arg.Value)
				return &object.String{Value: converted}

			default:
				return newError("argument to `upper` must be STRING, got %s", args[0].Type())
			}
		},
	},

	// Lower converts a string to lowercase
	"lower": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got=%d, expected=1", len(args))
			}

			switch arg := args[0].(type) {
			case *object.String:
				converted := strings.ToLower(arg.Value)
				return &object.String{Value: converted}

			default:
				return newError("argument to `lower` must be STRING, got %s", args[0].Type())
			}
		},
	},

	// echo prints strings or any object side by side
	"echo": {
		Fn: func(args ...object.Object) object.Object {
			for _, arg := range args {
				fmt.Print(arg.Inspect())
			}

			return NULL
		},
	},

	// echo prints strings or any object side by side and appends a newline at end
	"echoln": {
		Fn: func(args ...object.Object) object.Object {
			for _, arg := range args {
				fmt.Print(arg.Inspect())
			}
			fmt.Println() // Print a newline after all agrs are handled

			return NULL
		},
	},
}
