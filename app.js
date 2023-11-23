const textInput = document.getElementById('textInput');
const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');
const clearButton = document.getElementById('clearButton');
const voiceSelect = document.getElementById('voiceSelect');
const rate = document.querySelector("#rate");

let utterance = new SpeechSynthesisUtterance();
let paused = false;

function speakText() {
  if (!window.speechSynthesis) {
    alert('Your browser does not support text-to-speech');
    return;
  }

  utterance.text = textInput.value;

  const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');
  const foundVoice = window.speechSynthesis.getVoices().find(voice => voice.name === selectedVoice);

  if (foundVoice) {
    utterance.voice = foundVoice;
    utterance.rate = rate.value;
    window.speechSynthesis.speak(utterance);
  } else {
    alert('Selected voice not found.');
  }
}

function populateVoices() {
  voiceSelect.innerHTML = '';
  window.speechSynthesis.getVoices().forEach(voice => {
    const option = document.createElement('option');
    option.textContent = `${voice.name} (${voice.lang})`;
    option.setAttribute('data-lang', voice.lang);
    option.setAttribute('data-name', voice.name);
    voiceSelect.appendChild(option);
  });
}

window.speechSynthesis.onvoiceschanged = () => {
  populateVoices();
};

playButton.addEventListener('click', function () {
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
    paused = false;
  } else {
    window.speechSynthesis.cancel();
    speakText();
  }
});

pauseButton.addEventListener('click', function () {
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
    paused = false;
  } else {
    window.speechSynthesis.pause();
    paused = true;
  }
});

clearButton.addEventListener('click', function () {
  window.speechSynthesis.cancel();
  textInput.value = '';
});

voiceSelect.addEventListener('change', function () {
  speakText();
});
