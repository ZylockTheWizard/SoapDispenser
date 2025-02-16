
let speechEnabled = false

const speech = new SpeechSynthesisUtterance()
speech.rate = 2.5
speech.onend = onSpeakEnd

const speechQueue: string[] = []
let currentlyProcessing = false

function processNextSpeech()
{
    currentlyProcessing = true
    speech.text = speechQueue.shift()
    speechSynthesis.speak(speech)
}

function onSpeakEnd()
{
    if(speechQueue.length === 0) currentlyProcessing = false
    else processNextSpeech()
}

export function speak(text: string) 
{
    if(!speechEnabled) return
    speechQueue.push(text)
    if(!currentlyProcessing) processNextSpeech()
}

export function speakLetters(text: string)
{
    const say = [...text].map(c => c === ' ' ? 'space': c).join(' ')
    speak(say)
}

export function toggleSpeech()
{
    if(speechEnabled)
    {
        speak('Speech disabled')
        speechEnabled = false
    }
    else
    {
        speechEnabled = true
        speak('Speech enabled')
    }
}