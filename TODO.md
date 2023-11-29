*TODO*

HW4: LONG GROUP PROJECT for CS 4500, Fall 2023
Hopefully, you’ve noticed the progression: HW1 – pair programming; HW2 – trios; HW3 – quartets. Your HW4 groups will have 4 or more people on your team. Canvas picked the teams randomly, but I made some swaps so that each team has at least one person who expressed some confidence about making websites.

HW4 will NOT force you to use onlinegdb.com. In fact, you won’t be able to use it, at least not exclusively. For HW4, you and your group will be making an interactive website. You can use whatever programming languages you would like. You will be obliged to make a website. If you have access to a web server, feel free to use that. If you need me to provide a
web site location, please let me know.

If you want me to pay for website hosting, please go to this website:
https://www.namecheap.com/

Sign up for a monthly rate, and buy two months of the least expensive plan. (If the cheapest plan has a limitation that cramps your style, make a case to me and I’ll consider the higher rate.) Email me the receipt, and I’ll reimburse.

Unlike your first few programming projects in CS 4500, this project will take many weeks. The final version of all your documents, and your program, are due the evening of the final exam, at 23:59. Your HW4 group for lasts the rest of the semester. Do your best to get along, and contribute significantly to the group effort.

In addition to the deliverable documents, the HW4 final project is delivered as a functioning web-based application. In other words, to run your HW4 completed project, someone will only need the URL you supply to run the program. That’s what you will hand in to me in addition to the deliverable documents: a URL.

If you want to use an existing web server that you have access to, that’s fine. If no one in your group has access to a server where you can host your webpage, let me know and I’ll arrange something for your group.

Whatever language or languages you choose, your documentation must be high quality. I hope your group can make the program look good and sound good. Creativity counts.

You will be turning in several important deliverables during the rest of the semester. Although I will comment on these preliminary versions after you turn them in, I will only grade them when they are turned in on the evening of the final exam. The MODULES section of our class Canvas site includes details of each of these documents. The documents are:

* High Level Design (level 0 data flow diagram)
* Detailed Designs
* User Manual
* Programmer’s Guide
* Test Plan
* Demo Video

I suggest that your group plan immediately for people to start working on each of these documents.

HW4 again uses pseudo-random numbers to simulate a rather fanciful idea. But there is no wandering in the woods this time. Instead, this time there are random drops of paint on a canvas. At each step, the program picks a random spot on a rectangular grid. The program then picks randomly from among three colors.

Each drop of paint on this magic canvas stays exactly in the square on the grid where it lands. (No splashing occurs.) When two drops land on the same spot, the colors mix. As paint drops fall, the paint may get very thick on some spots while other spots are bare; that is OK, and there is never any spill over between spots on the grid.

When someone visits your website, there should be an animation (or some other form of communication) that explains concisely what the website does. Then the program asks the user for several parameters, each of which you should limit as you deem appropriate. Your limitations should be justified by your plan for the website. You should make sure the user only enters values that are appropriate according to your limits, and reprompts until they do. The user choices you must ask for are:

X dimension: the size of the grid from left to right; this is given in terms of the number of squares on the grid.

Y dimension: the size of the grid from left to right; this is given in terms of the number of squares on the grid. This may be the same size as the X dimension, but that is not assumed.

Color1, Color2, and Color3: Choosing from choices you make available, the user picks three colors. Give the user 8 or more choices.

Stopping criterion: The user picks a stopping criterion for the random painting. You must include these two criteria as possible stopping points: as soon as the last unpainted square is painted for the first time; and the first time any square gets its second paint blob (this criterion is reminiscent of the birthday paradox). You should think of at least one other stopping criterion, and you may include more than one extra stopping criterion if you’d like.

After the user picks these six parameters, your website should simulate the random painting, both visually and with appropriate sound. (Music and sound effects welcome.) You should include controls that allow the user to speed up or slow down the simulation.

Once the initial simulation has been presented to the user, leave the final picture of the grid on the screen. Keep it visible until the user pushes a “CONTINUE” button. After the CONTINUE button is pushed, a new screen appears, and your website explains a new function for the website: building, executing, and displaying results from “experiments” based on the painting simulations. This explanation could be made using text and pictures, or with a video. Here is more information about the experiments:

As in HW3, each experiment will have an independent variable, and a dependent variable. Traditionally, in a graph of experimental results, the independent variable is shown on the x axis. Possible independent variables are:
* D, a single dimension that is used for square canvases. (When you pick a D, you are picking both X and Y)
* X, the x-dimension, with the y-dimension held constant.
* R, the number of repetitions in the experiment

Once one of those independent variables is chosen, the user must give a list of different, increasing values for the independent variable. Only appropriate values should be accepted, and when the user enters an inappropriate value, your program must give a descriptive error message, and re-prompt. Your group should decide on a reasonable limit for the number of independent variable values you accept. Include a justification for that number in your program documentation. Allow users to enter values less than or equal to the maximum values, and greater than or equal to the minimum values allowed. Notice that the user first picks how many different values the independent variable will take on, and then the user picks those values.

After the user designates an independent variable, and gives values for that variable, the user must give appropriate values for variables not chosen to be independent for this experiment. If a single dimension for square canvases is chosen, only the number of repetitions needs to be fixed. If the x-dimension is chosen as the independent variable, then the y- dimension and the number of repetitions are fixed and must be set by the user. If the number of repetitions is the
independent variable, then both X and Y dimensions need to be fixed by the user. (In this case, the user may decide to have a square canvas, but that is not required.)


For the rest of this specification, PAINT_ONCE(X, Y, C1, C2, C3, S) means simulating the random painting of a single canvas with dimensions X by Y; using colors C1, C2, and C3; and stopping using the criterion S. PAINT_MANY(X, Y, C1, C2, C3, S, R) means doing that same random painting R times. For each of those times, random paintings occur.

Whenever a canvas is randomly painted, the following values must be calculated:
* A: the total number of paint drops put on the canvas before the stopping criterion stops the painting.
* A1. The number of paint drops on the canvas of Color 1.
* A2. The number of paint drops on the canvas of Color 2.
* A3. The number of paint drops on the canvas of Color 3.
* B: the maximum number of paint drops on any given square when the painting halts (that is, looking at all the squares,
what is the largest number of paint drops that fell on one square?)
* C. the average number of paint drops over all the squares when the painting halts

Using the independent variable’s values, and the fixed values, the experiment should be run the required number of repetitions. For example, assume that the user chooses to paint square canvases with increasing sizes of 2, 4, 8, 16, and 32 units in each direction. Assume further that C1, C2, C3, S, and R are fixed by the user. Your program will then run the following:
`PAINT_MANY(2, 2, C1, C2, C3, S, R)
PAINT_MANY(4, 4, C1, C2, C3, S, R)
PAINT_MANY(8, 8, C1, C2, C3, S, R)
PAINT_MANY(16, 16, C1, C2, C3, S, R)
PAINT_MANY(32, 32, C1, C2, C3, S, R)`

Each time your program executes a PAINT_MANY process, it must keep track of the minimum, maximum, and average number for A, A1, A2, A3, B, and C. Notice that for B and C this requires the somewhat confusing idea of such notions as the maximum maximum number of paint drops, and the minimum average number of paint drops over all repetitions. This can be odd at first blush, but you should get used to it after a while. After all the required simulations are done (in
the case above, 5*R random paintings will be required), you will have 18 values for each PAINT_MANY, namely the min, max, and average for A, A1, A2, A3, B, and C, for a total of 90 experimental values from 5 PAINT_MANY executions.

During the computations (which may take a while), make sure that the website assures the user that the computations are progressing. Perhaps this should be showing an image of one or more of the paintings being done, or perhaps something else. Exactly how you do it is up to you, but do something so that the user doesn’t think the program has gone into an infinite loop.


When all the required simulated paintings are done, display a table of all the values, starting with the independent values in the leftmost column, all the fixed values, and then all the calculated values (A, A1, A2, A3, B, and C, in that order).

When your random paintings for this experiment are complete, display a list of possible dependent variables. That list is:
* A: the number of paint drops put on the canvas before the painting halts
* A1. The number of paint drops on the canvas of Color 1.
* A2. The number of paint drops on the canvas of Color 2.
* A3. The number of paint drops on the canvas of Color 3.
* B: the maximum number of paint drops on any given square when the painting halts (that is, looking at all the squares, what is the largest number of paint drops that fell on one square?)
* C. the average number of paint drops over all the squares when the painting for this canvas halts


The user is required to pick one of these, and is allowed to pick two of them. Once the user has made a selection, your program should display a new, reduced table with the independent variable, and the selected dependent variable (or two dependent variables). For our running example, this table would have 5 rows of data, plus a header that labels each column.

The program should have a CONTINUE button, along with the instruction that pushing the button will show a graph of the table values. When the button is pushed, the table disappears, and the graph appears. This graph should NOT use typewriter graphics; it should be your best effort to visualize the data in the table. Place the independent variable on the horizontal access of the graph, and the dependent variable(s) on the y axis. Label the axes appropriately. Since all the dependent variables count paint drops, the same y axis can be used for two different variables on the same graph.

Near the displayed graph, the user should be given three options:
* 1. Make a new table/graph from the current experimental data
* 2. Abandon this experiment, and make a new experiment.
* 3. Quit the program

The program should respond appropriately to each of these possibilities. If the user wants to make a new table and graph from the same experiment, loop back to the appropriate part of the program, and make the new graph. Then give the same three choices as directly above.

If the user chooses to make a new experiment, then loop back to where the user chooses the independent variable, gives values for that variable, and fixes a single value to the other variable(s). You should then continue as above until after the experiment is over and the data displayed. Finally, you’ll be back to the 3 choices.

If the user quits the program, you should say thanks to the user, pause for a moment, and then return to the opening page of your website, where someone could start the whole process again.

Your software engineering textbook emphasizes the importance of communication with the customer. For HW4, Keith Miller is your customer. Each group will have an appointed Zoom time each week to communicate with Keith.

Except for the opening line of the opening comment, the rules for documenting your code that you used for HW1, HW2, and HW3 should be used for HW4. You need NOT have a single file for HW4; in fact, I’d be surprised if you did.

Your first group task is to figure out a cool name for your group. Your second task is to elect a leader. When your team has a leader, have the leader check in with Keith via email.

As always, please email me with any questions: millerkei@umsl.edu. Have fun painting!
Keith
