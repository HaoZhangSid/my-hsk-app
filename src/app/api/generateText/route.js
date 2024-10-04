import { NextResponse } from 'next/server';
import fetch from 'node-fetch'; // Ensure you have node-fetch installed

export async function POST(request) {
  const { level, topic } = await request.json();
  const apiProvider = new URL(request.url).searchParams.get('apiProvider');

  if (!level || !topic) {
    return NextResponse.json({ error: 'HSK 等级或主题未提供' }, { status: 400 });
  }

  try {
    const prompt = `生成一个 HSK ${level} 级的中文短文，主题是 "${topic}, 请直接回复内容,不要有任何别的废话"。`;

    let apiResponse;

    if (apiProvider === 'openai') {
      // 调用 OpenAI API
      apiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo', // 或 'gpt-4'
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 4000,
          temperature: 0.7,
        }),
      });
    } else if (apiProvider === 'kimi') {
      // 调用 Kimi (Moonshot API)
      apiResponse = await fetch('https://api.moonshot.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.MOONSHOT_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'moonshot-v1-8k',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
        }),
      });
    } else {
      return NextResponse.json({ error: '未知的 API 提供者' }, { status: 400 });
    }

    // 检查 API 响应状态
    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      console.error(`${apiProvider} API 错误:`, errorData);
      return NextResponse.json({ error: errorData.error.message }, { status: apiResponse.status });
    }

    const data = await apiResponse.json();
    const generatedText = data.choices[0].message.content.trim();

    // 返回生成的短文
    return NextResponse.json({ text: generatedText }, { status: 200 });
  } catch (error) {
    console.error('生成文本时出错:', error);
    return NextResponse.json({ error: '生成短文时出错' }, { status: 500 });
  }
}
