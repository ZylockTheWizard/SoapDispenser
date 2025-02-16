"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleSpeech = exports.speakLetters = exports.speak = void 0;
let speechEnabled = false;
const speech = new SpeechSynthesisUtterance();
speech.rate = 2.5;
speech.onend = onSpeakEnd;
const speechQueue = [];
let currentlyProcessing = false;
function processNextSpeech() {
    currentlyProcessing = true;
    speech.text = speechQueue.shift();
    speechSynthesis.speak(speech);
}
function onSpeakEnd() {
    if (speechQueue.length === 0)
        currentlyProcessing = false;
    else
        processNextSpeech();
}
function speak(text) {
    if (!speechEnabled)
        return;
    speechQueue.push(text);
    if (!currentlyProcessing)
        processNextSpeech();
}
exports.speak = speak;
function speakLetters(text) {
    const say = [...text].map(c => c === ' ' ? 'space' : c).join(' ');
    speak(say);
}
exports.speakLetters = speakLetters;
function toggleSpeech() {
    if (speechEnabled) {
        speak('Speech disabled');
        speechEnabled = false;
    }
    else {
        speechEnabled = true;
        speak('Speech enabled');
    }
}
exports.toggleSpeech = toggleSpeech;
//# sourceMappingURL=Speak.js.map