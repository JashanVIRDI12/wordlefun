'use client';

const keys1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
const keys2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
const keys3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

export default function Keyboard({ onKeyPress, onEnter, onDelete, letterStatuses = {} }) {
    const getKeyClass = (key) => {
        const status = letterStatuses[key];

        if (status === 'correct') {
            return "bg-gradient-to-r from-green-400 to-green-600 text-white shadow-md";
        } else if (status === 'present') {
            return "bg-gradient-to-r from-yellow-300 to-yellow-500 text-black shadow-md";
        } else if (status === 'absent') {
            return "bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 shadow-inner";
        } else {
            return "bg-[#2C2C2C] hover:bg-[#3A3A3A] text-gray-100";
        }
    };

    return (
        <div className="space-y-2">
            {[keys1, keys2, keys3].map((row, idx) => (
                <div key={idx} className="flex justify-center space-x-2">
                    {row.map((key) => (
                        <button
                            key={key}
                            className={`w-14 h-16 flex items-center justify-center font-bold rounded-xl backdrop-blur-md transition-all duration-200 ${getKeyClass(key)} hover:scale-105 active:scale-95`}
                            onClick={() => onKeyPress(key)}
                        >
                            {key}
                        </button>
                    ))}
                </div>
            ))}
            <div className="flex justify-center space-x-4 mt-4">
                <button
                    className="w-28 h-16 bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:brightness-110 text-white font-bold rounded-xl backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95"
                    onClick={onEnter}
                >
                    Enter
                </button>
                <button
                    className="w-28 h-16 bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:brightness-110 text-white font-bold rounded-xl backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95"
                    onClick={onDelete}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}







