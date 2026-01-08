import PriorityQueue from './PriorityQueue';
import { GridUtils } from '../utils/grid';


/* 
 Formål: finder korste vej mellem to punkter, ligesom A* bare uden HEURISTIC
 Her bruger vi altså en blind søgning, og ikke en guided søgning

  A*: f(n) = g(n) + h(n) - Guided af heuristic
  Dijkstra: f(n) = g(n) - Kun den faktiske distance

*/
class Dijkstra {
  constructor(grid, start, goal) {
    this.grid = grid;
    this.start = start;
    this.goal = goal;
    //Ingen HEURISTIC forskellen mellem Dijkstra og A*


    this.pq = new PriorityQueue(); // Nodes sorteret efter g-score
    this.gScore = new Map(); // Faktisk cost fra start
    this.cameFrom = new Map(); // Parent pointers
    this.openSet = new Set();  // Nodes i kø (visualisering)
    this.closedSet = new Set(); // Udforskede nodes

    //Stats ligesom A*
    this.exploredCount = 0;
    this.isComplete = false;

    this._initialize();
  }

  _initialize() {
    const startKey = this._key(this.start);
    this.pq.push(this.start, 0);
    this.gScore.set(startKey, 0);
    this.openSet.add(startKey);
  }

  _key(node) {
    return `${node.x},${node.y}`;
  }

  _reconstructPath(endNode) {
    const path = [];
    let current = endNode;

    while (current) {
      path.unshift(current);
      current = this.cameFrom.get(this._key(current));
    }

    return path;
  }

  // Single step of algorithm
  step() {
    if (this.isComplete || this.pq.isEmpty()) {
      return { done: true, path: null };
    }

    //Henter node med lavese g-score
    const current = this.pq.pop();
    const currentKey = this._key(current);

    this.openSet.delete(currentKey);
    this.closedSet.add(currentKey);
    this.exploredCount++;

    // Tjekker om vi er kommet i mål
    if (current.x === this.goal.x && current.y === this.goal.y) {
      this.isComplete = true;
      const finalPath = this._reconstructPath(current);
      return {
        done: true,
        path: finalPath,
        current,
        openSet: this._getNodesFromKeys(this.openSet),
        closedSet: this._getNodesFromKeys(this.closedSet)
      };
    }

    // Udforsk af naboer
    const neighbors = GridUtils.getNeighbors(current, this.grid);

    for (const neighbor of neighbors) {
      const neighborKey = this._key(neighbor);

      if (this.closedSet.has(neighborKey)) continue;

      //Beregner ny g-score
      const tentativeG = this.gScore.get(currentKey) + neighbor.cost;

      if (tentativeG < (this.gScore.get(neighborKey) || Infinity)) {
        this.cameFrom.set(neighborKey, current);
        this.gScore.set(neighborKey, tentativeG);

        /* 
          Dijkstra: priority = g(n)
          A*:       priority = g(n) + h(n)
        */
        const priority = tentativeG;

        if (!this.openSet.has(neighborKey)) {
          this.pq.push(neighbor, priority);
          this.openSet.add(neighborKey);
        }
      }
    }

    //returner state til visualisering
    return {
      done: false,
      current,
      currentPath: this._reconstructPath(current),
      openSet: this._getNodesFromKeys(this.openSet),
      closedSet: this._getNodesFromKeys(this.closedSet),
      exploredCount: this.exploredCount
    };
  }

  
  _getNodesFromKeys(keySet) {
    return Array.from(keySet).map(k => {
      const [x, y] = k.split(',').map(Number);
      return { x, y };
    });
  }

  getStats() {
    return {
      explored: this.exploredCount,
      openSetSize: this.openSet.size,
      closedSetSize: this.closedSet.size
    };
  }
}

export default Dijkstra;