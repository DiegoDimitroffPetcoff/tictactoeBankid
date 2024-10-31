import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

function Square({
  value,
  onClick,
  disabled,
}: {
  value: string | null;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <Button
      className="w-16 h-16 text-2xl font-bold bg-white hover:bg-gray-100"
      onClick={onClick}
      disabled={disabled}
    >
      {value}
    </Button>
  );
}

interface TicTacToeProps {
  isDisabled: boolean;
  timeRemaining: number;
}

export default function TicTacToe({
  isDisabled,
  timeRemaining,
}: TicTacToeProps) {
  const [squares, setSquares] = useState<(string | null)[]>(
    Array(9).fill(null)
  );
  const [xIsNext, setXIsNext] = useState(true);

  const handleClick = (i: number) => {
    if (calculateWinner(squares) || squares[i] || isDisabled) {
      return;
    }
    const newSquares = squares.slice();
    newSquares[i] = xIsNext ? "X" : "O";
    setSquares(newSquares);
    setXIsNext(!xIsNext);
  };

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (squares.every(Boolean)) {
    status = "It's a draw!";
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="text-center mb-4">
        <p className="text-lg">{status}</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {squares.map((square, i) => (
          <Square
            key={i}
            value={square}
            onClick={() => handleClick(i)}
            disabled={isDisabled || !!winner}
          />
        ))}
      </div>
      <button 
        onClick={resetGame}
        className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
      >
        Reset Game
      </button>
      {timeRemaining > 0 && (
        <div className="mt-4 text-center text-blue-500">
          You have {timeRemaining} seconds left to continue playing. You must
          log in with BankID to continue playing.
        </div>
      )}
      {isDisabled && (
        <div className="mt-4 text-center text-red-500">
          Please log in to continue playing.
        </div>
      )}
    </div>
  );
}

function calculateWinner(squares: (string | null)[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
