let currentStep = 0;
let storySteps = [];
let ttsAudio = new Audio(); // For text-to-speech audio
let backgroundAudio = document.getElementById('background-audio');
let isPlaying = false; // Track if text-to-speech is playing

// Function to convert text to speech
function textToSpeech(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.volume = 1; // Max volume for text-to-speech
        speechSynthesis.speak(utterance);

        // Reduce background music volume
        backgroundAudio.volume = 0.2;

        // When speech ends, restore background music volume
        utterance.onend = () => {
            backgroundAudio.volume = 1;
            isPlaying = false;
            updatePlayButton();
        };

        isPlaying = true;
        updatePlayButton();
    } else {
        alert("Text-to-speech is not supported in your browser.");
    }
}

// Function to pause text-to-speech
function pauseTextToSpeech() {
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel(); // Stop speech
        backgroundAudio.volume = 1; // Restore background music volume
        isPlaying = false;
        updatePlayButton();
    }
}

// Function to update the play button's appearance
function updatePlayButton() {
    const playButton = document.getElementById('play-tts');
    if (isPlaying) {
        playButton.textContent = '⏸️'; // Pause symbol
    } else {
        playButton.textContent = '▶️'; // Play symbol
    }
}

// Add event listener for the play button
document.getElementById('play-tts').addEventListener('click', () => {
    const storyText = document.getElementById('story-text').textContent;
    if (isPlaying) {
        pauseTextToSpeech();
    } else {
        textToSpeech(storyText);
    }
});

// Load story data from JSON
function loadStoryData() {
    fetch('steps.json')
        .then(response => response.json())
        .then(data => {
            storySteps = data.storySteps;
            displayStep(currentStep);
        })
        .catch(error => console.error('Error loading story:', error));
}

// Function to display the current step
function displayStep(stepIndex) {
    const step = storySteps[stepIndex];
    const storyText = document.getElementById('story-text');
    const optionsDiv = document.getElementById('options');
    const backgroundContainer = document.getElementById('background-container');

    // Update story text
    storyText.textContent = step.text;

    // Update background image
    backgroundContainer.style.backgroundImage = step.backgroundImage;

    // Update background audio
    backgroundAudio.src = step.audio;
    backgroundAudio.play();

    // Clear previous options
    optionsDiv.innerHTML = '';

    // Add new options
    step.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option.text;
        button.addEventListener('click', () => {
            currentStep = option.nextStep;
            displayStep(currentStep);
        });
        optionsDiv.appendChild(button);
    });

    // Reset play button state
    isPlaying = false;
    updatePlayButton();
}

// Initialize on page load
window.onload = () => {
    loadStoryData();
};

// Loading screen timeout
window.addEventListener('load', function () {
    setTimeout(function () {
        document.body.classList.add('loaded');
    }, 4000);
});