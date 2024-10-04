import { NextResponse } from 'next/server';
import fetch from 'node-fetch'; // 确保已安装 node-fetch
import pinyin from 'pinyin'; // 安装并引入 pinyin 库

export async function POST(request) {
  const { level, topic } = await request.json();
  const apiProvider = new URL(request.url).searchParams.get('apiProvider');

  if (!level || !topic) {
    return NextResponse.json({ error: 'HSK 等级或主题未提供' }, { status: 400 });
  }

  try {
    const prompt = `请为 HSK ${level} 级学习者生成一篇中文短文，主题是 "${topic}"。请根据 HSK ${level} 的词汇和语法要求，调整短文的难度，确保符合该级别的学习水平。文章长度应适合该级别的学习者，HSK 1 和 2 的短文尽量短,控制在100字左右，HSK 3 到 6 的短文应更长且更复杂。请直接输出短文，不需要解释或询问。`;

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
      apiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(requestBody),
      });
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

      apiResponse = await fetch('https://api.moonshot.cn/v1/chat/completions', {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(requestBody),
      });
    } else {
      return NextResponse.json({ error: '未知的 API 提供者' }, { status: 400 });
    }

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      console.error(`${apiProvider} API 错误:`, errorData);
      return NextResponse.json({ error: errorData.error.message }, { status: apiResponse.status });
    }

    const data = await apiResponse.json();
    const generatedText = data.choices[0].message.content.trim();

    // 将生成的文本拆分为字符数组
    const tokens = generatedText.split('');

    // 创建一个包含字符和拼音的数组
    const pinyinTokens = tokens.map((char) => {
      // 检查是否是汉字
      if (/[\u4e00-\u9fa5]/.test(char)) {
        // 获取该汉字的拼音
        const pinyinArray = pinyin(char, {
          style: pinyin.STYLE_TONE,
          segment: false,
        });
        const pinyinText = pinyinArray[0] ? pinyinArray[0][0] : '';
        return {
          char,
          pinyin: pinyinText,
        };
      } else {
        // 非汉字字符，拼音设为空字符串
        return {
          char,
          pinyin: '', // 如果你希望非汉字字符也生成空的 <rt> 标签，可以保留空字符串
        };
      }
    });

    // 使用字符和拼音数组生成 <ruby> 结构的 HTML 字符串
    let rubyHtml = '';
    pinyinTokens.forEach(({ char, pinyin }) => {
      // 对于每个字符，都生成 <ruby> 标签
      if (pinyin) {
        rubyHtml += `<ruby><rt>${pinyin}</rt>${char}</ruby>`;
      } else {
        // 如果你希望非汉字字符也有 <rt> 标签，可以取消注释以下代码
        // rubyHtml += `<ruby>${char}<rt></rt></ruby>`;
        // 否则，直接添加非汉字字符
        rubyHtml += char;
      }
    });

    // 返回包含拼音的 HTML 字符串
    return NextResponse.json({ text: generatedText, rubyHtml: rubyHtml }, { status: 200 });
  } catch (error) {
    console.error('生成文本时出错:', error);
    return NextResponse.json({ error: '生成短文时出错' }, { status: 500 });
  }
}
