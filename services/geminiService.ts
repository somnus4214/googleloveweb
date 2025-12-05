import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateRomanticContent = async (
  days: number,
  date: string,
  type: 'message' | 'date-idea' | 'poem' | 'quote'
): Promise<string> => {
  if (!apiKey) {
    return "请先配置 API Key 以使用 AI 助手功能。";
  }

  const model = "gemini-2.5-flash";
  let prompt = "";

  switch (type) {
    case 'message':
      prompt = `我们恋爱 ${days} 天了，今天是 ${date}。请帮我写一段温暖、深情但不肉麻的短信发给我的女朋友，表达我的爱意。不超过100字。`;
      break;
    case 'date-idea':
      prompt = `我们恋爱 ${days} 天纪念日（${date}）。请为我们策划一个浪漫的约会方案。请给出具体的活动建议，比如去哪里，做什么，吃什么。风格要温馨浪漫。`;
      break;
    case 'poem':
      prompt = `以“恋爱 ${days} 天”为主题，写一首现代三行诗，送给我的女朋友。要文艺一点。`;
      break;
    case 'quote':
      prompt = `请生成一句简短、唯美、治愈的恋爱短句（每日情话），适合情侣之间细细品味。不超过30个字，不要带引号。`;
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      }
    });

    return response.text || "AI 正在思考爱的语言...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 暂时掉线了，但我的爱永远在线。请稍后再试。";
  }
};