/* Canvas som også kan tegnes på med musen */

import { useRef, useEffect, useState } from 'react';
import { CELL_SIZE, CELL_WALL, CELL_EMPTY } from '../utils/constants';

export default function InteractiveCanvas({
    grid,
    onGridChange,
    start,
    goal,
    openSet,
    closedSet,
    currentPath,
    finalPath,
    canvasWidth = 600,
    canvasHeight = 600,
    editMode = false,
    pathColor = '#3b82f6'
}) {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const gridSize = grid.length;
    const cellWidth = canvasWidth / gridSize;
    const cellHeight = canvasHeight / gridSize;

    /* Hjælpe funktioner til forskellige handlinger brugeren laver på vores canvas */
    const handleMouseDown = (e) => {
        if (!editMode || !onGridChange) return;

        setIsDrawing(true);
        handleDraw(e);
    };

    /* Dragging, så vi kan tegne flere på sammme tid.. */
    const handleMouseMove = (e) => {
        if (!editMode || !isDrawing || !onGridChange) return;
        handleDraw(e);
    };

    /*     Når brugeren slipper musen ved brugeren har holdt den nede */
    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    /* Tegner/Opretter vores blokke på vores grid */
    const handleDraw = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const gridX = Math.floor(x / cellWidth);
        const gridY = Math.floor(y / cellHeight);

        if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize) {
            // Brugeren skal ikke kunne tegne i start og mål(goal) | PT kun sat til på selve den x og y pos.
            if ((gridX === start.x && gridY === start.y) ||
                (gridX === goal.x && gridY === goal.y)) {
                return;
            }

            // Create new grid with modification
            const newGrid = grid.map(row => [...row]);

            if (e.shiftKey) {
                // Shift + click = slet
                newGrid[gridY][gridX] = CELL_EMPTY;
            } else {
                // Normal click = normal væg/blok
                newGrid[gridY][gridX] = CELL_WALL;
            }

            onGridChange(newGrid);
        }
    };

    /* Højre klik med musen */
    const handleContextMenu = (e) => {
        e.preventDefault();
        if (!editMode || !onGridChange) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const gridX = Math.floor(x / cellWidth);
        const gridY = Math.floor(y / cellHeight);

        if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize) {
            /* Sikre vi ikke fjernet start og goal ligesom med placeringen */
            if ((gridX === start.x && gridY === start.y) ||
                (gridX === goal.x && gridY === goal.y)) {
                return;
            }

            const newGrid = grid.map(row => [...row]);
            newGrid[gridY][gridX] = CELL_EMPTY; /* Placere CELL_EMPTY på vores grid plads */
            onGridChange(newGrid);
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !grid.length) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // tegner vores blokke/grid med korrekte farver afhænig af hvilken type der er sat på x og y
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                ctx.fillStyle = grid[y][x] === CELL_WALL ? '#1f2937' : '#f3f4f6';
                ctx.fillRect(
                    x * cellWidth,
                    y * cellHeight,
                    cellWidth - 1,
                    cellHeight - 1
                );
            }
        }

        /* Tegner vores closed set, de blokke var har "explored" */
        ctx.fillStyle = 'rgba(252, 165, 165, 0.6)';
        closedSet.forEach(node => {
            ctx.fillRect(
                node.x * cellWidth,
                node.y * cellHeight,
                cellWidth - 1,
                cellHeight - 1
            );
        });

        /* Tegner vores open set, de blokke de bør/KAN "undersøges" næste gang */
        ctx.fillStyle = 'rgba(134, 239, 172, 0.6)';
        openSet.forEach(node => {
            ctx.fillRect(
                node.x * cellWidth,
                node.y * cellHeight,
                cellWidth - 1,
                cellHeight - 1
            );
        });

        // Tegner den nuværrende valgte path
        if (currentPath.length > 1 && finalPath.length === 0) {
            ctx.strokeStyle = pathColor;
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(
                currentPath[0].x * cellWidth + cellWidth / 2,
                currentPath[0].y * cellHeight + cellHeight / 2
            );
            for (let i = 1; i < currentPath.length; i++) {
                ctx.lineTo(
                    currentPath[i].x * cellWidth + cellWidth / 2,
                    currentPath[i].y * cellHeight + cellHeight / 2
                );
            }
            ctx.stroke();
        }

        // Tegner vores endegyldige path, som har fundet goal
        if (finalPath.length > 0) {
            ctx.strokeStyle = pathColor;
            ctx.lineWidth = 6;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.shadowColor = pathColor.replace(')', ', 0.5)').replace('rgb', 'rgba');
            ctx.shadowBlur = 10;

            ctx.beginPath();
            ctx.moveTo(
                finalPath[0].x * cellWidth + cellWidth / 2,
                finalPath[0].y * cellHeight + cellHeight / 2
            );
            for (let i = 1; i < finalPath.length; i++) {
                ctx.lineTo(
                    finalPath[i].x * cellWidth + cellWidth / 2,
                    finalPath[i].y * cellHeight + cellHeight / 2
                );
            }
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        /* Tegner Start */
        ctx.fillStyle = '#22c55e';
        ctx.shadowColor = 'rgba(34, 197, 94, 0.6)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(
            start.x * cellWidth + cellWidth / 2,
            start.y * cellHeight + cellHeight / 2,
            8,
            0,
            Math.PI * 2
        );
        ctx.fill();

        /* Tegner goal */
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = 'rgba(239, 68, 68, 0.6)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(
            goal.x * cellWidth + cellWidth / 2,
            goal.y * cellHeight + cellHeight / 2,
            8,
            0,
            Math.PI * 2
        );
        ctx.fill();
        ctx.shadowBlur = 0;

    }, [grid, openSet, closedSet, currentPath, finalPath, start, goal, editMode]);

    return (
        <div className="relative">
            <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onContextMenu={handleContextMenu}
                className={`border-2 rounded ${editMode
                    ? 'border-blue-500 cursor-crosshair'
                    : 'border-gray-300'
                    }`}
            />

            {editMode && (
                <div className="absolute top-2 left-2 bg-blue-100 border border-blue-300 rounded px-3 py-2 text-xs">
                    <div className="font-semibold text-blue-900 mb-1">Rediger</div>
                    <div className="text-blue-700 space-y-1">
                        <div>• Venstreklik: Placer væg</div>
                        <div>• Højreklik: Slet væg</div>
                        <div>• Shift + klik: Slet væg</div>
                    </div>
                </div>
            )}
        </div>
    );
}