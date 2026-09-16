/**
 * =====================================================================
 * memoly - 暗記フラッシュカード・早押しクイズアプリ (app.js) - ver.2.1.0
 * ===================================================================== */

/* =====================================================================
 * 1. 初期データおよび定数定義
 * ===================================================================== */

const defaultDecks = [
  {
    id: 'deck-1',
    title: '雑学クイズ基本セット',
    tags: ['基本'],
    orderMode: 'SHUFFLE',
    excludeStar: false,
    lastStudied: Date.now(),
    cards: [
      {
        id: 'card-1',
        question: '日本の現在の首都として事実上機能している、関東地方に位置する都道府県はどこでしょう？',
        answer: '東京都',
        explanation: '人口は約1400万人で、日本の政治・経済の中心地です。',
        image: '',
        dueDate: 0,
        interval: 0,
        easeFactor: 2.5,
        reps: 0,
        againStreak: 0,
        isHidden: false
      },
      {
        id: 'card-2',
        question: '太陽系で最も大きい、木星型惑星の代表格は何でしょう？',
        answer: '木星',
        explanation: '主に水素とヘリウムでできており、大赤斑という巨大な嵐が存在します。',
        image: '',
        dueDate: 0,
        interval: 0,
        easeFactor: 2.5,
        reps: 0,
        againStreak: 0,
        isHidden: false
      }
    ]
  }
];

const DEFAULT_KEY_BINDS = {
  advance: ['Space'],
  again: ['1'],
  hard: ['2'],
  good: ['3'],
  easy: ['4']
};

const DEFAULT_USER_CONFIG = {
  theme: 'device',
  fontSize: 15,
  mode: 'NORMAL',
  charSpeed: 150,
  deckSortOrder: 'RECENT',
  enableLongPress: true,
  holdSpeed: 1.0,
  holdSpeedQ: 0.2,
  holdSpeedA: 1.0,
  enableCardLevel: true,
  enableReviewResult: false,
  reviewInterval: 50,
  enableGamification: false,
  dailyGoalCards: 50,
  dailyGoalMinutes: 15,
  enableTextSelection: false,
  enableTags: false,
  tagColors: {},
  keyBinds: { ...DEFAULT_KEY_BINDS }
};

const INACTIVITY_TIMEOUT_MS = 60 * 1000;

const ACHIEVEMENTS_PRESET = [
  { id: 'first_step', name: '最初の一歩', desc: '初めてカードを1枚学習した', icon: '🌱' },
  { id: 'first_deck', name: 'デッキマスター見習い', desc: '初めてデッキを作成した', icon: '📂' },
  { id: 'first_star', name: '一番星', desc: '初めてカードの暗記レベルを★にした', icon: '⭐' },
  { id: 'cards_10', name: '暗記の兆し', desc: '累計10枚のカードを学習した', icon: '📖' },
  { id: 'cards_50', name: '知の小径', desc: '累計50枚のカードを学習した', icon: '📚' },
  { id: 'cards_100', name: '知識の探求者', desc: '累計100枚のカードを学習した', icon: '🥉' },
  { id: 'cards_500', name: '記憶のエキスパート', desc: '累計500枚のカードを学習した', icon: '🥈' },
  { id: 'cards_1000', name: '知識の泉', desc: '累計1,000枚のカードを学習した', icon: '🥇' },
  { id: 'cards_5000', name: '記憶の図書館', desc: '累計5,000枚のカードを学習した', icon: '🏛️' },
  { id: 'cards_10000', name: '博覧強記', desc: '累計10,000枚のカードを学習した', icon: '👑' },
  { id: 'cards_100000', name: '知の求道者', desc: '累計100,000枚のカードを学習した', icon: '🌌' },
  { id: 'cards_1000000', name: '神話を紡ぐ者', desc: '累計1,000,000枚のカードを学習した', icon: '🌟' },
  { id: 'streak_2', name: '継続の芽生え', desc: '2日連続で学習した', icon: '🌱' },
  { id: 'streak_3', name: '三日坊主の克服', desc: '3日連続で学習した', icon: '🌿' },
  { id: 'streak_7', name: '習慣の確立', desc: '1週間(7日)連続で学習した', icon: '🔥' },
  { id: 'streak_14', name: '確固たる意志', desc: '2週間(14日)連続で学習した', icon: '⚔️' },
  { id: 'streak_30', name: '努力の結晶', desc: '1ヶ月(30日)連続で学習した', icon: '💎' },
  { id: 'streak_100', name: '不屈の学習者', desc: '100日連続で学習した', icon: '🏆' },
  { id: 'stars_10', name: '小さな星座', desc: '暗記レベル★のカードが10枚に達した', icon: '✨' },
  { id: 'stars_50', name: 'きらめく銀河', desc: '暗記レベル★のカードが50枚に達した', icon: '🌌' },
  { id: 'stars_100', name: '満天の星空', desc: '暗記レベル★のカードが100枚に達した', icon: '🌠' },
  { id: 'stars_500', name: '星空の覇者', desc: '暗記レベル★のカードが500枚に達した', icon: '🪐' },
  { id: 'time_30m', name: '集中のひととき', desc: '累計30分学習した', icon: '⏱️' },
  { id: 'time_5h', name: '知の積み重ね', desc: '累計5時間学習した', icon: '⏳' },
  { id: 'time_20h', name: '情熱の時間', desc: '累計20時間学習した', icon: '🕰️' },
  { id: 'daily_goal_done', name: '本日の目標達成', desc: '1日のデイリー目標を初めて達成した', icon: '🎯' },
  { id: 'morning_quiz', name: '朝活マスター', desc: '朝(7:00〜9:00)に学習を行った', icon: '🌅' },
  { id: 'lunch_quiz', name: 'スキマ時間の達人', desc: '昼休み(12:00〜13:00)に学習を行った', icon: '🍱' },
  { id: 'night_quiz', name: '一日の締めくくり', desc: '夜(21:00〜24:00)に学習を行った', icon: '🌙' },
  { id: 'level_10', name: '記憶の達人', desc: 'プレイヤーレベル10に到達した', icon: '🎖️' }
];

/* =====================================================================
 * 2. アプリケーションの状態管理変数
 * ===================================================================== */

let decks = [];
let trashDecks = [];
let studyLogs = {};
let dailyStudyHistory = {};
let studyTimes = {};

let userExp = 0;
let userLevel = 1;
let userAchievements = {};
let pendingAchievementAlerts = [];

let selectedTagFilter = 'ALL';

let currentDeck = null;
let studyQueue = [];
let currentCard = null;
let targetDeckForAddCard = null;
let targetDeckForCardList = null;
let targetDeckForSettings = null;
let targetCardForEdit = null;
let currentEditingImageData = '';
let currentAddingImageData = '';

let sessionInitialCardLevels = {};
let sessionAnswerHistory = [];
let sessionStudiedCount = 0;

let pendingCsvCards = [];
let undoStack = [];
let redoStack = [];

let currentCalendarDate = new Date();
let selectedCalendarDateStr = '';
let cardListPageIndex = 0;
const CARDS_PER_PAGE = 100;

let userConfig = { ...DEFAULT_USER_CONFIG };
let tempFontSize = 15;
let todayCardsSortOrder = 'RECENT';

let charIndex = 0;
let timer = null;
let previewTimer = null;
let startTime = 0;
let stopTime = 0;
let state = 'IDLE';

let holdTimer = null;
let holdInterval = null;
let bindingKeyTarget = null;
let isHolding = false;
let didHold = false;
let aCharIndex = 0;
let holdPhase = 'NONE';

let optHoldTimerQ = null;
let optHoldIntervalQ = null;
let optHoldCharIndexQ = 0;
let isOptHoldingQ = false;

let optHoldTimerA = null;
let optHoldIntervalA = null;
let optHoldCharIndexA = 0;
let isOptHoldingA = false;

let touchStartX = 0;
let touchStartY = 0;
let isTouchDevice = false;
let isScrolling = false;
let lastHoldEndTime = 0;

let quizStudyTimer = null;
let lastUserActivityTime = Date.now();
let isQuizActive = false;

const SAMPLE_PREVIEW_TEXT = '山梨県と静岡県にまたがる、日本で一番高い山は何でしょう？';
const SAMPLE_PREVIEW_Q_PREFIX = '山梨県と静岡県にまたがる、';

/* =====================================================================
 * 3. DOM要素キャッシュ用変数
 * ===================================================================== */

let menuScreen,
  statsScreen,
  optionScreen,
  quizScreen,
  resultScreen,
  optLearningScreen,
  optCustomScreen,
  optDisplayScreen,
  optDeckScreen,
  optDataScreen,
  addCardModal,
  editCardModal,
  cardListModal,
  deckSettingsModal,
  tagManagerModal,
  csvImportModal,
  csvExportModal,
  exportDeckSelect,
  trashModal,
  trashListContainer,
  hiddenCardsModal,
  hiddenCardsListContainer,
  csvConfirmModal,
  csvDeckNameInput,
  csvConfirmCardCount,
  goalSettingModal,
  achievementModal,
  newTagModal,
  newTagNameInput,
  newTagColorInput,
  deckListEl,
  tagFilterBarEl,
  csvInput,
  currentDeckTitleEl,
  progressInfoEl,
  questionEl,
  answerSectionEl,
  answerTextEl,
  explanationTextEl,
  answerImageContainer,
  answerImageEl,
  searchTermTextEl,
  resultStatsEl,
  statProgressEl,
  statTimeEl,
  buttonsEl,
  tapHintEl,
  streakDaysEl,
  streakMessageEl,
  calendarTitleEl,
  calendarGridEl,
  selectedDayTitleEl,
  selectedDayCardsEl,
  selectedDayTimeEl,
  statTotalTimeEl,
  statTotalStudiedCardsEl,
  statTotalNewCardsEl,
  statTotalStarCardsEl,
  statPlayedDecksCountEl,
  statMasteredDecksCountEl,
  newCardQ,
  newCardA,
  newCardExp,
  editCardQ,
  editCardA,
  editCardExp,
  addCardImgInput,
  addCardImgPreview,
  addCardImgElement,
  editCardImgInput,
  editCardImgPreview,
  editCardImgElement,
  speedOptionGroup,
  charSpeedRange,
  speedValueDisplay,
  previewTextContainer,
  fontSizeRange,
  fontSizeValueDisplay,
  cardListDeckTitle,
  cardListContainer,
  cardPaginationEl,
  deckSettingsTitle,
  deckTagsCheckboxContainer,
  deckTagsSettingRow,
  undoBtn,
  redoBtn;

function initDOMElements() {
  menuScreen = document.getElementById('menu-screen');
  statsScreen = document.getElementById('stats-screen');
  optionScreen = document.getElementById('option-screen');
  quizScreen = document.getElementById('quiz-screen');
  resultScreen = document.getElementById('result-screen');

  optLearningScreen = document.getElementById('opt-learning-screen');
  optCustomScreen = document.getElementById('opt-custom-screen');
  optDisplayScreen = document.getElementById('opt-display-screen');
  optDeckScreen = document.getElementById('opt-deck-screen');
  optDataScreen = document.getElementById('opt-data-screen');

  addCardModal = document.getElementById('add-card-modal');
  editCardModal = document.getElementById('edit-card-modal');
  cardListModal = document.getElementById('card-list-modal');
  deckSettingsModal = document.getElementById('deck-settings-modal');
  tagManagerModal = document.getElementById('tag-manager-modal');
  csvImportModal = document.getElementById('csv-import-modal');
  csvExportModal = document.getElementById('csv-export-modal');
  exportDeckSelect = document.getElementById('export-deck-select');
  trashModal = document.getElementById('trash-modal');
  trashListContainer = document.getElementById('trash-list-container');
  hiddenCardsModal = document.getElementById('hidden-cards-modal');
  hiddenCardsListContainer = document.getElementById('hidden-cards-list-container');

  csvConfirmModal = document.getElementById('csv-confirm-modal');
  csvDeckNameInput = document.getElementById('csv-deck-name-input');
  csvConfirmCardCount = document.getElementById('csv-confirm-card-count');

  goalSettingModal = document.getElementById('goal-setting-modal');
  achievementModal = document.getElementById('achievement-modal');

  newTagModal = document.getElementById('new-tag-modal');
  newTagNameInput = document.getElementById('new-tag-name-input');
  newTagColorInput = document.getElementById('new-tag-color-input');

  deckListEl = document.getElementById('deck-list');
  tagFilterBarEl = document.getElementById('tag-filter-bar');
  csvInput = document.getElementById('csv-file-input');

  currentDeckTitleEl = document.getElementById('current-deck-title');
  progressInfoEl = document.getElementById('progress-info');
  questionEl = document.getElementById('question-text');
  answerSectionEl = document.getElementById('answer-section');
  answerTextEl = document.getElementById('answer-text');
  explanationTextEl = document.getElementById('explanation-text');
  answerImageContainer = document.getElementById('answer-image-container');
  answerImageEl = document.getElementById('answer-image');
  searchTermTextEl = document.getElementById('search-term-text');
  resultStatsEl = document.getElementById('result-stats');
  statProgressEl = document.getElementById('stat-progress');
  statTimeEl = document.getElementById('stat-time');
  buttonsEl = document.getElementById('action-buttons');
  tapHintEl = document.getElementById('tap-hint');

  streakDaysEl = document.getElementById('streak-days');
  streakMessageEl = document.getElementById('streak-message');
  calendarTitleEl = document.getElementById('calendar-title');
  calendarGridEl = document.getElementById('calendar-grid');

  selectedDayTitleEl = document.getElementById('selected-day-title');
  selectedDayCardsEl = document.getElementById('selected-day-cards');
  selectedDayTimeEl = document.getElementById('selected-day-time');

  statTotalTimeEl = document.getElementById('stat-total-time');
  statTotalStudiedCardsEl = document.getElementById('stat-total-studied-cards');
  statTotalNewCardsEl = document.getElementById('stat-total-new-cards');
  statTotalStarCardsEl = document.getElementById('stat-total-star-cards');
  statPlayedDecksCountEl = document.getElementById('stat-played-decks-count');
  statMasteredDecksCountEl = document.getElementById('stat-mastered-decks-count');

  newCardQ = document.getElementById('new-card-q');
  newCardA = document.getElementById('new-card-a');
  newCardExp = document.getElementById('new-card-exp');

  addCardImgInput = document.getElementById('add-card-img-input');
  addCardImgPreview = document.getElementById('add-card-img-preview');
  addCardImgElement = document.getElementById('add-card-img-element');

  editCardQ = document.getElementById('edit-card-q');
  editCardA = document.getElementById('edit-card-a');
  editCardExp = document.getElementById('edit-card-exp');
  editCardImgInput = document.getElementById('edit-card-img-input');
  editCardImgPreview = document.getElementById('edit-card-img-preview');
  editCardImgElement = document.getElementById('edit-card-img-element');

  speedOptionGroup = document.getElementById('speed-option-group');
  charSpeedRange = document.getElementById('char-speed-range');
  speedValueDisplay = document.getElementById('speed-value-display');
  previewTextContainer = document.getElementById('preview-text-container');

  fontSizeRange = document.getElementById('font-size-range');
  fontSizeValueDisplay = document.getElementById('font-size-value-display');

  cardListDeckTitle = document.getElementById('card-list-deck-title');
  cardListContainer = document.getElementById('card-list-container');
  cardPaginationEl = document.getElementById('card-pagination');
  deckSettingsTitle = document.getElementById('deck-settings-title');
  deckTagsCheckboxContainer = document.getElementById('deck-tags-checkbox-container');
  deckTagsSettingRow = document.getElementById('deck-tags-setting-row');

  undoBtn = document.getElementById('undo-btn');
  redoBtn = document.getElementById('redo-btn');
}

/* =====================================================================
 * 4. IndexedDB 永続化ストレージ処理
 * ===================================================================== */

const DB_NAME = 'memoly_db';
const DB_VERSION = 1;
const STORE_NAME = 'keyval';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function idbSet(key, val) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(val, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.error('[IDB Set Error]', e);
  }
}

async function idbGet(key) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const request = tx.objectStore(STORE_NAME).get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error('[IDB Get Error]', e);
    return null;
  }
}

async function idbClear() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.error('[IDB Clear Error]', e);
  }
}

async function migrateLocalStorage() {
  try {
    const keys = [
      'memoly_config',
      'memoly_decks',
      'memoly_trash_decks',
      'memoly_logs',
      'memoly_daily_history',
      'memoly_study_times',
      'memoly_user_exp',
      'memoly_user_achievements'
    ];
    const legacyKeys = [
      'aoki_config',
      'aoki_decks',
      'aoki_trash_decks',
      'aoki_logs',
      'aoki_daily_history',
      'aoki_study_times'
    ];

    for (let i = 0; i < keys.length; i++) {
      let data = await idbGet(keys[i]);
      if (!data) {
        const localData = (legacyKeys[i] ? localStorage.getItem(legacyKeys[i]) : null) || localStorage.getItem(keys[i]);
        if (localData) {
          try {
            data = JSON.parse(localData);
            await idbSet(keys[i], data);
            if (legacyKeys[i]) localStorage.removeItem(legacyKeys[i]);
          } catch (e) {}
        }
      }
    }
  } catch (e) {}
}

function saveDecks() {
  idbSet('memoly_decks', decks).catch((e) => console.error(e));
}
function saveConfig() {
  idbSet('memoly_config', userConfig).catch((e) => console.error(e));
}
function saveLogs() {
  idbSet('memoly_logs', studyLogs).catch((e) => console.error(e));
}
function saveDailyHistory() {
  idbSet('memoly_daily_history', dailyStudyHistory).catch((e) => console.error(e));
}
function saveTrashDecks() {
  idbSet('memoly_trash_decks', trashDecks).catch((e) => console.error(e));
}
function saveStudyTimes() {
  idbSet('memoly_study_times', studyTimes).catch((e) => console.error(e));
}
function saveGamificationData() {
  idbSet('memoly_user_exp', userExp).catch((e) => console.error(e));
  idbSet('memoly_user_achievements', userAchievements).catch((e) => console.error(e));
}

/* =====================================================================
 * 5. 学習時間トラッカー
 * ===================================================================== */

function startQuizStudyTimer() {
  isQuizActive = true;
  lastUserActivityTime = Date.now();

  if (quizStudyTimer) clearInterval(quizStudyTimer);

  quizStudyTimer = setInterval(() => {
    if (!isQuizActive) return;
    if (document.hidden) return;
    if (Date.now() - lastUserActivityTime > INACTIVITY_TIMEOUT_MS) return;

    const todayStr = getFormattedDate(new Date());
    if (!studyTimes[todayStr]) studyTimes[todayStr] = 0;
    studyTimes[todayStr] += 1;

    if (userConfig.enableGamification) {
      checkTimeAchievements();
    }
  }, 1000);
}

function stopQuizStudyTimer() {
  isQuizActive = false;
  if (quizStudyTimer) {
    clearInterval(quizStudyTimer);
    quizStudyTimer = null;
  }
  saveStudyTimes();
}

function markUserActivity() {
  lastUserActivityTime = Date.now();
}

function setupActivityListeners() {
  const resetActivity = () => markUserActivity();
  window.addEventListener('keydown', resetActivity, { passive: true });
  window.addEventListener('mousemove', resetActivity, { passive: true });
  window.addEventListener('touchstart', resetActivity, { passive: true });
  window.addEventListener('click', resetActivity, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      markUserActivity();
    }
  });
}

function formatDurationMinutes(seconds) {
  if (!seconds || seconds <= 0) return '0分';
  const mins = Math.floor(seconds / 60);
  if (mins < 1) return '1分未満';
  if (mins < 60) return `${mins}分`;
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return remMins === 0 ? `${hours}時間` : `${hours}時間${remMins}分`;
}

/* =====================================================================
 * 6. 重複チェック・エクスポート・インポート
 * ===================================================================== */

function checkDeckNameDuplicate(title, excludeDeckId = null) {
  const trimmed = title.trim();
  const exists = decks.some((d) => d.title.trim() === trimmed && d.id !== excludeDeckId);
  if (exists) {
    return confirm(`「${trimmed}」という名前は既にほかのデッキで使われていますが、本当にその名前でよろしいですか？`);
  }
  return true;
}

async function exportAllDataBackup() {
  try {
    const data = {
      decks: (await idbGet('memoly_decks')) || decks,
      trashDecks: (await idbGet('memoly_trash_decks')) || trashDecks,
      studyLogs: (await idbGet('memoly_logs')) || studyLogs,
      dailyStudyHistory: (await idbGet('memoly_daily_history')) || dailyStudyHistory,
      studyTimes: (await idbGet('memoly_study_times')) || studyTimes,
      userConfig: (await idbGet('memoly_config')) || userConfig,
      userExp: (await idbGet('memoly_user_exp')) || userExp,
      userAchievements: (await idbGet('memoly_user_achievements')) || userAchievements
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `memoly_data_backup_${getFormattedDate(new Date())}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('データのバックアップに成功しました。');
  } catch (e) {
    alert('バックアップの作成に失敗しました: ' + e.message);
  }
}

async function importAllDataBackup(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.decks) throw new Error('有効なバックアップデータではありません。');

      if (confirm('現在の端末内データがすべて上書きされます。よろしいですか？')) {
        await idbSet('memoly_decks', data.decks);
        await idbSet('memoly_trash_decks', data.trashDecks || []);
        await idbSet('memoly_logs', data.studyLogs || {});
        await idbSet('memoly_daily_history', data.dailyStudyHistory || {});
        await idbSet('memoly_study_times', data.studyTimes || {});
        await idbSet('memoly_config', data.userConfig || userConfig);
        await idbSet('memoly_user_exp', data.userExp || 0);
        await idbSet('memoly_user_achievements', data.userAchievements || {});

        alert('データを完全に復元しました。アプリをリロードします。');
        window.location.reload();
      }
    } catch (err) {
      alert('復元に失敗しました: ' + err.message);
    }
    event.target.value = '';
  };
  reader.readAsText(file, 'UTF-8');
}

function openCsvExportModal() {
  if (!exportDeckSelect || !csvExportModal) return;
  exportDeckSelect.innerHTML = '<option value="ALL">すべてのデッキ</option>';
  decks.forEach((deck) => {
    const opt = document.createElement('option');
    opt.value = deck.id;
    opt.textContent = deck.title;
    exportDeckSelect.appendChild(opt);
  });
  csvExportModal.classList.remove('hidden');
}

function closeCsvExportModal() {
  if (csvExportModal) csvExportModal.classList.add('hidden');
}

function submitCsvExport() {
  if (!exportDeckSelect) return;
  const selectedValue = exportDeckSelect.value;
  let targetDecks = [];
  let exportFileName = 'memoly_export';

  if (selectedValue === 'ALL') {
    targetDecks = decks;
    exportFileName = `memoly_alldecks_${getFormattedDate(new Date())}.csv`;
  } else {
    const deck = decks.find((d) => d.id === selectedValue);
    if (deck) {
      targetDecks = [deck];
      exportFileName = `memoly_${deck.title}_${getFormattedDate(new Date())}.csv`;
    }
  }

  if (targetDecks.length === 0) {
    alert('出力するデッキがありません。');
    closeCsvExportModal();
    return;
  }

  const csvRows = [];
  targetDecks.forEach((deck) => {
    (deck.cards || []).forEach((card) => {
      const escapeCsv = (str) => {
        if (str === null || str === undefined) return '';
        let escaped = str.toString().replace(/"/g, '""');
        if (escaped.search(/("|,|\n)/g) >= 0) escaped = `"${escaped}"`;
        return escaped;
      };
      csvRows.push(`${escapeCsv(card.question)},${escapeCsv(card.answer)},${escapeCsv(card.explanation || '')}`);
    });
  });

  if (csvRows.length === 0) {
    alert('出力するカードがありません。');
    closeCsvExportModal();
    return;
  }

  const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
  const blob = new Blob([bom, csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = exportFileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  closeCsvExportModal();
}

function resizeImage(file, maxWidth = 600, maxHeight = 600, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        let width = img.width,
          height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

function removeAddCardImage() {
  currentAddingImageData = '';
  if (addCardImgInput) addCardImgInput.value = '';
  if (addCardImgElement) addCardImgElement.src = '';
  if (addCardImgPreview) addCardImgPreview.classList.add('hidden');
}

function removeEditCardImage() {
  currentEditingImageData = '';
  if (editCardImgInput) editCardImgInput.value = '';
  if (editCardImgElement) editCardImgElement.src = '';
  if (editCardImgPreview) editCardImgPreview.classList.add('hidden');
}

function setupImageDropZone(dropZoneId, inputId, onImageLoaded) {
  const dropZone = document.getElementById(dropZoneId);
  const input = document.getElementById(inputId);
  if (!dropZone || !input) return;

  dropZone.addEventListener('click', () => input.click());
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((ev) =>
    dropZone.addEventListener(
      ev,
      (e) => {
        e.preventDefault();
        e.stopPropagation();
      },
      false
    )
  );
  ['dragenter', 'dragover'].forEach((ev) =>
    dropZone.addEventListener(ev, () => dropZone.classList.add('dragover'), false)
  );
  ['dragleave', 'drop'].forEach((ev) =>
    dropZone.addEventListener(ev, () => dropZone.classList.remove('dragover'), false)
  );

  dropZone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files.length) handleImageFile(files[0]);
  });
  input.addEventListener('change', (e) => {
    if (e.target.files.length) handleImageFile(e.target.files[0]);
  });

  async function handleImageFile(file) {
    if (!file.type.startsWith('image/')) {
      alert('画像ファイルを選択してください。');
      return;
    }
    try {
      const dataUrl = await resizeImage(file, 600, 600, 0.7);
      onImageLoaded(dataUrl);
    } catch (err) {
      alert('画像の処理に失敗しました。');
    }
  }
}

/* =====================================================================
 * 7. アプリケーション初期化
 * ===================================================================== */

async function initApp() {
  try {
    initDOMElements();
    await migrateLocalStorage();

    const savedConfig = await idbGet('memoly_config');
    if (savedConfig) {
      userConfig = { ...DEFAULT_USER_CONFIG, ...savedConfig };
      if (typeof userConfig.fontSize === 'string') userConfig.fontSize = 15;
      if (userConfig.holdSpeedQ === undefined) userConfig.holdSpeedQ = userConfig.holdSpeed || 0.2;
      if (userConfig.holdSpeedA === undefined) userConfig.holdSpeedA = userConfig.holdSpeed || 1.0;
      if (userConfig.enableReviewResult === undefined) userConfig.enableReviewResult = false;
      if (userConfig.reviewInterval === undefined) userConfig.reviewInterval = 50;
      if (userConfig.enableGamification === undefined) userConfig.enableGamification = false;
      if (userConfig.dailyGoalCards === undefined) userConfig.dailyGoalCards = 50;
      if (userConfig.dailyGoalMinutes === undefined) userConfig.dailyGoalMinutes = 15;
      if (userConfig.enableTextSelection === undefined) userConfig.enableTextSelection = true;
      if (userConfig.enableTags === undefined) userConfig.enableTags = true;
      if (!userConfig.tagColors) userConfig.tagColors = {};
      if (!userConfig.keyBinds) userConfig.keyBinds = JSON.parse(JSON.stringify(DEFAULT_KEY_BINDS));
    }
    tempFontSize = userConfig.fontSize;

    const savedDecks = await idbGet('memoly_decks');
    if (Array.isArray(savedDecks) && savedDecks.length > 0) {
      decks = savedDecks;
      decks.forEach((d) => {
        if (!Array.isArray(d.tags)) d.tags = [];
        if (!d.orderMode) d.orderMode = 'SHUFFLE';
        if (d.excludeStar === undefined) d.excludeStar = false;
        if (!d.lastStudied) d.lastStudied = 0;
        if (!Array.isArray(d.cards)) d.cards = [];
        d.cards.forEach((c) => {
          if (c.isHidden === undefined) c.isHidden = false;
          if (c.againStreak === undefined) c.againStreak = 0; // againStreak初期化
        });
      });
    } else {
      decks = JSON.parse(JSON.stringify(defaultDecks));
      await idbSet('memoly_decks', decks);
    }

    const savedTrash = await idbGet('memoly_trash_decks');
    if (Array.isArray(savedTrash)) trashDecks = savedTrash;

    const savedLogs = await idbGet('memoly_logs');
    if (savedLogs) studyLogs = savedLogs;

    const savedDaily = await idbGet('memoly_daily_history');
    if (savedDaily) dailyStudyHistory = savedDaily;

    const savedTimes = await idbGet('memoly_study_times');
    if (savedTimes) studyTimes = savedTimes;

    const savedExp = await idbGet('memoly_user_exp');
    if (typeof savedExp === 'number') userExp = savedExp;

    const savedAch = await idbGet('memoly_user_achievements');
    if (savedAch && typeof savedAch === 'object') userAchievements = savedAch;

    updateUserLevelFromExp();
    checkRetroactiveAchievements();

    setupEventListeners();
    setupOptionPreviewEventListeners();
    setupDragAndDrop();
    setupActivityListeners();

    setupImageDropZone('add-card-img-drop-zone', 'add-card-img-input', (dataUrl) => {
      currentAddingImageData = dataUrl;
      if (addCardImgElement) addCardImgElement.src = dataUrl;
      if (addCardImgPreview) addCardImgPreview.classList.remove('hidden');
    });

    setupImageDropZone('edit-card-img-drop-zone', 'edit-card-img-input', (dataUrl) => {
      currentEditingImageData = dataUrl;
      if (editCardImgElement) editCardImgElement.src = dataUrl;
      if (editCardImgPreview) editCardImgPreview.classList.remove('hidden');
    });

    selectedCalendarDateStr = getFormattedDate(new Date());

    applyConfigUI();
    showMenu();
    checkPendingAchievementPopup();
  } catch (err) {
    console.error('[memoly 初期化エラー]', err);
    decks = JSON.parse(JSON.stringify(defaultDecks));
    showMenu();
  }
}

function removeCardFromHistory(cardId) {
  let modified = false;
  Object.keys(dailyStudyHistory).forEach((dateKey) => {
    if (dailyStudyHistory[dateKey] && dailyStudyHistory[dateKey][cardId]) {
      delete dailyStudyHistory[dateKey][cardId];
      modified = true;
    }
  });
  if (modified) saveDailyHistory();
}

function recordStudyLog(card, rating) {
  const todayStr = getFormattedDate(new Date());
  if (!studyLogs[todayStr]) studyLogs[todayStr] = 0;
  studyLogs[todayStr] += 1;
  saveLogs();

  if (!dailyStudyHistory[todayStr]) dailyStudyHistory[todayStr] = {};
  if (!dailyStudyHistory[todayStr][card.id]) {
    dailyStudyHistory[todayStr][card.id] = {
      card: { question: card.question, answer: card.answer },
      deckTitle: currentDeck ? currentDeck.title : '',
      againCount: 0,
      totalCount: 0,
      lastStudiedTime: Date.now()
    };
  }
  dailyStudyHistory[todayStr][card.id].lastStudiedTime = Date.now();
  if (currentDeck) dailyStudyHistory[todayStr][card.id].deckTitle = currentDeck.title;
  dailyStudyHistory[todayStr][card.id].totalCount += 1;
  if (rating === 'again') dailyStudyHistory[todayStr][card.id].againCount += 1;
  saveDailyHistory();

  if (userConfig.enableGamification) {
    addExpForRating(rating);
    checkCardStudyAchievements();
  }
}

function getFormattedDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function applyConfigUI() {
  document.body.className = `theme-${userConfig.theme}`;
  document.documentElement.style.setProperty('--font-base', `${userConfig.fontSize}px`);
  document.documentElement.style.setProperty('--preview-font-size', `${tempFontSize}px`);

  const themeRadio = document.querySelector(`input[name="theme-option"][value="${userConfig.theme}"]`);
  if (themeRadio) themeRadio.checked = true;

  if (fontSizeRange) fontSizeRange.value = tempFontSize;
  if (fontSizeValueDisplay) fontSizeValueDisplay.textContent = tempFontSize;

  const modeRadio = document.querySelector(`input[name="mode-option"][value="${userConfig.mode}"]`);
  if (modeRadio) modeRadio.checked = true;

  const modeDescEl = document.getElementById('mode-description-text');
  if (modeDescEl) {
    if (userConfig.mode === 'NORMAL') modeDescEl.textContent = '問題文全表示の単語帳のようなモード。';
    else if (userConfig.mode === 'FAST')
      modeDescEl.textContent = '問題文が1文字ずつ表示されるモード。早押しクイズの形式を再現。';
  }

  const sortRadio = document.querySelector(`input[name="sort-option"][value="${userConfig.deckSortOrder}"]`);
  if (sortRadio) sortRadio.checked = true;

  if (charSpeedRange) charSpeedRange.value = userConfig.charSpeed;
  if (speedValueDisplay) speedValueDisplay.textContent = userConfig.charSpeed;

  const speedDisabledNotice = document.getElementById('speed-disabled-notice');
  if (speedOptionGroup) {
    const isFastMode = userConfig.mode === 'FAST';
    if (charSpeedRange) charSpeedRange.disabled = !isFastMode;
    speedOptionGroup.style.opacity = isFastMode ? '1' : '0.4';
    speedOptionGroup.style.pointerEvents = isFastMode ? 'auto' : 'none';
    if (speedDisabledNotice) speedDisabledNotice.style.display = isFastMode ? 'none' : 'block';
    if (isFastMode) startPreviewTyping();
    else clearInterval(previewTimer);
  }

  const cbLongPress = document.getElementById('toggle-long-press');
  if (cbLongPress) cbLongPress.checked = userConfig.enableLongPress;

  const isLongPressGlobalEnabled = userConfig.enableLongPress;
  const isNormalMode = userConfig.mode === 'NORMAL';

  const holdQGroup = document.getElementById('hold-q-group');
  const rangeHoldSpeedQ = document.getElementById('hold-speed-q-range');
  const dispHoldSpeedQ = document.getElementById('hold-speed-q-display');
  if (rangeHoldSpeedQ) rangeHoldSpeedQ.value = userConfig.holdSpeedQ || 0.2;
  if (dispHoldSpeedQ) dispHoldSpeedQ.textContent = (userConfig.holdSpeedQ || 0.2).toFixed(1);

  if (holdQGroup && rangeHoldSpeedQ) {
    const shouldDisableQ = !isLongPressGlobalEnabled || isNormalMode;
    rangeHoldSpeedQ.disabled = shouldDisableQ;
    holdQGroup.style.opacity = shouldDisableQ ? '0.4' : '1';
    holdQGroup.style.pointerEvents = shouldDisableQ ? 'none' : 'auto';
  }

  const holdAGroup = document.getElementById('hold-a-group');
  const rangeHoldSpeedA = document.getElementById('hold-speed-a-range');
  const dispHoldSpeedA = document.getElementById('hold-speed-a-display');
  if (rangeHoldSpeedA) rangeHoldSpeedA.value = userConfig.holdSpeedA || 1.0;
  if (dispHoldSpeedA) dispHoldSpeedA.textContent = (userConfig.holdSpeedA || 1.0).toFixed(1);

  if (holdAGroup && rangeHoldSpeedA) {
    const shouldDisableA = !isLongPressGlobalEnabled;
    rangeHoldSpeedA.disabled = shouldDisableA;
    holdAGroup.style.opacity = shouldDisableA ? '0.4' : '1';
    holdAGroup.style.pointerEvents = shouldDisableA ? 'none' : 'auto';
  }

  const cbCardLevel = document.getElementById('toggle-card-level');
  if (cbCardLevel) cbCardLevel.checked = userConfig.enableCardLevel;

  const cbReviewResult = document.getElementById('toggle-review-result');
  if (cbReviewResult) cbReviewResult.checked = !!userConfig.enableReviewResult;

  const reviewIntContainer = document.getElementById('review-interval-container');
  const inputReviewInt = document.getElementById('review-interval-input');
  if (inputReviewInt) inputReviewInt.value = userConfig.reviewInterval || 50;
  if (reviewIntContainer) {
    reviewIntContainer.style.opacity = userConfig.enableReviewResult ? '1' : '0.4';
    reviewIntContainer.style.pointerEvents = userConfig.enableReviewResult ? 'auto' : 'none';
  }

  const cbGamification = document.getElementById('toggle-gamification');
  if (cbGamification) cbGamification.checked = !!userConfig.enableGamification;

  const tabAchievementsBtn = document.getElementById('tab-btn-achievements');
  if (tabAchievementsBtn) {
    if (userConfig.enableGamification) {
      tabAchievementsBtn.classList.remove('hidden');
    } else {
      tabAchievementsBtn.classList.add('hidden');
      const tabAchievements = document.getElementById('stats-tab-achievements');
      if (tabAchievements && !tabAchievements.classList.contains('hidden')) {
        switchStatsTab('daily');
      }
    }
  }

  const cbTextSelection = document.getElementById('toggle-text-selection');
  if (cbTextSelection) cbTextSelection.checked = userConfig.enableTextSelection;

  const cbEnableTags = document.getElementById('toggle-enable-tags');
  if (cbEnableTags) cbEnableTags.checked = !!userConfig.enableTags;

  const tagManageBtnCont = document.getElementById('tag-management-btn-container');
  if (tagManageBtnCont) {
    tagManageBtnCont.style.display = userConfig.enableTags ? 'block' : 'none';
  }

  if (deckTagsSettingRow) {
    deckTagsSettingRow.style.display = userConfig.enableTags ? 'flex' : 'none';
  }

  updateKeyBindButtons();
}

/* =====================================================================
 * 8. 画面遷移制御
 * ===================================================================== */

function hideAllScreens() {
  clearInterval(timer);
  clearInterval(previewTimer);
  clearTimeout(holdTimer);
  clearInterval(holdInterval);
  stopQuizStudyTimer();

  if (menuScreen) menuScreen.classList.add('hidden');
  if (statsScreen) statsScreen.classList.add('hidden');
  if (optionScreen) optionScreen.classList.add('hidden');
  if (quizScreen) quizScreen.classList.add('hidden');
  if (resultScreen) resultScreen.classList.add('hidden');

  if (optLearningScreen) optLearningScreen.classList.add('hidden');
  if (optCustomScreen) optCustomScreen.classList.add('hidden');
  if (optDisplayScreen) optDisplayScreen.classList.add('hidden');
  if (optDeckScreen) optDeckScreen.classList.add('hidden');
  if (optDataScreen) optDataScreen.classList.add('hidden');
}

function showMenu() {
  hideAllScreens();
  if (menuScreen) menuScreen.classList.remove('hidden');
  renderMenu();
  checkPendingAchievementPopup();
}

function showStats() {
  hideAllScreens();
  if (statsScreen) statsScreen.classList.remove('hidden');
  switchStatsTab('daily');
  renderStatsScreen();
}

function switchStatsTab(tabName) {
  const btnDaily = document.getElementById('tab-btn-daily');
  const btnCards = document.getElementById('tab-btn-cards');
  const btnAch = document.getElementById('tab-btn-achievements');

  const tabDaily = document.getElementById('stats-tab-daily');
  const tabCards = document.getElementById('stats-tab-cards');
  const tabAch = document.getElementById('stats-tab-achievements');

  [btnDaily, btnCards, btnAch].forEach((b) => {
    if (b) b.classList.remove('active');
  });
  [tabDaily, tabCards, tabAch].forEach((t) => {
    if (t) t.classList.add('hidden');
  });

  if (tabName === 'daily') {
    if (btnDaily) btnDaily.classList.add('active');
    if (tabDaily) tabDaily.classList.remove('hidden');
  } else if (tabName === 'cards') {
    if (btnCards) btnCards.classList.add('active');
    if (tabCards) tabCards.classList.remove('hidden');
  } else if (tabName === 'achievements') {
    if (btnAch) btnAch.classList.add('active');
    if (tabAch) tabAch.classList.remove('hidden');
    renderAchievementsTab();
  }
}

function showOption() {
  hideAllScreens();
  tempFontSize = userConfig.fontSize;
  if (optionScreen) optionScreen.classList.remove('hidden');
}

function showOptScreen(screenId) {
  hideAllScreens();
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) targetScreen.classList.remove('hidden');

  applyConfigUI();
  if (screenId === 'opt-learning-screen') {
    if (userConfig.mode === 'FAST') startPreviewTyping();
    resetOptHoldPreview();
  }
}

/* =====================================================================
 * 9. 統計・カレンダー描画
 * ===================================================================== */

function calculateStreak() {
  let streak = 0;
  let checkDate = new Date();
  const todayStr = getFormattedDate(checkDate);
  let hasToday = !!(studyLogs[todayStr] && studyLogs[todayStr] > 0);
  if (!hasToday) checkDate.setDate(checkDate.getDate() - 1);
  while (true) {
    const dateStr = getFormattedDate(checkDate);
    if (studyLogs[dateStr] && studyLogs[dateStr] > 0) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else break;
  }
  return streak;
}

function getEncouragementMessage(streak) {
  if (streak === 0) return 'まずは今日、最初の1枚を挑戦してみよう！';
  if (streak === 1) return 'ナイススタート！この調子で明日も続けよう！';
  if (streak < 3) return '素晴らしい！習慣化への第一歩を踏み出せています！';
  if (streak < 7) return 'すごい集中力！この勢いで1週間を目指そう！';
  if (streak < 14) return '1週間突破！着実に知識が定着してきています！';
  if (streak < 30) return '継続の達人！素晴らしい努力が実を結んでいます！';
  return '伝説的継続力！あなたの努力は本当に素晴らしいです！！';
}

function renderStatsScreen() {
  const streak = calculateStreak();
  if (streakDaysEl) streakDaysEl.textContent = streak;
  if (streakMessageEl) streakMessageEl.textContent = getEncouragementMessage(streak);
  updateStatsDeckSelect();
  renderCalendar();
  renderSelectedDayDetail();
  renderAllTimeStats();
  renderTodayStudiedList();
}

function updateStatsDeckSelect() {
  const deckSelect = document.getElementById('stats-deck-select');
  if (!deckSelect) return;
  const currentValue = deckSelect.value;
  deckSelect.innerHTML = '<option value="ALL_DECKS">すべてのデッキ</option>';

  const deckNames = new Set();
  decks.forEach((d) => {
    if (d.title) deckNames.add(d.title);
  });

  Object.keys(dailyStudyHistory).forEach((dateKey) => {
    const dayData = dailyStudyHistory[dateKey];
    if (dayData) {
      Object.values(dayData).forEach((item) => {
        if (item.deckTitle) deckNames.add(item.deckTitle);
      });
    }
  });

  Array.from(deckNames)
    .sort()
    .forEach((name) => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      deckSelect.appendChild(opt);
    });
  deckSelect.value = Array.from(deckNames).includes(currentValue) ? currentValue : 'ALL_DECKS';
}

function changeCalendarMonth(delta) {
  currentCalendarDate.setDate(1);
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() + delta);
  renderCalendar();
}

function renderCalendar() {
  if (!calendarTitleEl || !calendarGridEl) return;
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  calendarTitleEl.textContent = `${year}年 ${month + 1}月`;
  calendarGridEl.innerHTML = '';

  ['日', '月', '火', '水', '木', '金', '土'].forEach((d) => {
    const dh = document.createElement('div');
    dh.className = 'calendar-day-header';
    dh.textContent = d;
    calendarGridEl.appendChild(dh);
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = getFormattedDate(new Date());

  if (!selectedCalendarDateStr) selectedCalendarDateStr = todayStr;

  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-cell empty';
    calendarGridEl.appendChild(emptyCell);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = new Date(year, month, day);
    const dateStr = getFormattedDate(cellDate);
    const count = studyLogs[dateStr] || 0;

    const cell = document.createElement('div');
    let cellClass = 'calendar-cell';
    if (count > 0) cellClass += ' has-data';
    if (dateStr === todayStr) cellClass += ' today';
    if (dateStr === selectedCalendarDateStr) cellClass += ' selected';

    cell.className = cellClass;
    cell.innerHTML = `<span class="day-num">${day}</span>${count > 0 ? `<span class="day-count">${count}枚</span>` : ''}`;
    cell.onclick = () => selectCalendarDay(dateStr);
    calendarGridEl.appendChild(cell);
  }
}

function selectCalendarDay(dateStr) {
  selectedCalendarDateStr = dateStr;
  renderCalendar();
  renderSelectedDayDetail();
}

function renderSelectedDayDetail() {
  if (!selectedDayTitleEl || !selectedDayCardsEl || !selectedDayTimeEl) return;
  const todayStr = getFormattedDate(new Date());
  const isToday = selectedCalendarDateStr === todayStr;
  const parts = selectedCalendarDateStr.split('-');

  selectedDayTitleEl.textContent = isToday
    ? '本日の学習記録'
    : `${parseInt(parts[0], 10)}年${parseInt(parts[1], 10)}月${parseInt(parts[2], 10)}日の学習記録`;
  selectedDayCardsEl.textContent = studyLogs[selectedCalendarDateStr] || 0;
  selectedDayTimeEl.textContent = formatDurationMinutes(studyTimes[selectedCalendarDateStr] || 0);
}

function renderAllTimeStats() {
  if (!statTotalTimeEl) return;
  let totalSeconds = 0;
  Object.values(studyTimes).forEach((sec) => {
    totalSeconds += sec || 0;
  });
  statTotalTimeEl.textContent = formatDurationMinutes(totalSeconds);

  let totalStudied = 0;
  Object.values(studyLogs).forEach((cnt) => {
    totalStudied += cnt || 0;
  });
  if (statTotalStudiedCardsEl) statTotalStudiedCardsEl.textContent = `${totalStudied}枚`;

  let totalNewCards = 0,
    totalStarCards = 0,
    playedDecksCount = 0,
    masteredDecksCount = 0;

  decks.forEach((deck) => {
    const activeCards = (deck.cards || []).filter((c) => !c.isHidden);
    let deckHasPlayed = deck.lastStudied && deck.lastStudied > 0;
    let deckAllStar = activeCards.length > 0;

    activeCards.forEach((card) => {
      if ((card.reps && card.reps > 0) || (card.dueDate && card.dueDate > 0)) {
        totalNewCards++;
        deckHasPlayed = true;
      }
      if (card.interval >= 30) totalStarCards++;
      else deckAllStar = false;
    });

    if (deckHasPlayed) playedDecksCount++;
    if (deckAllStar) masteredDecksCount++;
  });

  if (statTotalNewCardsEl) statTotalNewCardsEl.textContent = `${totalNewCards}枚`;
  if (statTotalStarCardsEl) statTotalStarCardsEl.textContent = `${totalStarCards}枚`;
  if (statPlayedDecksCountEl) statPlayedDecksCountEl.textContent = `${playedDecksCount}`;
  if (statMasteredDecksCountEl) statMasteredDecksCountEl.textContent = `${masteredDecksCount}`;
}

function changeTodayCardsSortOrder(order) {
  todayCardsSortOrder = order;
  renderTodayStudiedList();
}

function getCardLevelInfo(card) {
  if (!card) return { level: 0, score: 0, color: '#9ca3af' };
  let level = 1, score = 0;
  const val = card.interval || 0, reps = card.reps || 0, dueDate = card.dueDate || 0;

  if (val === 0 && reps === 0 && dueDate === 0) {
    level = 0;
    score = 0;
  } else if (val >= 30) {
    level = '★';
    score = 1.0;
  } else if (val >= 21) {
    level = 10;
    score = 0.9;
  } else if (val >= 14) {
    level = 9;
    score = 0.85;
  } else if (val >= 10) {
    level = 8;
    score = 0.75;
  } else if (val >= 7) {
    level = 7;
    score = 0.65;
  } else if (val >= 5) {
    level = 6;
    score = 0.55;
  } else if (val >= 3) {
    level = 5;
    score = 0.45;
  } else if (val >= 2) {
    level = 4;
    score = 0.35;
  } else if (val >= 1) {
    level = 3;
    score = 0.25;
  } else if (val >= 0.5) {
    level = 2;
    score = 0.15;
  } else {
    level = 1;
    score = 0.1; // 初回学習（もう一度でも）でスコアが反映される
  }

  let bg = '#9ca3af';
  if (level === '★') bg = '#8b5cf6';
  else if (level !== 0) bg = `hsl(217, 90%, ${Math.max(25, 75 - Number(level) * 5)}%)`;

  return { level, score, color: bg };
}

function renderTodayStudiedList() {
  const container = document.getElementById('today-studied-list');
  if (!container) return;
  container.innerHTML = '';

  const rangeSelect = document.getElementById('stats-range-select');
  const deckSelect = document.getElementById('stats-deck-select');
  const range = rangeSelect ? rangeSelect.value : 'TODAY';
  const targetDeckTitle = deckSelect ? deckSelect.value : 'ALL_DECKS';

  let studiedCards = [];
  const allCardsMap = {};
  decks.forEach((deck) => {
    (deck.cards || []).forEach((c) => {
      allCardsMap[c.id] = c;
    });
  });

  if (range === 'TODAY') {
    const todayStr = getFormattedDate(new Date());
    const todayData = dailyStudyHistory[todayStr];
    if (todayData) {
      studiedCards = Object.keys(todayData).map((cardId) => ({ id: cardId, ...todayData[cardId] }));
    }
  } else {
    const merged = {};
    Object.keys(dailyStudyHistory).forEach((dateKey) => {
      const dayData = dailyStudyHistory[dateKey];
      if (dayData) {
        Object.keys(dayData).forEach((cardId) => {
          const item = dayData[cardId];
          if (!merged[cardId]) {
            merged[cardId] = {
              id: cardId,
              card: { question: item.card.question, answer: item.card.answer },
              deckTitle: item.deckTitle,
              againCount: 0,
              totalCount: 0,
              lastStudiedTime: 0
            };
          }
          merged[cardId].againCount += item.againCount || 0;
          merged[cardId].totalCount += item.totalCount || 0;
          if (item.lastStudiedTime > merged[cardId].lastStudiedTime) {
            merged[cardId].lastStudiedTime = item.lastStudiedTime;
            if (item.deckTitle) merged[cardId].deckTitle = item.deckTitle;
          }
        });
      }
    });
    studiedCards = Object.values(merged);
  }

  if (targetDeckTitle !== 'ALL_DECKS') {
    studiedCards = studiedCards.filter((item) => item.deckTitle === targetDeckTitle);
  }

  if (studiedCards.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:15px; color:var(--text-sub); font-size:0.85em;">該当する学習カードはありません。</div>`;
    return;
  }

  if (todayCardsSortOrder === 'AGAIN') {
    studiedCards.sort((a, b) => (b.againCount || 0) - (a.againCount || 0));
  } else {
    studiedCards.sort((a, b) => (b.lastStudiedTime || 0) - (a.lastStudiedTime || 0));
  }

  studiedCards.forEach((item) => {
    const realCard = allCardsMap[item.id];
    let levelBadgeHtml = '';
    if (realCard && userConfig.enableCardLevel) {
      const lvInfo = getCardLevelInfo(realCard);
      levelBadgeHtml = `<div style="background-color: ${lvInfo.color}; color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.9em; font-weight: bold;">Lv.${lvInfo.level}</div>`;
    }

    const itemEl = document.createElement('div');
    itemEl.className = 'card-item';
    itemEl.innerHTML = `
      <div class="card-item-info">
        <div class="card-item-deck-title">from ${item.deckTitle ? item.deckTitle : '不明なデッキ'}</div>
        <div class="card-item-q">Q. ${item.card.question}</div>
        <div class="card-item-a">A. ${item.card.answer}</div>
      </div>
      <div style="font-size:0.8em; font-weight:bold; color: var(--text-sub); flex-shrink:0; display:flex; flex-direction:column; align-items:flex-end; gap:4px; min-width: 70px;">
        ${levelBadgeHtml}
        <div style="margin-top: 4px;">総学習: ${item.totalCount || 1}回</div>
        <div style="color: ${item.againCount > 0 ? '#ef4444' : 'var(--text-sub)'};">「もう一度」: ${item.againCount}回</div>
      </div>
    `;
    container.appendChild(itemEl);
  });
}

/* =====================================================================
 * 10. ゲーミフィケーション＆称号システム
 * ===================================================================== */

function getExpRequiredForLevel(lv) {
  return Math.round(100 * Math.pow(lv, 1.4));
}

function getRankTitle(lv) {
  if (lv >= 100) return '神話級記憶マスター';
  if (lv >= 80) return '記憶の超越者';
  if (lv >= 60) return '大賢者';
  if (lv >= 40) return '博識の巨匠';
  if (lv >= 25) return '記憶の達人';
  if (lv >= 15) return '熟練の記憶士';
  if (lv >= 8) return '気鋭の探求者';
  if (lv >= 4) return '見習い記憶士';
  return '初級暗記者';
}

function updateUserLevelFromExp() {
  let lv = 1,
    accumulated = 0;
  while (true) {
    const req = getExpRequiredForLevel(lv);
    if (userExp >= accumulated + req) {
      accumulated += req;
      lv++;
    } else break;
  }
  userLevel = lv;
  return {
    level: userLevel,
    currentExpInLevel: userExp - accumulated,
    nextLevelReq: getExpRequiredForLevel(userLevel)
  };
}

function addExpForRating(rating) {
  let gain = 10;
  if (rating === 'again') gain = 5;
  else if (rating === 'hard') gain = 10;
  else if (rating === 'good') gain = 20;
  else if (rating === 'easy') gain = 30;

  userExp += gain;
  saveGamificationData();
  const oldLv = userLevel;
  updateUserLevelFromExp();
  if (userLevel > oldLv && userLevel >= 10) {
    triggerAchievement('level_10');
  }
}

function triggerAchievement(achievementId) {
  if (!userAchievements[achievementId]) {
    userAchievements[achievementId] = Date.now();
    saveGamificationData();
    const ach = ACHIEVEMENTS_PRESET.find((a) => a.id === achievementId);
    if (ach) {
      pendingAchievementAlerts.push(ach);
      const menuEl = document.getElementById('menu-screen');
      if (menuEl && !menuEl.classList.contains('hidden')) {
        showNextAchievementPopup();
      }
    }
  }
}

function showNextAchievementPopup() {
  if (pendingAchievementAlerts.length === 0) return;
  const ach = pendingAchievementAlerts[0];
  const modal = document.getElementById('achievement-modal');
  const nameEl = document.getElementById('achievement-unlocked-name');
  const descEl = document.getElementById('achievement-unlocked-desc');

  if (modal && nameEl && descEl) {
    nameEl.textContent = `${ach.icon} ${ach.name}`;
    descEl.textContent = ach.desc;
    modal.classList.remove('hidden');
  }
}

function closeAchievementModal(goToStats = false) {
  const modal = document.getElementById('achievement-modal');
  if (modal) modal.classList.add('hidden');
  if (pendingAchievementAlerts.length > 0) pendingAchievementAlerts.shift();

  if (goToStats) {
    showStats();
    switchStatsTab('achievements');
  } else if (pendingAchievementAlerts.length > 0) {
    setTimeout(() => showNextAchievementPopup(), 300);
  }
}

function checkPendingAchievementPopup() {
  if (userConfig.enableGamification && pendingAchievementAlerts.length > 0) {
    showNextAchievementPopup();
  }
}

function checkRetroactiveAchievements() {
  if (!userConfig.enableGamification) return;
  let totalStudied = 0;
  Object.values(studyLogs).forEach((cnt) => {
    totalStudied += cnt || 0;
  });

  let totalStars = 0;
  decks.forEach((d) => {
    (d.cards || []).forEach((c) => {
      if (c.interval >= 30) totalStars++;
    });
  });

  let totalSeconds = 0;
  Object.values(studyTimes).forEach((sec) => {
    totalSeconds += sec || 0;
  });
  const streak = calculateStreak();

  if (totalStudied >= 1) triggerAchievement('first_step');
  if (totalStudied >= 10) triggerAchievement('cards_10');
  if (totalStudied >= 50) triggerAchievement('cards_50');
  if (totalStudied >= 100) triggerAchievement('cards_100');
  if (totalStudied >= 500) triggerAchievement('cards_500');
  if (totalStudied >= 1000) triggerAchievement('cards_1000');
  if (totalStudied >= 5000) triggerAchievement('cards_5000');
  if (totalStudied >= 10000) triggerAchievement('cards_10000');
  if (totalStudied >= 100000) triggerAchievement('cards_100000');
  if (totalStudied >= 1000000) triggerAchievement('cards_1000000');

  if (totalStars >= 1) triggerAchievement('first_star');
  if (totalStars >= 10) triggerAchievement('stars_10');
  if (totalStars >= 50) triggerAchievement('stars_50');
  if (totalStars >= 100) triggerAchievement('stars_100');
  if (totalStars >= 500) triggerAchievement('stars_500');

  if (streak >= 2) triggerAchievement('streak_2');
  if (streak >= 3) triggerAchievement('streak_3');
  if (streak >= 7) triggerAchievement('streak_7');
  if (streak >= 14) triggerAchievement('streak_14');
  if (streak >= 30) triggerAchievement('streak_30');
  if (streak >= 100) triggerAchievement('streak_100');

  if (totalSeconds >= 1800) triggerAchievement('time_30m');
  if (totalSeconds >= 18000) triggerAchievement('time_5h');
  if (totalSeconds >= 72000) triggerAchievement('time_20h');

  if (userLevel >= 10) triggerAchievement('level_10');
}

function checkCardStudyAchievements() {
  let totalStudied = 0;
  Object.values(studyLogs).forEach((cnt) => {
    totalStudied += cnt || 0;
  });

  if (totalStudied >= 1) triggerAchievement('first_step');
  if (totalStudied >= 10) triggerAchievement('cards_10');
  if (totalStudied >= 50) triggerAchievement('cards_50');
  if (totalStudied >= 100) triggerAchievement('cards_100');
  if (totalStudied >= 500) triggerAchievement('cards_500');
  if (totalStudied >= 1000) triggerAchievement('cards_1000');
  if (totalStudied >= 5000) triggerAchievement('cards_5000');
  if (totalStudied >= 10000) triggerAchievement('cards_10000');
  if (totalStudied >= 100000) triggerAchievement('cards_100000');
  if (totalStudied >= 1000000) triggerAchievement('cards_1000000');

  const hour = new Date().getHours();
  if (hour >= 7 && hour < 9) triggerAchievement('morning_quiz');
  if (hour >= 12 && hour < 13) triggerAchievement('lunch_quiz');
  if (hour >= 21 && hour <= 23) triggerAchievement('night_quiz');

  let totalStars = 0;
  decks.forEach((d) => {
    (d.cards || []).forEach((c) => {
      if (c.interval >= 30) totalStars++;
    });
  });
  if (totalStars >= 1) triggerAchievement('first_star');
  if (totalStars >= 10) triggerAchievement('stars_10');
  if (totalStars >= 50) triggerAchievement('stars_50');
  if (totalStars >= 100) triggerAchievement('stars_100');
  if (totalStars >= 500) triggerAchievement('stars_500');

  checkDailyGoalAchievements();
}

function checkTimeAchievements() {
  let totalSeconds = 0;
  Object.values(studyTimes).forEach((sec) => {
    totalSeconds += sec || 0;
  });
  if (totalSeconds >= 1800) triggerAchievement('time_30m');
  if (totalSeconds >= 18000) triggerAchievement('time_5h');
  if (totalSeconds >= 72000) triggerAchievement('time_20h');
  checkDailyGoalAchievements();
}

function checkDailyGoalAchievements() {
  const todayStr = getFormattedDate(new Date());
  const todayCards = studyLogs[todayStr] || 0;
  const todayMins = Math.floor((studyTimes[todayStr] || 0) / 60);

  const goalCards = userConfig.dailyGoalCards || 0;
  const goalMins = userConfig.dailyGoalMinutes || 0;

  let achieved = false;
  if (goalCards > 0 && goalMins > 0) {
    if (todayCards >= goalCards && todayMins >= goalMins) achieved = true;
  } else if (goalCards > 0) {
    if (todayCards >= goalCards) achieved = true;
  } else if (goalMins > 0) {
    if (todayMins >= goalMins) achieved = true;
  }

  if (achieved) triggerAchievement('daily_goal_done');
}

function renderAchievementsTab() {
  const lvInfo = updateUserLevelFromExp();
  const lvEl = document.getElementById('user-level');
  const rankEl = document.getElementById('user-rank-title');
  const curExpEl = document.getElementById('user-current-exp');
  const nextExpEl = document.getElementById('user-next-exp');
  const expBar = document.getElementById('exp-progress-bar');
  const totalExpEl = document.getElementById('total-accumulated-exp');
  const totalCardsEl = document.getElementById('total-cards-all-time');

  if (lvEl) lvEl.textContent = lvInfo.level;
  if (rankEl) rankEl.textContent = `(${getRankTitle(lvInfo.level)})`;
  if (curExpEl) curExpEl.textContent = lvInfo.currentExpInLevel;
  if (nextExpEl) nextExpEl.textContent = lvInfo.nextLevelReq;
  if (expBar) {
    const pct = Math.min(100, Math.round((lvInfo.currentExpInLevel / lvInfo.nextLevelReq) * 100));
    expBar.style.width = `${pct}%`;
  }
  if (totalExpEl) totalExpEl.textContent = userExp.toLocaleString();

  let totalStudied = 0;
  Object.values(studyLogs).forEach((cnt) => {
    totalStudied += cnt || 0;
  });
  if (totalCardsEl) totalCardsEl.textContent = totalStudied.toLocaleString();

  renderDailyGoalProgress();
  renderAchievementsGrid();
}

function renderDailyGoalProgress() {
  const todayStr = getFormattedDate(new Date());
  const todayCards = studyLogs[todayStr] || 0;
  const todayMins = Math.floor((studyTimes[todayStr] || 0) / 60);

  const goalCards = userConfig.dailyGoalCards || 0;
  const goalMins = userConfig.dailyGoalMinutes || 0;

  const cardItem = document.getElementById('goal-card-count-item');
  const timeItem = document.getElementById('goal-time-item');

  if (cardItem) {
    if (goalCards > 0) {
      cardItem.style.display = 'block';
      document.getElementById('goal-card-current').textContent = todayCards;
      document.getElementById('goal-card-target').textContent = goalCards;
      const pct = Math.min(100, Math.round((todayCards / goalCards) * 100));
      document.getElementById('goal-card-percent').textContent = `${pct}%`;
      document.getElementById('goal-card-progress-bar').style.width = `${pct}%`;
    } else {
      cardItem.style.display = 'none';
    }
  }

  if (timeItem) {
    if (goalMins > 0) {
      timeItem.style.display = 'block';
      document.getElementById('goal-time-current').textContent = todayMins;
      document.getElementById('goal-time-target').textContent = goalMins;
      const pct = Math.min(100, Math.round((todayMins / goalMins) * 100));
      document.getElementById('goal-time-percent').textContent = `${pct}%`;
      document.getElementById('goal-time-progress-bar').style.width = `${pct}%`;
    } else {
      timeItem.style.display = 'none';
    }
  }
}

function renderAchievementsGrid() {
  const grid = document.getElementById('achievements-grid');
  const countEl = document.getElementById('unlocked-achievements-count');
  if (!grid) return;
  grid.innerHTML = '';

  let unlockedCount = 0;
  ACHIEVEMENTS_PRESET.forEach((ach) => {
    const isUnlocked = !!userAchievements[ach.id];
    if (isUnlocked) unlockedCount++;

    const card = document.createElement('div');
    card.style.cssText = `
      background: ${isUnlocked ? 'var(--bg-color)' : 'rgba(0,0,0,0.04)'};
      border: 1px solid ${isUnlocked ? 'var(--accent-color)' : 'var(--card-border)'};
      border-radius: 8px; padding: 8px; display: flex; flex-direction: column; gap: 3px;
      opacity: ${isUnlocked ? '1' : '0.45'}; box-shadow: ${isUnlocked ? '0 1px 4px var(--shadow)' : 'none'};
    `;
    card.innerHTML = `
      <div style="display: flex; align-items: center; gap: 6px;">
        <span style="font-size: 1.4em; filter: ${isUnlocked ? 'none' : 'grayscale(100%)'};">${ach.icon}</span>
        <span style="font-weight: bold; font-size: 0.85em; color: ${isUnlocked ? 'var(--header-text)' : 'var(--text-sub)'}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          ${ach.name}
        </span>
      </div>
      <div style="font-size: 0.72em; color: var(--text-sub); line-height: 1.3;">${ach.desc}</div>
      ${isUnlocked ? `<div style="font-size: 0.68em; color: #10b981; font-weight: bold; margin-top: auto;">✓ 獲得済み</div>` : `<div style="font-size: 0.68em; color: var(--text-sub); margin-top: auto;">🔒 未獲得</div>`}
    `;
    grid.appendChild(card);
  });

  if (countEl) countEl.textContent = unlockedCount;
}

function openGoalSettingModal() {
  const inputCards = document.getElementById('goal-input-cards');
  const inputMins = document.getElementById('goal-input-minutes');
  if (inputCards) inputCards.value = userConfig.dailyGoalCards || 0;
  if (inputMins) inputMins.value = userConfig.dailyGoalMinutes || 0;
  if (goalSettingModal) goalSettingModal.classList.remove('hidden');
}

function closeGoalSettingModal() {
  if (goalSettingModal) goalSettingModal.classList.add('hidden');
}

function submitGoalSetting() {
  const inputCards = document.getElementById('goal-input-cards');
  const inputMins = document.getElementById('goal-input-minutes');
  if (!inputCards || !inputMins) return;

  userConfig.dailyGoalCards = Math.max(0, parseInt(inputCards.value, 10) || 0);
  userConfig.dailyGoalMinutes = Math.max(0, parseInt(inputMins.value, 10) || 0);
  saveConfig();
  closeGoalSettingModal();
  renderDailyGoalProgress();
  alert('今日の目標を更新しました！');
}

/* =====================================================================
 * 11. 設定ハンドラ
 * ===================================================================== */

function changeTheme(theme) {
  userConfig.theme = theme;
  saveConfig();
  applyConfigUI();
}

function updateFontSizePreview(size) {
  tempFontSize = parseInt(size, 10);
  if (fontSizeValueDisplay) fontSizeValueDisplay.textContent = tempFontSize;
  document.documentElement.style.setProperty('--preview-font-size', `${tempFontSize}px`);
}

function applyAndSaveFontSize() {
  userConfig.fontSize = tempFontSize;
  saveConfig();
  applyConfigUI();
  alert('文字サイズの設定をアプリ全体に保存・反映しました。');
}

function changeMode(mode) {
  userConfig.mode = mode;
  saveConfig();
  applyConfigUI();
  if (mode === 'FAST') startPreviewTyping();
}

function changeDeckSortOrder(order) {
  userConfig.deckSortOrder = order;
  saveConfig();
  applyConfigUI();
}

function updateCharSpeed(speed) {
  userConfig.charSpeed = parseInt(speed, 10);
  if (speedValueDisplay) speedValueDisplay.textContent = userConfig.charSpeed;
  saveConfig();
  startPreviewTyping();
}

function toggleLongPressOption(enabled) {
  userConfig.enableLongPress = enabled;
  saveConfig();
  applyConfigUI();
}

function updateHoldSpeedQ(val) {
  userConfig.holdSpeedQ = parseFloat(val);
  const disp = document.getElementById('hold-speed-q-display');
  if (disp) disp.textContent = userConfig.holdSpeedQ.toFixed(1);
  saveConfig();
}

function updateHoldSpeedA(val) {
  userConfig.holdSpeedA = parseFloat(val);
  const disp = document.getElementById('hold-speed-a-display');
  if (disp) disp.textContent = userConfig.holdSpeedA.toFixed(1);
  saveConfig();
}

function toggleCardLevelOption(enabled) {
  userConfig.enableCardLevel = enabled;
  saveConfig();
}

function toggleReviewResultOption(enabled) {
  userConfig.enableReviewResult = enabled;
  saveConfig();
  applyConfigUI();
}

function updateReviewInterval(val) {
  let num = parseInt(val, 10);
  if (isNaN(num) || num < 1) num = 50;
  userConfig.reviewInterval = num;
  saveConfig();
}

function toggleGamificationOption(enabled) {
  userConfig.enableGamification = enabled;
  saveConfig();
  applyConfigUI();
  if (enabled) checkRetroactiveAchievements();
}

function toggleTextSelectionOption(enabled) {
  userConfig.enableTextSelection = enabled;
  saveConfig();
}

function toggleEnableTagsOption(enabled) {
  userConfig.enableTags = enabled;
  saveConfig();
  applyConfigUI();
}

function startPreviewTyping() {
  clearInterval(previewTimer);
  if (!previewTextContainer) return;
  previewTextContainer.textContent = '';
  let pIndex = 0;
  const chars = [...SAMPLE_PREVIEW_TEXT];
  previewTimer = setInterval(() => {
    if (pIndex < chars.length) {
      previewTextContainer.textContent += chars[pIndex];
      pIndex++;
    } else clearInterval(previewTimer);
  }, userConfig.charSpeed);
}

function resetOptHoldPreview() {
  const qTextContainer = document.getElementById('hold-preview-q-text-container');
  const aTextContainer = document.getElementById('hold-preview-a-text-container');
  clearTimeout(optHoldTimerQ);
  clearInterval(optHoldIntervalQ);
  isOptHoldingQ = false;
  clearTimeout(optHoldTimerA);
  clearInterval(optHoldIntervalA);
  isOptHoldingA = false;
  if (qTextContainer) {
    qTextContainer.textContent = SAMPLE_PREVIEW_Q_PREFIX;
    optHoldCharIndexQ = 0;
  }
  if (aTextContainer) {
    aTextContainer.innerHTML = '';
    optHoldCharIndexA = 0;
  }
}

function setupOptionPreviewEventListeners() {
  const qTouchArea = document.getElementById('hold-preview-q-touch-area');
  const qTextContainer = document.getElementById('hold-preview-q-text-container');
  if (qTouchArea && qTextContainer) {
    const qChars = [...SAMPLE_PREVIEW_TEXT].slice(SAMPLE_PREVIEW_Q_PREFIX.length);
    const startOptHoldQ = () => {
      if (userConfig.mode === 'NORMAL' || !userConfig.enableLongPress) return;
      isOptHoldingQ = true;
      clearTimeout(optHoldTimerQ);
      clearInterval(optHoldIntervalQ);
      if (optHoldCharIndexQ >= qChars.length) {
        qTextContainer.textContent = SAMPLE_PREVIEW_Q_PREFIX;
        optHoldCharIndexQ = 0;
      }
      const holdMsQ = (userConfig.holdSpeedQ || 0.2) * 1000;
      optHoldTimerQ = setTimeout(() => {
        optHoldIntervalQ = setInterval(() => {
          if (optHoldCharIndexQ < qChars.length) {
            qTextContainer.textContent += qChars[optHoldCharIndexQ];
            optHoldCharIndexQ++;
          } else clearInterval(optHoldIntervalQ);
        }, holdMsQ);
      }, 200);
    };
    const endOptHoldQ = () => {
      isOptHoldingQ = false;
      clearTimeout(optHoldTimerQ);
      clearInterval(optHoldIntervalQ);
    };
    qTouchArea.addEventListener('mousedown', startOptHoldQ);
    qTouchArea.addEventListener('mouseup', endOptHoldQ);
    qTouchArea.addEventListener('mouseleave', endOptHoldQ);
    qTouchArea.addEventListener('touchstart', startOptHoldQ, { passive: true });
    qTouchArea.addEventListener('touchend', endOptHoldQ);
    qTouchArea.addEventListener('touchcancel', endOptHoldQ);
    qTouchArea.addEventListener(
      'touchmove',
      () => {
        endOptHoldQ();
      },
      { passive: true }
    );
  }

  const aTouchArea = document.getElementById('hold-preview-a-touch-area');
  const aTextContainer = document.getElementById('hold-preview-a-text-container');
  if (aTouchArea && aTextContainer) {
    const aChars = [...'富士山'];
    const startOptHoldA = () => {
      if (!userConfig.enableLongPress) return;
      isOptHoldingA = true;
      clearTimeout(optHoldTimerA);
      clearInterval(optHoldIntervalA);
      aTextContainer.innerHTML =
        '<span style="color: #10b981; font-weight: bold; font-size: 1.15em;">正解：<span id="opt-hold-ans-text"></span></span>';
      optHoldCharIndexA = 0;
      const holdMsA = (userConfig.holdSpeedA || 1.0) * 1000;
      optHoldTimerA = setTimeout(() => {
        optHoldIntervalA = setInterval(() => {
          if (optHoldCharIndexA < aChars.length) {
            const ansSpan = document.getElementById('opt-hold-ans-text');
            if (ansSpan) ansSpan.textContent += aChars[optHoldCharIndexA];
            optHoldCharIndexA++;
          } else clearInterval(optHoldIntervalA);
        }, holdMsA);
      }, 200);
    };
    const endOptHoldA = () => {
      isOptHoldingA = false;
      clearTimeout(optHoldTimerA);
      clearInterval(optHoldIntervalA);
      if (aTextContainer) {
        aTextContainer.innerHTML = '';
        optHoldCharIndexA = 0;
      }
    };
    aTouchArea.addEventListener('mousedown', startOptHoldA);
    aTouchArea.addEventListener('mouseup', endOptHoldA);
    aTouchArea.addEventListener('mouseleave', endOptHoldA);
    aTouchArea.addEventListener('touchstart', startOptHoldA, { passive: true });
    aTouchArea.addEventListener('touchend', endOptHoldA);
    aTouchArea.addEventListener('touchcancel', endOptHoldA);
    aTouchArea.addEventListener(
      'touchmove',
      () => {
        endOptHoldA();
      },
      { passive: true }
    );
  }
}

function resetAllSettingsSafe() {
  if (
    confirm('【確認 1/2】\nすべての設定項目を初期状態に戻しますか？\n※デッキや学習記録などのデータは消去されません。')
  ) {
    if (confirm('【確認 2/2・最終確認】\n本当に設定を初期化してもよろしいですか？\nこの操作は取り消せません。')) {
      userConfig = { ...DEFAULT_USER_CONFIG, keyBinds: JSON.parse(JSON.stringify(DEFAULT_KEY_BINDS)) };
      tempFontSize = userConfig.fontSize;
      saveConfig();
      applyConfigUI();
      if (
        document.getElementById('opt-learning-screen') &&
        !document.getElementById('opt-learning-screen').classList.contains('hidden')
      ) {
        if (userConfig.mode === 'FAST') startPreviewTyping();
        resetOptHoldPreview();
      }
      alert('設定を初期状態にリセットしました。');
    }
  }
}

async function factoryResetAllDataSafe() {
  if (confirm('【警告 1/3】\n端末内のすべてのデータを完全に消去し、初回インストール時の状態に戻しますか？')) {
    if (
      confirm(
        '【警告 2/3】\n作成したすべてのデッキ、カード、学習時間、学習記録、設定が完全に消去されます。\n本当に実行してもよろしいですか？'
      )
    ) {
      if (confirm('【警告 3/3・最終確認】\nこの操作は取り消せません。\n本当にすべてのデータを完全に消去しますか？')) {
        try {
          await idbClear();
          localStorage.clear();
          await idbSet('memoly_decks', JSON.parse(JSON.stringify(defaultDecks)));
          await idbSet('memoly_config', { ...DEFAULT_USER_CONFIG });
          alert('初期状態にリセットしました。アプリを再起動します。');
          window.location.reload();
        } catch (e) {
          alert('初期化中にエラーが発生しました: ' + e.message);
        }
      }
    }
  }
}

function updateKeyBindButtons() {
  const kb = userConfig.keyBinds || DEFAULT_KEY_BINDS;
  const setBtn = (id, keys) => {
    const el = document.getElementById(id);
    if (el && keys) el.textContent = Array.isArray(keys) ? keys.join(' / ') : String(keys);
  };
  setBtn('key-bind-advance', kb.advance);
  setBtn('key-bind-again', kb.again);
  setBtn('key-bind-hard', kb.hard);
  setBtn('key-bind-good', kb.good);
  setBtn('key-bind-easy', kb.easy);

  const setEvalBtnKey = (id, keys) => {
    const el = document.getElementById(id);
    if (el && keys) el.textContent = Array.isArray(keys) ? keys[0] || '' : String(keys);
  };
  setEvalBtnKey('btn-key-again', kb.again);
  setEvalBtnKey('btn-key-hard', kb.hard);
  setEvalBtnKey('btn-key-good', kb.good);
  setEvalBtnKey('btn-key-easy', kb.easy);
}

function startKeyBinding(action) {
  bindingKeyTarget = action;
  const el = document.getElementById(`key-bind-${action}`);
  if (el) el.textContent = 'キーを押してください...';
  if (document.activeElement) document.activeElement.blur();
}

function resetKeyBinds() {
  userConfig.keyBinds = JSON.parse(JSON.stringify(DEFAULT_KEY_BINDS));
  saveConfig();
  updateKeyBindButtons();
  alert('キー割り当てをデフォルトに戻しました。');
}

/* =====================================================================
 * 12. メインメニュー画面 & デッキ管理 & タグ管理機能
 * ===================================================================== */

function getTagColor(tagName) {
  if (userConfig.tagColors && userConfig.tagColors[tagName]) {
    return userConfig.tagColors[tagName];
  }
  return '#2563eb';
}

function setTagFilter(tag) {
  selectedTagFilter = tag;
  renderMenu();
}

function renderTagFilterBar() {
  if (!tagFilterBarEl) return;
  tagFilterBarEl.innerHTML = '';

  if (!userConfig.enableTags) {
    tagFilterBarEl.style.display = 'none';
    selectedTagFilter = 'ALL';
    return;
  }

  const tagCounts = {};
  decks.forEach((deck) => {
    (deck.tags || []).forEach((t) => {
      const trimmed = t.trim();
      if (trimmed) {
        tagCounts[trimmed] = (tagCounts[trimmed] || 0) + 1;
      }
    });
  });

  const uniqueTags = Object.keys(tagCounts).sort();

  if (uniqueTags.length === 0) {
    tagFilterBarEl.style.display = 'none';
    selectedTagFilter = 'ALL';
    return;
  }
  tagFilterBarEl.style.display = 'flex';

  if (selectedTagFilter !== 'ALL' && !uniqueTags.includes(selectedTagFilter)) {
    selectedTagFilter = 'ALL';
  }

  const allBtn = document.createElement('button');
  allBtn.type = 'button';
  allBtn.className = `tag-btn ${selectedTagFilter === 'ALL' ? 'active' : ''}`;
  allBtn.textContent = `すべて (${decks.length})`;
  allBtn.onclick = () => setTagFilter('ALL');
  tagFilterBarEl.appendChild(allBtn);

  uniqueTags.forEach((tag) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    const isActive = selectedTagFilter === tag;
    btn.className = `tag-btn ${isActive ? 'active' : ''}`;
    const color = getTagColor(tag);

    if (!isActive) {
      btn.style.borderColor = color;
      btn.style.color = color;
    } else {
      btn.style.backgroundColor = color;
      btn.style.borderColor = color;
    }

    btn.innerHTML = `<span class="tag-color-dot" style="background-color: ${color};"></span>${tag} (${tagCounts[tag]})`;
    btn.onclick = () => setTagFilter(tag);
    tagFilterBarEl.appendChild(btn);
  });
}

function renderMenu() {
  if (!deckListEl) return;
  renderTagFilterBar();
  deckListEl.innerHTML = '';
  const now = Date.now();

  if (!decks || decks.length === 0) {
    deckListEl.innerHTML = `<div class="empty-deck-notice"><p>まだデッキがありません。<br>「＋作成」や「📥CSV」からデッキを追加して学習を始めましょう！</p></div>`;
    return;
  }

  let sortedDecks = [...decks];
  if (userConfig.deckSortOrder === 'RECENT') {
    sortedDecks.sort((a, b) => (b.lastStudied || 0) - (a.lastStudied || 0));
  }

  if (userConfig.enableTags && selectedTagFilter !== 'ALL') {
    sortedDecks = sortedDecks.filter((d) => Array.isArray(d.tags) && d.tags.includes(selectedTagFilter));
  }

  if (sortedDecks.length === 0) {
    deckListEl.innerHTML = `<div class="empty-deck-notice"><p>タグ「${selectedTagFilter}」が付いたデッキはありません。</p></div>`;
    return;
  }

  sortedDecks.forEach((deck) => {
    const activeCards = (deck.cards || []).filter((c) => !c.isHidden);
    let totalScore = 0;
    activeCards.forEach((c) => {
      totalScore += getCardLevelInfo(c).score;
    });
    const retentionRate = activeCards.length > 0 ? ((totalScore / activeCards.length) * 100).toFixed(2) : '0.00';

    const dueCount = activeCards.filter((c) => {
      if (deck.excludeStar && c.interval >= 30) return false;
      return !c.dueDate || c.dueDate <= now;
    }).length;

    let orderModeText = 'シャッフル';
    if (deck.orderMode === 'ORDER') orderModeText = '順番順';
    if (deck.orderMode === 'WEAK') orderModeText = '苦手特化';

    let tagsHtml = '';
    if (userConfig.enableTags && Array.isArray(deck.tags) && deck.tags.length > 0) {
      tagsHtml = deck.tags
        .map((t) => {
          const color = getTagColor(t);
          return `<span class="deck-tag-badge" style="border-color: ${color}; color: ${color};">${t}</span>`;
        })
        .join(' ');
    }

    const cardEl = document.createElement('div');
    cardEl.className = 'deck-card';
    cardEl.innerHTML = `
      <div class="deck-header-row">
        <span class="deck-title">${deck.title}</span>
        <span class="deck-retention">定着率: ${retentionRate}%</span>
      </div>
      <div class="deck-count">総カード: ${(deck.cards || []).length}枚 / 出題対象: ${dueCount}枚</div>
      <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px; align-items: center;">
        <span class="deck-mode-badge" style="margin-bottom:0;">出題順: ${orderModeText}</span>
        ${deck.excludeStar ? `<span class="deck-mode-badge" style="margin-bottom:0; color:#8b5cf6; border-color:#8b5cf6;">★除外中</span>` : ''}
        ${tagsHtml}
      </div>
      <div class="deck-manage-btns">
        <button type="button" class="btn-small" onclick="openDeckSettingsModal('${deck.id}')">⚙ デッキ設定</button>
        <button type="button" class="btn-small" onclick="openCardListModal('${deck.id}')">カード確認・編集</button>
        <button type="button" class="btn-small" onclick="openAddCardModal('${deck.id}')">カード追加</button>
        <button type="button" class="btn-small" onclick="renameDeck('${deck.id}')">名前変更</button>
        <button type="button" class="btn-small" onclick="resetDeckProgress('${deck.id}')">進捗リセット</button>
        <button type="button" class="btn-small btn-small-danger" onclick="deleteDeck('${deck.id}')">デッキ削除</button>
      </div>
      <button type="button" class="btn-start" onclick="startQuiz('${deck.id}')">学習を開始</button>
    `;
    deckListEl.appendChild(cardEl);
  });
}

/* --- デッキ設定内のタグチェックボックス管理 --- */
let currentEditingDeckTags = [];

function getAllExistingTags() {
  const tagSet = new Set();
  decks.forEach((d) => {
    (d.tags || []).forEach((t) => {
      const trimmed = t.trim();
      if (trimmed) tagSet.add(trimmed);
    });
  });
  if (userConfig.tagColors) {
    Object.keys(userConfig.tagColors).forEach((t) => {
      const trimmed = t.trim();
      if (trimmed) tagSet.add(trimmed);
    });
  }
  return Array.from(tagSet).sort();
}

function renderDeckTagsCheckboxList(deck) {
  if (!deckTagsCheckboxContainer) return;
  deckTagsCheckboxContainer.innerHTML = '';

  if (deck) {
    currentEditingDeckTags = [...(deck.tags || [])];
  }

  const allTags = getAllExistingTags();

  if (allTags.length === 0) {
    deckTagsCheckboxContainer.innerHTML =
      '<span style="font-size: 0.85em; color: var(--text-sub);">登録されているタグがありません。「＋ 新規タグを作成」から追加してください。</span>';
    return;
  }

  allTags.forEach((tag) => {
    const isChecked = currentEditingDeckTags.includes(tag);
    const color = getTagColor(tag);

    const label = document.createElement('label');
    label.className = `tag-checkbox-label ${isChecked ? 'checked' : ''}`;

    if (isChecked) {
      label.style.backgroundColor = color;
      label.style.borderColor = color;
      label.style.color = '#ffffff';
    } else {
      label.style.backgroundColor = 'var(--bg-color)';
      label.style.borderColor = 'var(--card-border)';
      label.style.color = 'var(--text-main)';
    }

    label.innerHTML = `
      <input type="checkbox" value="${tag}" ${isChecked ? 'checked' : ''} onchange="toggleDeckTagSelection(this, '${tag}')">
      <span class="tag-color-dot" style="background-color: ${isChecked ? '#ffffff' : color};"></span>${tag}
    `;
    deckTagsCheckboxContainer.appendChild(label);
  });
}

function toggleDeckTagSelection(checkboxElem, tag) {
  if (checkboxElem.checked) {
    if (!currentEditingDeckTags.includes(tag)) {
      currentEditingDeckTags.push(tag);
    }
  } else {
    currentEditingDeckTags = currentEditingDeckTags.filter((t) => t !== tag);
  }
  renderDeckTagsCheckboxList();
}

function openDeckSettingsModal(deckId) {
  targetDeckForSettings = deckId;
  const deck = decks.find((d) => d.id === deckId);
  if (!deck) return;
  if (deckSettingsTitle) deckSettingsTitle.textContent = `デッキ: ${deck.title}`;

  if (deckTagsSettingRow) {
    deckTagsSettingRow.style.display = userConfig.enableTags ? 'block' : 'none';
  }

  renderDeckTagsCheckboxList(deck);

  const currentMode = deck.orderMode || 'SHUFFLE';
  const radio = document.querySelector(`input[name="deck-order-option"][value="${currentMode}"]`);
  if (radio) radio.checked = true;

  const cbExclude = document.getElementById('deck-exclude-star-option');
  if (cbExclude) cbExclude.checked = !!deck.excludeStar;

  if (deckSettingsModal) deckSettingsModal.classList.remove('hidden');
}

function closeDeckSettingsModal() {
  if (deckSettingsModal) deckSettingsModal.classList.add('hidden');
  targetDeckForSettings = null;
}

function submitDeckSettings() {
  if (!targetDeckForSettings) return;
  const deck = decks.find((d) => d.id === targetDeckForSettings);
  if (!deck) return;

  if (deckTagsSettingRow && userConfig.enableTags) {
    deck.tags = [...currentEditingDeckTags];
  }

  const selectedRadio = document.querySelector('input[name="deck-order-option"]:checked');
  if (selectedRadio) deck.orderMode = selectedRadio.value;

  const cbExclude = document.getElementById('deck-exclude-star-option');
  if (cbExclude) deck.excludeStar = cbExclude.checked;

  saveDecks();
  renderMenu();
  closeDeckSettingsModal();
}

/* --- 新規タグ作成モーダル制御 --- */
function openNewTagModal() {
  if (newTagNameInput) newTagNameInput.value = '';
  if (newTagColorInput) newTagColorInput.value = '#2563eb';
  if (newTagModal) newTagModal.classList.remove('hidden');
  if (newTagNameInput) {
    setTimeout(() => newTagNameInput.focus(), 50);
  }
}

function closeNewTagModal() {
  if (newTagModal) newTagModal.classList.add('hidden');
}

function submitNewTag() {
  if (!newTagNameInput || !newTagColorInput) return;
  const tagName = newTagNameInput.value.trim();
  const tagColor = newTagColorInput.value;

  if (!tagName) {
    alert('タグ名を入力してください。');
    return;
  }

  if (!userConfig.tagColors) userConfig.tagColors = {};
  userConfig.tagColors[tagName] = tagColor;
  saveConfig();

  if (!currentEditingDeckTags.includes(tagName)) {
    currentEditingDeckTags.push(tagName);
  }

  renderDeckTagsCheckboxList();

  const tagManagerModalEl = document.getElementById('tag-manager-modal');
  if (tagManagerModalEl && !tagManagerModalEl.classList.contains('hidden')) {
    renderTagManagerList();
  }

  closeNewTagModal();
}

/* --- タグ色・名前マネージャーモーダル制御 --- */
function openTagManagerModal() {
  renderTagManagerList();
  if (tagManagerModal) tagManagerModal.classList.remove('hidden');
}

function closeTagManagerModal() {
  if (tagManagerModal) tagManagerModal.classList.add('hidden');
  renderMenu();
}

function renderTagManagerList() {
  const container = document.getElementById('tag-manager-list');
  if (!container) return;
  container.innerHTML = '';

  const allTags = getAllExistingTags();
  if (allTags.length === 0) {
    container.innerHTML =
      '<div style="text-align:center; padding:15px; color:var(--text-sub); font-size:0.85em;">現在登録されているタグはありません。</div>';
    return;
  }

  allTags.forEach((tag) => {
    const color = getTagColor(tag);
    const row = document.createElement('div');
    row.className = 'tag-manager-row';
    row.innerHTML = `
      <div class="tag-manager-left">
        <input type="color" class="tag-color-input" value="${color}" onchange="updateTagColor('${tag}', this.value)">
        <span style="font-weight:bold; font-size:0.9em; color:var(--text-main);">${tag}</span>
      </div>
      <div style="display: flex; gap: 4px;">
        <button type="button" class="btn-small" onclick="renameTagPrompt('${tag}')">名前変更</button>
        <button type="button" class="btn-small btn-small-danger" onclick="deleteTagUniversal('${tag}')">タグ解除</button>
      </div>
    `;
    container.appendChild(row);
  });
}

function updateTagColor(tag, newColor) {
  if (!userConfig.tagColors) userConfig.tagColors = {};
  userConfig.tagColors[tag] = newColor;
  saveConfig();
}

function renameTagPrompt(oldTag) {
  const newTag = prompt(`タグ「${oldTag}」の新しい名前を入力してください:`, oldTag);
  if (!newTag || !newTag.trim() || newTag.trim() === oldTag) return;
  const cleaned = newTag.trim();

  decks.forEach((d) => {
    if (Array.isArray(d.tags)) {
      d.tags = d.tags.map((t) => (t === oldTag ? cleaned : t));
    }
  });

  if (userConfig.tagColors && userConfig.tagColors[oldTag]) {
    userConfig.tagColors[cleaned] = userConfig.tagColors[oldTag];
    delete userConfig.tagColors[oldTag];
    saveConfig();
  }

  saveDecks();
  renderTagManagerList();
}

function deleteTagUniversal(targetTag) {
  if (!confirm(`すべてのデッキからタグ「${targetTag}」を解除しますか？`)) return;

  decks.forEach((d) => {
    if (Array.isArray(d.tags)) {
      d.tags = d.tags.filter((t) => t !== targetTag);
    }
  });

  if (userConfig.tagColors && userConfig.tagColors[targetTag]) {
    delete userConfig.tagColors[targetTag];
    saveConfig();
  }

  saveDecks();
  renderTagManagerList();
}

function showNewDeckModal() {
  const title = prompt('新しいデッキ名を入力してください:');
  if (title && title.trim()) {
    const cleanedTitle = title.trim();
    if (checkDeckNameDuplicate(cleanedTitle)) {
      decks.push({
        id: 'deck-' + Date.now(),
        title: cleanedTitle,
        tags: [],
        orderMode: 'SHUFFLE',
        excludeStar: false,
        lastStudied: Date.now(),
        cards: []
      });
      saveDecks();
      renderMenu();
      if (userConfig.enableGamification) triggerAchievement('first_deck');
    }
  }
}

function renameDeck(deckId) {
  const deck = decks.find((d) => d.id === deckId);
  if (!deck) return;
  const newTitle = prompt('新しいデッキ名を入力してください:', deck.title);
  if (newTitle && newTitle.trim()) {
    const cleanedTitle = newTitle.trim();
    if (checkDeckNameDuplicate(cleanedTitle, deckId)) {
      deck.title = cleanedTitle;
      saveDecks();
      renderMenu();
    }
  }
}

function resetDeckProgress(deckId) {
  const deck = decks.find((d) => d.id === deckId);
  if (!deck) return;
  if (
    confirm(
      `デッキ「${deck.title}」の学習進捗をリセットしてもよろしいですか？\n（問題と答えのデータは消去されず、すべて未学習状態に戻ります）`
    )
  ) {
    (deck.cards || []).forEach((card) => {
      card.dueDate = 0;
      card.interval = 0;
      card.easeFactor = 2.5;
      card.reps = 0;
      card.againStreak = 0; // 進捗リセット時にagainStreakも確実にリセット
    });
    saveDecks();
    renderMenu();
    alert(`デッキ「${deck.title}」の学習進捗をリセットしました。`);
  }
}

function deleteDeck(deckId) {
  const index = decks.findIndex((d) => d.id === deckId);
  if (index === -1) return;
  const deck = decks[index];
  if (confirm(`デッキ「${deck.title}」をごみ箱へ移動しますか？`)) {
    trashDecks.push({ originalIndex: index, deck: deck });
    decks.splice(index, 1);
    saveDecks();
    saveTrashDecks();
    renderMenu();
  }
}

function openTrashModal() {
  renderTrashList();
  if (trashModal) trashModal.classList.remove('hidden');
}
function closeTrashModal() {
  if (trashModal) trashModal.classList.add('hidden');
}

function renderTrashList() {
  if (!trashListContainer) return;
  trashListContainer.innerHTML = '';
  const clearAllBtn = document.getElementById('trash-clear-all-btn');
  if (trashDecks.length === 0) {
    trashListContainer.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-sub);">ごみ箱は空です。</div>`;
    if (clearAllBtn) clearAllBtn.style.display = 'none';
    return;
  }
  if (clearAllBtn) clearAllBtn.style.display = 'inline-block';

  trashDecks.forEach((item, index) => {
    const trashEl = document.createElement('div');
    trashEl.className = 'trash-item';
    trashEl.innerHTML = `
      <div class="trash-item-info">
        <span class="trash-item-title">${item.deck.title}</span>
        <span class="trash-item-count">枚数: ${item.deck.cards ? item.deck.cards.length : 0}枚</span>
      </div>
      <div style="display:flex; gap:6px; flex-shrink:0;">
        <button type="button" class="btn-small" onclick="restoreDeckFromTrash(${index})">復活</button>
        <button type="button" class="btn-small btn-small-danger" onclick="permanentlyDeleteDeck(${index})">完全削除</button>
      </div>
    `;
    trashListContainer.appendChild(trashEl);
  });
}

function restoreDeckFromTrash(index) {
  if (index < 0 || index >= trashDecks.length) return;
  const item = trashDecks[index];
  if (confirm('このデッキを復旧させますか？')) {
    const originalIndex = item.originalIndex;
    if (originalIndex !== undefined && originalIndex >= 0 && originalIndex <= decks.length) {
      decks.splice(originalIndex, 0, item.deck);
    } else {
      decks.push(item.deck);
    }
    trashDecks.splice(index, 1);
    saveDecks();
    saveTrashDecks();
    renderTrashList();
    renderMenu();
  }
}

function permanentlyDeleteDeck(index) {
  if (index < 0 || index >= trashDecks.length) return;
  if (
    confirm('このデッキを完全に消してもよいですか？含まれるカードの学習記録も削除されます。この操作は取り消せません。')
  ) {
    const item = trashDecks[index];
    if (item.deck && item.deck.cards) {
      item.deck.cards.forEach((card) => removeCardFromHistory(card.id));
    }
    trashDecks.splice(index, 1);
    saveTrashDecks();
    renderTrashList();
  }
}

function clearAllTrash() {
  if (trashDecks.length === 0) return;
  if (
    confirm(
      'ごみ箱内のデッキをすべて完全削除しますか？含まれる全カードの学習記録も削除されます。この操作は取り消せません。'
    )
  ) {
    trashDecks.forEach((item) => {
      if (item.deck && item.deck.cards) {
        item.deck.cards.forEach((card) => removeCardFromHistory(card.id));
      }
    });
    trashDecks = [];
    saveTrashDecks();
    renderTrashList();
  }
}

/* =====================================================================
 * 13. カード個別編集・追加・リストモーダル & ' ' 消去機能
 * ===================================================================== */

function cleanTextSurroundingSpacesAndQuotes(str) {
  if (!str) return '';

  // 日本語（漢字、ひらがな、カタカナ、全角記号・句読点）の正規表現範囲
  const jp = '[\\u3040-\\u309F\\u30A0-\\u30FF\\u4E00-\\u9FFF\\u3000-\\u303F\\uFF00-\\uFFEF]';

  return str
    // 1. 文頭・文末の余分な空白を除去
    .trim()
    // 2. 日本語と日本語の間にある半角・全角スペースを除去 (例: "山 梨 県" → "山梨県", "日本　で" → "日本で")
    .replace(new RegExp(`(${jp})\\s+(${jp})`, 'g'), '$1$2')
    // 1文字おきにスペースが入っているケースに対応するため2回実行 (例: "日 本 の" の連続パターン)
    .replace(new RegExp(`(${jp})\\s+(${jp})`, 'g'), '$1$2')
    // 3. 連続する複数の半角スペースを1つに統合 (英単語などの間隔調整)
    .replace(/[ ]{2,}/g, ' ')
    // 4. 前後のクォーテーションや余分な空白を最終トリム
    .replace(/^["'“”‘’]+|["'“”‘’]+$/g, '')
    .trim();
}

function cleanCardEditQuotes() {
  if (editCardQ) editCardQ.value = cleanTextSurroundingSpacesAndQuotes(editCardQ.value);
  if (editCardA) editCardA.value = cleanTextSurroundingSpacesAndQuotes(editCardA.value);
  if (editCardExp) editCardExp.value = cleanTextSurroundingSpacesAndQuotes(editCardExp.value);
}

function cleanAddCardSpaces() {
  if (newCardQ) newCardQ.value = cleanTextSurroundingSpacesAndQuotes(newCardQ.value);
  if (newCardA) newCardA.value = cleanTextSurroundingSpacesAndQuotes(newCardA.value);
  if (newCardExp) newCardExp.value = cleanTextSurroundingSpacesAndQuotes(newCardExp.value);
}

function openAddCardModal(deckId) {
  targetDeckForAddCard = deckId;
  if (newCardQ) newCardQ.value = '';
  if (newCardA) newCardA.value = '';
  if (newCardExp) newCardExp.value = '';
  removeAddCardImage();
  if (addCardModal) addCardModal.classList.remove('hidden');
}

function closeAddCardModal() {
  if (addCardModal) addCardModal.classList.add('hidden');
  targetDeckForAddCard = null;
}

function submitAddCard() {
  const q = newCardQ ? cleanTextSurroundingSpacesAndQuotes(newCardQ.value) : '';
  const a = newCardA ? cleanTextSurroundingSpacesAndQuotes(newCardA.value) : '';
  const exp = newCardExp ? cleanTextSurroundingSpacesAndQuotes(newCardExp.value) : '';
  if (!q || !a) {
    alert('問題文と答えは必須です。');
    return;
  }

  const deck = decks.find((d) => d.id === targetDeckForAddCard);
  if (deck) {
    if (!Array.isArray(deck.cards)) deck.cards = [];
    deck.cards.push({
      id: `card-${Date.now()}`,
      question: q,
      answer: a,
      explanation: exp,
      image: currentAddingImageData,
      dueDate: 0,
      interval: 0,
      easeFactor: 2.5,
      reps: 0,
      againStreak: 0,
      isHidden: false
    });
    saveDecks();
    renderMenu();
    closeAddCardModal();
  }
}

function openEditModalForCard(card) {
  targetCardForEdit = card;
  if (editCardQ) editCardQ.value = card.question;
  if (editCardA) editCardA.value = card.answer;
  if (editCardExp) editCardExp.value = card.explanation || '';
  if (editCardImgInput) editCardImgInput.value = '';
  currentEditingImageData = card.image || '';

  if (currentEditingImageData && editCardImgElement && editCardImgPreview) {
    editCardImgElement.src = currentEditingImageData;
    editCardImgPreview.classList.remove('hidden');
  } else if (editCardImgElement && editCardImgPreview) {
    editCardImgElement.src = '';
    editCardImgPreview.classList.add('hidden');
  }
  if (editCardModal) editCardModal.classList.remove('hidden');
}

function openEditCardModal(cardId) {
  const deck = decks.find((d) => d.id === targetDeckForCardList);
  if (!deck) return;
  const card = (deck.cards || []).find((c) => c.id === cardId);
  if (!card) return;
  openEditModalForCard(card);
}

function openEditCurrentQuizCard(event) {
  if (event) event.stopPropagation();
  if (!currentCard) return;
  openEditModalForCard(currentCard);
}

function closeEditCardModal() {
  if (editCardModal) editCardModal.classList.add('hidden');
  targetCardForEdit = null;
  currentEditingImageData = '';
}

function submitEditCard() {
  if (!targetCardForEdit) return;
  const q = editCardQ ? cleanTextSurroundingSpacesAndQuotes(editCardQ.value) : '';
  const a = editCardA ? cleanTextSurroundingSpacesAndQuotes(editCardA.value) : '';
  const exp = editCardExp ? cleanTextSurroundingSpacesAndQuotes(editCardExp.value) : '';
  if (!q || !a) {
    alert('問題文と答えは必須です。');
    return;
  }

  targetCardForEdit.question = q;
  targetCardForEdit.answer = a;
  targetCardForEdit.explanation = exp;
  targetCardForEdit.image = currentEditingImageData;
  saveDecks();

  if (currentCard && currentCard.id === targetCardForEdit.id) {
    if (questionEl) questionEl.textContent = targetCardForEdit.question;
    if (answerTextEl) answerTextEl.textContent = targetCardForEdit.answer;
    if (explanationTextEl) explanationTextEl.textContent = targetCardForEdit.explanation;
    if (searchTermTextEl) searchTermTextEl.textContent = targetCardForEdit.answer;

    if (targetCardForEdit.image && answerImageEl && answerImageContainer) {
      answerImageEl.src = targetCardForEdit.image;
      answerImageContainer.classList.remove('hidden');
    } else if (answerImageEl && answerImageContainer) {
      answerImageEl.src = '';
      answerImageContainer.classList.add('hidden');
    }
  }
  if (targetDeckForCardList) renderCardList();
  renderMenu();
  closeEditCardModal();
}

function openCardListModal(deckId) {
  targetDeckForCardList = deckId;
  cardListPageIndex = 0;
  const deck = decks.find((d) => d.id === deckId);
  if (!deck) return;
  if (cardListDeckTitle) cardListDeckTitle.textContent = `カード一覧: ${deck.title}`;
  renderCardList();
  if (cardListModal) cardListModal.classList.remove('hidden');
}

function closeCardListModal() {
  if (cardListModal) cardListModal.classList.add('hidden');
  targetDeckForCardList = null;
}

function changeCardListPage(direction) {
  const deck = decks.find((d) => d.id === targetDeckForCardList);
  if (!deck) return;
  const totalCards = (deck.cards || []).length;
  const totalPages = Math.ceil(totalCards / CARDS_PER_PAGE) || 1;
  cardListPageIndex += direction;
  if (cardListPageIndex < 0) cardListPageIndex = 0;
  if (cardListPageIndex >= totalPages) cardListPageIndex = totalPages - 1;
  renderCardList();
}

function renderCardList() {
  const deck = decks.find((d) => d.id === targetDeckForCardList);
  if (!deck || !cardListContainer) return;
  cardListContainer.innerHTML = '';
  const cards = deck.cards || [];
  if (cards.length === 0) {
    cardListContainer.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-sub);">カードがありません。</div>`;
    if (cardPaginationEl) cardPaginationEl.innerHTML = '';
    return;
  }
  const totalPages = Math.ceil(cards.length / CARDS_PER_PAGE);
  if (cardListPageIndex >= totalPages) cardListPageIndex = totalPages - 1;
  const startIdx = cardListPageIndex * CARDS_PER_PAGE;
  const pageCards = cards.slice(startIdx, startIdx + CARDS_PER_PAGE);

  pageCards.forEach((card, idx) => {
    const absoluteIndex = startIdx + idx + 1;
    let levelBadgeHtml = '';
    if (userConfig.enableCardLevel) {
      const lvInfo = getCardLevelInfo(card);
      levelBadgeHtml = `<div style="background-color: ${lvInfo.color}; color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.85em; font-weight: bold;">Lv.${lvInfo.level}</div>`;
    }

    const cardEl = document.createElement('div');
    cardEl.className = 'card-item';
    cardEl.innerHTML = `
      <div class="card-item-info">
        <div class="card-item-q">${absoluteIndex}. Q. ${card.question}</div>
        <div class="card-item-a">A. ${card.answer}</div>
        ${card.explanation ? `<div class="card-item-exp">解説: ${card.explanation}</div>` : ''}
        ${card.image ? `<div class="card-item-img-badge">📷 画像あり</div>` : ''}
        ${card.isHidden ? `<div style="font-size:0.75em; color:#ef4444; font-weight:bold;">※非表示中</div>` : ''}
      </div>
      <div style="display:flex; flex-direction:column; align-items:flex-end; gap:8px; flex-shrink:0;">
        ${levelBadgeHtml}
        <div style="display:flex; gap:4px; margin-top: auto;">
          <button type="button" class="btn-small" onclick="openEditCardModal('${card.id}')">編集</button>
          <button type="button" class="btn-small btn-small-danger" onclick="deleteCard('${card.id}')">削除</button>
        </div>
      </div>
    `;
    cardListContainer.appendChild(cardEl);
  });

  if (cardPaginationEl) {
    cardPaginationEl.innerHTML = `
      <button type="button" class="btn-small" ${cardListPageIndex === 0 ? 'disabled style="opacity:0.4; cursor:default;"' : ''} onclick="changeCardListPage(-1)">← 前の100件</button>
      <span>${cardListPageIndex + 1} / ${totalPages} ページ (${cards.length}枚中)</span>
      <button type="button" class="btn-small" ${cardListPageIndex >= totalPages - 1 ? 'disabled style="opacity:0.4; cursor:default;"' : ''} onclick="changeCardListPage(1)">次の100件 →</button>
    `;
  }
}

function deleteCard(cardId) {
  const deck = decks.find((d) => d.id === targetDeckForCardList);
  if (!deck) return;
  if (confirm('このカードを削除しますか？学習記録からも消去されます。')) {
    deck.cards = (deck.cards || []).filter((c) => c.id !== cardId);
    removeCardFromHistory(cardId);
    saveDecks();
    renderCardList();
    renderMenu();
  }
}

/* =====================================================================
 * 14. CSVパースおよびインポート
 * ===================================================================== */

function openCsvImportModal() {
  if (csvInput) csvInput.value = '';
  if (csvImportModal) csvImportModal.classList.remove('hidden');
}

function closeCsvImportModal() {
  if (csvImportModal) csvImportModal.classList.add('hidden');
}

function closeCsvConfirmModal() {
  if (csvConfirmModal) csvConfirmModal.classList.add('hidden');
  pendingCsvCards = [];
  if (csvInput) csvInput.value = '';
}

function submitCsvImport() {
  if (!pendingCsvCards || pendingCsvCards.length === 0) {
    alert('インポートするカードデータがありません。');
    closeCsvConfirmModal();
    return;
  }
  const titleInput = csvDeckNameInput ? csvDeckNameInput.value.trim() : '';
  if (!titleInput) {
    alert('デッキ名を入力してください。');
    return;
  }

  if (checkDeckNameDuplicate(titleInput)) {
    const newDeck = {
      id: 'deck-' + Date.now(),
      title: titleInput,
      tags: [],
      orderMode: 'SHUFFLE',
      excludeStar: false,
      lastStudied: Date.now(),
      cards: pendingCsvCards
    };
    decks.push(newDeck);
    saveDecks();
    renderMenu();
    closeCsvConfirmModal();
    alert(`デッキ「${newDeck.title}」を追加しました！（${newDeck.cards.length}枚）`);
    if (userConfig.enableGamification) triggerAchievement('first_deck');
  }
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') inQuotes = !inQuotes;
    else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else current += char;
  }
  result.push(current);
  return result;
}

function processCsvText(text, fileName = 'インポートデッキ') {
  const lines = text.split('\n');
  if (lines.length === 0) {
    alert('データが空です。');
    return;
  }

  const firstLineParts = parseCSVLine(lines[0]).map((p) => p.trim().toLowerCase());
  let qIdx = 0,
    aIdx = 1,
    expIdx = 2;
  let startIndex = 0;

  if (firstLineParts.includes('question') || firstLineParts.includes('question_plain')) {
    qIdx =
      firstLineParts.indexOf('question_plain') !== -1
        ? firstLineParts.indexOf('question_plain')
        : firstLineParts.indexOf('question');
    aIdx =
      firstLineParts.indexOf('answer_plain') !== -1
        ? firstLineParts.indexOf('answer_plain')
        : firstLineParts.indexOf('answer');
    expIdx =
      firstLineParts.indexOf('remark_plain') !== -1
        ? firstLineParts.indexOf('remark_plain')
        : firstLineParts.indexOf('remark');
    startIndex = 1;
  }

  const newCards = [];
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const parts = parseCSVLine(line).map((p) => p.trim());

    let q = cleanTextSurroundingSpacesAndQuotes(parts[qIdx] || '');
    let a = cleanTextSurroundingSpacesAndQuotes(parts[aIdx] || '');
    let exp = expIdx !== -1 ? cleanTextSurroundingSpacesAndQuotes(parts[expIdx] || '') : '';

    if (q && a) {
      newCards.push({
        id: `card-${Date.now()}-${i}`,
        question: q,
        answer: a,
        explanation: exp,
        image: '',
        dueDate: 0,
        interval: 0,
        easeFactor: 2.5,
        reps: 0,
        againStreak: 0,
        isHidden: false
      });
    }
  }

  if (newCards.length > 0) {
    pendingCsvCards = newCards;
    closeCsvImportModal();
    if (csvDeckNameInput) csvDeckNameInput.value = fileName.replace(/\.[^/.]+$/, '');
    if (csvConfirmCardCount) csvConfirmCardCount.textContent = `読み込み成功: ${newCards.length} 枚のカード`;
    if (csvConfirmModal) csvConfirmModal.classList.remove('hidden');
    if (csvDeckNameInput) csvDeckNameInput.focus();
  } else {
    alert('有効なカードデータが見つかりませんでした。');
    if (csvInput) csvInput.value = '';
  }
}

function setupDragAndDrop() {
  const dropZone = document.getElementById('drop-zone');
  if (!dropZone) return;

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((ev) =>
    dropZone.addEventListener(
      ev,
      (e) => {
        e.preventDefault();
        e.stopPropagation();
      },
      false
    )
  );
  ['dragenter', 'dragover'].forEach((ev) =>
    dropZone.addEventListener(ev, () => dropZone.classList.add('dragover'), false)
  );
  ['dragleave', 'drop'].forEach((ev) =>
    dropZone.addEventListener(ev, () => dropZone.classList.remove('dragover'), false)
  );

  dropZone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (!file.name.toLowerCase().endsWith('.csv')) {
        alert('CSVファイルのみ追加可能です。');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => processCsvText(event.target.result, file.name);
      reader.readAsText(file, 'UTF-8');
    }
  });
  dropZone.addEventListener('click', () => {
    if (csvInput) csvInput.click();
  });
}

/* =====================================================================
 * 15. クイズ学習ロジック & リザルト機能
 * ===================================================================== */

function getNumericLevelInfo(card) {
  if (!card) return 0;
  const val = card.interval || 0,
    reps = card.reps || 0,
    dueDate = card.dueDate || 0;
  if (val === 0 && reps === 0 && dueDate === 0) return 0;
  if (val >= 30) return 11;
  if (val >= 21) return 10;
  if (val >= 14) return 9;
  if (val >= 10) return 8;
  if (val >= 7) return 7;
  if (val >= 5) return 6;
  if (val >= 3) return 5;
  if (val >= 2) return 4;
  if (val >= 1) return 3;
  if (val >= 0.5) return 2;
  return 1;
}

function getIntervalForNumericLevel(level) {
  if (level <= 1) return 0.1;
  if (level === 2) return 0.5;
  if (level === 3) return 1;
  if (level === 4) return 2;
  if (level === 5) return 3;
  if (level === 6) return 5;
  if (level === 7) return 7;
  if (level === 8) return 10;
  if (level === 9) return 14;
  if (level === 10) return 21;
  return 30;
}

function calculateNextReview(card, rating) {
  const now = Date.now();
  const ONE_MINUTE = 60 * 1000,
    ONE_HOUR = 60 * ONE_MINUTE,
    ONE_DAY = 24 * ONE_HOUR;
  let nextInterval = card.interval,
    ease = card.easeFactor || 2.5,
    reps = card.reps || 0,
    nextDueDate = now;

  const currentLevel = getNumericLevelInfo(card);
  let nextLevel = currentLevel;

  if (card.againStreak === undefined) {
    card.againStreak = 0;
  }

  switch (rating) {
    case 'again':
      if (currentLevel === 0) {
        nextLevel = 1;
      } else {
        if (card.againStreak >= 1) {
          nextLevel = Math.max(1, currentLevel - 3);
        } else {
          nextLevel = Math.max(1, currentLevel - 2);
        }
      }
      card.againStreak += 1;
      reps = Math.max(1, reps);
      nextInterval = getIntervalForNumericLevel(nextLevel);
      nextDueDate = now + 1 * ONE_MINUTE;
      break;

    case 'hard':
      card.againStreak = 0;
      if (currentLevel === 0) {
        nextLevel = 1;
      } else {
        nextLevel = Math.max(1, currentLevel - 1);
      }
      reps = Math.max(1, reps);
      nextInterval = getIntervalForNumericLevel(nextLevel);
      nextDueDate = now + 12 * ONE_HOUR;
      ease = Math.max(1.3, ease - 0.15);
      break;

    case 'good':
      card.againStreak = 0;
      if (currentLevel === 0) {
        nextLevel = 3; // 初回Good: 1日後 (Lv.3)
      } else {
        nextLevel = Math.min(11, currentLevel + 1); // 確実に+1段階アップ（Hard後のペナルティを維持）
      }
      reps += 1;
      nextInterval = getIntervalForNumericLevel(nextLevel);
      nextDueDate = now + nextInterval * ONE_DAY;
      break;

    case 'easy':
      card.againStreak = 0;
      if (currentLevel === 0) {
        nextLevel = 4; // 初回Easy: 4日 (Lv.4)
        nextInterval = 4;
      } else if (currentLevel <= 4) {
        nextLevel = 8; // 2回目Easy: 10日 (Lv.8)
        nextInterval = 10;
      } else if (currentLevel <= 8) {
        nextLevel = 10; // 3回目Easy: 21日 (Lv.10)
        nextInterval = 21;
      } else {
        nextLevel = 11; // 4回目以降: 30日 (Lv.★)
        nextInterval = 30;
      }
      reps += 1;
      ease += 0.15;
      nextDueDate = now + nextInterval * ONE_DAY;
      break;
  }

  card.interval = nextInterval;
  card.easeFactor = ease;
  card.reps = Math.max(1, reps);
  card.dueDate = nextDueDate;
  saveDecks();
}

function renderCardLevelBadge(card) {
  const badge = document.getElementById('card-level-badge');
  if (!badge) return;
  if (!userConfig.enableCardLevel || !card) {
    badge.classList.add('hidden');
    return;
  }
  const lvInfo = getCardLevelInfo(card);
  badge.textContent = `暗記レベル ${lvInfo.level}`;
  badge.style.backgroundColor = lvInfo.color;
  badge.classList.remove('hidden');
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function sortStudyQueue(cards, mode) {
  const queue = [...cards];
  if (mode === 'SHUFFLE') return shuffleArray(queue);
  else if (mode === 'WEAK')
    return queue.sort((a, b) => {
      if (a.interval !== b.interval) return a.interval - b.interval;
      return a.reps - b.reps;
    });
  return queue;
}

function startQuiz(deckId) {
  currentDeck = decks.find((d) => d.id === deckId);
  if (!currentDeck || (currentDeck.cards || []).length === 0) {
    alert('このデッキにはまだカードがありません。カードを追加してください。');
    return;
  }
  currentDeck.lastStudied = Date.now();
  saveDecks();

  let activeCards = (currentDeck.cards || []).filter((c) => !c.isHidden);
  if (activeCards.length === 0) {
    alert('このデッキには出題可能なカードがありません。（すべて非表示になっています）');
    return;
  }

  let baseQueue = activeCards.filter((c) => {
    if (currentDeck.excludeStar && c.interval >= 30) return false;
    return !c.dueDate || c.dueDate <= Date.now();
  });

  if (baseQueue.length === 0) {
    if (confirm('今日の復習カードは完了しています！全カードを再練習しますか？')) {
      baseQueue = activeCards.filter((c) => !(currentDeck.excludeStar && c.interval >= 30));
      if (baseQueue.length === 0) {
        alert('除外設定により、出題可能なカードがありません。');
        return;
      }
    } else return;
  }

  studyQueue = sortStudyQueue(baseQueue, currentDeck.orderMode || 'SHUFFLE');
  undoStack = [];
  redoStack = [];

  sessionInitialCardLevels = {};
  sessionAnswerHistory = [];
  sessionStudiedCount = 0;

  if (currentDeckTitleEl) currentDeckTitleEl.textContent = currentDeck.title;
  hideAllScreens();
  if (quizScreen) quizScreen.classList.remove('hidden');

  startQuizStudyTimer();
  loadNextCard();
}

function loadNextCard() {
  clearTimeout(holdTimer);
  clearInterval(holdInterval);
  isHolding = false;
  didHold = false;
  holdPhase = 'NONE';

  const qContainer = document.querySelector('.question-container');
  if (qContainer) {
    qContainer.classList.remove('selectable-text');
  }

  if (studyQueue.length === 0) {
    stopQuizStudyTimer();
    if (userConfig.enableReviewResult && sessionAnswerHistory.length > 0) {
      showResultScreen(true);
    } else {
      alert('このセッションの学習がすべて完了しました！');
      showMenu();
    }
    return;
  }

  currentCard = studyQueue[0];
  if (currentCard && !sessionInitialCardLevels[currentCard.id]) {
    sessionInitialCardLevels[currentCard.id] = getCardLevelInfo(currentCard);
  }

  if (progressInfoEl) progressInfoEl.textContent = `残り: ${studyQueue.length}枚`;
  updateUndoRedoUI();
  renderCardLevelBadge(currentCard);

  if (questionEl) questionEl.textContent = '';
  if (answerTextEl) answerTextEl.textContent = currentCard.answer;
  if (explanationTextEl) explanationTextEl.textContent = currentCard.explanation;

  if (currentCard.image && answerImageEl && answerImageContainer) {
    answerImageEl.src = currentCard.image;
    answerImageContainer.classList.remove('hidden');
  } else if (answerImageEl && answerImageContainer) {
    answerImageEl.src = '';
    answerImageContainer.classList.add('hidden');
  }
  if (searchTermTextEl) searchTermTextEl.textContent = currentCard.answer;

  if (answerSectionEl) {
    answerSectionEl.classList.add('hidden');
    answerSectionEl.classList.remove('holding-only-answer');
  }
  if (resultStatsEl) resultStatsEl.classList.remove('hidden');
  if (buttonsEl) buttonsEl.classList.add('hidden');

  const longPressSuffix = userConfig.enableLongPress ? '（長押しで文字送り）' : '';

  if (userConfig.mode === 'FAST') {
    charIndex = 0;
    state = 'TYPING';
    if (tapHintEl) tapHintEl.textContent = '画面タップ または キー操作でストップ';
    startTime = Date.now();
    stopTime = 0;
    clearInterval(timer);

    const chars = [...currentCard.question];
    timer = setInterval(() => {
      if (charIndex < chars.length) {
        if (questionEl) questionEl.textContent += chars[charIndex];
        charIndex++;
      } else clearInterval(timer);
    }, userConfig.charSpeed);
  } else {
    charIndex = [...currentCard.question].length;
    if (questionEl) questionEl.textContent = currentCard.question;
    state = 'STOPPED';
    if (tapHintEl) tapHintEl.textContent = `画面タップ または キー操作で答えを表示${longPressSuffix}`;
  }
}

function searchOnGoogle(event) {
  if (event) event.stopPropagation();
  markUserActivity();
  if (!navigator.onLine) {
    alert('インターネット接続がありません。');
    return;
  }
  if (currentCard && currentCard.answer) {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(currentCard.answer)}`, '_blank');
  }
}

function hideCurrentCard(event) {
  if (event) event.stopPropagation();
  markUserActivity();
  if (!currentCard) return;

  if (confirm('このカードを今後の出題から除外（非表示）にしますか？\n※デッキ設定からいつでも再表示できます。')) {
    currentCard.isHidden = true;
    saveDecks();
    studyQueue.shift();
    loadNextCard();
  }
}

/* =====================================================================
 * 非表示カードの管理（全デッキ・個別デッキ両対応）
 * ===================================================================== */

let hiddenCardsContext = 'ALL';

function openAllHiddenCardsModal() {
  hiddenCardsContext = 'ALL';
  renderHiddenCardsList();
  if (hiddenCardsModal) hiddenCardsModal.classList.remove('hidden');
}

function openDeckHiddenCardsModal() {
  if (!targetDeckForSettings) return;
  hiddenCardsContext = 'DECK';
  renderHiddenCardsList();
  if (hiddenCardsModal) hiddenCardsModal.classList.remove('hidden');
}

function closeHiddenCardsModal() {
  if (hiddenCardsModal) hiddenCardsModal.classList.add('hidden');
}

function renderHiddenCardsList() {
  if (!hiddenCardsListContainer) return;
  hiddenCardsListContainer.innerHTML = '';

  const titleEl = document.getElementById('hidden-cards-modal-title');
  const restoreAllBtn = document.getElementById('restore-all-hidden-btn');

  let hiddenCards = [];

  if (hiddenCardsContext === 'DECK') {
    const deck = decks.find((d) => d.id === targetDeckForSettings);
    if (!deck) return;
    if (titleEl) titleEl.textContent = `👀 非表示カード (${deck.title})`;
    if (restoreAllBtn) restoreAllBtn.textContent = 'このデッキをすべて再表示';

    (deck.cards || []).forEach((card) => {
      if (card && card.isHidden === true) {
        hiddenCards.push({ deckId: deck.id, deckTitle: deck.title, card: card });
      }
    });
  } else {
    if (titleEl) titleEl.textContent = '👀 非表示カード一覧（すべてのデッキ）';
    if (restoreAllBtn) restoreAllBtn.textContent = 'すべてのカードを再表示';

    decks.forEach((deck) => {
      (deck.cards || []).forEach((card) => {
        if (card && card.isHidden === true) {
          hiddenCards.push({ deckId: deck.id, deckTitle: deck.title, card: card });
        }
      });
    });
  }

  if (hiddenCards.length === 0) {
    hiddenCardsListContainer.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-sub);">非表示のカードはありません。</div>`;
    if (restoreAllBtn) restoreAllBtn.style.display = 'none';
    return;
  }
  if (restoreAllBtn) restoreAllBtn.style.display = 'inline-block';

  hiddenCards.forEach((item) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'card-item';
    cardEl.innerHTML = `
      <div class="card-item-info">
        <div class="card-item-deck-title">from ${item.deckTitle}</div>
        <div class="card-item-q">${item.card.question}</div>
        <div class="card-item-a">${item.card.answer}</div>
      </div>
      <div style="display:flex; align-items: center; flex-shrink:0;">
        <button type="button" class="btn-small" onclick="restoreSingleHiddenCardUniversal('${item.deckId}', '${item.card.id}')">再表示する</button>
      </div>
    `;
    hiddenCardsListContainer.appendChild(cardEl);
  });
}

function restoreSingleHiddenCardUniversal(deckId, cardId) {
  const deck = decks.find((d) => d.id === deckId);
  if (deck) {
    const card = (deck.cards || []).find((c) => c.id === cardId);
    if (card) {
      card.isHidden = false;
      saveDecks();
      renderHiddenCardsList();
      renderMenu();
    }
  }
}

function restoreAllHiddenCardsUniversal() {
  if (hiddenCardsContext === 'DECK') {
    const deck = decks.find((d) => d.id === targetDeckForSettings);
    if (!deck) return;
    if (confirm(`デッキ「${deck.title}」のすべての非表示カードを再表示しますか？`)) {
      (deck.cards || []).forEach((c) => {
        c.isHidden = false;
      });
      saveDecks();
      renderHiddenCardsList();
      renderMenu();
      alert('このデッキの非表示カードをすべて再表示しました。');
    }
  } else {
    if (confirm('すべてのデッキに含まれる非表示カードを一括で再表示しますか？')) {
      let modified = false;
      decks.forEach((deck) => {
        (deck.cards || []).forEach((card) => {
          if (card && card.isHidden === true) {
            card.isHidden = false;
            modified = true;
          }
        });
      });
      if (modified) {
        saveDecks();
        renderHiddenCardsList();
        renderMenu();
        alert('すべての非表示カードを再表示しました。');
      }
    }
  }
}

function finishTypingUI() {
  if (!stopTime) stopTime = Date.now();
  const elapsedSeconds = ((stopTime - startTime) / 1000).toFixed(1);
  const totalLen = [...currentCard.question].length;
  const progressPercent = Math.round((charIndex / totalLen) * 100);

  if (statProgressEl) statProgressEl.textContent = `読み上げ率: ${progressPercent}%`;
  if (statTimeEl) statTimeEl.textContent = `タイム: ${elapsedSeconds}秒`;
  if (resultStatsEl) resultStatsEl.classList.remove('hidden');

  const longPressSuffix = userConfig.enableLongPress ? '（長押しで文字送り）' : '';
  if (tapHintEl) tapHintEl.textContent = `画面タップ または キー操作で答えを表示${longPressSuffix}`;
}

function advanceQuizState() {
  markUserActivity();
  if (!currentCard) return;

  if (userConfig.mode === 'FAST') {
    if (state === 'TYPING') {
      clearInterval(timer);
      finishTypingUI();
      state = 'STOPPED';
    } else if (state === 'STOPPED') {
      if (questionEl) questionEl.textContent = currentCard.question;
      charIndex = [...currentCard.question].length;
      state = 'ANSWERED';

      const qContainer = document.querySelector('.question-container');
      if (qContainer && userConfig.enableTextSelection) {
        qContainer.classList.add('selectable-text');
      }

      if (answerSectionEl) {
        answerSectionEl.classList.remove('hidden');
        answerSectionEl.classList.remove('holding-only-answer');
      }
      if (answerTextEl) answerTextEl.textContent = currentCard.answer;
      if (buttonsEl) buttonsEl.classList.remove('hidden');

      const selectionHint = userConfig.enableTextSelection ? '\n問題文を長押しでテキスト選択が可能です。' : '';
      if (tapHintEl) tapHintEl.textContent = '評価ボタンを押すか、対応キーで回答してください。' + selectionHint;
    }
  } else {
    if (state === 'STOPPED') {
      state = 'ANSWERED';

      const qContainer = document.querySelector('.question-container');
      if (qContainer && userConfig.enableTextSelection) {
        qContainer.classList.add('selectable-text');
      }

      if (answerSectionEl) {
        answerSectionEl.classList.remove('hidden');
        answerSectionEl.classList.remove('holding-only-answer');
      }
      if (answerTextEl) answerTextEl.textContent = currentCard.answer;
      if (buttonsEl) buttonsEl.classList.remove('hidden');

      const selectionHint = userConfig.enableTextSelection ? '\n問題文を長押しでテキスト選択が可能です。' : '';
      if (tapHintEl) tapHintEl.textContent = '評価ボタンを押すか、対応キーで回答してください。' + selectionHint;
    }
  }
}

function handleAnswer(rating) {
  markUserActivity();
  if (state !== 'ANSWERED' || !currentCard) return;

  // 大元のデッキ内のカード実体と参照同期を担保
  if (currentDeck && currentDeck.cards) {
    const realCard = currentDeck.cards.find((c) => c.id === currentCard.id);
    if (realCard && realCard !== currentCard) {
      Object.assign(realCard, currentCard);
      currentCard = realCard;
    }
  }

  const oldLevelInfo = sessionInitialCardLevels[currentCard.id] || getCardLevelInfo(currentCard);

  undoStack.push({
    queue: JSON.parse(JSON.stringify(studyQueue)),
    card: JSON.parse(JSON.stringify(currentCard)),
    studyLogs: JSON.parse(JSON.stringify(studyLogs)),
    dailyStudyHistory: JSON.parse(JSON.stringify(dailyStudyHistory)),
    deckInfo: JSON.parse(JSON.stringify(decks.find((d) => d.id === currentDeck.id))),
    sessionHistory: JSON.parse(JSON.stringify(sessionAnswerHistory)),
    sessionCount: sessionStudiedCount
  });
  redoStack = [];

  recordStudyLog(currentCard, rating);
  calculateNextReview(currentCard, rating);

  const newLevelInfo = getCardLevelInfo(currentCard);
  sessionAnswerHistory.push({
    card: JSON.parse(JSON.stringify(currentCard)),
    oldLevel: oldLevelInfo,
    newLevel: newLevelInfo,
    rating: rating
  });
  sessionStudiedCount++;

  studyQueue.shift();

  const interval = userConfig.reviewInterval || 50;
  if (userConfig.enableReviewResult && sessionStudiedCount > 0 && sessionStudiedCount % interval === 0) {
    showResultScreen(false);
  } else {
    loadNextCard();
  }
}

function handleQuizBackAction() {
  if (userConfig.enableReviewResult && sessionAnswerHistory.length > 0) {
    showResultScreen(true);
  } else {
    exitQuizToMenu();
  }
}

function showResultScreen(isFinalOrExit = false) {
  hideAllScreens();
  if (!resultScreen) return;
  resultScreen.classList.remove('hidden');

  const deck = currentDeck || (decks.length > 0 ? decks[0] : null);
  if (!deck) {
    showMenu();
    return;
  }

  const activeCards = (deck.cards || []).filter((c) => !c.isHidden);
  let totalScore = 0;
  activeCards.forEach((c) => {
    totalScore += getCardLevelInfo(c).score;
  });
  const retention = activeCards.length > 0 ? ((totalScore / activeCards.length) * 100).toFixed(2) : '0.00';

  const retEl = document.getElementById('result-deck-retention');
  const countEl = document.getElementById('result-session-card-count');
  const titleEl = document.getElementById('result-screen-title');
  const resumeBtn = document.getElementById('btn-resume-quiz');
  const exitBtn = document.getElementById('btn-exit-quiz');

  if (retEl) retEl.textContent = retention;
  if (countEl) countEl.textContent = sessionAnswerHistory.length;
  if (titleEl) titleEl.textContent = `学習リザルト (${deck.title})`;

  if (studyQueue.length === 0) {
    if (resumeBtn) {
      resumeBtn.textContent = '学習完了 (メニューに戻る)';
      resumeBtn.onclick = exitQuizToMenu;
      resumeBtn.classList.remove('hidden');
    }
    if (exitBtn) exitBtn.classList.add('hidden');
  } else {
    if (resumeBtn) {
      resumeBtn.textContent = '学習に戻る (次のセッションへ)';
      resumeBtn.onclick = resumeNextStudySession;
      resumeBtn.classList.remove('hidden');
    }
    if (exitBtn) exitBtn.classList.remove('hidden');
  }

  renderResultCardList();
}

function renderResultCardList() {
  const container = document.getElementById('result-card-list-container');
  if (!container) return;
  container.innerHTML = '';

  if (sessionAnswerHistory.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:15px; color:var(--text-sub);">今回のセッションで解いたカードはありません。</div>`;
    return;
  }

  const ratingStyles = {
    again: { bg: 'var(--result-again-bg)', border: '#ef4444', text: '#ef4444', label: 'もう一度' },
    hard: { bg: 'var(--result-hard-bg)', border: '#f97316', text: '#f97316', label: '難しい' },
    good: { bg: 'var(--result-good-bg)', border: '#3b82f6', text: '#3b82f6', label: 'ふつう' },
    easy: { bg: 'var(--result-easy-bg)', border: '#10b981', text: '#10b981', label: '簡単' }
  };

  sessionAnswerHistory.forEach((item, idx) => {
    const style = ratingStyles[item.rating] || ratingStyles.good;
    const oldLv = item.oldLevel ? item.oldLevel.level : 1;
    const newLv = item.newLevel ? item.newLevel.level : 1;

    const row = document.createElement('div');
    row.className = 'card-item';
    row.style.background = style.bg;
    row.style.borderColor = style.border;

    row.innerHTML = `
      <div class="card-item-info">
        <div class="card-item-q">${idx + 1}. Q. ${item.card.question}</div>
        <div class="card-item-a">A. ${item.card.answer}</div>
        <div style="font-size:0.75em; color: ${style.text}; font-weight:bold; margin-top:2px;">評価: 【${style.label}】</div>
      </div>
      <div style="display:flex; flex-direction:column; align-items:flex-end; gap:4px; flex-shrink:0;">
        <div style="font-size:0.85em; font-weight:bold; color:var(--header-text);">
          Lv.${oldLv} <span style="color:var(--accent-color); font-weight:bold;">&gt;&gt;&gt;</span> <span style="color:#10b981;">Lv.${newLv}</span>
        </div>
      </div>
    `;
    container.appendChild(row);
  });
}

function resumeNextStudySession() {
  if (studyQueue.length === 0) {
    exitQuizToMenu();
    return;
  }
  sessionAnswerHistory = [];
  sessionInitialCardLevels = {};
  hideAllScreens();
  if (quizScreen) quizScreen.classList.remove('hidden');
  startQuizStudyTimer();
  loadNextCard();
}

function exitQuizToMenu() {
  stopQuizStudyTimer();
  sessionAnswerHistory = [];
  sessionInitialCardLevels = {};
  sessionStudiedCount = 0;
  showMenu();
}

/* =====================================================================
 * Undo / Redo（参照切れバグを完全解決）
 * ===================================================================== */

function undoLastAnswer(event) {
  if (event) event.stopPropagation();
  markUserActivity();
  if (undoStack.length === 0) return;

  redoStack.push({
    queue: JSON.parse(JSON.stringify(studyQueue)),
    card: JSON.parse(JSON.stringify(currentCard)),
    studyLogs: JSON.parse(JSON.stringify(studyLogs)),
    dailyStudyHistory: JSON.parse(JSON.stringify(dailyStudyHistory)),
    deckInfo: JSON.parse(JSON.stringify(decks.find((d) => d.id === currentDeck.id))),
    sessionHistory: JSON.parse(JSON.stringify(sessionAnswerHistory)),
    sessionCount: sessionStudiedCount
  });

  const previousState = undoStack.pop();
  studyLogs = previousState.studyLogs;
  dailyStudyHistory = previousState.dailyStudyHistory;
  sessionAnswerHistory = previousState.sessionHistory || [];
  sessionStudiedCount = previousState.sessionCount || 0;

  const deckIdx = decks.findIndex((d) => d.id === currentDeck.id);
  if (deckIdx !== -1 && previousState.deckInfo) {
    decks[deckIdx] = previousState.deckInfo;
    currentDeck = decks[deckIdx];
  }

  // 大元のデッキ内のカード実体と参照を再接続（参照切れによるLv.0固定化を防止）
  if (currentDeck && currentDeck.cards) {
    currentCard = currentDeck.cards.find((c) => c.id === previousState.card.id) || previousState.card;
    studyQueue = previousState.queue.map((qc) => currentDeck.cards.find((c) => c.id === qc.id) || qc);
  } else {
    studyQueue = previousState.queue;
    currentCard = previousState.card;
  }

  saveDecks();
  saveLogs();
  saveDailyHistory();
  loadNextCard();
}

function redoLastAnswer(event) {
  if (event) event.stopPropagation();
  markUserActivity();
  if (redoStack.length === 0) return;

  undoStack.push({
    queue: JSON.parse(JSON.stringify(studyQueue)),
    card: JSON.parse(JSON.stringify(currentCard)),
    studyLogs: JSON.parse(JSON.stringify(studyLogs)),
    dailyStudyHistory: JSON.parse(JSON.stringify(dailyStudyHistory)),
    deckInfo: JSON.parse(JSON.stringify(decks.find((d) => d.id === currentDeck.id))),
    sessionHistory: JSON.parse(JSON.stringify(sessionAnswerHistory)),
    sessionCount: sessionStudiedCount
  });

  const nextState = redoStack.pop();
  studyLogs = nextState.studyLogs;
  dailyStudyHistory = nextState.dailyStudyHistory;
  sessionAnswerHistory = nextState.sessionHistory || [];
  sessionStudiedCount = nextState.sessionCount || 0;

  const deckIdx = decks.findIndex((d) => d.id === currentDeck.id);
  if (deckIdx !== -1 && nextState.deckInfo) {
    decks[deckIdx] = nextState.deckInfo;
    currentDeck = decks[deckIdx];
  }

  // 大元のデッキ内のカード実体と参照を再接続
  if (currentDeck && currentDeck.cards) {
    currentCard = currentDeck.cards.find((c) => c.id === nextState.card.id) || nextState.card;
    studyQueue = nextState.queue.map((qc) => currentDeck.cards.find((c) => c.id === qc.id) || qc);
  } else {
    studyQueue = nextState.queue;
    currentCard = nextState.card;
  }

  saveDecks();
  saveLogs();
  saveDailyHistory();
  loadNextCard();
}

function updateUndoRedoUI() {
  if (undoBtn) undoBtn.disabled = undoStack.length === 0;
  if (redoBtn) redoBtn.disabled = redoStack.length === 0;
}

/* =====================================================================
 * 16. 長押しジェスチャー制御
 * ===================================================================== */

function startHoldAction() {
  markUserActivity();
  if (!userConfig.enableLongPress || !currentCard) return;
  if (state === 'ANSWERED') return;

  didHold = false;
  holdPhase = 'NONE';
  clearTimeout(holdTimer);
  clearInterval(holdInterval);

  holdTimer = setTimeout(() => {
    isHolding = true;
    didHold = true;
    const qArr = [...currentCard.question];

    if (userConfig.mode === 'FAST' && charIndex < qArr.length) {
      holdPhase = 'QUESTION';
      if (state === 'TYPING') {
        clearInterval(timer);
        finishTypingUI();
        state = 'STOPPED';
      }
      const holdMsQ = (userConfig.holdSpeedQ || 0.2) * 1000;
      holdInterval = setInterval(() => {
        if (charIndex < qArr.length) {
          if (questionEl) questionEl.textContent += qArr[charIndex];
          charIndex++;
        } else {
          clearInterval(holdInterval);
          finishTypingUI();
        }
      }, holdMsQ);
    } else if (state === 'STOPPED') {
      holdPhase = 'ANSWER';
      if (answerSectionEl) {
        answerSectionEl.classList.remove('holding-only-answer');
        answerSectionEl.classList.remove('hidden');
        answerSectionEl.classList.add('holding-only-answer');
      }
      if (answerTextEl) answerTextEl.textContent = '';
      aCharIndex = 0;
      const holdMsA = (userConfig.holdSpeedA || 1.0) * 1000;
      const ansArr = [...currentCard.answer];
      holdInterval = setInterval(() => {
        if (aCharIndex < ansArr.length) {
          if (answerTextEl) answerTextEl.textContent += ansArr[aCharIndex];
          aCharIndex++;
        } else clearInterval(holdInterval);
      }, holdMsA);
    }
  }, 200);
}

function endHoldAction() {
  markUserActivity();
  clearTimeout(holdTimer);
  clearInterval(holdInterval);

  if (isHolding) {
    isHolding = false;
    lastHoldEndTime = Date.now();
    if (holdPhase === 'QUESTION') finishTypingUI();
    if (holdPhase === 'ANSWER' || state === 'STOPPED') {
      if (answerSectionEl && state !== 'ANSWERED') {
        answerSectionEl.classList.remove('holding-only-answer');
        answerSectionEl.classList.add('hidden');
      }
      if (answerTextEl && state !== 'ANSWERED') answerTextEl.textContent = '';
    }
    holdPhase = 'NONE';
  }
}

/* =====================================================================
 * 17. グローバルイベントリスナー
 * ===================================================================== */

function setupEventListeners() {
  const quizCardEl = document.getElementById('quiz-card');

  if (quizCardEl) {
    quizCardEl.addEventListener('contextmenu', (e) => {
      if (e.target.closest('.selectable-text') || e.target.closest('input') || e.target.closest('textarea')) return;
      e.preventDefault();
    });

    quizCardEl.addEventListener('selectstart', (e) => {
      if (e.target.closest('.selectable-text') || e.target.closest('input') || e.target.closest('textarea')) return;
      e.preventDefault();
    });

    document.addEventListener('selectionchange', () => {
      if (isHolding) {
        const sel = window.getSelection();
        if (sel) sel.removeAllRanges();
      }
    });

    quizCardEl.addEventListener('mousedown', (e) => {
      if (isTouchDevice) return;
      if (e.target.closest('button') || e.target.closest('a')) return;
      if (state === 'ANSWERED' && e.target.closest('.selectable-text')) return;
      startHoldAction();
    });

    quizCardEl.addEventListener('mouseup', (e) => {
      if (isTouchDevice) return;
      if (e.target.closest('button') || e.target.closest('a')) return;
      if (state === 'ANSWERED' && e.target.closest('.selectable-text')) return;
      const wasHolding = didHold;
      endHoldAction();
      if (!wasHolding && Date.now() - lastHoldEndTime > 300) {
        advanceQuizState();
      }
    });

    quizCardEl.addEventListener('mouseleave', () => {
      if (isTouchDevice) return;
      endHoldAction();
    });

    quizCardEl.addEventListener(
      'touchstart',
      (e) => {
        isTouchDevice = true;
        isScrolling = false;
        if (e.target.closest('button') || e.target.closest('a')) return;
        if (state === 'ANSWERED' && e.target.closest('.selectable-text')) return;

        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;

        const sel = window.getSelection();
        if (sel) sel.removeAllRanges();

        startHoldAction();
      },
      { passive: true }
    );

    quizCardEl.addEventListener(
      'touchmove',
      (e) => {
        if (isHolding) return;
        if (holdTimer) {
          const touch = e.touches[0];
          if (Math.abs(touch.clientX - touchStartX) > 40 || Math.abs(touch.clientY - touchStartY) > 40) {
            isScrolling = true;
            endHoldAction();
          }
        }
      },
      { passive: true }
    );

    quizCardEl.addEventListener('touchend', (e) => {
      if (e.target.closest('button') || e.target.closest('a')) return;
      if (state === 'ANSWERED' && e.target.closest('.selectable-text')) return;

      const wasHolding = didHold;
      endHoldAction();

      if (!isScrolling && !wasHolding && Date.now() - lastHoldEndTime > 400) {
        advanceQuizState();
      }
      setTimeout(() => {
        isTouchDevice = false;
      }, 500);
    });

    quizCardEl.addEventListener('touchcancel', () => {
      endHoldAction();
      setTimeout(() => {
        isTouchDevice = false;
      }, 500);
    });
  }

  document.addEventListener('keydown', (e) => {
    markUserActivity();
    if (bindingKeyTarget) {
      e.preventDefault();
      const keyName = e.code === 'Space' ? 'Space' : e.key;
      if (!userConfig.keyBinds[bindingKeyTarget]) userConfig.keyBinds[bindingKeyTarget] = [];
      userConfig.keyBinds[bindingKeyTarget] = [keyName];
      saveConfig();
      updateKeyBindButtons();
      bindingKeyTarget = null;
      return;
    }

    const activeTag = document.activeElement ? document.activeElement.tagName : '';
    if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;

    if (quizScreen && !quizScreen.classList.contains('hidden')) {
      const kb = userConfig.keyBinds || DEFAULT_KEY_BINDS;
      const key = e.key,
        code = e.code;
      const isMatch = (bindList) => bindList && (bindList.includes(key) || bindList.includes(code));

      if (isMatch(kb.advance)) {
        e.preventDefault();
        advanceQuizState();
      } else if (state === 'ANSWERED') {
        if (isMatch(kb.again)) {
          e.preventDefault();
          handleAnswer('again');
        } else if (isMatch(kb.hard)) {
          e.preventDefault();
          handleAnswer('hard');
        } else if (isMatch(kb.good)) {
          e.preventDefault();
          handleAnswer('good');
        } else if (isMatch(kb.easy)) {
          e.preventDefault();
          handleAnswer('easy');
        }
      }
    }
  });

  if (csvInput) {
    csvInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (!file.name.toLowerCase().endsWith('.csv')) {
        alert('CSVファイルのみ追加可能です。');
        csvInput.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => processCsvText(event.target.result, file.name);
      reader.readAsText(file, 'UTF-8');
    });
  }
}

window.addEventListener('DOMContentLoaded', initApp);
