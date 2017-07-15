# Description of the project

This tool allows to parse a command line of a script. I had done the
same for bash scripts and wanted to use the same mindset for this
language.

# Common issue in parameters parsing

Usually, scripts are written at different moments. The scripts are built around
a common thema and then may need to use the same set of options.
But it is quite commoni, among different scripts, to have parameters with different
names that designates the same thing. That is what I call the parameters
inconsistency issue.

I encountered this problem in a mission where I had to maintain and improve
bash scripts. This was a big issue to remember what was the syntax for the option
for this script or this script (one with underscore instead of hyphen, one with
long option that had a different spelling than the same option in another script).

# The idea to avoid the parameters inconsistency

I tried to apply the ideas I had in bash to javascript programs. The bash library
is stored in a different repository so you can have a look if you are interested
in the tool.

The library provides a file listing the parameters in a JSON structure. You can
provide your own file that matches this structure and details your own parameters.

Using this file in a set of scripts guarantees the same naming and the same syntax for
all the scripts. If the documentation of an option changes from a script to another,
you simply have to override the documentation of this option.

# Parameters you don't want to have an option for

If you think that one (or some parameters) should not have a dedicated option,
they are collected in a special value of the output parameter : _unassigned .

# Structure of the parameters file

The file containing the options is a json file. This is the structure :

``` javascript
{
	name : {
		doc: "",
		shortOption: "",
		longOption: "",
		value: ""
	}
}
```
The field *value* is the default value for the option.

# Declare the supported arguments of a script

You simply need to declare an array named allowedParameters with the names of the parameters :

``` javascript
var allowedParameters = [
	"name1",
	"name2"
];
```
Any supported parameter must defined in this array. Mandatory parameters are handled in another place.

# Declare a parameter as mandatory

To declare mandatory parameters, you have to define the following array :

``` javascript
var mandatoryParameters = [
	"name2"
];
```

# Automatic generation of the documentation

Of course, as the other libraries, the documentation is automatically built. The documentation
can be ouputed in different formats. This allows the publication of the documentation in different
tools.

# Using the command line parsing

The parsing of the command line generates a parameter object that stores only the name and the value
of the parameter.

``` javascript

// Load the parsing library
var parsing = require("parsing");

// Use a given parameter file
parsing.useParameterFiles("pathToTheParameters");

// parse the command line
parameters = parsing.parseCommandLine();

```

# Overriding the documentation of an option

Simply overrides the following value :

``` javascript
overrideDocumentation("name", "New documentation.");
```

It works the same for the value of a parameter :

``` javascript
overrideDefaultValue("name", "New Value.");
```


# Support for allowed values for the parameter ??
To be done.

# Support for multiple values
To be done.

# Support for interdependent options
To be done

# Supplying a json as arguments and validate it
To be done
