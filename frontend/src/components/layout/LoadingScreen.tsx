'use client';

import { motion } from 'framer-motion';

export function LoadingScreen({ fullScreen = true }: { fullScreen?: boolean }) {
  return (
    <div className={`${fullScreen ? 'fixed' : 'absolute'} inset-0 bg-surface-bg/50 backdrop-blur-sm flex flex-col items-center justify-center z-[100]`}>

      <div className="relative">
        {/* Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full border-t-2 border-r-2 border-brand-blue"
        />
        {/* Inner Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border-b-2 border-l-2 border-brand-purple"
        />
        {/* Center Dot */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute inset-[40%] bg-brand-cyan rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"
        />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 flex flex-col items-center"
      >
        <span className="text-text-primary font-bold text-lg tracking-wider">LevelUp AI</span>
        <div className="flex gap-1 mt-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="w-1.5 h-1.5 rounded-full bg-brand-blue"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
