import React from 'react';
import { Trophy } from 'lucide-react';

export default function RaceMode({
    astarStats,
    dijkstraStats,
    isRunning,
    isComplete
}) {
    // Determine winner
    const astarWins = isComplete && astarStats.explored < dijkstraStats.explored;
    const dijkstraWins = isComplete && dijkstraStats.explored < astarStats.explored;
    const tie = isComplete && astarStats.explored === dijkstraStats.explored;

    // Calculate efficiency
    const efficiency = dijkstraStats.explored > 0
        ? ((dijkstraStats.explored - astarStats.explored) / dijkstraStats.explored * 100).toFixed(1)
        : 0;

    return (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border-2 border-purple-200">
            <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                
                Algoritme Løbet
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-3">
                {/* A* Stats */}
                <div className={`bg-white p-3 rounded-lg border-2 ${astarWins ? 'border-green-500 bg-green-50' : 'border-gray-200'
                    }`}>
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-purple-700">A* Algoritme</span>
                       
                    </div>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Nodes "set":</span>
                            <span className="font-mono font-bold text-purple-900">
                                {astarStats.explored}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Path Længde:</span>
                            <span className="font-mono font-bold text-purple-900">
                                {astarStats.pathLength}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Dijkstra Stats */}
                <div className={`bg-white p-3 rounded-lg border-2 ${dijkstraWins ? 'border-green-500 bg-green-50' : 'border-gray-200'
                    }`}>
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-blue-700">Dijkstra</span>
                        {dijkstraWins && <Trophy size={16} className="text-yellow-500" />}
                    </div>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Nodes "set":</span>
                            <span className="font-mono font-bold text-blue-900">
                                {dijkstraStats.explored}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Path Længde:</span>
                            <span className="font-mono font-bold text-blue-900">
                                {dijkstraStats.pathLength}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vinder visning med vores udregnet værdier */}
            {isComplete && (
                <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3 text-center">
                    {astarWins && (
                        <div>
                            <div className="font-bold text-yellow-900 flex items-center justify-center gap-2">
                                A* Vinder!
                            </div>
                            <div className="text-sm text-yellow-800 mt-1">
                                {efficiency}% mere effektiv end Dijkstra
                            </div>
                        </div>
                    )}
                    {dijkstraWins && (
                        <div className="font-bold text-yellow-900 flex items-center justify-center gap-2">
                            Dijkstra Vinder! (Det er lidt vildt!)
                        </div>
                    )}
                    {tie && (
                        <div className="font-bold text-yellow-900 flex items-center justify-center gap-2">
                            Det er uafgjort!
                        </div>
                    )}
                </div>
            )}

            {/* Info */}
            {!isComplete && !isRunning && (
                <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs text-blue-800">
                    <p className="font-medium mb-1">Hvad forventer vi?</p>
                    <ul className="space-y-1 ml-4">
                        <li>• A* bruger heuristics (smartere søgning)</li>
                        <li>• Dijkstra udforsker/søger ensartet (blind søgning)</li>
                        <li>• Begge finder den optimale vej</li>
                    </ul>
                </div>
            )}
        </div>
    );
}