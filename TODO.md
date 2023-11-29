After the CONTINUE button is pushed, a new screen appears, and your website explains a new function for the website: building, executing, and displaying results from “experiments” based on the painting simulations. This explanation could be made using text and pictures, or with a video.

Here is more information about the experiments:

As in HW3, each experiment will have an independent variable, and a dependent variable. Traditionally, in a graph of experimental results, the independent variable is shown on the x axis. Possible independent variables are:
	* D, a single dimension that is used for square canvases. (When you pick a D, you are picking both X and Y)
	* X, the x-dimension, with the y-dimension held constant.
	* R, the number of repetitions in the experiment

Once one of those independent variables is chosen, the user must give a list of different, increasing values for the independent variable. Only appropriate values should be accepted, and when the user enters an inappropriate value, your program must give a descriptive error message, and re-prompt. Your group should decide on a reasonable limit for the number of independent variable values you accept. Include a justification for that number in your program documentation.

Allow users to enter values less than or equal to the maximum values, and greater than or equal to the minimum values allowed. Notice that the user first picks how many different values the independent variable will take on, and then the user picks those values.

After the user designates an independent variable, and gives values for that variable, the user must give appropriate values for variables not chosen to be independent for this experiment.

If a single dimension for square canvases is chosen, only the number of repetitions needs to be fixed.

If the x-dimension is chosen as the independent variable, then the y- dimension and the number of repetitions are fixed and must be set by the user.

If the number of repetitions is the independent variable, then both X and Y dimensions need to be fixed by the user. (In this case, the user may decide to have a square canvas, but that is not required.)

For the rest of this specification, PAINT_ONCE(X, Y, C1, C2, C3, S) means simulating the random painting of a single canvas with dimensions X by Y; using colors C1, C2, and C3; and stopping using the criterion S. PAINT_MANY(X, Y, C1, C2, C3, S, R) means doing that same random painting R times. For each of those times, random paintings occur.

So we need these variables?
	D
	X
	R
	independentVarNum (int: limit the number
	independentVarList (string: list of different, increasing values, limit the number)
