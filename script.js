let verbs = [];
let activeVerbs = [];
let current = 0;
let score = 0;
let level = 1;
let mode = 'all';
const history = [];

const LEVELS = [0, 50, 100];

function dedupeVerbs(verbsList) {
  const unique = new Map();
  verbsList.forEach(v => {
    const key = `${v.base}|${v.past}|${v.participle}`;
    if (!unique.has(key)) unique.set(key, v);
  });
  return Array.from(unique.values());
}

function isIrregular(v) {
  const raw = v.past.trim().toLowerCase();
  if (raw.includes('/')) return true;
  const regularForm = v.base.toLowerCase().endsWith('e') ? `${v.base.toLowerCase()}d` : `${v.base.toLowerCase()}ed`;
  return raw !== regularForm;
}

function getActiveVerbs() {
  if (mode === 'irregular') {
    return verbs.filter(isIrregular);
  }
  if (mode === 'regular') {
    return verbs.filter(v => !isIrregular(v));
  }
  return [...verbs];
}

function saveProgress() {
  localStorage.setItem('englishTrainerPontos', score.toString());
  localStorage.setItem('englishTrainerNivel', level.toString());
  localStorage.setItem('englishTrainerModo', mode);
  localStorage.setItem('englishTrainerCurrent', current.toString());
  localStorage.setItem('englishTrainerHistory', JSON.stringify(history));
}

function loadProgress() {
  const pScore = Number(localStorage.getItem('englishTrainerPontos') || 0);
  const pLevel = Number(localStorage.getItem('englishTrainerNivel') || 1);
  const pMode = localStorage.getItem('englishTrainerModo') || 'all';
  const pCurrent = Number(localStorage.getItem('englishTrainerCurrent') || 0);
  const pHistory = JSON.parse(localStorage.getItem('englishTrainerHistory') || '[]');

  if (!Number.isNaN(pScore)) score = pScore;
  if (!Number.isNaN(pLevel)) level = pLevel;
  mode = ['all', 'irregular', 'regular'].includes(pMode) ? pMode : 'all';
  current = Number.isNaN(pCurrent) ? 0 : pCurrent;
  if (Array.isArray(pHistory)) {
    history.length = 0;
    history.push(...pHistory);
  }
}

function renderHistory() {
  const historyContainer = document.getElementById('history');
  if (!history.length) {
    historyContainer.innerHTML = '<p>Nenhuma tentativa ainda.</p>';
    return;
  }

  historyContainer.innerHTML = history.slice(-20).reverse().map(entry => {
    const status = entry.correct ? 'correto' : 'incorreto';
    return `<p><strong>${entry.verb}</strong> → você: ${entry.answer} | esperada: ${entry.expected} | <em>${status}</em> (${entry.time})</p>`;
  }).join('');
}


function updateLevel() {
  level = LEVELS.reduce((acc, threshold) => (score >= threshold ? acc + 1 : acc), 0);
  if (level > 3) level = 3;
  document.getElementById('levelValue').innerText = level;
}

function showVerb(){
  if (!activeVerbs.length) {
    document.getElementById('card').innerText = 'Nenhum verbo disponível para o modo selecionado.';
    return;
  }

  if (current >= activeVerbs.length) current = 0;

  const v = activeVerbs[current];
  document.getElementById('card').innerHTML =
    `<strong>Base:</strong> ${v.base}<br><strong>Participle:</strong> ${v.participle}<br><strong>PT:</strong> ${v.pt}`;

  generateSentence(v);
}

function nextVerb(){
  if (!activeVerbs.length) return;

  current = (current + 1) % activeVerbs.length;
  const answerInput = document.getElementById('answer');
  answerInput.value = '';
  answerInput.focus();
  const feedback = document.getElementById('feedback');
  feedback.innerText = '';
  feedback.className = '';

  showVerb();
}

function previousVerb(){
  if (!activeVerbs.length) return;

  current = (current - 1 + activeVerbs.length) % activeVerbs.length;
  const answerInput = document.getElementById('answer');
  answerInput.value = '';
  answerInput.focus();
  const feedback = document.getElementById('feedback');
  feedback.innerText = '';
  feedback.className = '';

  showVerb();
}

function checkAnswer(){
  if (!activeVerbs.length) return;

  const v = activeVerbs[current];
  const rawAnswer = document.getElementById('answer').value.trim().toLowerCase();

  if (!rawAnswer) {
    document.getElementById('feedback').innerText = 'Por favor, digite sua resposta.';
    document.getElementById('feedback').className = 'wrong';
    return;
  }

  const rawPast = v.past.trim().toLowerCase();
  const validAnswers = v.past.split('/').map(x => x.trim().toLowerCase());
  const correct = rawAnswer === rawPast || validAnswers.includes(rawAnswer);

  if (correct) {
    score += 10;
    document.getElementById('feedback').innerText = `✅ Correto! Past simples: ${v.past}`;
    document.getElementById('feedback').className = 'correct';
  } else {
    document.getElementById('feedback').innerText = `❌ Errado. Resposta correta: ${v.past}`;
    document.getElementById('feedback').className = 'wrong';
  }

  history.push({
    verb: v.base,
    answer: rawAnswer || '(vazio)',
    expected: v.past,
    correct,
    time: new Date().toLocaleTimeString(),
  });

  document.getElementById('score').innerText = score;
  updateLevel();
  renderHistory();
  saveProgress();

  // O usuário decide quando ir para a próxima questão.
}

function playAudio(){
  if (!verbs.length) return;

  const v = verbs[current];
  const sentence = document.getElementById('ai').innerText;
  const utter = new SpeechSynthesisUtterance(`${v.base}. ${v.past}. ${v.participle}. ${sentence}`);
  utter.lang = 'en-US';
  speechSynthesis.speak(utter);
}

function generateSentence(v){
  const verb = v.base.toLowerCase();
  let sentence;

  if (verb === 'be') {
    sentence = 'I usually am at home every day.';
  } else {
    sentence = `I usually ${verb} every day.`;
  }

  document.getElementById('ai').innerText = sentence;
}

function renderExamples(){
  const examples = document.getElementById('examples');
  if (!activeVerbs.length) {
    examples.innerText = 'Sem exemplos disponíveis.';
    return;
  }

  const v = activeVerbs[current];
  const base = v.base.toLowerCase();
  const past = v.past;
  const part = v.participle;

  examples.innerHTML = `
    <p><strong>${base}</strong> (Base): I usually ${base} every day.</p>
    <p><strong>${past}</strong> (Past): Yesterday I ${past} yesterday.</p>
    <p><strong>${part}</strong> (Participle): I have ${part} before.</p>
  `;
}

function clearHistory(){
  history.length = 0;
  renderHistory();
  saveProgress();
}

function bindEvents(){
  document.getElementById('previousBtn').addEventListener('click', previousVerb);
  document.getElementById('checkBtn').addEventListener('click', checkAnswer);
  document.getElementById('nextBtn').addEventListener('click', nextVerb);
  document.getElementById('audioBtn').addEventListener('click', playAudio);
  document.getElementById('examplesBtn').addEventListener('click', renderExamples);
  document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);

  const modeSelect = document.getElementById('modeSelect');
  modeSelect.value = mode;
  modeSelect.addEventListener('change', (e) => {
    mode = e.target.value;
    activeVerbs = getActiveVerbs();
    current = 0;
    saveProgress();
    showVerb();
    renderExamples();
  });

  const answerInput = document.getElementById('answer');
  answerInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') checkAnswer();
  });
}

loadProgress();

fetch('verbs.json')
  .then(r => r.json())
  .then(d => {
    verbs = dedupeVerbs(d);
    activeVerbs = getActiveVerbs();
    if (!activeVerbs.length) {
      document.getElementById('card').innerText = 'Nenhum verbo disponível para o modo selecionado.';
      return;
    }
    if (current >= activeVerbs.length) current = 0;

    document.getElementById('score').innerText = score;
    document.getElementById('levelValue').innerText = level;
    document.getElementById('modeSelect').value = mode;

    showVerb();
    renderHistory();
    renderExamples();
    bindEvents();
  })
  .catch(err => {
    document.getElementById('card').innerText = 'Falha ao carregar verbos.';
    console.error(err);
  });
