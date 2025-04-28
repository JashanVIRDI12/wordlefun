'use client';

import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

export default function WordleBoard({ guesses, solution, currentGuess }) {
    const tileRefs = useRef([]);

    const currentRow = guesses.length;

    const setTileRef = useCallback((row, col) => (el) => {
        if (!tileRefs.current[row]) {
            tileRefs.current[row] = [];
        }
        tileRefs.current[row][col] = el;
    }, []);

    const rows = Array.from({ length: 6 }, (_, i) => {
        if (i === currentRow) return currentGuess.padEnd(5);
        return guesses[i] ? guesses[i].padEnd(5) : ''.padEnd(5);
    });

    // ✅ Perfect card flip on final guess submission
    useEffect(() => {
        if (guesses.length > 0) {
            const lastRowIndex = guesses.length - 1;
            const tiles = tileRefs.current[lastRowIndex];

            if (tiles) {
                tiles.forEach((tile, index) => {
                    const tl = gsap.timeline({
                        delay: index * 0.15, // slight stagger between each flip
                    });

                    tl.to(tile, {
                        rotateX: 90,
                        duration: 0.3,
                        ease: 'power1.in',
                        onComplete: () => {
                            tile.classList.add('flipped'); // we can trigger class change
                        },
                    });

                    tl.to(tile, {
                        rotateX: 0,
                        duration: 0.3,
                        ease: 'bounce.out',
                    });
                });
            }
        }
    }, [guesses]);

    // ✅ Smooth "typing" bounce
    useEffect(() => {
        const currentTiles = tileRefs.current[currentRow];
        if (currentTiles && currentGuess.length) {
            const tile = currentTiles[currentGuess.length - 1];
            if (tile) {
                gsap.fromTo(tile,
                    { scale: 0.9 },
                    { scale: 1, duration: 0.2, ease: 'elastic.out(1, 0.5)' }
                );
            }
        }
    }, [currentGuess, currentRow]);

    function getCellColor(letter, index, isSubmittedRow) {
        if (!letter.trim()) return 'bg-[#1E1E1E] border-[#333]';
        if (!isSubmittedRow) return 'bg-[#1E1E1E] border-[#333]';

        const solutionArray = solution.split('');

        if (solutionArray[index] === letter) {
            return 'bg-gradient-to-br from-green-400 to-green-600 text-white';
        } else if (solutionArray.includes(letter)) {
            return 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-black';
        } else {
            return 'bg-gradient-to-br from-gray-700 to-gray-900 text-gray-300';
        }
    }

    return (
        <div className="grid grid-rows-6 gap-2 mb-8 perspective-1000">
            {rows.map((word, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-5 gap-2">
                    {Array.from({ length: 5 }, (_, colIndex) => {
                        const letter = word[colIndex] || '';
                        const isSubmittedRow = rowIndex < guesses.length;
                        const tileColorClass = getCellColor(letter, colIndex, isSubmittedRow);

                        return (
                            <div
                                key={colIndex}
                                ref={setTileRef(rowIndex, colIndex)}
                                className={`w-16 h-16 flex items-center justify-center text-2xl font-bold rounded-xl border transition-all duration-300 ${tileColorClass}`}
                                style={{
                                    transformStyle: 'preserve-3d',
                                    transformOrigin: 'center',
                                }}
                            >
                                {letter}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}












