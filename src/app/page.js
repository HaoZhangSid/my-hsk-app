"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import HSKSelector from './components/HSKSelector';
import PlaySpeech from './components/PlaySpeech';
import { presetTopics } from './data/topics';  // 从 topics.js 导入
import { apiProviders } from './data/apiProviders';  // 从 apiProviders.js 导入
import { styles } from './data/styles';  // 从 styles.js 导入

export default function HomePage() {
  const [level, setLevel] = useState('');
  const [text, setText] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [presetTopic, setPresetTopic] = useState('');
  const [apiProvider, setApiProvider] = useState('kimi');
  const [isLoading, setIsLoading] = useState(false);
  const [style, setStyle] = useState(styles[0].value);  // 默认选择 "默认" 风格

  const generateText = async () => {
    if (!level) {
      alert("请先选择 HSK 等级！");
      return;
    }

    const topic = customTopic || presetTopic;
    if (!topic) {
      alert("请输入或选择一个主题！");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/generateText?apiProvider=${apiProvider}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level, topic, style }),  // 传递风格
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`错误：${errorData.error}`);
        return;
      }

      const data = await response.json();
      setText(data.text);
    } catch (error) {
      console.error('请求生成文本时出错:', error);
      alert('请求生成文本时出错');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">HSK 中文短文生成器</h1>

      <HSKSelector onChange={setLevel} />

      <div className="mt-4">
        <label htmlFor="custom-topic" className="block text-lg font-medium text-gray-700">
          输入自定义主题:
        </label>
        <input
          id="custom-topic"
          type="text"
          value={customTopic}
          onChange={(e) => setCustomTopic(e.target.value)}
          placeholder="请输入主题..."
          className="w-full p-2 border border-gray-300 rounded-md mt-2"
        />
      </div>

      <div className="mt-4">
        <label htmlFor="preset-topic" className="block text-lg font-medium text-gray-700">
          或选择一个预设主题:
        </label>
        <select
          id="preset-topic"
          value={presetTopic}
          onChange={(e) => setPresetTopic(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mt-2"
        >
          <option value="">请选择一个主题...</option>
          {presetTopics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label htmlFor="style" className="block text-lg font-medium text-gray-700">
          选择语音风格:
        </label>
        <select
          id="style"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          {styles.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label htmlFor="api-provider" className="block text-lg font-medium text-gray-700">
          选择 API 提供者:
        </label>
        <select
          id="api-provider"
          value={apiProvider}
          onChange={(e) => setApiProvider(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mt-2"
        >
          {apiProviders.map((provider) => (
            <option key={provider.value} value={provider.value}>
              {provider.label}
            </option>
          ))}
        </select>
      </div>

      <Button
        onClick={generateText}
        disabled={isLoading}
        className="mt-4"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            生成中...
          </>
        ) : (
          '生成短文'
        )}
      </Button>

      {text && (
        <div className="mt-6">
          <p className="mb-4">{text}</p>
          <PlaySpeech text={text} />
        </div>
      )}
    </div>
  );
}
