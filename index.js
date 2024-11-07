const fs = require('fs');
const { SpeechClient } = require('@google-cloud/speech');
const RecordRTC = require('recordrtc');

const speechClient = new SpeechClient({ keyFilename });

async function recordAudio() {
  //Simulation of recording audio
  await transcribeAudio("./template.wav");
}

async function transcribeAudio(audioData) {
  try {
    const audio = {
      content: fs.readFileSync(audioData).toString('base64'),
    };

    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'fr-FR',
    };

    const request = {
      audio: audio,
      config: config,
    };

    const [response] = await speechClient.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    console.log('Transcription :', transcription);
  } catch (error) {
    console.error('Erreur lors de la transcription :', error);
  }
}

recordAudio().catch(console.error);