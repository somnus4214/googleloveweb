
import React, { useState, useEffect } from 'react';
import { Quote, RefreshCw, Sparkles } from 'lucide-react';
import { generateRomanticContent } from '../services/aiService';

const PRESET_QUOTES = [
  "斯人若彩虹，遇上方知有。",
  "晓看天色暮看云，行也思君，坐也思君。",
  "世间所有的相遇，都是久别重逢。",
  "海底月是天上月，眼前人是心上人。",
  "我想要和你一起慢慢变老。",
  "喜你为疾，药石无医。",
  "春风十里，不如你。",
  "愿得一心人，白首不相离。",
  "所爱隔山海，山海皆可平。",
  "山河远阔，人间星河，无一是你，无一不是你。"
];

export const DailyQuote: React.FC = () => {
  const [quote, setQuote] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Pick a random quote on mount
    const randomQuote = PRESET_QUOTES[Math.floor(Math.random() * PRESET_QUOTES.length)];
    setQuote(randomQuote);
  }, []);

  const handleNewQuote = async () => {
    setLoading(true);
    try {
      // Passing dummy days/date since quote is generic
      const result = await generateRomanticContent(0, '', 'quote');
      setQuote(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-8 mb-4 px-4">
      <div className="relative bg-white/60 backdrop-blur-sm border border-rose-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all text-center group">
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-rose-100 text-rose-500 px-3 py-1 rounded-full text-xs font-bold tracking-wider flex items-center shadow-sm">
          <Quote className="w-3 h-3 mr-1 fill-current" />
          每日情话
        </div>

        <div className="mt-2 min-h-[60px] flex items-center justify-center">
          {loading ? (
             <div className="flex items-center space-x-2 text-rose-400 animate-pulse">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">DeepSeek 正在摘录浪漫...</span>
             </div>
          ) : (
            <p className="text-lg text-gray-700 font-serif leading-relaxed italic">
              "{quote}"
            </p>
          )}
        </div>

        <button 
          onClick={handleNewQuote}
          disabled={loading}
          className="absolute top-2 right-2 p-2 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
          title="换一句 AI 情话"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};
