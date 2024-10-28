// pages/ttsPage.js
"use client";

import { useState } from 'react';
import PlaySpeech from '../components/PlaySpeech';

export default function TTSPage() {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);

  const generateSpeech = async () => {
    try {
      const response = await fetch('/api/convertToSpeech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error('语音生成失败');

      const blob = await response.blob();
      setAudioUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error('生成语音时出错:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-6">文本转语音功能</h1>

      <textarea
        className="w-full p-3 border rounded mb-4"
        placeholder="请输入要转换成语音的文本..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
        onClick={generateSpeech}
      >
        生成语音
      </button>

      {audioUrl && <audio controls src={audioUrl} className="mt-4" />}
    </div>
  );
}
