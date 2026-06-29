package object

// Environment binds (identifiers) variable names to their evaluated runtime Object values.
type Environment struct {
	store map[string]Object
	outer *Environment
}

// NewEnvironment initializes and returns an empty Environment for storing variables.
func NewEnvironment() *Environment {
	s := make(map[string]Object)

	return &Environment{store: s, outer: nil}
}

func NewEnclosedEnvironment(outer *Environment) *Environment {
	env := NewEnvironment()
	env.outer = outer

	return env
}

// Get looks up a variable name in the Environment store map.
func (e *Environment) Get(name string) (Object, bool) {
	obj, ok := e.store[name]
	if !ok && e.outer != nil {
		obj, ok = e.outer.Get(name)
	}

	return obj, ok
}

// Set stores a variable name string with a Object.
func (e *Environment) Set(name string, val Object) Object {
	e.store[name] = val
	return val
}
