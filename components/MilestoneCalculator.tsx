import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { addDays, format, differenceInDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface MilestoneCalculatorProps {
  startDate: Date;
  onSelectMilestone: (days: number, date: string) => void;
}

export const MilestoneCalculator: React.FC<MilestoneCalculatorProps> = ({ startDate, onSelectMilestone }) => {
  const [inputDays, setInputDays] = useState<number>(100);
  const [resultDate, setResultDate] = useState<Date>(addDays(startDate, 100));

  useEffect(() => {
    setResultDate(addDays(startDate, inputDays));
  }, [inputDays, startDate]);

  const handleCalculate = () => {
    // Just trigger the parent callback if needed, but calculation is live
    onSelectMilestone(inputDays, format(resultDate, 'yyyy-MM-dd'));
  };

  const quickSelect = [100, 365, 520, 999, 10000];

  return (
    <div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-rose-100">
      <div className="flex items-center space-x-2 mb-6">
        <Calendar className="w-5 h-5 text-rose-500" />
        <h3 className="text-lg font-bold text-gray-800">纪念日计算器</h3>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            我想知道恋爱第...
          </label>
          <div className="relative">
            <input
              type="number"
              value={inputDays}
              onChange={(e) => setInputDays(Math.max(1, parseInt(e.target.value) || 0))}
              className="block w-full px-4 py-3 text-rose-900 bg-rose-50 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition-all font-mono text-lg"
            />
            <span className="absolute right-4 top-3.5 text-gray-400">天</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {quickSelect.map(day => (
            <button
              key={day}
              onClick={() => setInputDays(day)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                inputDays === day 
                  ? 'bg-rose-500 text-white border-rose-500' 
                  : 'bg-white text-rose-500 border-rose-200 hover:bg-rose-50'
              }`}
            >
              {day}天
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-100 to-pink-50 rounded-xl">
          <div className="text-sm text-rose-600 font-medium">是这一天</div>
          <ArrowRight className="w-4 h-4 text-rose-400" />
          <div className="text-xl font-bold text-rose-800 font-serif">
            {format(resultDate, 'yyyy年MM月dd日', { locale: zhCN })}
          </div>
        </div>
        
         <div className="text-center text-xs text-gray-400">
            {format(resultDate, 'EEEE', { locale: zhCN })}
         </div>

        <button
          onClick={handleCalculate}
          className="w-full flex items-center justify-center space-x-2 bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg transform active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>让 AI 为这一天出谋划策</span>
        </button>
      </div>
    </div>
  );
};