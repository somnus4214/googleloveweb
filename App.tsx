import React, { useState, useRef } from 'react';
import { DaysCounter } from './components/DaysCounter';
import { MilestoneCalculator } from './components/MilestoneCalculator';
import { AiLoveAssistant } from './components/AiLoveAssistant';
import { DailyQuote } from './components/DailyQuote';
import { START_DATE_STRING } from './types';
import { Heart } from 'lucide-react';

export default function App() {
  // Use the user's specific start date
  const [startDate] = useState<Date>(new Date(START_DATE_STRING));
  
  const [selectedMilestone, setSelectedMilestone] = useState<{days: number, dateStr: string} | null>(null);
  
  const aiSectionRef = useRef<HTMLDivElement>(null);

  const handleMilestoneSelect = (days: number, dateStr: string) => {
    setSelectedMilestone({ days, dateStr });
    // Smooth scroll to AI section
    setTimeout(() => {
        const element = document.getElementById('ai-assistant');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100);
  };

  return (
    <div className="min-h-screen pb-20 px-4 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center py-6">
        <div className="flex items-center space-x-3 text-rose-600 font-bold text-lg">
          <Heart className="fill-rose-600 w-5 h-5" />
          <span>LoveSpace</span>
          <span className="text-rose-300/50">|</span>
          <span className="font-serif italic text-rose-700">CL & ZSY</span>
        </div>
        <div className="text-xs text-rose-400 font-mono hidden md:block">
            Since {START_DATE_STRING}
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="w-full max-w-4xl flex flex-col items-center space-y-8 mt-4 md:mt-10">
        
        <div className="w-full flex flex-col items-center">
          <DaysCounter startDate={startDate} />
          <DailyQuote />
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mt-8">
            <div className="flex flex-col space-y-4">
                <div className="text-center lg:text-left mb-2">
                    <h3 className="text-2xl font-serif text-rose-800">纪念日查询</h3>
                    <p className="text-rose-400 text-sm">输入天数，查看未来的那个特别日子。</p>
                </div>
                <MilestoneCalculator 
                    startDate={startDate} 
                    onSelectMilestone={handleMilestoneSelect} 
                />
            </div>

            <div className="hidden lg:block relative h-full min-h-[300px] bg-white/40 rounded-3xl p-6 border border-white">
                 <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <Heart className="w-full h-full text-rose-300" />
                 </div>
                 <div className="relative z-10 text-center space-y-4 pt-10">
                    <h4 className="text-lg font-bold text-rose-700">爱的寄语</h4>
                    <p className="text-gray-600 italic leading-relaxed">
                        "爱情不是寻找一个完美的人，<br/>而是学会用完美的眼光，<br/>欣赏那个不完美的人。"
                    </p>
                    <p className="text-sm text-rose-500 mt-4">- 宫崎骏</p>
                 </div>
            </div>
        </div>

        {selectedMilestone && (
          <div className="w-full animate-fadeIn" ref={aiSectionRef}>
             <AiLoveAssistant 
                days={selectedMilestone.days} 
                dateStr={selectedMilestone.dateStr} 
             />
          </div>
        )}

      </main>

      <footer className="mt-20 text-rose-300 text-sm text-center">
        <p>&copy; 2025 LoveSpace. 为 CL & ZSY 专属定制。</p>
      </footer>
    </div>
  );
}