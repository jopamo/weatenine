// Converts string "rgb(255,0,0)" to an array [255, 0, 0].
const rgbStringToArray = (str) => str.slice(4, -1).split(',').map(Number);

const isMixedColor = (color, originalColors) => {
  // Get RGB values of the color to check
  const colorRGB = rgbStringToArray(color);

  // Compare with each original color
  return originalColors.every(originalColor => {
    const originalRGB = rgbStringToArray(originalColor);
    return !originalRGB.every((value, index) => value === colorRGB[index]);
  });
};

// Calculate mix of two colors
const mixColors = (colorA, colorB) => {
  if (!colorA) return colorB; // If no colorA, return colorB
  if (!colorB) return colorA;  // If no colorB, return colorA

  // Use rgbStringToArray from above
  const [r1, g1, b1] = rgbStringToArray(colorA);
  const [r2, g2, b2] = rgbStringToArray(colorB);

  // Use a weighted average (20% of the difference) to mix the two
  const r = Math.round(r1 + 0.2 * (r2 - r1));
  const g = Math.round(g1 + 0.2 * (g2 - g1));
  const b = Math.round(b1 + 0.2 * (b2 - b1));

  // Return the mixed color as an RGB string
  return `rgb(${r},${g},${b})`;
};


// Check whether a stopping criterion for painting is met
export const checkStoppingCriteria = (grid, stoppingCriterion, color1, color2, color3) => {
  switch (stoppingCriterion) {
    // Criterion: Stop when all squares on the grid are painted at least once
    case 'lastUnpainted':
      // Check if every cell in every row of the grid has been painted at least once
      // grid.every(...) checks each row, and row.every(...) checks each cell in the row
      const lastUnpainted = grid.every(row => row.every(cell => cell.color !== null));
      // Return an object indicating if this criterion is met (true/false) and the
      // associated message
      return {
        met: lastUnpainted,
        message: 'Stopped: All squares have been painted at least once.'
      };

    // Criterion: Stop when any square is painted twice
    case 'secondBlob':
      // Check if there is at least one cell in any row of the grid that has been painted twice
      // grid.some(...) checks each row, and row.some(...) checks each cell in the row
      const secondBlob = grid.some(row => row.some(cell => cell.count >= 2));
      // Return an object indicating if this criterion is met and the associated message
      return {
        met: secondBlob,
        message: 'Stopped: A square has been painted twice.'
      };

    // Criterion: Stop when all squares have mixed colors
    case 'allMixedColors':
      const originalColors = [color1, color2, color3];
      const allPainted = grid.every(row =>
        row.every(cell =>
          cell.color !== null &&
          isMixedColor(cell.color, originalColors)
        )
      );

      return {
        met: allPainted,
        message: 'Stopped: The entire board is filled with mixed colors.'
      };

    // Default case: if the stoppingCriterion provided doesn't match any of the cases
    default:
      // Return an object indicating that no criterion has been met
      return { met: false, message: '' };
  }
};


// Initializes 2d array, each cell is an object with color and count properties
export const initializeGrid = (xDimension, yDimension) => {
  // The function takes two arguments:
  // xDimension: Number of columns in the grid
  // yDimension: Number of rows in the grid

  // Create a 2D array (an array of arrays) to represent the grid
  // The outer array represents rows, and each inner array represents a row with multiple cells
  return Array.from({ length: yDimension }, () =>
    // For each row (outer array), create an array representing columns
    // This inner array is created for each row, and its length is determined by xDimension
    Array.from({ length: xDimension }, () =>
      // Each cell in the grid is represented as an object
      // The object has two properties:
      // color: Initially set to null
      // count: Represents how many times the cell has been painted
      ({ color: null, count: 0 }))
  );
};


// Paint a random cell in a grid with one of the provided colors
export const paintRandomCell = (grid, xDimension, yDimension, color1, color2, color3, counts) => {
  // Select a random x-coordinate within the grid. Math.random()
  // generates a number between 0 (inclusive) and 1 (exclusive)
  // Multiplying by xDimension scales this to the grid width, and
  // Math.floor() rounds down to get an integer cell index
  const x = Math.floor(Math.random() * xDimension);

  // Select a random y-coordinate within the grid, similar to the x-coordinate selection
  const y = Math.floor(Math.random() * yDimension);

  // Choose one of the three provided colors randomly.
  // Math.random() * 3 generates a number between 0 and 3, and Math.floor()
  // converts it to an integer (0, 1, or 2). This integer is used to select
  // from the array [color1, color2, color3]
  const chosenColor = [color1, color2, color3][Math.floor(Math.random() * 3)];

  // blends two colors. The existing color of the cell and the chosen color are passed to it
  const mixedColor = mixColors(grid[y][x].color, chosenColor);

  // Update the color of the cell in the grid to the new mixed color
  grid[y][x].color = mixedColor;

  // Increment the count of how many times the cell has been painted
  grid[y][x].count++;

  // Update counts for each color drop
  // If the chosen color matches one of the original colors
  // color1, color2, color3), increment the corresponding total color count
  counts.totalColor1 += chosenColor === color1 ? 1 : 0;
  counts.totalColor2 += chosenColor === color2 ? 1 : 0;
  counts.totalColor3 += chosenColor === color3 ? 1 : 0;

  // Check and update the square that has the most drops
  // currentCount holds the number of times the current cell has been painted
  const currentCount = grid[y][x].count;

  // If the current cell's count exceeds the highest recorded count, update the counts
  if (currentCount > counts.squareMostDrops) {
    counts.squareMostDrops = currentCount;
    // Also, record the location (coordinates) of the square with the most drops
    counts.squareMostDropsLocation = { x, y };
  }

  // Return the updated grid and counts, along with the coordinates of the painted cell
  return {
    grid,
    counts,
    paintedCell: { x, y }
  };
};


// simulate painting the grid according to certain rules
export const PAINT_ONCE = (X, Y, C1, C2, C3, S) => {
  console.log(`Starting PAINT_ONCE with dimensions: X=${X}, Y=${Y}, Colors: ${C1}, ${C2}, ${C3}, Stopping Criterion: ${S}`);

  // Init a grid based on given dimensions X (width) and Y (height)
  let grid = initializeGrid(X, Y);

  // Initialize a 'Set' to track unique painted cells on the grid.
  // 'Set' is used here because it automatically handles uniqueness,
  // ensuring each cell is tracked only once
  let paintedCellsTracker = new Set();

  let counts = {
    totalColor1: 0,
    totalColor2: 0,
    totalColor3: 0,
    squareMostDrops: 0,
  };

  // continue until a stopping criterion is met.
  while (true) {
    // Execute the paintRandomCell function, which paints a random cell on the grid
    // and returns an object containing the updated grid and counts, and the
    // coordinates of the painted cell
    // The returned object is destructured to extract:
    // - updatedGrid: the new state of the grid after painting the cell.
    // - newCounts: updated painting counts after the cell is painted.
    // - paintedCell: the coordinates (x, y) of the cell that was just painted.
    const {
      grid: updatedGrid,
      counts: newCounts,
      paintedCell
    } = paintRandomCell(grid, X, Y, C1, C2, C3, counts);

    // Update the grid and counts with the values returned from painting a cell
    grid = updatedGrid;
    counts = newCounts;

    // Add the coordinates of the painted cell to the tracker to record its painting
    paintedCellsTracker.add(`${paintedCell.x},${paintedCell.y}`);

    // Check if any of the defined stopping criteria have been met
    const stopMessage = checkStoppingCriteria(grid, S, C1, C2, C3);

    // If a stopping criterion is met, exit the loop
    if (stopMessage.met) {
      // Calculate the total number of color drops by adding the totals of each color
      const totalDrops = counts.totalColor1 + counts.totalColor2 + counts.totalColor3;
      counts.totalDrops = totalDrops;

      // Calculate the average number of drops per square on the grid
      counts.averageTotal = totalDrops / (X * Y);

      // Determine the total number of unique cells that have been painted
      const paintedCells = paintedCellsTracker.size;
      counts.paintedCells = paintedCells;

      // Return an object containing 2 objects: 'counts' contains all the math results from
      // paintRandomCell, 'stopMessage' contains the messaging to give to the user interface (React)
      // from checkStoppingCriteria.
      return {
        counts,
        stopMessage
      };
    }
  }
};
