import { useEffect, useState, } from 'react';
import Cell from './Cell';
import gemSound from './assets/gem-sound.mp3';
import bombSound from './assets/bomb-sound.mp3';
import cashOutSound from './assets/cashout-sound.mp3';

const initBoard = () => {
  const size = 5;
  return Array(size)
    .fill()
    .map(() =>
      Array(size)
        .fill()
        .map(() => ({ hasMine: false, revealed: false }))
    );
};

const placeMines = (board, mineCount) => {
  const size = board.length;
  const positions = new Set();

  while (positions.size < mineCount) {
    const r = Math.floor(Math.random() * size);
    const c = Math.floor(Math.random() * size);
    positions.add(`${r},${c}`);
  }

  return board.map((row, r) =>
    row.map((cell, c) => ({
      ...cell,
      hasMine: positions.has(`${r},${c}`),
    }))
  );
};

const revealAllCells = (board) => {
  return board.map((row) =>
    row.map((cell) => ({
      ...cell,
      revealed: true,
    }))
  );
};

const GameBoard = ({
  gameTrigger,
  onCanCashOutChange,
  mineCount,
  onSafeRevealCountChange,
  gameStatus,
  setGameStatus,
  isMuted,
}) => {
  const [board, setBoard] = useState(initBoard);

  useEffect(() => {
    const empty = initBoard();
    const withMines = placeMines(empty, mineCount);
    setBoard(withMines);
    onSafeRevealCountChange(0);
  }, [gameTrigger, mineCount, onSafeRevealCountChange]);

  useEffect(() => {
    const hasSafe = board.some((row) =>
      row.some((cell) => cell.revealed && !cell.hasMine)
    );
    const canCashOut = hasSafe && gameStatus === 'playing';
    onCanCashOutChange(canCashOut);
  }, [board, gameStatus, onCanCashOutChange]);

  useEffect(() => {
    if (gameStatus === 'gameOver' || gameStatus === 'cashedOut') {
      setBoard((prevBoard) => revealAllCells(prevBoard));
    }
  }, [gameStatus]);

  const handleReveal = (row, col) => {
    if (gameStatus !== 'playing') {
      return;
    }

    const clickedCell = board[row][col];
    if (clickedCell.revealed) return;

    const isMine = clickedCell.hasMine;

    let newBoard = board.map((r, rowIndex) =>
      r.map((cell, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return { ...cell, revealed: true };
        }
        return cell;
      })
    );

    setBoard(newBoard);

    if (isMine) {
      if (!isMuted) {
        const bombAudio = new Audio(bombSound);
        bombAudio.volume = 0.2;
        bombAudio.play();
      }

      setGameStatus('gameOver');
      setTimeout(() => {
        setBoard(revealAllCells);
      }, 300);
    } else {
      if (!isMuted) {
        const gemAudio = new Audio(gemSound);
        gemAudio.volume = 0.3;
        gemAudio.play();
      }

      const safeRevealedCount = newBoard
        .flat()
        .filter((c) => c.revealed && !c.hasMine).length;
      onSafeRevealCountChange(safeRevealedCount);

      const totalSafeCells = 25 - mineCount;
      if (safeRevealedCount === totalSafeCells) {
        setGameStatus('cashedOut');
        if (!isMuted) {
          const cashOutAudio = new Audio(cashOutSound);
          cashOutAudio.volume = 0.2;
          cashOutAudio.play();
        }
      }
    }
  };

  return (
    <div
      className='w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl 
flex flex-col gap-2 items-center p-2 sm:p-4 
bg-gray-950'
    >
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className='flex gap-2 sm:gap-3'>
          {row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              hasMine={cell.hasMine}
              revealed={cell.revealed}
              onReveal={() => handleReveal(rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
export default GameBoard;
