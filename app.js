const textInput = document.getElementById('textInput');
const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');
const clearButton = document.getElementById('clearButton');
const voiceSelect = document.getElementById('voiceSelect');
const rate = document.querySelector("#rate");

let utterance = new SpeechSynthesisUtterance();
let paused = false;
let voices = [];

function speakText() {
  if (!window.speechSynthesis) {
    alert('Your browser does not support text-to-speech');
    return;
  }

  utterance.text = textInput.value;

  // Get the browser language
  const browserLanguage = navigator.language;

  // Find a voice that matches the browser language
  const selectedVoice = voices.find(voice => voice.lang.startsWith(browserLanguage));

  if (selectedVoice) {
    utterance.voice = selectedVoice;
    window.speechSynthesis.speak(utterance);
  } else {
    alert('Voice for browser language not found. Using default voice.');
    // If no matching voice is found, use the default voice
    utterance.voice = voices[0];
    window.speechSynthesis.speak(utterance);
  }
}

function populateVoices() {
  voices = window.speechSynthesis.getVoices();
  voiceSelect.innerHTML = '';
  voices.forEach(voice => {
    const option = document.createElement('option');
    option.textContent = `${voice.name} (${voice.lang})`;
    option.setAttribute('data-lang', voice.lang);
    option.setAttribute('data-name', voice.name);
    voiceSelect.appendChild(option);
  });
}

function updateVoicesAndSpeak() {
  populateVoices();
  speakText();
}

window.speechSynthesis.onvoiceschanged = updateVoicesAndSpeak;

playButton.addEventListener('click', function () {
  if (window.speechSynthesis.paused) {
    utterance.rate = rate.value;
    window.speechSynthesis.resume();
    paused = false;
  } else { 
  utterance.rate = rate.value;
  window.speechSynthesis.cancel();
  speakText();
  }
});

pauseButton.addEventListener('click', function () {
  if (window.speechSynthesis.paused) {
    utterance.rate = rate.value;
    window.speechSynthesis.resume();
    paused = false;
  } else {
    utterance.rate = rate.value;
    window.speechSynthesis.pause();
    paused = true;
  }
});

clearButton.addEventListener('click', function () {
  window.speechSynthesis.cancel();
  textInput.value = '';
});

populateVoices();
