// Import necessary libraries
const fs = require('fs');
const sdk = require('microsoft-cognitiveservices-speech-sdk');

exports.handler = async (event, context) => {
  try {
    // Read the audio file from the request
    const audioFile = fs.readFileSync(event.audioFile);

    // Set up the Speech SDK configuration
    const speechConfig = sdk.SpeechConfig.fromSubscription("<your-subscription-key>", "<your-service-region>");

    // Set up the audio input stream
    const audioConfig = sdk.AudioConfig.fromStreamInput(new sdk.PullAudioInputStreamImpl());
    const audioStream = audioConfig.inputStream;
    audioStream.write(audioFile);

    // Set up the speech recognizer
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    // Recognize the speech in the audio file
    const result = await new Promise((resolve, reject) => {
      recognizer.recognizeOnceAsync(
        (res) => resolve(res),
        (err) => reject(err)
      );
    });

    // Return the recognized speech as captions
    return result.text;
  } catch (error) {
    console.error(error);
    return "Error: Unable to recognize speech.";
  }
};
