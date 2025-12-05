import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface DaysCounterProps {
  startDate: Date;
}

export const DaysCounter: React.FC<DaysCounterProps> = ({ startDate }) => {
  const [timeDiff, setTimeDiff] = useState<number>(0);
  const [isFuture, setIsFuture] = useState<boolean>(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      // Reset hours to start of day for clean day calculation
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const current = new Date(now);
      current.setHours(0, 0, 0, 0);

      const diffTime = current.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setTimeDiff(Math.abs(diffDays));
      setIsFuture(diffDays < 0);
    };

    calculateTime();
    const timer = setInterval(calculateTime, 60000); // Update every minute is enough for days

    return () => clearInterval(timer);
  }, [startDate]);

  return (
    <div className="relative flex flex-col items-center justify-center p-10 text-center animate-float">
      <div className="absolute -z-10 opacity-20">
        <Heart className="w-64 h-64 text-rose-500 fill-rose-500 animate-pulse-slow" />
      </div>
      
      <h2 className="text-xl md:text-2xl font-serif text-rose-800 mb-4">
        {isFuture ? "距离我们的故事开始还有" : "我们已经相爱了"}
      </h2>
      
      <div className="flex items-baseline space-x-2">
        <span className="text-6xl md:text-8xl font-bold text-rose-600 drop-shadow-sm">
          {timeDiff}
        </span>
        <span className="text-2xl text-rose-700 font-serif">天</span>
      </div>
      
      <p className="mt-6 text-rose-500 font-medium tracking-wide">
        {startDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
    </div>
  );
};