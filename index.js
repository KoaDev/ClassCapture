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


> ..\ffmpeg-2024-11-03-git-df00705e00-essentials_build\bin/ffmpeg.exe -i ..\..\project\template.m4a -ac 1 -ar 16000 ..\..\project\template.wav
ffmpeg version 2024-11-03-git-df00705e00-essentials_build-www.gyan.dev Copyright (c) 2000-2024 the FFmpeg developers
  built with gcc 14.2.0 (Rev1, Built by MSYS2 project)
  configuration: --enable-gpl --enable-version3 --enable-static --disable-w32threads --disable-autodetect --enable-fontconfig --enable-iconv --enable-gnutls --enable-libxml2 --enable-gmp --enable-bzlib --enable-lzma --enable-zlib --enable-libsrt --enable-libssh --enable-libzmq --enable-avisynth --enable-sdl2 --enable-libwebp --enable-libx264 --enable-libx265 --enable-libxvid --enable-libaom --enable-libopenjpeg --enable-libvpx --enable-mediafoundation --enable-libass --enable-libfreetype --enable-libfribidi --enable-libharfbuzz --enable-libvidstab --enable-libvmaf --enable-libzimg --enable-amf --enable-cuda-llvm --enable-cuvid --enable-dxva2 --enable-d3d11va --enable-d3d12va --enable-ffnvcodec --enable-libvpl --enable-nvdec --enable-nvenc --enable-vaapi --enable-libgme --enable-libopenmpt --enable-libopencore-amrwb --enable-libmp3lame --enable-libtheora --enable-libvo-amrwbenc --enable-libgsm --enable-libopencore-amrnb --enable-libopus --enable-libspeex --enable-libvorbis --enable-librubberband
  libavutil      59. 46.100 / 59. 46.100
  libavcodec     61. 24.100 / 61. 24.100
  libavformat    61.  9.100 / 61.  9.100
  libavdevice    61.  4.100 / 61.  4.100
  libavfilter    10.  6.101 / 10.  6.101
  libswscale      8.  9.101 /  8.  9.101
  libswresample   5.  4.100 /  5.  4.100
  libpostproc    58.  4.100 / 58.  4.100
Input #0, mov,mp4,m4a,3gp,3g2,mj2, from '..\..\project\template.m4a':
  Metadata:
    major_brand     : mp42
    minor_version   : 0
    compatible_brands: mp41isom
    creation_time   : 2024-11-07T08:47:05.000000Z
    date            : 2024
    title           : Enregistrement (2)
    album_artist    : Enregistreur vocal
  Duration: 00:00:05.06, start: 0.000000, bitrate: 166 kb/s
  Stream #0:0[0x2](und): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 163 kb/s (default)
    Metadata:
      creation_time   : 2024-11-07T08:47:05.000000Z
      handler_name    : SoundHandler
      vendor_id       : [0][0][0][0]
File '..\..\project\template.wav' already exists. Overwrite? [y/N] y
Stream mapping:
  Stream #0:0 -> #0:0 (aac (native) -> pcm_s16le (native))
Press [q] to stop, [?] for help
Output #0, wav, to '..\..\project\template.wav':
  Metadata:
    major_brand     : mp42
    minor_version   : 0
    compatible_brands: mp41isom
    album_artist    : Enregistreur vocal
    ICRD            : 2024
    INAM            : Enregistrement (2)
    ISFT            : Lavf61.9.100
  Stream #0:0(und): Audio: pcm_s16le ([1][0][0][0] / 0x0001), 16000 Hz, mono, s16, 256 kb/s (default)
    Metadata:
      encoder         : Lavc61.24.100 pcm_s16le
      creation_time   : 2024-11-07T08:47:05.000000Z
      handler_name    : SoundHandler
      vendor_id       : [0][0][0][0]
[out#0/wav @ 000002287ae0fdc0] video:0KiB audio:158KiB subtitle:0KiB other streams:0KiB global headers:0KiB muxing overhead: 0.074169%
size=     158KiB time=00:00:05.05 bitrate= 256.2kbits/s speed= 234x