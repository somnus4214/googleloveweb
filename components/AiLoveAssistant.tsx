
import React, { useState } from 'react';
import { generateRomanticContent } from '../services/aiService';
import { Bot, HeartHandshake, PenTool, Loader2, Sparkles } from 'lucide-react';

interface AiLoveAssistantProps {
  days: number;
  dateStr: string;
}

export const AiLoveAssistant: React.FC<AiLoveAssistantProps> = ({ days, dateStr }) => {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string>("");
  const [activeType, setActiveType] = useState<'message' | 'date-idea' | 'poem' | null>(null);

  const handleGenerate = async (type: 'message' | 'date-idea' | 'poem') => {
    setLoading(true);
    setActiveType(type);
    setContent(""); // Clear previous
    
    try {
      const result = await generateRomanticContent(days, dateStr, type);
      setContent(result);
    } catch (e) {
      console.error(e);
      setContent("抱歉，我现在有点累，想不出好的点子了。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-assistant" className="w-full max-w-2xl mx-auto mt-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-rose-100">
        <div className="bg-gradient-to-r from-rose-400 to-pink-500 p-6 text-white">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6" />
            <h3 className="text-xl font-bold">恋爱 AI 助手 (DeepSeek)</h3>
          </div>
          <p className="text-rose-100 text-sm mt-1">
            为第 <span className="font-bold text-white">{days}</span> 天（{dateStr}）准备一份惊喜
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => handleGenerate('message')}
              disabled={loading}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                activeType === 'message' 
                  ? 'border-rose-500 bg-rose-50 text-rose-700' 
                  : 'border-transparent bg-gray-50 text-gray-600 hover:bg-rose-50 hover:border-rose-200'
              }`}
            >
              <HeartHandshake className="w-6 h-6 mb-2" />
              <span className="font-medium text-sm">写一段情话</span>
            </button>

            <button
              onClick={() => handleGenerate('date-idea')}
              disabled={loading}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                activeType === 'date-idea' 
                  ? 'border-rose-500 bg-rose-50 text-rose-700' 
                  : 'border-transparent bg-gray-50 text-gray-600 hover:bg-rose-50 hover:border-rose-200'
              }`}
            >
              <Bot className="w-6 h-6 mb-2" />
              <span className="font-medium text-sm">策划约会</span>
            </button>

            <button
              onClick={() => handleGenerate('poem')}
              disabled={loading}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                activeType === 'poem' 
                  ? 'border-rose-500 bg-rose-50 text-rose-700' 
                  : 'border-transparent bg-gray-50 text-gray-600 hover:bg-rose-50 hover:border-rose-200'
              }`}
            >
              <PenTool className="w-6 h-6 mb-2" />
              <span className="font-medium text-sm">写首三行诗</span>
            </button>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-10 text-rose-400">
              <Loader2 className="w-8 h-8 animate-spin mb-3" />
              <p className="text-sm animate-pulse">DeepSeek 正在用心思考中...</p>
            </div>
          )}

          {!loading && content && (
            <div className="bg-rose-50/50 p-6 rounded-xl border border-rose-100 relative group">
              <div className="prose prose-rose max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                {content}
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => navigator.clipboard.writeText(content)}
                  className="text-xs bg-white px-2 py-1 rounded shadow text-rose-400 hover:text-rose-600"
                >
                  复制
                </button>
              </div>
            </div>
          )}
          
          {!loading && !content && (
            <div className="text-center py-10 text-gray-400 text-sm">
              点击上方按钮，让 AI 为你们的纪念日增添一份浪漫。
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
