const axios = require('axios');
const chalk = require('chalk');
const { Writable } = require('stream');
const recorder = require('node-record-lpcm16');
const speech = require('@google-cloud/speech').v1;

const API_URL = 'http://localhost:3000/api/transcriptions';

function main(
    encoding = 'LINEAR16',
    sampleRateHertz = 16000,
    languageCode = 'fr-FR',
    streamingLimit = 10000,
    keyFilename = './classCapture.json'
) {
    const client = new speech.SpeechClient({
        keyFilename: keyFilename,
    });

    const config = {
        encoding: encoding,
        sampleRateHertz: sampleRateHertz,
        languageCode: languageCode,
    };

    const request = {
        config,
        interimResults: true,
    };

    let recognizeStream = null;
    let restartCounter = 0;
    let audioInput = [];
    let lastAudioInput = [];
    let resultEndTime = 0;
    let isFinalEndTime = 0;
    let finalRequestEndTime = 0;
    let newStream = true;
    let bridgingOffset = 0;
    let lastTranscriptWasFinal = false;
    let fullTranscription = '';

    function startStream() {
        audioInput = [];
        recognizeStream = client
            .streamingRecognize(request)
            .on('error', (err) => {
                if (err.code === 11) {
                    // restartStream();
                } else {
                    console.error('API request error: ' + err);
                }
            })
            .on('data', speechCallback);

        setTimeout(restartStream, streamingLimit);
    }

    const speechCallback = (stream) => {
        resultEndTime =
            stream.results[0].resultEndTime.seconds * 1000 +
            Math.round(stream.results[0].resultEndTime.nanos / 1000000);

        const correctedTime =
            resultEndTime - bridgingOffset + streamingLimit * restartCounter;

        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        let stdoutText = '';
        if (stream.results[0] && stream.results[0].alternatives[0]) {
            stdoutText =
                correctedTime + ': ' + stream.results[0].alternatives[0].transcript;
        }

        if (stream.results[0].isFinal) {
            process.stdout.write(chalk.green(`${stdoutText}\n`));
            fullTranscription += `${stream.results[0].alternatives[0].transcript} `;
            isFinalEndTime = resultEndTime;
            lastTranscriptWasFinal = true;
        } else {
            if (stdoutText.length > process.stdout.columns) {
                stdoutText =
                    stdoutText.substring(0, process.stdout.columns - 4) + '...';
            }
            process.stdout.write(chalk.red(`${stdoutText}`));
            lastTranscriptWasFinal = false;
        }
    };

    const audioInputStreamTransform = new Writable({
        write(chunk, encoding, next) {
            if (newStream && lastAudioInput.length !== 0) {
                const chunkTime = streamingLimit / lastAudioInput.length;
                if (chunkTime !== 0) {
                    if (bridgingOffset < 0) {
                        bridgingOffset = 0;
                    }
                    if (bridgingOffset > finalRequestEndTime) {
                        bridgingOffset = finalRequestEndTime;
                    }
                    const chunksFromMS = Math.floor(
                        (finalRequestEndTime - bridgingOffset) / chunkTime
                    );
                    bridgingOffset = Math.floor(
                        (lastAudioInput.length - chunksFromMS) * chunkTime
                    );

                    for (let i = chunksFromMS; i < lastAudioInput.length; i++) {
                        recognizeStream.write(lastAudioInput[i]);
                    }
                }
                newStream = false;
            }

            audioInput.push(chunk);

            if (recognizeStream) {
                recognizeStream.write(chunk);
            }

            next();
        },

        final() {
            if (recognizeStream) {
                recognizeStream.end();
            }
        },
    });

    function restartStream() {
        if (recognizeStream) {
            recognizeStream.end();
            recognizeStream.removeListener('data', speechCallback);
            recognizeStream = null;
        }
        if (resultEndTime > 0) {
            finalRequestEndTime = isFinalEndTime;
        }
        resultEndTime = 0;

        lastAudioInput = [];
        lastAudioInput = audioInput;

        restartCounter++;

        if (!lastTranscriptWasFinal) {
            process.stdout.write('\n');
        }
        process.stdout.write(
            chalk.yellow(`${streamingLimit * restartCounter}: RESTARTING REQUEST\n`)
        );

        newStream = true;

        startStream();
    }

    recorder
        .record({
            sampleRateHertz: sampleRateHertz,
            threshold: 0,
            silence: 1000,
            keepSilence: true,
            recordProgram: 'rec',
        })
        .stream()
        .on('error', (err) => {
            console.error('Audio recording error: ' + err);
        })
        .pipe(audioInputStreamTransform);

    console.log('');
    console.log('Listening, press Ctrl+C to stop.');
    console.log('');
    console.log('End (ms)       Transcript Results/Status');
    console.log('=========================================================');

    startStream();

    process.on('SIGINT', async () => {
        console.log(fullTranscription);
        console.log('\nSending to API...');

        try {
            if (!fullTranscription.trim()) {
                console.error('Error: body is empty');
                process.exit(1);
            }

            const response = await axios.post(
                API_URL,
                {
                    transcriptionText: fullTranscription.trim(),
                },
                {
                    headers: {
                        Authorization: `Bearer HelloWorld`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('API OK:', response.data);
        } catch (error) {
            console.error('Error API:', error.message);
            if (error.response) {
                console.error('Response of API:', error.response.data);
            }
        }

        process.exit(0);
    });
}

process.on('unhandledRejection', (err) => {
    console.error(err.message);
    process.exitCode = 1;
});

main(...process.argv.slice(2));
