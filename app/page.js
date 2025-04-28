'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import WordleBoard from '../components/WordleBoard';
import Keyboard from '../components/Keyboard';
import { Toaster, toast } from 'react-hot-toast';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';

export default function HomePage() {
    const [solution, setSolution] = useState('');
    const [currentGuess, setCurrentGuess] = useState('');
    const [guesses, setGuesses] = useState([]);
    const [letterStatuses, setLetterStatuses] = useState({});
    const [gameStatus, setGameStatus] = useState('playing');
    const popupRef = useRef(null);
    const boardRef = useRef(null);
    const { width, height } = useWindowSize();

    useEffect(() => {
        fetchNewWord();
    }, []);

    async function fetchNewWord() {
        try {
            const res = await fetch('/api/random-word');
            const data = await res.json();
            setSolution(data.word.toUpperCase());
        } catch (err) {
            console.error('Error fetching word:', err);
            toast.error("Failed to load new word.");
        }
    }

    function updateStatuses(guesses, solution) {
        const statuses = { ...letterStatuses };
        guesses.forEach(word => {
            word.split('').forEach((letter, idx) => {
                if (solution[idx] === letter) {
                    statuses[letter] = 'correct';
                } else if (solution.includes(letter)) {
                    if (statuses[letter] !== 'correct') {
                        statuses[letter] = 'present';
                    }
                } else {
                    if (!statuses[letter]) {
                        statuses[letter] = 'absent';
                    }
                }
            });
        });
        setLetterStatuses(statuses);
    }

    const handleKeyPress = (letter) => {
        if (currentGuess.length < 5) {
            setCurrentGuess(currentGuess + letter);
        }
    };

    const handleEnter = async () => {
        if (currentGuess.length !== 5) {
            toast.error('Word must be 5 letters.');
            return;
        }

        const res = await fetch('/api/check-word', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ word: currentGuess })
        });

        if (!res.ok) {
            toast.error('Not a valid English word.');
            return;
        }

        const guess = currentGuess.toUpperCase();
        const updatedGuesses = [...guesses, guess];
        setGuesses(updatedGuesses);
        setCurrentGuess('');
        updateStatuses(updatedGuesses, solution);

        if (guess === solution) {
            setGameStatus('won');

            // 🎉 Bounce celebration for board
            if (boardRef.current) {
                gsap.fromTo(boardRef.current,
                    { scale: 1 },
                    { scale: 1.05, yoyo: true, repeat: 3, duration: 0.3, ease: 'power1.inOut' }
                );
            }
        } else if (updatedGuesses.length >= 6) {
            setGameStatus('lost');
        }
    };

    const handleDelete = () => {
        setCurrentGuess(currentGuess.slice(0, -1));
    };

    const handleRestart = async () => {
        setGuesses([]);
        setCurrentGuess('');
        setLetterStatuses({});
        setGameStatus('playing');
        await fetchNewWord();
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-gray-100 p-4 relative overflow-hidden">
            <Toaster position="top-center" reverseOrder={false} />

            {/* 🎉 Confetti if WON */}
            {gameStatus === 'won' && (
                <Confetti width={width} height={height} numberOfPieces={300} gravity={0.3} />
            )}

            {(gameStatus === 'won' || gameStatus === 'lost') && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-20 animate-fade-in">
                    <div
                        ref={popupRef}
                        className={`relative p-10 rounded-2xl shadow-2xl text-center space-y-6 border-2 ${
                            gameStatus === 'won'
                                ? 'bg-gradient-to-br from-green-400 via-green-500 to-green-600 border-green-300'
                                : 'bg-gradient-to-br from-red-400 via-red-500 to-red-600 border-red-300'
                        }`}
                    >
                        {/* ✨ Shine behind title if WON */}
                        {gameStatus === 'won' && (
                            <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                                <div className="w-32 h-32 bg-white opacity-20 blur-2xl rounded-full animate-ping-slow"></div>
                            </div>
                        )}

                        <h2 className="text-5xl font-extrabold text-white relative z-10 animate-pop">
                            {gameStatus === 'won' ? 'Victory!' : 'Defeat'}
                        </h2>

                        <p className="text-lg text-white relative z-10">
                            The word was: <span className="font-bold">{solution}</span>
                        </p>

                        <button
                            onClick={handleRestart}
                            className="mt-4 px-8 py-3 bg-white text-black font-bold rounded-xl hover:scale-110 active:scale-95 transition transform relative z-10"
                        >
                            Play Again
                        </button>
                    </div>
                </div>
            )}

            <h1 className="text-7xl font-extrabold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-white/80 to-white/50">
                WordRush
            </h1>

            {/* 🎯 Wordle board (with ref for bounce) */}
            <div ref={boardRef}>
                <WordleBoard
                    guesses={guesses}
                    solution={solution}
                    currentGuess={currentGuess}
                />
            </div>

            {gameStatus === 'playing' && (
                <Keyboard
                    onKeyPress={handleKeyPress}
                    onEnter={handleEnter}
                    onDelete={handleDelete}
                    letterStatuses={letterStatuses}
                />
            )}
        </main>
    );
}







