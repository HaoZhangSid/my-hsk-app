"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import HSKSelector from './components/HSKSelector';
import PlaySpeech from './components/PlaySpeech';
import { presetTopics } from './data/topics';
import { apiProviders } from './data/apiProviders';
import { styles } from './data/styles';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";  // 引入 Select 相关组件

export default function HomePage() {
  const [level, setLevel] = useState('1');
  const [text, setText] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [presetTopic, setPresetTopic] = useState('');
  const [apiProvider, setApiProvider] = useState('kimi');
  const [isLoading, setIsLoading] = useState(false);
  const [style, setStyle] = useState(styles[0].value);
  const [rubyHtml, setRubyHtml] = useState('');

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
        body: JSON.stringify({ level, topic, style }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`错误：${errorData.error}`);
        return;
      }

      const data = await response.json();
      setText(data.text);
      setRubyHtml(data.rubyHtml);
    } catch (error) {
      console.error('请求生成文本时出错:', error);
      alert('请求生成文本时出错');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetTopicChange = (value) => {
    setPresetTopic(value);
    // 如果不是自定义选项，清空自定义主题输入框
    if (value !== 'custom') {
      setCustomTopic('');
    }
  };

  return (
    <div className="container mx-auto p-6 bg-pink-50">
      <h1 className="text-4xl font-bold mb-6 text-center text-pink-600 animate-pulse">
        汉语短文生成器
      </h1>

      <HSKSelector onChange={setLevel} />

      {/* 当选择的是 'custom' 时才显示自定义主题输入框 */}
      {presetTopic === 'custom' && (
        <div className="mt-4">
          <label htmlFor="custom-topic" className="block text-lg font-medium text-pink-700">
            输入自定义主题:
          </label>
          <input
            id="custom-topic"
            type="text"
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            placeholder="请输入主题..."
            className="w-full p-2 border border-pink-300 rounded-md mt-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
      )}

      <div className="mt-4">
        <label htmlFor="preset-topic" className="block text-lg font-medium text-pink-700">
          或选择一个预设主题:
        </label>
        <Select onValueChange={handlePresetTopicChange} value={presetTopic}>
          <SelectTrigger className="w-full p-2 border border-pink-300 rounded-md bg-white text-pink-800 focus:ring-pink-500 focus:border-pink-500">
            <SelectValue placeholder="请选择一个主题..." />
          </SelectTrigger>
          <SelectContent className="bg-white border border-pink-300 rounded-md shadow-lg">
            <SelectItem value="custom" className="text-pink-800 hover:bg-pink-100 focus:bg-pink-200">
              自定义主题
            </SelectItem>
            {presetTopics.map((topic) => (
              <SelectItem
                key={topic}
                value={topic}
                className="text-pink-800 hover:bg-pink-100 focus:bg-pink-200"
              >
                {topic}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4">
        <label htmlFor="api-provider" className="block text-lg font-medium text-pink-700">
          选择 API 提供者:
        </label>
        <Select onValueChange={setApiProvider} value={apiProvider}>
          <SelectTrigger className="w-full p-2 border border-pink-300 rounded-md bg-white text-pink-800 focus:ring-pink-500 focus:border-pink-500">
            <SelectValue placeholder="选择 API 提供者" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-pink-300 rounded-md shadow-lg">
            {apiProviders.map((provider) => (
              <SelectItem
                key={provider.value}
                value={provider.value}
                className="text-pink-800 hover:bg-pink-100 focus:bg-pink-200"
              >
                {provider.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={generateText}
        disabled={isLoading}
        className="mt-6 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            生成中...
          </>
        ) : (
          '生成可爱短文'
        )}
      </Button>

      {rubyHtml && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
          <style jsx>{`
            ruby {
              display: inline-block;
              font-size: 1.2em;
              text-align: center;
            }
            rt {
              font-size: 0.7em;
              color: #f472b6;
              line-height: 1.2;
              font-weight: lighter;
            }
          `}</style>
          <div
            dangerouslySetInnerHTML={{ __html: rubyHtml }}
            className="text-lg leading-relaxed text-pink-800"
            style={{
              wordBreak: 'break-word',
              lineHeight: '2em',
            }}
          />
        </div>
      )}

      {text && (
        <div className="mt-6">
          <PlaySpeech text={text} />
        </div>
      )}
    </div>
  );
}
