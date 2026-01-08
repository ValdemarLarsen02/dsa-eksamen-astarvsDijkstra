/* Komponent der styrer vores knapper til redigering af bane/grid, med vores givende states på applikationen */


import { Edit3, Eye } from 'lucide-react';

export default function EditModeToggle({ editMode, onToggle, disabled }) {
    return (
        <div className="bg-indigo-50 p-4 rounded">
            <h3 className="font-semibold text-indigo-900 mb-3">
                 Opret egen bane
            </h3>

            <button
                onClick={onToggle}
                disabled={disabled}
                className={`
          w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg
          font-medium transition-all
          ${editMode
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-white text-indigo-600 border-2 border-indigo-300 hover:bg-indigo-50'
                    }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
            >
                {editMode ? (
                    <>
                        <Eye size={18} />
                        <span>Se</span>
                    </>
                ) : (
                    <>
                        <Edit3 size={18} />
                        <span>Rediger</span>
                    </>
                )}
            </button>

            <div className="mt-3 text-xs text-indigo-700 space-y-1">
                <p className="font-medium"></p>
                <ul className="ml-4 space-y-1">
                    <li>• Tegn/opret vække ved at venstreklik</li>
                </ul>
            </div>

            {editMode && (
                <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded text-xs text-yellow-800">
                    For at vi viser det rigtige resultat så skal "banen" nulstilles når man har placeret nye blokke
                </div>
            )}
        </div>
    );
}