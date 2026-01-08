export default function Controls({ isRunning, isComplete, speed, onStart, onPause, onReset, onSpeedChange }) {
  return (
    <div className="bg-gray-50 p-4 rounded">
      <h3 className="font-semibold text-gray-800 mb-3">Funktioner</h3>
      <div className="flex justify-center items-center">
        <div className="flex gap-2 mb-4">
          <button
            onClick={onStart}
            disabled={isRunning || isComplete}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Start
          </button>
          <button
            onClick={onPause}
            disabled={!isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Pause
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
             Nulstil
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fart: {speed}%
        </label>
        <input
          type="range"
          min="0"
          max="95"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
}