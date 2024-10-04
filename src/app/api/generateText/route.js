import { NextResponse } from 'next/server';
import fetch from 'node-fetch'; // 确保已安装 node-fetch
import { pinyin } from 'pinyin-pro'; // 安装并引入 pinyin-pro 库

export async function POST(request) {
  const { level, topic } = await request.json();
  const apiProvider = new URL(request.url).searchParams.get('apiProvider');

  if (!level || !topic) {
    return NextResponse.json(
      { error: 'HSK 等级或主题未提供' },
      { status: 400 }
    );
  }

  try {
    const prompt = `请为 HSK ${level} 级学习者生成一篇中文短文，主题是 "${topic}"。请根据 HSK ${level} 的词汇和语法要求，调整短文的难度，确保符合该级别的学习水平。文章长度应适合该级别的学习者，HSK 1 和 2 的短文尽量短，控制在100字左右，HSK 3 到 6 的短文应更长且更复杂。请直接输出短文，不需要解释或询问。`;

    let apiResponse;

    if (apiProvider === 'openai') {
      // 准备请求参数
      const requestBody = {
        model: 'gpt-3.5-turbo', // 或 'gpt-4'
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
        temperature: 0.7,
      };

      const requestHeaders = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      };

      // 调用 OpenAI API
      apiResponse = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: requestHeaders,
          body: JSON.stringify(requestBody),
        }
      );
    } else if (apiProvider === 'kimi') {
      // 调用 Kimi (Moonshot API)
      const requestBody = {
        model: 'moonshot-v1-8k',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      };

      const requestHeaders = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.MOONSHOT_API_KEY}`,
      };

      apiResponse = await fetch(
        'https://api.moonshot.cn/v1/chat/completions',
        {
          method: 'POST',
          headers: requestHeaders,
          body: JSON.stringify(requestBody),
        }
      );
    } else {
      return NextResponse.json({ error: '未知的 API 提供者' }, { status: 400 });
    }

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      console.error(`${apiProvider} API 错误:`, errorData);
      return NextResponse.json(
        { error: errorData.error.message },
        { status: apiResponse.status }
      );
    }

    const data = await apiResponse.json();
    const generatedText = data.choices[0].message.content.trim();

    // 使用 pinyin-pro 库为整个文本生成拼音，考虑上下文
    const pinyinTextArray = pinyin(generatedText, {
      toneType: 'tone', // 带声调的拼音
      type: 'array', // 返回拼音数组
    });

    // 将拼音和汉字组合成 <ruby> 结构的 HTML 字符串
    let rubyHtml = '';
    for (let i = 0; i < generatedText.length; i++) {
      const char = generatedText[i];
      const pinyinChar = pinyinTextArray[i];

      if (/[\u4e00-\u9fa5]/.test(char)) {
        // 如果是汉字，添加 <ruby> 标签
        rubyHtml += `<ruby><rt>${pinyinChar}</rt>${char}</ruby>`;
      } else {
        // 非汉字字符直接添加
        rubyHtml += char;
      }
    }

    // 返回包含拼音的 HTML 字符串
    return NextResponse.json(
      { text: generatedText, rubyHtml: rubyHtml },
      { status: 200 }
    );
  } catch (error) {
    console.error('生成文本时出错:', error);
    return NextResponse.json({ error: '生成短文时出错' }, { status: 500 });
  }
}
