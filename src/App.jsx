import { useState, useEffect, useRef } from 'react'
import { GRID_SIZE } from './utils/constants';
import './App.css'

// Algorithm
import AStar from './algorithms/AStar';
import Dijkstra from './algorithms/Dijkstra';
import { Heuristics } from './algorithms/heuristics';

// Grid utilities
import { TRACKS } from './utils/grid';

// Components
import Controls from './components/Controls';
import Stats from './components/Stats';
import Legend from './components/Legend';
import TrackSelector from './components/TrackSelector';
import RaceMode from './components/RaceMode';

/* Vores egen edit mode */
import InteractiveCanvas from './components/InteractiveCanvas';
import EditModeToggle from './components/EditModeToggle';


function AStarVisualizer() {
  //States der holder styr på vores grid og modes osv
  const [grid, setGrid] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(TRACKS[0]);
  const [start, setStart] = useState(TRACKS[0].start);
  const [goal, setGoal] = useState(TRACKS[0].goal);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [editMode, setEditMode] = useState(false);
  const [raceMode, setRaceMode] = useState(false);



  //Start states til vores algoritmer
  // A*
  const [astarOpenSet, setAstarOpenSet] = useState([]);
  const [astarClosedSet, setAstarClosedSet] = useState([]);
  const [astarCurrentPath, setAstarCurrentPath] = useState([]);
  const [astarFinalPath, setAstarFinalPath] = useState([]);
  const [astarStats, setAstarStats] = useState({ explored: 0, pathLength: 0 });


  // Dijkstra
  const [dijkstraOpenSet, setDijkstraOpenSet] = useState([]);
  const [dijkstraClosedSet, setDijkstraClosedSet] = useState([]);
  const [dijkstraCurrentPath, setDijkstraCurrentPath] = useState([]);
  const [dijkstraFinalPath, setDijkstraFinalPath] = useState([]);
  const [dijkstraStats, setDijkstraStats] = useState({ explored: 0, pathLength: 0 });



  const astarRef = useRef(null);
  const dijkstraRef = useRef(null); // NY REF!


  // Initialize grid
  useEffect(() => {
    const newGrid = selectedTrack.creator(GRID_SIZE);
    setGrid(newGrid);
    setStart(selectedTrack.start);
    setGoal(selectedTrack.goal);
  }, [selectedTrack]);

  // useEffect der køres når vi starter algoritmen
  useEffect(() => {
    if (!isRunning || !grid.length) return;

    const runStep = () => {
      let astarDone = false;
      let dijkstraDone = false;

      // Run A* step
      if (astarRef.current && !astarRef.current.isComplete) {
        const result = astarRef.current.step();

        if (result.done) {
          astarDone = true;
          if (result.path) {
            setAstarFinalPath(result.path);
            setAstarStats({
              explored: astarRef.current.exploredCount,
              pathLength: result.path.length
            });
          }
        } else {
          setAstarOpenSet(result.openSet);
          setAstarClosedSet(result.closedSet);
          setAstarCurrentPath(result.currentPath);
          setAstarStats({
            explored: result.exploredCount,
            pathLength: result.currentPath.length
          });
        }
      } else {
        astarDone = true;
      }

      // Run Dijkstra step (if race mode)
      if (raceMode && dijkstraRef.current && !dijkstraRef.current.isComplete) {
        const result = dijkstraRef.current.step();

        if (result.done) {
          dijkstraDone = true;
          if (result.path) {
            setDijkstraFinalPath(result.path);
            setDijkstraStats({
              explored: dijkstraRef.current.exploredCount,
              pathLength: result.path.length
            });
          }
        } else {
          setDijkstraOpenSet(result.openSet);
          setDijkstraClosedSet(result.closedSet);
          setDijkstraCurrentPath(result.currentPath);
          setDijkstraStats({
            explored: result.exploredCount,
            pathLength: result.currentPath.length
          });
        }
      } else if (raceMode) {
        dijkstraDone = true;
      }

      // Stop if both are done
      if (astarDone && (!raceMode || dijkstraDone)) {
        setIsRunning(false);
      }
    };

    const interval = setInterval(runStep, 100 - speed);
    return () => clearInterval(interval);
  }, [isRunning, speed, grid, raceMode]);

  const handleStart = () => {
    // Initialize A*
    if (!astarRef.current) {
      astarRef.current = new AStar(grid, start, goal, Heuristics.euclidean);
    }

    // Initialize Dijkstra (if race mode)
    if (raceMode && !dijkstraRef.current) {
      dijkstraRef.current = new Dijkstra(grid, start, goal);
    }

    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);

    // Reset A*
    astarRef.current = null;
    setAstarOpenSet([]);
    setAstarClosedSet([]);
    setAstarCurrentPath([]);
    setAstarFinalPath([]);
    setAstarStats({ explored: 0, pathLength: 0 });

    // Reset Dijkstra
    dijkstraRef.current = null;
    setDijkstraOpenSet([]);
    setDijkstraClosedSet([]);
    setDijkstraCurrentPath([]);
    setDijkstraFinalPath([]);
    setDijkstraStats({ explored: 0, pathLength: 0 });
  };

  const handleTrackChange = (track) => {
    handleReset();
    setEditMode(false);
    setSelectedTrack(track);
  };

  const handleGridChange = (newGrid) => {
    setGrid(newGrid);
    handleReset();
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-5xl w-full">
        {raceMode ? (
          <h1 className="text-3xl font-bold text-gray-800 mb-2">A* vs Dijkstra Algoritme Visualisering</h1>
        ) : (
          <h1 className="text-3xl font-bold text-gray-800 mb-2">A* Algoritme Visualisering</h1>
        )}
        <p className="text-gray-600 mb-4">
          {editMode && <span className="ml-2 text-indigo-600">(Redigering)</span>}
          {raceMode && <span className="ml-2 text-yellow-600">(Løb)</span>}
        </p>

        <div className="flex gap-6">
          {/* Canvas(es) */}
          <div className="flex-shrink-0">
            {raceMode ? (
              // Split screen for race mode
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-semibold text-purple-700 mb-2 text-center">
                    A* Algoritme
                  </div>
                  <InteractiveCanvas
                    grid={grid}
                    onGridChange={null}
                    start={start}
                    goal={goal}
                    openSet={astarOpenSet}
                    closedSet={astarClosedSet}
                    currentPath={astarCurrentPath}
                    finalPath={astarFinalPath}
                    canvasWidth={300}
                    canvasHeight={300}
                    editMode={false}
                    pathColor="#9333ea"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold text-blue-700 mb-2 text-center">
                    Dijkstra Algoritme
                  </div>
                  <InteractiveCanvas
                    grid={grid}
                    onGridChange={null}
                    start={start}
                    goal={goal}
                    openSet={dijkstraOpenSet}
                    closedSet={dijkstraClosedSet}
                    currentPath={dijkstraCurrentPath}
                    finalPath={dijkstraFinalPath}
                    canvasWidth={300}
                    canvasHeight={300}
                    editMode={false}
                    pathColor="#3b82f6"
                  />
                </div>
              </div>
            ) : (
              // Single canvas for normal mode
              <InteractiveCanvas
                grid={grid}
                onGridChange={handleGridChange}
                start={start}
                goal={goal}
                openSet={astarOpenSet}
                closedSet={astarClosedSet}
                currentPath={astarCurrentPath}
                finalPath={astarFinalPath}
                canvasWidth={600}
                canvasHeight={600}
                editMode={editMode}
              />
            )}
          </div>

          <div className="flex flex-col gap-4 flex-1">
            {/* Toogle til racet */}
            <div className="bg-yellow-50 p-4 rounded border-2 border-yellow-300">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={raceMode}
                  onChange={(e) => {
                    setRaceMode(e.target.checked);
                    handleReset();
                  }}
                  disabled={isRunning || editMode}
                  className="w-5 h-5"
                />
                <span className="font-semibold text-yellow-900">
                  Algoritme løbet (A* vs Dijkstra)
                </span>
              </label>
            </div>

            {raceMode && (
              <RaceMode
                astarStats={astarStats}
                dijkstraStats={dijkstraStats}
                isRunning={isRunning}
                isComplete={astarFinalPath.length > 0 && dijkstraFinalPath.length > 0}
              />
            )}

            {!raceMode && (
              <EditModeToggle
                editMode={editMode}
                onToggle={() => setEditMode(!editMode)}
                disabled={isRunning}
              />
            )}


            {/* TODO:Husk at slå til hvis ejg laver flere baner */}
            {/* Pt slået fra da vi kun har en bane som det er lige nu  */}
            {/* <TrackSelector
              tracks={TRACKS}
              selectedTrack={selectedTrack}
              onTrackChange={handleTrackChange}
              disabled={isRunning || editMode}
            /> */}

            {!raceMode && (
              <Stats
                explored={astarStats.explored}
                pathLength={astarStats.pathLength}
                isRunning={isRunning}
                isComplete={astarFinalPath.length > 0}
              />
            )}

            <Controls
              isRunning={isRunning}
              isComplete={astarFinalPath.length > 0}
              speed={speed}
              onStart={handleStart}
              onPause={() => setIsRunning(false)}
              onReset={handleReset}
              onSpeedChange={setSpeed}
            />

            <Legend />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return <AStarVisualizer />
}