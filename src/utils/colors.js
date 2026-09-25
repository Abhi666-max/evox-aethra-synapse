// Helper to interpolate between two hex colors
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const rgbToHex = (r, g, b) => {
  return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
};

const interpolateColor = (color1, color2, factor) => {
  const result = {
    r: Math.round(color1.r + factor * (color2.r - color1.r)),
    g: Math.round(color1.g + factor * (color2.g - color1.g)),
    b: Math.round(color1.b + factor * (color2.b - color1.b))
  };
  return result;
};

export const generateGradientGrid = (size, corners) => {
  // corners: { tl, tr, bl, br } (hex strings)
  const cTl = hexToRgb(corners.tl);
  const cTr = hexToRgb(corners.tr);
  const cBl = hexToRgb(corners.bl);
  const cBr = hexToRgb(corners.br);

  const grid = [];
  for (let y = 0; y < size; y++) {
    const yFactor = size === 1 ? 0 : y / (size - 1);
    const leftColor = interpolateColor(cTl, cBl, yFactor);
    const rightColor = interpolateColor(cTr, cBr, yFactor);

    for (let x = 0; x < size; x++) {
      const xFactor = size === 1 ? 0 : x / (size - 1);
      const finalColor = interpolateColor(leftColor, rightColor, xFactor);
      
      const isFixed = 
        (x === 0 && y === 0) || 
        (x === size - 1 && y === 0) ||
        (x === 0 && y === size - 1) || 
        (x === size - 1 && y === size - 1);

      grid.push({
        id: `${x}-${y}`,
        color: rgbToHex(finalColor.r, finalColor.g, finalColor.b),
        isFixed,
        correctIndex: y * size + x
      });
    }
  }
  return grid;
};

// Fisher-Yates shuffle that ignores fixed tiles
export const shuffleGrid = (grid) => {
  const newGrid = [...grid];
  const movableIndices = [];
  
  newGrid.forEach((tile, index) => {
    if (!tile.isFixed) movableIndices.push(index);
  });

  // Shuffle movable indices
  for (let i = movableIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const idx1 = movableIndices[i];
    const idx2 = movableIndices[j];
    
    const temp = newGrid[idx1];
    newGrid[idx1] = newGrid[idx2];
    newGrid[idx2] = temp;
  }
  
  return newGrid;
};
