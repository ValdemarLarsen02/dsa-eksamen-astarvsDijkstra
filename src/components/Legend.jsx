export default function Legend() {
    return (
        <div className="bg-gray-50 p-4 rounded text-sm">
            <h3 className="font-semibold text-gray-800 mb-2">Overblik</h3>
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span>Start</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span>Goal</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-300"></div>
                    <span>Open Set (frontier)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-300"></div>
                    <span>Closed Set (explored)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-500"></div>
                    <span>Nuværrende path</span>
                </div>
            </div>
        </div>
    );
}