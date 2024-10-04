import axios from 'axios';

export default async function handler(req, res) {
  const { text } = req.body;

  const response = await axios({
    method: 'post',
    url: `https://${process.env.AZURE_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,
    headers: {
      'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
    },
    data: `<speak version="1.0" xml:lang="zh-CN">
            <voice name="zh-CN-XiaoxiaoNeural">
              ${text}
            </voice>
          </speak>`,
    responseType: 'arraybuffer',
  });

  res.setHeader('Content-Type', 'audio/mpeg');
  res.send(response.data);
}
