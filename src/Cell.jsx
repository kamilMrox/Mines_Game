import { motion } from 'framer-motion';
import bombImg from './assets/bomb-svgrepo-com.svg';
import gemImg from './assets/gem-stone-svgrepo-com.svg';

const Cell = ({ hasMine, revealed, onReveal }) => {
  return (
    <motion.div
      onClick={() => {
        if (!revealed) onReveal();
      }}
      whileTap={{ scale: 0.9 }}
      animate={{
        backgroundColor: revealed
          ? hasMine
            ? '#450a0a'
            : '#1a1a1a'
          : '#2d2d2d',
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 18,
        delay: revealed ? 0.15 : 0,
        duration: 0.4,
      }}
      className={`
        w-28 h-28 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 
        flex justify-center items-center 
        cursor-pointer 
        border border-gray-700 
        rounded-lg 
        shadow-md 
        ${
          revealed
            ? ''
            : 'hover:scale-105 hover:shadow-[0_0_10px_rgba(255,255,255,0.2)]'
        }
      `}
    >
      {revealed && (
        <motion.span
          initial={
            hasMine
              ? { scale: 0.6, opacity: 0, rotate: 0 }
              : { opacity: 0, scale: 0.6 }
          }
          animate={
            hasMine
              ? {
                  scale: [1.2, 1.6, 1],
                  opacity: [1, 0.7, 1],
                  rotate: [0, 20, -20, 0],
                }
              : {
                  opacity: 1,
                  scale: 1,
                }
          }
          transition={{
            duration: hasMine ? 0.6 : 0.3,
            ease: 'easeOut',
            delay: 0.6,
          }}
          className='w-20 h-20 text-3xl'
        >
          <img
            src={hasMine ? bombImg : gemImg}
            alt={hasMine ? 'Bomb' : 'Gem'}
            className='w-full h-full'
          />
        </motion.span>
      )}
    </motion.div>
  );
};

export default Cell;
