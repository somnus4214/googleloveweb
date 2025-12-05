
// Support both standard Node process.env and Vite's import.meta.env
const getApiKey = () => {
  if (typeof process !== 'undefined' && process.env && process.env.VITE_API_KEY) {
    return process.env.VITE_API_KEY;
  }
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_API_KEY;
  }
  return '';
};

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

export const generateRomanticContent = async (
  days: number,
  date: string,
  type: 'message' | 'date-idea' | 'poem' | 'quote'
): Promise<string> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    return "请先配置 DeepSeek API Key (在 .env 文件中设置 VITE_API_KEY) 以使用 AI 助手功能。";
  }

  let systemPrompt = "你是一个浪漫、体贴且充满诗意的恋爱助手。你的任务是帮助用户表达爱意，策划惊喜。请用温暖、真挚的中文回答。";
  let userPrompt = "";

  switch (type) {
    case 'message':
      userPrompt = `我们恋爱 ${days} 天了，今天是 ${date}。请帮我写一段温暖、深情但不肉麻的短信发给我的女朋友，表达我的爱意。不超过100字。`;
      break;
    case 'date-idea':
      userPrompt = `我们恋爱 ${days} 天纪念日（${date}）。请为我们策划一个浪漫的约会方案。请给出具体的活动建议，比如去哪里，做什么，吃什么。风格要温馨浪漫。`;
      break;
    case 'poem':
      userPrompt = `以“恋爱 ${days} 天”为主题，写一首现代三行诗，送给我的女朋友。要文艺一点，意境优美。`;
      break;
    case 'quote':
      systemPrompt = "你是一个精通文学的浪漫诗人。";
      userPrompt = `请生成一句简短、唯美、治愈的恋爱短句（每日情话），适合情侣之间细细品味。不超过30个字，不要带引号，不要解释，直接输出句子。`;
      break;
  }

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat", // 使用 DeepSeek V3
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 1.3, // DeepSeek 建议：代码生成用0，创意写作建议高一点
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("DeepSeek API Error:", errorData);
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "AI 正在思考爱的语言...";
  } catch (error) {
    console.error("AI Service Error:", error);
    return "AI 暂时掉线了，但我的爱永远在线。请检查网络或 API Key。";
  }
};
