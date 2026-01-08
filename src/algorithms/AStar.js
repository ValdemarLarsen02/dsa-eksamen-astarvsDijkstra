
import PriorityQueue from './PriorityQueue';
import { GridUtils } from '../utils/grid';
import { Heuristics } from './heuristics';

class AStar {
  /* Params:
    grid(array) = 2d grid (0 = drivable, 1 = wall)
    start(Object) = Start position {x, y}
    goal(Object) = Goal position {x, y}
    heuristic(Function) = Standard bruger vi Heuristics.euclidean
  */
  constructor(grid, start, goal, heuristic = Heuristics.euclidean) {
    this.grid = grid;
    this.start = start;
    this.goal = goal;
    this.heuristic = heuristic; // Hjulpet søgning med vores goal

    this.pq = new PriorityQueue(); // De nodes vi skal "søge/explore" filtreret af f-score
    this.gScore = new Map(); //Indeholder cost fra start to node
    this.fScore = new Map(); // g-score + heuristic vores estimeret total
    this.cameFrom = new Map(); // Parent points for vores path
    this.openSet = new Set(); // Nodes der er i priority kø (Visualisering)
    this.closedSet = new Set(); // Alle vores explored nodes

    //States til variables
    this.exploredCount = 0;
    this.isComplete = false;

    this._initialize();
  }

  /* Initializer vores algoritme med start(Objekt) node */
  _initialize() {
    const startKey = this._key(this.start);
    this.pq.push(this.start, 0);
    this.gScore.set(startKey, 0);
    this.fScore.set(startKey, this.heuristic(this.start, this.goal));
    this.openSet.add(startKey);
  }

  /* Laver en unikt key for node | format "x,y" */
  _key(node) {
    return `${node.x},${node.y}`;
  }

  /* Laver vores path fra goal tilbage til start */
  _reconstructPath(endNode) {
    const path = [];
    let current = endNode;

    //Følger vores parent pointers tilbage af
    while (current) {
      path.unshift(current); // Tilføjer forrest i arrayet
      current = this.cameFrom.get(this._key(current));
    }

    return path;
  }

  /*   
    Udføre 1 iteration af A* Algoritmen
    Returner: status og det visuelle data
  */
  step() {
    if (this.isComplete || this.pq.isEmpty()) {
      return { done: true, path: null };
    }

    //Henter node med lavese f-score
    const current = this.pq.pop();
    const currentKey = this._key(current);


    //Flytter fra det åbne til lukkede sæt
    this.openSet.delete(currentKey);
    this.closedSet.add(currentKey);
    this.exploredCount++;

    // Tjekker om vi er kommet i mål ud fra x og y værdier
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

    // Explore neighbors | Tjekker de nærmeste nodes/celler
    const neighbors = GridUtils.getNeighbors(current, this.grid);

    for (const neighbor of neighbors) {
      const neighborKey = this._key(neighbor);

      //Skipper hvis vi allerrede har tjekket den
      if (this.closedSet.has(neighborKey)) continue;

      //udregner den nuværende g-score | Altså hvad er "cost" for at ramme naboen
      const tentativeG = this.gScore.get(currentKey) + neighbor.cost;

      //Opdaterer hvis path er bedre
      if (tentativeG < (this.gScore.get(neighborKey) || Infinity)) {

        this.cameFrom.set(neighborKey, current);
        this.gScore.set(neighborKey, tentativeG);

        // A* Formel | f(n) = g(n) + h(n)
        const f = tentativeG + this.heuristic(neighbor, this.goal);
        this.fScore.set(neighborKey, f);

        //Tilføjer til priority kø, hvis den ikke er der.
        if (!this.openSet.has(neighborKey)) {
          this.pq.push(neighbor, f);
          this.openSet.add(neighborKey);
        }
      }
    }

    //Returner nuværende state for visualisering
    return {
      done: false,
      current,
      currentPath: this._reconstructPath(current),
      openSet: this._getNodesFromKeys(this.openSet),
      closedSet: this._getNodesFromKeys(this.closedSet),
      exploredCount: this.exploredCount
    };
  }

  /* 
  Laver et sæt af "keys" til array af node objektor
  Altså ("x,y") bliver til Array af {x, y} objektor
  */
  _getNodesFromKeys(keySet) {
    return Array.from(keySet).map(k => {
      const [x, y] = k.split(',').map(Number);
      return { x, y };
    });
  }


  /*
  Henter nuværrende statistik over algoritmen 
   */
  getStats() {
    return {
      explored: this.exploredCount,
      openSetSize: this.openSet.size,
      closedSetSize: this.closedSet.size
    };
  }
}

export default AStar;