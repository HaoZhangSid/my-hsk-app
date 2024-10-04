import { NextResponse } from 'next/server';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

export async function POST(req) {
  const { text, voice, style } = await req.json();

  // 检查环境变量是否正确加载
  console.log("Azure Speech Key:", process.env.AZURE_SPEECH_KEY);
  console.log("Azure Region:", process.env.AZURE_REGION);

  if (!process.env.AZURE_SPEECH_KEY || !process.env.AZURE_REGION) {
    return NextResponse.json({ error: 'Azure 订阅密钥或区域未设置' }, { status: 500 });
  }

  try {
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.AZURE_SPEECH_KEY, 
      process.env.AZURE_REGION
    );

    if (!speechConfig) {
      console.error("Failed to create SpeechConfig");
      return NextResponse.json({ error: "SpeechConfig 创建失败" }, { status: 500 });
    }

    speechConfig.speechSynthesisVoiceName = voice || 'zh-CN-XiaoxiaoNeural';

    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

    const ssmlText = `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="zh-CN">
        <voice name="${voice}">
          <mstts:express-as style="${style}">
            ${text}
          </mstts:express-as>
        </voice>
      </speak>
    `;

    return new Promise((resolve, reject) => {
      synthesizer.speakSsmlAsync(
        ssmlText,
        (result) => {
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            const audioData = Buffer.from(result.audioData);
            resolve(new Response(audioData, {
              status: 200,
              headers: {
                'Content-Type': 'audio/mpeg',
              },
            }));
          } else {
            const errorDetails = sdk.SpeechSynthesisCancellationDetails.fromResult(result);
            console.error("语音合成失败: ", errorDetails.errorDetails);
            resolve(NextResponse.json({ error: errorDetails.errorDetails }, { status: 500 }));
          }
          synthesizer.close();
        },
        (error) => {
          console.error("语音合成出错: ", error);
          reject(NextResponse.json({ error: "语音生成失败", details: error }, { status: 500 }));
          synthesizer.close();
        }
      );
    });
  } catch (error) {
    console.error("请求失败: ", error);
    return NextResponse.json({ error: "语音生成失败", details: error }, { status: 500 });
  }
}
