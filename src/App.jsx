import { useState } from 'react';
import './App.css';
import GameBoard from './Board';
import { motion } from 'framer-motion';
import cashOutSound from './assets/cashout-sound.mp3';
import playSound from './assets/play-sound.mp3';

const computeMultiplier = (x, b) => {
  let probability = 1;
  const totalCells = 25;
  for (let n = 0; n < x; n++) {
    probability *= (totalCells - b - n) / (totalCells - n);
  }
  return 1 / probability;
};

const getMultiplierColor = (multiplier) => {
  if (multiplier >= 16) return 'text-red-500';
  if (multiplier >= 8) return 'text-purple-500';
  if (multiplier >= 6) return 'text-orange-500';
  if (multiplier >= 4) return 'text-yellow-400';
  if (multiplier >= 2) return 'text-green-400';
  return 'text-white';
};

function App() {
  const [gameTrigger, setGameTrigger] = useState(0);
  const [canCashOut, setCanCashOut] = useState(false);
  const [mineCount, setMineCount] = useState(1);
  const [revealedCount, setRevealedCount] = useState(0);
  const [gameStatus, setGameStatus] = useState('idle');
  const [isMuted, setIsMuted] = useState('false');

  const handlePlay = () => {
    if (!isMuted) {
      const playAudio = new Audio(playSound);
      playAudio.volume = 0.4;
      playAudio.play();
    }

    setGameStatus('playing');
    setGameTrigger((prev) => prev + 1);
  };

  const handleCashOut = () => {
    setGameStatus('cashedOut');
    if(!isMuted) {
      const cashOutAudio = new Audio(cashOutSound);
      cashOutAudio.volume = 0.3;
      cashOutAudio.play();
    }
  };

  const multiplier = computeMultiplier(revealedCount, mineCount).toFixed(2);

  return (
    <div className='min-h-screen w-full bg-gray-950 flex flex-col lg:flex-row justify-center items-center p-4'>
      {/* Control Panel */}
      <div className='flex flex-col items-center justify-center w-full max-w-sm p-4 sm:p-6'>
        <h1
          className={`mb-6 text-center text-3xl sm:text-4xl font-bold ${getMultiplierColor(
            multiplier
          )}`}
        >
          {revealedCount > 0 ? `${multiplier}x` : '1.00x'}
        </h1>

        {/* Mines slider */}
        <div className='mb-4 w-full'>
          <p className='text-white font-semibold mb-2 text-sm sm:text-base'>
            Mines: {mineCount}
          </p>
          <input
            type='range'
            min='1'
            max='24'
            value={mineCount}
            disabled={gameStatus === 'playing'}
            onChange={(e) => setMineCount(Number(e.target.value))}
            className='w-full'
          />
        </div>

        {/* Buttons */}
        <motion.button
          onClick={handlePlay}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold text-sm sm:text-base py-3 sm:py-4 px-6 sm:px-8 rounded-full w-full mb-4'
          disabled={gameStatus === 'playing'}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          PLAY
        </motion.button>

        <motion.button
          onClick={handleCashOut}
          disabled={!canCashOut}
          className='bg-green-500 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold text-sm sm:text-base py-3 sm:py-4 px-6 sm:px-8 rounded-full w-full'
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          CASH OUT
        </motion.button>

        {/* CashOut Popup */}
        {gameStatus === 'cashedOut' && (
          <div className='mt-6 w-full flex justify-center'>
            <div className='text-center p-4 bg-black bg-opacity-70 rounded-lg border-4 border-green-500 w-full'>
              <h2 className='text-3xl sm:text-4xl font-bold text-green-400'>
                {multiplier}x
              </h2>
              <p className='text-base sm:text-lg text-white mt-2'>
                Cashed Out!
              </p>
            </div>
          </div>
        )}

        <motion.button
          onClick={() => setIsMuted((m) => !m)}
          className='bg-gray-650 hover:bg-gray-600 text-white font-bold text-sm py-2 px-3 rounded-full w-full mt-4 mb-2'
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
        >
          {isMuted ? 'Unmute 🔊' : 'Mute 🔇'}
        </motion.button>
      </div>

      {/* Game Board */}
      <div className='flex-1 flex justify-center items-center p-2 sm:p-6 overflow-x-auto'>
        <GameBoard
          gameTrigger={gameTrigger}
          onCanCashOutChange={setCanCashOut}
          mineCount={mineCount}
          onSafeRevealCountChange={setRevealedCount}
          gameStatus={gameStatus}
          setGameStatus={setGameStatus}
          isMuted={isMuted}
        />
      </div>
    </div>
  );
}

export default App;
