export default function Stats({ explored, pathLength, isRunning, isComplete }) {
  return (
    <div className="bg-blue-50 p-4 rounded">
      <h3 className="font-semibold text-blue-900 mb-2">Statistik</h3>
      <div className="space-y-1 text-sm">
        <div>Nodes "set": <span className="font-mono">{explored}</span></div>
        <div>Path Længde: <span className="font-mono">{pathLength}</span></div>
        <div>Status: <span className="font-mono">{
          isComplete ? 'Færdig' : 
          isRunning ? 'Kører...' : 'Klar'
        }</span></div>
      </div>
    </div>
  );
}