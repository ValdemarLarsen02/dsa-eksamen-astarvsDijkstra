
import { GRID_SIZE, CELL_EMPTY, CELL_WALL } from './constants';

export const GridUtils = {
  createEmptyGrid: (size) => {
    return Array(size).fill(null).map(() => Array(size).fill(CELL_EMPTY));
  },

  createOvalTrack: (size) => {
    const grid = GridUtils.createEmptyGrid(size);

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        if (y < 5 && (x < 8 || x > 22)) grid[y][x] = CELL_WALL;
        if (y > 24 && (x < 8 || x > 22)) grid[y][x] = CELL_WALL;
        if (x < 3 && y >= 5 && y <= 24) grid[y][x] = CELL_WALL;
        if (x > 26 && y >= 5 && y <= 24) grid[y][x] = CELL_WALL;
      }
    }

    return grid;
  },

  getNeighbors: (node, grid) => {
    const neighbors = [];
    const size = grid.length;
    const dirs = [
      { dx: 0, dy: -1 }, { dx: 1, dy: 0 },
      { dx: 0, dy: 1 }, { dx: -1, dy: 0 },
      { dx: 1, dy: 1 }, { dx: -1, dy: 1 },
      { dx: 1, dy: -1 }, { dx: -1, dy: -1 }
    ];

    for (const dir of dirs) {
      const nx = node.x + dir.dx;
      const ny = node.y + dir.dy;

      if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
        if (grid[ny][nx] !== CELL_WALL) {
          const cost = (dir.dx !== 0 && dir.dy !== 0) ? 1.414 : 1;
          neighbors.push({ x: nx, y: ny, cost });
        }
      }
    }

    return neighbors;
  }
};

// TRACKS ARRAY
export const TRACKS = [
  {
    id: 'oval',
    name: 'Start Bane',
    description: 'Normal canvas med mulighed for redigering',
    start: { x: 5, y: 15 },
    goal: { x: 24, y: 15 },
    creator: GridUtils.createOvalTrack
  },
];