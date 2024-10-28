import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// 英文语音选项
const englishVoices = [
  { label: 'Ava (Female)', value: 'en-US-AvaNeural' },
  { label: 'Jenny (Female)', value: 'en-US-JennyNeural' },
  { label: 'Guy (Male)', value: 'en-US-GuyNeural' },
  { label: 'Aria (Female)', value: 'en-US-AriaNeural' }
];

export default function PlayEnglishSpeech({ text }) {
  const [voice, setVoice] = useState(englishVoices[0].value);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateSpeech = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/convertToSpeech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice }), // 仅传递语音参数
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
            {englishVoices.map((v) => (
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
