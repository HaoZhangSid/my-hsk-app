// app/text-to-speech/page.js
"use client";
import { useState } from 'react';
import PlayEnglishSpeech from '../components/PlayEnglishSpeech';

export default function TextToSpeechPage() {
  const [text, setText] = useState('');
  const [selectedWord, setSelectedWord] = useState(null); // 存储选中的单词

  // 处理单词点击发音
  const handleWordClick = async (word) => {
    setSelectedWord(word);

    try {
      const response = await fetch('/api/convertToSpeech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: word, voice: 'en-US-JennyNeural' }), // 使用默认英文语音
      });

      if (!response.ok) {
        throw new Error('生成语音失败');
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error('生成语音时出错:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-pink-600 animate-pulse">
      文本转语音功能
      </h1>
      <textarea
        className="w-full p-3 border rounded mb-4"
        placeholder="请输入要转换成语音的文本..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <PlayEnglishSpeech text={text} />

      {/* 显示每个可点击的单词 */}
      {text && (
        <div className="mt-4 p-4 border rounded bg-pink-100 overflow-hidden" style={{ wordWrap: "break-word" }}>
          {text.split(' ').map((word, index) => (
            <span
              key={index}
              onClick={() => handleWordClick(word)}
              className="cursor-pointer text-pink-600 hover:underline mr-2 inline-block"
            >
              {word}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
