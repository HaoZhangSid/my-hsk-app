import { useState } from 'react';
import { styles } from '../data/styles';  // 从 styles.js 导入语气风格
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";  // 引入 Select 组件
import { Button } from "@/components/ui/button";

const voices = [
  { label: 'Xiaoxiao (Female)', value: 'zh-CN-XiaoxiaoNeural' },
  { label: 'Yunxi (Male)', value: 'zh-CN-YunxiNeural' },
  { label: 'Xiaoyi (Female)', value: 'zh-CN-XiaoyiNeural' }
];

export default function PlaySpeech({ text }) {
  const [voice, setVoice] = useState(voices[0].value);
  const [style, setStyle] = useState(styles[0].value);  // 从 styles 数组设置默认语气
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateSpeech = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/convertToSpeech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice, style }),  // 传递语气参数
      });

      if (!response.ok) {
        throw new Error('生成语音失败');
      }

      const blob = await response.blob();
      setAudioUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error('生成语音时出错:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mt-4">
        <label htmlFor="voice" className="block text-lg font-medium text-gray-700">
          选择语音:
        </label>
        <Select onValueChange={setVoice} value={voice}>
          <SelectTrigger className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:ring-gray-500 focus:border-gray-500">
            <SelectValue placeholder="选择语音" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg">
            {voices.map((v) => (
              <SelectItem 
                key={v.value} 
                value={v.value}
                className="text-gray-800 hover:bg-gray-100 focus:bg-gray-200"
              >
                {v.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4">
        <label htmlFor="style" className="block text-lg font-medium text-gray-700">
          选择语气:
        </label>
        <Select onValueChange={setStyle} value={style}>
          <SelectTrigger className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:ring-gray-500 focus:border-gray-500">
            <SelectValue placeholder="选择语气" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg">
            {styles.map((s) => (
              <SelectItem 
                key={s.value} 
                value={s.value}
                className="text-gray-800 hover:bg-gray-100 focus:bg-gray-200"
              >
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        className="mt-6 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
        onClick={generateSpeech}
        disabled={loading}
      >
        {loading ? '生成中...' : '生成语音'}
      </Button>

      {audioUrl && <audio controls src={audioUrl} className="mt-4" />}
    </div>
  );
}
