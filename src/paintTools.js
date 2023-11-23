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

