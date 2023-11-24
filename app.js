const textInput = document.getElementById('textInput');
const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');
const clearButton = document.getElementById('clearButton');
const voiceSelect = document.getElementById('voiceSelect');
const rate = document.getElementById("rate");
const synth = window.speechSynthesis;




let utterance = new SpeechSynthesisUtterance();
let paused = false;

function speakText() {
  utterance = new SpeechSynthesisUtterance();
  if (!window.speechSynthesis) {
    alert('Your browser does not support text-to-speech');
    return;
  }

  utterance.text = textInput.value;

  const selectedVoice = voiceSelect.value;
  const foundVoice = window.speechSynthesis.getVoices().find(voice => voice.name === selectedVoice);

  if (foundVoice) {
    utterance.voice = foundVoice;
    utterance.rate = rate.value;
    synth.speak(utterance);
    paused = false;
  } else {
    alert('Selected voice not found.');
  }
}
/** 
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
*/


let synthVoices = [];

function populateVoices() {
    synthVoices = synth.getVoices();
    voiceSelect.innerHTML = '';

    for (let voice of synthVoices) {
        let option = document.createElement('option');
        option.textContent = `${voice.name} (${voice.lang})`;
        option.value = voice.name;
        voiceSelect.appendChild(option);
    }
}

synth.addEventListener('voiceschanged', populateVoices);
populateVoices();






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

rate.addEventListener('onchange', function () {
  utterance.rate = rate.value;
});
