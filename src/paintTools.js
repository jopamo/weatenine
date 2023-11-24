// converts "rgb(255,0,0)" into an array ([255,0,0])
const rgbStringToArray = (str) => str.slice(4, -1).split(',').map(Number);

// calculate color mix.
export const mixColors = (colorA, colorB) => {
  if (!colorA) return colorB;
  if (!colorB) return colorA;

  const [r1, g1, b1] = rgbStringToArray(colorA);
  const [r2, g2, b2] = rgbStringToArray(colorB);

  const r = Math.round(r1 + 0.2 * (r2 - r1));
  const g = Math.round(g1 + 0.2 * (g2 - g1));
  const b = Math.round(b1 + 0.2 * (b2 - b1));

  return `rgb(${r},${g},${b})`;
};

export const checkStoppingCriteria = (grid, stoppingCriterion, color1, color2, color3) => {
  switch (stoppingCriterion) {
    case 'lastUnpainted':
      const lastUnpainted = grid.every(row => row.every(cell => cell.color !== null));
      return {
        met: lastUnpainted,
        message: 'Stopped: All squares have been painted at least once.'
      };

    case 'secondBlob':
      const secondBlob = grid.some(row => row.some(cell => cell.count >= 2));
      return {
        met: secondBlob,
        message: 'Stopped: A square has been painted twice.'
      };

    case 'allMixedColors':
      const allPainted = grid.every(row => row.every(cell => cell.color !== null && ![color1, color2, color3].includes(cell.color)));
      return {
        met: allPainted,
        message: 'Stopped: The entire board is filled with mixed colors.'
      };

    default:
      return { met: false, message: '' };
  }
};

export const initializeGrid = (xDimension, yDimension) => {
  return Array.from({ length: yDimension }, () =>
    Array.from({ length: xDimension }, () => ({ color: null, count: 0 }))
  );
};

export const paintRandomCell = (grid, xDimension, yDimension, color1, color2, color3, statistics) => {
  const x = Math.floor(Math.random() * xDimension);
  const y = Math.floor(Math.random() * yDimension);
  const chosenColor = [color1, color2, color3][Math.floor(Math.random() * 3)];

  const mixedColor = mixColors(grid[y][x].color, chosenColor);
  grid[y][x].color = mixedColor;
  grid[y][x].count++;

  // Update total drops of each color
  statistics.totalColor1 += chosenColor === color1 ? 1 : 0;
  statistics.totalColor2 += chosenColor === color2 ? 1 : 0;
  statistics.totalColor3 += chosenColor === color3 ? 1 : 0;

  // Update square with the most drops
  const currentCount = grid[y][x].count;
  if (currentCount > statistics.squareMostDrops) {
    statistics.squareMostDrops = currentCount;
    statistics.squareMostDropsLocation = { x, y };
  }

  return { grid, statistics, paintedCell: { x, y } };
};

export const PAINT_ONCE = (X, Y, C1, C2, C3, S, statistics) => {
  let grid = initializeGrid(X, Y);
  let count = 0;
  let paintedCellsTracker = new Set();

  while (true) {
    count++;
    const { grid: updatedGrid, statistics: updatedStatistics, paintedCell } = paintRandomCell(grid, X, Y, C1, C2, C3, statistics);
    grid = updatedGrid;
    statistics = updatedStatistics;

    paintedCellsTracker.add(`${paintedCell.x},${paintedCell.y}`);

    const stoppingCriteriaResult = checkStoppingCriteria(grid, S, C1, C2, C3);

    if (stoppingCriteriaResult.met) {
      const totalDrops = statistics.totalColor1 + statistics.totalColor2 + statistics.totalColor3;

      statistics.averageTotal = totalDrops / (X * Y);

      const paintedCells = paintedCellsTracker.size;

      return { count, paintedCells, statistics, stoppingCriteriaResult, S };
    }
  }
};
