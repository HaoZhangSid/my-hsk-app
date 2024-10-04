import { useState } from 'react';
import { styles } from '../data/styles';  // 从 styles.js 导入语气风格

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
        <select
          id="voice"
          value={voice}
          onChange={(e) => setVoice(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          {voices.map((v) => (
            <option key={v.value} value={v.value}>
              {v.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label htmlFor="style" className="block text-lg font-medium text-gray-700">
          选择语气:
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

      <button
        className="bg-green-500 text-white py-2 px-4 rounded mt-4"
        onClick={generateSpeech}
        disabled={loading}
      >
        {loading ? '生成中...' : '生成语音'}
      </button>

      {audioUrl && <audio controls src={audioUrl} className="mt-4" />}
    </div>
  );
}
