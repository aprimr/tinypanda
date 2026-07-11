package eval

import (
	"fmt"
	"strconv"
	"strings"
	"tinypanda/internal/object"
)

var builtins = map[string]*object.Builtin{

	// len returns the no of characters in a string or no of elements in a list
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

	// reverse can accept a list or a string and returns the reverse value of the list or string
	// reverse only returns the reversed value, it doesnt muatates the original list or string
	"reverse": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got=%d, expected=1", len(args))
			}

			// if list is not passed to the function return error
			if !(args[0].Type() == object.LIST_OBJ || args[0].Type() == object.STRING_OBJ) {
				return newError("argument to `reverse` must be LIST or STRING. got=%s", args[0].Type())
			}

			switch args[0].Type() {
			case object.LIST_OBJ:
				list := args[0].(*object.List)
				listLength := len(list.Elements)

				// A empty slice of capacity same as original list to store reversed list
				reverse := make([]object.Object, listLength)
				// reverse eg. list: [10, true, "hello"] rev: ["hello", true, 10]
				// Loop the list and copy the element from back to front
				for i := range list.Elements {
					reverse[i] = list.Elements[listLength-1-i]
				}

				return &object.List{Elements: reverse}

			case object.STRING_OBJ:
				var reverse string

				for _, s := range args[0].(*object.String).Value {
					reverse = string(s) + reverse
				}
				return &object.String{Value: reverse}

			default:
				return &object.Null{}
			}
		},
	},

	// --- Type Utils
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
	"whatIs": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got=%d, expected=1", len(args))
			}

			return &object.String{Value: string(args[0].Type())}
		},
	},

	// --- String Utils
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

	// --- Console Output
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

	// --- List Builtins
	// first returns the element on the 0th index on the list
	"first": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got=%d, expected=1", len(args))
			}

			// if list is not passed to the function return error
			if args[0].Type() != object.LIST_OBJ {
				return newError("argument to `first` must be LIST. got=%s", args[0].Type())
			}

			list := args[0].(*object.List)
			if len(list.Elements) > 0 {
				return list.Elements[0]
			}

			return NULL
		},
	},

	// last returns the last element of the list
	"last": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got=%d, expected=1", len(args))
			}

			// if list is not passed to the function return error
			if args[0].Type() != object.LIST_OBJ {
				return newError("argument to `last` must be LIST. got=%s", args[0].Type())
			}

			list := args[0].(*object.List)
			if listLength := len(list.Elements); listLength > 0 {
				return list.Elements[listLength-1]
			}

			return NULL
		},
	},

	// rest returns the rest of the list except the element on the 0th index
	"rest": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got=%d, expected=1", len(args))
			}

			// if list is not passed to the function return error
			if args[0].Type() != object.LIST_OBJ {
				return newError("argument to `rest` must be LIST. got=%s", args[0].Type())
			}

			list := args[0].(*object.List)
			if listLength := len(list.Elements); listLength > 0 {
				newElements := make([]object.Object, listLength-1) // create a new slice of size length of actual list size - 1
				copy(newElements, list.Elements[1:listLength])     // copy rest of list except 0th elenent in newElements slice
				return &object.List{Elements: newElements}
			}

			return NULL
		},
	},

	// append(list, value)
	// append accepts two parameters: a list identifier and a value to append
	// it appends the value to the end of list, mutating the original list and returns the length of new list.
	"append": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 2 {
				return newError("wrong number of arguments. got=%d, expected=2", len(args))
			}

			// if list is not passed to the function return error
			if args[0].Type() != object.LIST_OBJ {
				return newError("first argument to `append` must be LIST. got=%s", args[0].Type())
			}

			list := args[0].(*object.List)
			listLength := len(list.Elements)
			newElements := make([]object.Object, listLength+1)
			copy(newElements, list.Elements)
			newElements[listLength] = args[1]

			list.Elements = newElements
			return &object.Integer{Value: int64(listLength + 1)}
		},
	},

	// drop removes the last item by mutating the original list, and returns the dropped item.
	"drop": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 1 {
				return newError("wrong number of arguments. got=%d, expected=1", len(args))
			}

			// if list is not passed to the function return error
			if args[0].Type() != object.LIST_OBJ {
				return newError("argument to `pop` must be LIST. got=%s", args[0].Type())
			}

			list := args[0].(*object.List)
			listLength := len(list.Elements)

			// If list is empty, return null
			if listLength == 0 {
				return &object.Null{}
			}

			dropped := list.Elements[listLength-1]

			newElements := make([]object.Object, listLength-1)
			copy(newElements, list.Elements[:listLength-1])

			list.Elements = newElements
			return dropped
		},
	},

	// join(list, string)
	// join joins the elements of a list by the string provided and returns the final string
	"join": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 2 {
				return newError("wrong number of arguments. got=%d, expected=2", len(args))
			}

			// if list is not passed as first argument return error
			if args[0].Type() != object.LIST_OBJ {
				return newError("first argument to `join` must be LIST. got=%s", args[0].Type())
			}

			// if second argument is not a string return error
			if args[1].Type() != object.STRING_OBJ {
				return newError("second argument to `join` must be STRING. got=%s", args[1].Type())
			}

			list := args[0].(*object.List)
			listLength := len(list.Elements)

			var joinedString string
			for i, el := range list.Elements {
				// for last element dont add the join string on end
				if i == listLength-1 {
					joinedString = joinedString + el.Inspect()
				} else {
					joinedString = joinedString + el.Inspect() + args[1].Inspect()
				}
			}

			return &object.String{Value: joinedString}
		},
	},

	// contains(list, value)
	"contains": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 2 {
				return newError("wrong number of arguments. got=%d, expected=2", len(args))
			}

			// if list is not passed as first argument return error
			if args[0].Type() != object.LIST_OBJ {
				return newError("first argument to `contains` must be LIST. got=%s", args[0].Type())
			}

			list := args[0].(*object.List)

			// loop through the list of elements to find the value, if it exists return true, if not return fasle
			for _, el := range list.Elements {
				if el.Type() == args[1].Type() && el.Inspect() == args[1].Inspect() {
					return TRUE
				}
			}

			return FALSE
		},
	},

	// posOf(list, value)
	// returns the index of the value if it is in list else returns -1
	"posOf": {
		Fn: func(args ...object.Object) object.Object {
			if len(args) != 2 {
				return newError("wrong number of arguments. got=%d, expected=2", len(args))
			}

			// if list is not passed as first argument return error
			if args[0].Type() != object.LIST_OBJ {
				return newError("first argument to `contains` must be LIST. got=%s", args[0].Type())
			}

			list := args[0].(*object.List)

			// loop through the list of elements to find the value, if it exists return true, if not return fasle
			for i, el := range list.Elements {
				if el.Type() == args[1].Type() && el.Inspect() == args[1].Inspect() {
					return &object.Integer{Value: int64(i)}
				}
			}

			return &object.Integer{Value: -1}
		},
	},
}
