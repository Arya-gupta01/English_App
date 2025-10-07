




const linePool = [
  "The sky is full of stars tonight.",
  "She walks her dog every morning.",
  "Can you help me with this task?",
  "Learning English is fun and useful.",
  "I enjoy listening to music while working."
];

let currentTargetLine = "";
let recognition;
let recording = false;
let timerInterval;
let history = JSON.parse(localStorage.getItem("listeningHistory") || "[]");
let isSpeaking = false;
let hasCompletedCycle = false;

// 🔊 Generate new line
document.getElementById("newLineBtn").addEventListener("click", () => {
  if (!hasCompletedCycle && currentTargetLine) {
    alert("Please complete the current cycle before generating a new line.");
    return;
  }

  currentTargetLine = linePool[Math.floor(Math.random() * linePool.length)];
  document.getElementById("recordBtn").disabled = true;
  document.getElementById("submitBtn").style.display = "none";
  document.getElementById("resultsContainer").style.display = "none";
  hasCompletedCycle = false;
});

// 🔊 AI speaks once
document.getElementById("playBtn").addEventListener("click", () => {
  if (!currentTargetLine || isSpeaking) {
    alert("Please click 'New Line' first or wait for current speech to finish.");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(currentTargetLine);
  utterance.lang = "en-US";
  isSpeaking = true;
  document.getElementById("newLineBtn").disabled = true;

  utterance.onend = () => {
    document.getElementById("recordBtn").disabled = false;
    document.getElementById("newLineBtn").disabled = false;
    isSpeaking = false;
  };

  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
});

// 🎙 Record user voice
document.getElementById("recordBtn").addEventListener("click", () => {
  if (recording) {
    recognition.stop();
    clearInterval(timerInterval);
    document.getElementById("recordBtn").textContent = "🎙 Record";
    document.getElementById("submitBtn").style.display = "inline-block";
    document.getElementById("recordingIndicator").style.display = "none";
    recording = false;
    return;
  }

  if (!('webkitSpeechRecognition' in window)) {
    alert("Speech recognition not supported on this browser.");
    return;
  }

  recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = e => {
    const transcript = e.results[0][0].transcript;
    if (!transcript || transcript.trim() === "") {
      alert("Couldn't detect your speech. Please try again.");
      showResults("", 0);
      return;
    }
    const { accuracy, highlighted } = compareTranscript(currentTargetLine, transcript);
    showResults(transcript, accuracy, highlighted);
    saveToHistory(transcript, accuracy);
    hasCompletedCycle = true;
  };

  recognition.onerror = () => {
    alert("Couldn't detect your speech. Please try again.");
    showResults("", 0);
  };

  recognition.start();
  recording = true;
  document.getElementById("recordBtn").textContent = "⏹ Stop Recording";
  document.getElementById("recordingIndicator").style.display = "flex";

  let seconds = 0;
  timerInterval = setInterval(() => {
    seconds++;
    document.getElementById("timer").textContent = `${seconds}s`;
  }, 1000);
});

// 📊 Compare transcript word-by-word
function compareTranscript(target, user) {
  const normalize = str => str.toLowerCase().replace(/[^\w\s]/gi, "").trim();
  const targetWords = normalize(target).split(" ");
  const userWords = normalize(user).split(" ");

  let matchCount = 0;
  let highlighted = "";

  const maxLen = Math.max(targetWords.length, userWords.length);
  for (let i = 0; i < maxLen; i++) {
    const targetWord = targetWords[i] || "";
    const userWord = userWords[i] || "";

    if (targetWord === userWord) {
      highlighted += userWord + " ";
      matchCount++;
    } else if (userWord) {
      highlighted += `<span style="color:red;">${userWord}</span> `;
    }
  }

  const accuracy = targetWords.length > 0
    ? Math.round((matchCount / targetWords.length) * 100)
    : 0;

  return { accuracy, highlighted: highlighted.trim() };
}

// 🧾 Show results
function showResults(transcript, accuracy, highlightedHTML = "") {
  document.getElementById("resultsContainer").style.display = "block";
  document.getElementById("targetCompare").textContent = currentTargetLine;
  document.getElementById("userTranscript").innerHTML = highlightedHTML || transcript;
  document.getElementById("accuracyScore").textContent = `✅ Accuracy: ${accuracy}%`;
}

// 💾 Save to history
function saveToHistory(transcript, accuracy) {
  const item = {
    id: Date.now(),
    targetText: currentTargetLine,
    transcript,
    accuracy,
    date: new Date().toLocaleString()
  };
  history.push(item);
  localStorage.setItem("listeningHistory", JSON.stringify(history));
}
