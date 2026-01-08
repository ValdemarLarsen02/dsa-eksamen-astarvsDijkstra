
export default function TrackSelector({ tracks, selectedTrack, onTrackChange, disabled }) {
  return (
    <div className="bg-purple-50 p-4 rounded">
      <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
        Vælg Bane
      </h3>
      
      <div className="space-y-2">
        {tracks.map(track => (
          <button
            key={track.id}
            onClick={() => onTrackChange(track)}
            disabled={disabled}
            className={`
              w-full text-left p-3 rounded transition-all
              ${selectedTrack?.id === track.id 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white hover:bg-purple-100 text-gray-800'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="font-medium">{track.name}</div>
            <div className={`text-xs mt-1 ${
              selectedTrack?.id === track.id ? 'text-purple-100' : 'text-gray-500'
            }`}>
              {track.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}