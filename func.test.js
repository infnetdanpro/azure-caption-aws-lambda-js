const { expect } = require('chai');
const fs = require('fs');
const sdk = require('microsoft-cognitiveservices-speech-sdk');

const lambdaFunction = require('./lambdaFunction');

describe('lambdaFunction', () => {
  let audioFile;

  before(() => {
    audioFile = fs.readFileSync('./test/audio.wav');
  });

  it('should return captions when Speech SDK recognizes speech', async () => {
    const text = "hello world";
    const result = { text: text };
    const recognizerStub = sinon.stub(sdk, 'SpeechRecognizer').returns({
      recognizeOnceAsync: sinon.stub().callsArgWith(0, result)
    });

    const captions = await lambdaFunction.handler({ audioFile: audioFile });

    expect(captions).to.equal(text);
  });

  it('should handle errors when Speech SDK fails to recognize speech', async () => {
    const error = new Error('Error: Unable to recognize speech.');
    const recognizerStub = sinon.stub(sdk, 'SpeechRecognizer').returns({
      recognizeOnceAsync: sinon.stub().callsArgWith(1, error)
    });

    const captions = await lambdaFunction.handler({ audioFile: audioFile });

    expect(captions).to.equal('Error: Unable to recognize speech.');
  });
});
