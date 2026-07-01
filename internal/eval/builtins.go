package eval

import "tinypanda/internal/object"

var builtins = map[string]*object.Builtin{
	"length": &object.Builtin{
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got=%d, expected=1", len(args))
			}

			switch arg := args[0].(type) {
			case *object.String:
				return &object.Integer{Value: int64(len(arg.Value))}

			default:
				return newError("argument to `length` not supported, got %s", args[0].Type())
			}
		},
	},
}
