const STORAGE_KEY = "aitimer-free-v3";
const HISTORY_LIMIT = 12;

const COLOR_THEMES = {
  magenta: { ring: "#ff2bd6", glow: "rgba(255, 43, 214, 0.28)", text: "#ff6ee7" },
  cyan: { ring: "#00f5ff", glow: "rgba(0, 245, 255, 0.28)", text: "#7dfaff" },
  lime: { ring: "#33ff4f", glow: "rgba(51, 255, 79, 0.26)", text: "#98ffaa" },
  amber: { ring: "#ff9f1c", glow: "rgba(255, 159, 28, 0.28)", text: "#ffc266" },
  red: { ring: "#ff3131", glow: "rgba(255, 49, 49, 0.28)", text: "#ff8484" },
  yellow: { ring: "#ffef29", glow: "rgba(255, 239, 41, 0.28)", text: "#fff27e" },
  white: { ring: "#ffffff", glow: "rgba(255, 255, 255, 0.18)", text: "#ffffff" },
};

const TIMER_LIBRARY = [
  { name: "Nästa patient", label: "10 min byte mellan patienter", type: "countdown", durationMs: 10 * 60 * 1000, color: "magenta" },
  { name: "Besök 15 min", label: "Kort konsultation", type: "countdown", durationMs: 15 * 60 * 1000, color: "amber" },
  { name: "Besök 20 min", label: "Standardmottagning", type: "countdown", durationMs: 20 * 60 * 1000, color: "yellow" },
  { name: "Labsvar 10 min", label: "Kontroll av provsvar", type: "countdown", durationMs: 10 * 60 * 1000, color: "cyan" },
  { name: "Admin 30 min", label: "Dokumentation och uppföljning", type: "countdown", durationMs: 30 * 60 * 1000, color: "lime" },
  { name: "Djupjobb 50 min", label: "Längre fokusblock", type: "countdown", durationMs: 50 * 60 * 1000, color: "white" },
  { name: "5 min paus", label: "Snabb återhämtning", type: "countdown", durationMs: 5 * 60 * 1000, color: "red" },
  { name: "Stopwatch", label: "Öppen mätning utan sluttid", type: "stopwatch", durationMs: 0, color: "lime" },
];

const PROFESSIONAL_PROFILES = [
  {
    id: "clinic-standard",
    name: "Klinik standard",
    description: "Besök, labbsvar, buffer och öppen mätning för ett vanligt mottagningspass.",
    timers: [
      { name: "Besök 20 min", label: "Tid för besök", type: "countdown", durationMs: 20 * 60 * 1000, color: "yellow" },
      { name: "Nästa patient", label: "Nästa steg", type: "countdown", durationMs: 10 * 60 * 1000, color: "magenta" },
      { name: "Labsvar 10 min", label: "Svar och kontroll", type: "countdown", durationMs: 10 * 60 * 1000, color: "cyan" },
      { name: "Vidimering", label: "Öppen mätning", type: "stopwatch", durationMs: 0, color: "lime" },
      { name: "5 min paus", label: "Kort buffer", type: "countdown", durationMs: 5 * 60 * 1000, color: "red" }
    ]
  },
  {
    id: "acute-flow",
    name: "Snabbflöde",
    description: "För korta beslut, triage och tät patientrotation med tydliga buffers.",
    timers: [
      { name: "Triage 3 min", label: "Första beslut", type: "countdown", durationMs: 3 * 60 * 1000, color: "red" },
      { name: "Besök 15 min", label: "Kort konsultation", type: "countdown", durationMs: 15 * 60 * 1000, color: "amber" },
      { name: "Observation 30 min", label: "Vänteläge", type: "countdown", durationMs: 30 * 60 * 1000, color: "cyan" },
      { name: "Patientflöde", label: "Öppen totalmätning", type: "stopwatch", durationMs: 0, color: "white" }
    ]
  },
  {
    id: "focus-lab",
    name: "Fokus och produktion",
    description: "Pomodoro-liknande upplägg för längre koncentrationsblock och återhämtning.",
    timers: [
      { name: "Fokus 25 min", label: "Pomodoro", type: "countdown", durationMs: 25 * 60 * 1000, color: "magenta" },
      { name: "Djupjobb 50 min", label: "Lång session", type: "countdown", durationMs: 50 * 60 * 1000, color: "white" },
      { name: "Paus 10 min", label: "Längre break", type: "countdown", durationMs: 10 * 60 * 1000, color: "lime" },
      { name: "Research", label: "Öppen mätning", type: "stopwatch", durationMs: 0, color: "cyan" }
    ]
  },
  {
    id: "meeting-pack",
    name: "Möte och uppföljning",
    description: "För kickoff, huvudmöte och uppföljning utan att tappa tempo mellan blocken.",
    timers: [
      { name: "Intro 5 min", label: "Start och orientering", type: "countdown", durationMs: 5 * 60 * 1000, color: "cyan" },
      { name: "Möte 30 min", label: "Huvudblock", type: "countdown", durationMs: 30 * 60 * 1000, color: "yellow" },
      { name: "Uppföljning 15 min", label: "Nästa steg", type: "countdown", durationMs: 15 * 60 * 1000, color: "magenta" },
      { name: "Beslutslogg", label: "Öppen mätning", type: "stopwatch", durationMs: 0, color: "lime" }
    ]
  }
];

const CONTINENT_BLOBS = [
  { lat: 52, lon: -105, rx: 34, ry: 20 },
  { lat: 25, lon: -95, rx: 26, ry: 16 },
  { lat: -18, lon: -60, rx: 20, ry: 28 },
  { lat: 6, lon: 20, rx: 20, ry: 30 },
  { lat: 46, lon: 14, rx: 16, ry: 10 },
  { lat: 52, lon: 78, rx: 52, ry: 22 },
  { lat: 23, lon: 90, rx: 18, ry: 12 },
  { lat: -24, lon: 133, rx: 20, ry: 14 },
  { lat: 74, lon: -40, rx: 12, ry: 8 },
  { lat: -42, lon: 172, rx: 8, ry: 6 }
];

const UI_TEXT = {
  sv: {
    liveBoard: "Live board",
    saveProfile: "Spara profil",
    resetBoard: "Reset board",
    newTimer: "Ny timer",
    editTimer: "Redigera timer",
    manualMode: "Manuell",
    aiMode: "AI text / röst",
    modalAiTitle: "Skapa timer, alarm eller stopwatch med AI",
    modalAiDescription: "Skriv fritt eller prata. AI-byggaren kan skapa flera element samtidigt direkt i din board.",
    prompt: "Prompt",
    saveTimer: "Spara timer",
    deleteTimer: "Ta bort",
    profileSaved: "profil sparad",
    aiCreated: "skapades från AI-prompten.",
    aiNoTimers: "Jag hittade inga tydliga timers. Prova till exempel: besök 20 min, labsvar 10 min, paus 5 min eller alarm 07:30.",
    aiListening: "Lyssnar nu. Beskriv timers, alarm eller stopwatch.",
    aiSpeechCaptured: "Röst fångad. Klicka på Skapa med AI för att bygga elementen.",
    aiSpeechUnsupported: "Röststyrning stöds inte i den här webbläsaren. Skriv prompten i stället.",
    aiSpeechError: "Kunde inte läsa mikrofonen. Kontrollera tillstånd och försök igen.",
    aiReady: "Redo att skapa timers från text eller röst.",
    alarmReady: "Alarm redo",
    alarmActive: "Alarm bevakar tiden",
    alarmFinished: "Alarm utlöst",
    alarmDescription: "Alarmet väntar på att tiden ska nås. Perfekt för påminnelser och fasta stoppunkter.",
    countdownDescriptionRunning: "Den här countdownen rullar live. Du kan lägga till minuter i farten eller öppna fokusläge för en ren fullscreen-visning.",
    countdownDescriptionFinished: "Timern har gått i mål. Återställ för att köra samma intervall igen eller spara upplägget som profil.",
    countdownDescriptionIdle: "Timern väntar i standby. Justera tiden, byt färg eller spara hela boarden som en professionell profil.",
    stopwatchDescriptionRunning: "Stopwatchen mäter aktivt. Perfekt för öppna arbetsflöden där sluttiden inte är bestämd från start.",
    stopwatchDescriptionIdle: "Stopwatchen är redo att starta. Bra när du vill mäta verklig tidsåtgång utan förinställd sluttid.",
    done: "Klar",
    running: "Kör",
    ready: "Redo",
    paused: "Pausad",
    active: "Aktiv",
    measuringLive: "Mäter live",
    pressStart: "Tryck start",
    readyForRestart: "Redo för ny start",
    timeLeft: "Kvar",
    sunUp: "Sol uppe",
    sunDown: "Sol nere",
    globeTitle: "Hologram Globe",
    liveClock: "Live clock",
    board: "Board",
    mode: "Läge",
    profile: "Profil",
    saved: "Sparad",
    custom: "Custom",
    openLibrary: "Profiler"
  },
  en: {
    liveBoard: "Live board",
    saveProfile: "Save profile",
    resetBoard: "Reset board",
    newTimer: "New timer",
    editTimer: "Edit timer",
    manualMode: "Manual",
    aiMode: "AI text / voice",
    modalAiTitle: "Create a timer, alarm, or stopwatch with AI",
    modalAiDescription: "Write naturally or speak. The AI builder can create several items at once directly on your board.",
    prompt: "Prompt",
    saveTimer: "Save timer",
    deleteTimer: "Delete",
    profileSaved: "profile saved",
    aiCreated: "created from the AI prompt.",
    aiNoTimers: "I couldn't find any clear timers. Try for example: visit 20 min, lab reply 10 min, break 5 min or alarm 07:30.",
    aiListening: "Listening now. Describe timers, alarms, or a stopwatch.",
    aiSpeechCaptured: "Voice captured. Click Create with AI to build the items.",
    aiSpeechUnsupported: "Voice input is not supported in this browser. Type the prompt instead.",
    aiSpeechError: "Could not access the microphone. Check permission and try again.",
    aiReady: "Ready to create timers from text or voice.",
    alarmReady: "Alarm ready",
    alarmActive: "Alarm is monitoring time",
    alarmFinished: "Alarm triggered",
    alarmDescription: "The alarm is waiting for its trigger time. Great for reminders and fixed stop points.",
    countdownDescriptionRunning: "This countdown is running live. You can add minutes on the fly or open focus mode for a clean fullscreen view.",
    countdownDescriptionFinished: "The timer has finished. Reset it to run the same interval again or save the setup as a profile.",
    countdownDescriptionIdle: "The timer is standing by. Adjust the time, change the color, or save the whole board as a professional profile.",
    stopwatchDescriptionRunning: "The stopwatch is actively measuring. Perfect for open workflows where the end time is not fixed.",
    stopwatchDescriptionIdle: "The stopwatch is ready to start. Useful when you want to measure actual time without a preset finish.",
    done: "Done",
    running: "Running",
    ready: "Ready",
    paused: "Paused",
    active: "Active",
    measuringLive: "Measuring live",
    pressStart: "Press start",
    readyForRestart: "Ready for restart",
    timeLeft: "Left",
    sunUp: "Sun up",
    sunDown: "Sun down",
    globeTitle: "Hologram Globe",
    liveClock: "Live clock",
    board: "Board",
    mode: "Mode",
    profile: "Profile",
    saved: "Saved",
    custom: "Custom",
    openLibrary: "Profiles"
  }
};

const dom = {
  timerBoard: document.getElementById("timerBoard"),
  selectedPanel: document.getElementById("selectedPanel"),
  presetGrid: document.getElementById("presetGrid"),
  profileGrid: document.getElementById("profileGrid"),
  savedProfileList: document.getElementById("savedProfileList"),
  historyList: document.getElementById("historyList"),
  overlay: document.getElementById("overlay"),
  menuButton: document.getElementById("menuButton"),
  closeDrawerButton: document.getElementById("closeDrawerButton"),
  newTimerButton: document.getElementById("newTimerButton"),
  langSvButton: document.getElementById("langSvButton"),
  langEnButton: document.getElementById("langEnButton"),
  googleTranslateButton: document.getElementById("googleTranslateButton"),
  saveProfileButton: document.getElementById("saveProfileButton"),
  resetBoardButton: document.getElementById("resetBoardButton"),
  clearProfilesButton: document.getElementById("clearProfilesButton"),
  aiPromptInput: document.getElementById("aiPromptInput"),
  generateAiButton: document.getElementById("generateAiButton"),
  listenAiButton: document.getElementById("listenAiButton"),
  aiStatus: document.getElementById("aiStatus"),
  timerModal: document.getElementById("timerModal"),
  timerForm: document.getElementById("timerForm"),
  timerModalTitle: document.getElementById("timerModalTitle"),
  modalModeSwitch: document.getElementById("modalModeSwitch"),
  manualModeButton: document.getElementById("manualModeButton"),
  aiModeButton: document.getElementById("aiModeButton"),
  modalAiBuilder: document.getElementById("modalAiBuilder"),
  modalAiTitle: document.getElementById("modalAiTitle"),
  modalAiDescription: document.getElementById("modalAiDescription"),
  modalAiPromptLabel: document.getElementById("modalAiPromptLabel"),
  modalAiPromptInput: document.getElementById("modalAiPromptInput"),
  modalGenerateAiButton: document.getElementById("modalGenerateAiButton"),
  modalListenAiButton: document.getElementById("modalListenAiButton"),
  modalAiStatus: document.getElementById("modalAiStatus"),
  cancelModalButton: document.getElementById("cancelModalButton"),
  deleteTimerButton: document.getElementById("deleteTimerButton"),
  timerIdInput: document.getElementById("timerIdInput"),
  timerNameInput: document.getElementById("timerNameInput"),
  timerLabelInput: document.getElementById("timerLabelInput"),
  timerTypeInput: document.getElementById("timerTypeInput"),
  timerColorInput: document.getElementById("timerColorInput"),
  timerDurationInput: document.getElementById("timerDurationInput"),
  extraTimeInput: document.getElementById("extraTimeInput"),
  extraTimeUnitInput: document.getElementById("extraTimeUnitInput"),
  durationField: document.getElementById("durationField"),
  soundToggle: document.getElementById("soundToggle"),
  millisecondsToggle: document.getElementById("millisecondsToggle"),
  motionToggle: document.getElementById("motionToggle"),
  clearHistoryButton: document.getElementById("clearHistoryButton"),
  focusView: document.getElementById("focusView"),
  focusOrb: document.getElementById("focusOrb"),
  closeFocusButton: document.getElementById("closeFocusButton")
};

let state = loadState();
let isFocusOpen = false;
let speechRecognition = null;
let modalMode = "manual";
let locationState = {
  lat: 52.2297,
  lon: 21.0122,
  label: "Approximerad plats",
  precise: false
};

if (dom.aiStatus) {
  dom.aiStatus.dataset.locked = "false";
}

if (dom.modalAiStatus) {
  dom.modalAiStatus.dataset.locked = "false";
}

if (!state.settings.languageChosen) {
  state.settings.language = "en";
  state.settings.languageChosen = true;
  saveState();
}

ensureSelectedTimer();
applyStaticTranslations();
renderAll();
window.setInterval(tick, 100);
requestUserLocation();

function createId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function t(key) {
  const lang = state.settings.language === "en" ? "en" : "sv";
  return UI_TEXT[lang][key] || UI_TEXT.sv[key] || key;
}

function setLanguage(language) {
  state.settings.language = language === "en" ? "en" : "sv";
  state.settings.languageChosen = true;
  saveState();
  applyStaticTranslations();
  renderAll();
}

function openGoogleTranslate() {
  const currentUrl = window.location.href;
  const targetLang = state.settings.language === "en" ? "sv" : "en";
  const translatedUrl = `https://translate.google.com/translate?sl=auto&tl=${targetLang}&u=${encodeURIComponent(currentUrl)}`;
  window.open(translatedUrl, "_blank", "noopener,noreferrer");
}

function setText(target, text) {
  const element = typeof target === "string" ? document.querySelector(target) : target;
  if (element) {
    element.textContent = text;
  }
}

function setFieldLabel(target, spanId, text) {
  const label = target?.matches?.("label") ? target : target?.closest?.("label");
  if (!label) {
    return;
  }

  let caption = label.querySelector(`#${spanId}`);
  if (!caption) {
    caption = document.createElement("span");
    caption.id = spanId;
    label.insertBefore(caption, label.firstChild);
  }

  caption.textContent = text;

  Array.from(label.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent = "";
    }
  });
}

function applyStaticTranslations() {
  document.documentElement.lang = state.settings.language === "en" ? "en" : "sv";

  const brandEyebrow = document.querySelector(".brand-eyebrow");
  if (brandEyebrow) {
    brandEyebrow.textContent = state.settings.language === "en" ? "Free web version" : "Gratis webbversion";
  }

  const liveStatusLabel = document.querySelector("#liveStatus span:last-child");
  if (liveStatusLabel) {
    liveStatusLabel.textContent = t("liveBoard");
  }

  dom.saveProfileButton.textContent = t("saveProfile");
  dom.resetBoardButton.textContent = t("resetBoard");
  dom.newTimerButton.textContent = t("newTimer");
  dom.googleTranslateButton.textContent = "Google Translate";
  dom.generateAiButton.textContent = state.settings.language === "en" ? "Create with AI" : "Skapa med AI";
  dom.listenAiButton.textContent = state.settings.language === "en" ? "Listen" : "Lyssna";
  dom.manualModeButton.textContent = t("manualMode");
  dom.aiModeButton.textContent = t("aiMode");
  dom.modalAiTitle.textContent = t("modalAiTitle");
  dom.modalAiDescription.textContent = t("modalAiDescription");
  dom.modalAiPromptLabel.textContent = t("prompt");
  dom.modalGenerateAiButton.textContent = state.settings.language === "en" ? "Create with AI" : "Skapa med AI";
  dom.modalListenAiButton.textContent = state.settings.language === "en" ? "Listen" : "Lyssna";
  dom.deleteTimerButton.textContent = t("deleteTimer");

  const modalSubmitButton = dom.timerForm.querySelector('button[type="submit"]');
  if (modalSubmitButton) {
    modalSubmitButton.textContent = t("saveTimer");
  }

  const shortcutsPanel = document.querySelectorAll(".control-deck .deck-panel")[1];
  if (shortcutsPanel) {
    setText(shortcutsPanel.querySelector(".section-kicker"), state.settings.language === "en" ? "System" : "System");
    setText(shortcutsPanel.querySelector("h3"), state.settings.language === "en" ? "Shortcuts" : "Snabbkommandon");
    const shortcutDescriptions = state.settings.language === "en"
      ? [
          "Start or pause the selected timer",
          "Create a new timer",
          "Open focus mode for the selected timer"
        ]
      : [
          "Starta eller pausa vald timer",
          "Skapa en ny timer",
          "Öppna fokusläge för vald timer"
        ];
    shortcutsPanel.querySelectorAll(".shortcut-list p").forEach((item, index) => {
      item.textContent = shortcutDescriptions[index] || item.textContent;
    });
  }

  const freePanel = document.querySelectorAll(".control-deck .deck-panel")[2];
  if (freePanel) {
    setText(freePanel.querySelector(".section-kicker"), state.settings.language === "en" ? "Free" : "Gratis");
    setText(freePanel.querySelector("h3"), state.settings.language === "en" ? "Everything here is open" : "Allt här är öppet");
    const freeItems = state.settings.language === "en"
      ? [
          "Countdown, stopwatch, and Pomodoro presets",
          "History, local storage, and editing",
          "Responsive design for mobile, tablet, and desktop"
        ]
      : [
          "Countdown, stopwatch och Pomodoro-preset",
          "Historik, lokal lagring och redigering",
          "Responsiv design för mobil, surfplatta och desktop"
        ];
    freePanel.querySelectorAll(".feature-list li").forEach((item, index) => {
      item.textContent = freeItems[index] || item.textContent;
    });
  }

  setText(".drawer-header .section-kicker", state.settings.language === "en" ? "Profiles and timers" : "Profiler och timers");
  setText(".drawer-header h3", state.settings.language === "en" ? "Build your board" : "Bygg din board");
  dom.closeDrawerButton.setAttribute("aria-label", state.settings.language === "en" ? "Close side panel" : "Stäng sidopanel");
  dom.cancelModalButton.setAttribute("aria-label", state.settings.language === "en" ? "Close form" : "Stäng formulär");

  const drawerSectionTitles = state.settings.language === "en"
    ? ["Professional profiles", "Saved profiles", "AI Studio", "Timer library", "Settings", "History"]
    : ["Professionella profiler", "Sparade profiler", "AI Studio", "Timerbibliotek", "Inställningar", "Historik"];
  document.querySelectorAll(".drawer-section h4").forEach((item, index) => {
    item.textContent = drawerSectionTitles[index] || item.textContent;
  });

  const drawerAiLabel = dom.aiPromptInput.closest("label")?.querySelector(".section-kicker");
  if (drawerAiLabel) {
    drawerAiLabel.textContent = t("prompt");
  }

  const drawerAiDescription = dom.aiPromptInput.closest(".drawer-section")?.querySelector(".preset-description");
  if (drawerAiDescription) {
    drawerAiDescription.textContent =
      state.settings.language === "en"
        ? "Write or speak and the assistant will build timers directly from your prompt."
        : "Skriv eller prata, så bygger assistenten timers direkt från din text.";
  }

  dom.clearProfilesButton.textContent = state.settings.language === "en" ? "Clear" : "Rensa";
  dom.clearHistoryButton.textContent = state.settings.language === "en" ? "Clear" : "Rensa";

  const toggleLabels = state.settings.language === "en"
    ? ["Sound when a timer finishes", "Show milliseconds", "Ambient motion"]
    : ["Ljud vid färdig timer", "Visa millisekunder", "Ambient rörelse"];
  document.querySelectorAll(".toggle-row span").forEach((item, index) => {
    item.textContent = toggleLabels[index] || item.textContent;
  });

  setFieldLabel(dom.timerNameInput, "timerNameLabel", state.settings.language === "en" ? "Name" : "Namn");
  setFieldLabel(dom.timerLabelInput, "timerDescriptionLabel", state.settings.language === "en" ? "Description" : "Beskrivning");
  setFieldLabel(dom.timerTypeInput, "timerTypeLabel", state.settings.language === "en" ? "Type" : "Typ");
  setFieldLabel(dom.timerColorInput, "timerColorLabel", state.settings.language === "en" ? "Color" : "Färg");
  setFieldLabel(dom.durationField, "durationFieldLabel", state.settings.language === "en" ? "Base time in minutes" : "Bas tid i minuter");
  setFieldLabel(dom.extraTimeInput, "extraTimeLabel", state.settings.language === "en" ? "Add extra time" : "Lägg till");
  setFieldLabel(dom.extraTimeUnitInput, "extraTimeUnitLabel", state.settings.language === "en" ? "Unit" : "Enhet");

  const colorLabels = state.settings.language === "en"
    ? ["Magenta", "Cyan", "Lime", "Amber", "Red", "Yellow", "White"]
    : ["Magenta", "Cyan", "Lime", "Amber", "Röd", "Gul", "Vit"];
  Array.from(dom.timerColorInput.options).forEach((option, index) => {
    option.textContent = colorLabels[index] || option.textContent;
  });

  const extraUnitLabels = state.settings.language === "en" ? ["Minutes", "Hours"] : ["Minuter", "Timmar"];
  Array.from(dom.extraTimeUnitInput.options).forEach((option, index) => {
    option.textContent = extraUnitLabels[index] || option.textContent;
  });

  dom.menuButton.setAttribute("aria-label", state.settings.language === "en" ? "Open side panel" : "Öppna sidopanel");
  dom.timerBoard.setAttribute("aria-label", state.settings.language === "en" ? "Timer overview" : "Timeröversikt");

  const heroKicker = document.querySelector(".hero-strip .section-kicker");
  if (heroKicker) {
    heroKicker.textContent = state.settings.language === "en" ? "Futuristic timer board" : "Futuristisk timer-board";
  }

  const heroTitle = document.querySelector(".hero-strip h2");
  if (heroTitle) {
    heroTitle.textContent =
      state.settings.language === "en"
        ? "No subscription. Full control. Local in the browser."
        : "Noll abonnemang. Full kontroll. Lokalt i webbläsaren.";
  }

  const heroCopy = document.querySelector(".hero-copy");
  if (heroCopy) {
    heroCopy.textContent =
      state.settings.language === "en"
        ? "Built for fast workflows with neon rings, presets, focus mode, history, and local control in your browser."
        : "Byggd för snabba arbetsflöden med tydliga neonringar, svenska presets, fokusläge och historik direkt i din browser.";
  }

  const aiSectionTitle = Array.from(document.querySelectorAll(".drawer-section h4")).find((item) =>
    item.textContent.includes("AI") || item.textContent.includes("Studio")
  );
  if (aiSectionTitle) {
    aiSectionTitle.textContent = "AI Studio";
  }

  const aiPromptLabel = document.querySelector('label[for="aiPromptInput"], label .section-kicker');
  if (dom.aiPromptInput) {
    dom.aiPromptInput.placeholder =
      state.settings.language === "en"
        ? "Example: create visit 20 min, lab reply 10 min, break 5 min, alarm 07:30 and a stopwatch for validation"
        : "Exempel: skapa besök 20 min, labsvar 10 min, paus 5 min, alarm 07:30 och en stopwatch för vidimering";
  }

  if (dom.aiStatus && (!dom.aiStatus.dataset.locked || dom.aiStatus.dataset.locked === "false")) {
    dom.aiStatus.textContent = t("aiReady");
  }

  if (dom.modalAiPromptInput) {
    dom.modalAiPromptInput.placeholder =
      state.settings.language === "en"
        ? "Example: create visit 20 min, lab reply 10 min, break 5 min, alarm 07:30 and a stopwatch for validation"
        : "Exempel: skapa besök 20 min, labsvar 10 min, paus 5 min, alarm 07:30 och en stopwatch för vidimering";
  }

  if (dom.modalAiStatus && (!dom.modalAiStatus.dataset.locked || dom.modalAiStatus.dataset.locked === "false")) {
    dom.modalAiStatus.textContent = t("aiReady");
  }
}

function requestUserLocation() {
  if (!navigator.geolocation) {
    locationState.label = "Plats ej tillgänglig";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      locationState = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        label: "Din position",
        precise: true
      };
      renderAll();
    },
    () => {
      locationState.label = "Plats approximerad";
      renderAll();
    },
    {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 15 * 60 * 1000
    }
  );
}

function loadState() {
  const base = {
    version: 2,
    settings: {
      soundEnabled: true,
      showMilliseconds: true,
      ambientMotion: true,
      language: "en",
      languageChosen: false
    },
    timers: [],
    history: [],
    savedProfiles: [],
    activeProfileId: null,
    selectedTimerId: null
  };

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return base;
    }

    const parsed = JSON.parse(raw);
    const timers = Array.isArray(parsed.timers)
      ? parsed.timers.map((timer) => normalizeTimer(timer)).filter(Boolean)
      : [];

    return {
      version: 2,
      settings: {
        ...base.settings,
        ...(parsed.settings || {})
      },
      timers,
      history: Array.isArray(parsed.history) ? parsed.history.slice(0, HISTORY_LIMIT) : [],
      savedProfiles: Array.isArray(parsed.savedProfiles)
        ? parsed.savedProfiles.map((profile) => normalizeProfile(profile)).filter(Boolean)
        : [],
      activeProfileId: parsed.activeProfileId || null,
      selectedTimerId: parsed.selectedTimerId || timers[0]?.id || null
    };
  } catch (error) {
    console.warn("Could not load local state", error);
    return base;
  }
}

function normalizeProfile(profile) {
  if (!profile || !profile.name || !Array.isArray(profile.timers) || !profile.timers.length) {
    return null;
  }

  const timers = profile.timers.map((timer) => normalizeProfileTimerSeed(timer)).filter(Boolean);
  if (!timers.length) {
    return null;
  }

  return {
    id: profile.id || createId(),
    name: String(profile.name).slice(0, 36),
    description: String(profile.description || `${timers.length} timers`).slice(0, 90),
    timers,
    updatedAt: Number(profile.updatedAt) || Date.now()
  };
}

function normalizeProfileTimerSeed(timer) {
  if (!timer || !timer.name) {
    return null;
  }

  return {
    name: String(timer.name).slice(0, 32),
    label: String(timer.label || "").slice(0, 48),
    type: timer.type === "stopwatch" ? "stopwatch" : "countdown",
    durationMs: timer.type === "stopwatch" ? 0 : Math.max(Number(timer.durationMs) || 60 * 1000, 60 * 1000),
    color: COLOR_THEMES[timer.color] ? timer.color : "cyan"
  };
}

function createTimer(seed) {
  const isCountdownLike = seed.type === "countdown" || seed.type === "alarm";
    return normalizeTimer({
      id: seed.id || createId(),
      name: seed.name,
      label: seed.label || "",
      type: seed.type || "countdown",
      color: seed.color || "cyan",
      durationMs: Math.max(Number(seed.durationMs) || 0, isCountdownLike ? 60 * 1000 : 0),
      remainingMs: isCountdownLike ? Math.max(Number(seed.remainingMs ?? seed.durationMs) || 0, 0) : 0,
      elapsedMs: Math.max(Number(seed.elapsedMs) || 0, 0),
      isRunning: Boolean(seed.isRunning),
      endAt: seed.endAt || null,
      alarmAt: seed.alarmAt || null,
      startedAt: seed.startedAt || null,
      completedCount: Number(seed.completedCount) || 0
    });
  }

function normalizeTimer(timer) {
  if (!timer || !timer.name) {
    return null;
  }

    const type = timer.type === "stopwatch" ? "stopwatch" : timer.type === "alarm" ? "alarm" : "countdown";
    const isCountdownLike = type === "countdown" || type === "alarm";
    const normalized = {
      id: timer.id || createId(),
      name: String(timer.name).slice(0, 32),
      label: String(timer.label || "").slice(0, 48),
      type,
      color: COLOR_THEMES[timer.color] ? timer.color : "cyan",
      durationMs: isCountdownLike ? Math.max(Number(timer.durationMs) || 60 * 1000, 60 * 1000) : 0,
      remainingMs: isCountdownLike ? Math.max(Number(timer.remainingMs ?? timer.durationMs) || 0, 0) : 0,
      elapsedMs: type === "stopwatch" ? Math.max(Number(timer.elapsedMs) || 0, 0) : 0,
      isRunning: Boolean(timer.isRunning),
      endAt: timer.endAt || null,
      alarmAt: timer.alarmAt || null,
      startedAt: timer.startedAt || null,
      completedCount: Number(timer.completedCount) || 0
    };

    if ((normalized.type === "countdown" || normalized.type === "alarm") && normalized.isRunning && !normalized.endAt && !normalized.alarmAt) {
      normalized.isRunning = false;
    }

  if (normalized.type === "stopwatch" && normalized.isRunning && !normalized.startedAt) {
    normalized.isRunning = false;
  }

  return normalized;
}

function saveState() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
    version: 2,
    settings: state.settings,
    timers: state.timers,
    history: state.history,
    savedProfiles: state.savedProfiles,
    activeProfileId: state.activeProfileId,
    selectedTimerId: state.selectedTimerId
  }));
}

function ensureSelectedTimer() {
  const exists = state.timers.some((timer) => timer.id === state.selectedTimerId);
  state.selectedTimerId = exists ? state.selectedTimerId : state.timers[0]?.id || null;
}
function tick() {
  let changed = false;
  const now = Date.now();

  state.timers.forEach((timer) => {
    const isCountdownLike = timer.type === "countdown" || timer.type === "alarm";
    const finishAt = timer.type === "alarm" && timer.alarmAt ? timer.alarmAt : timer.endAt;
    if (isCountdownLike && timer.isRunning && finishAt && finishAt <= now) {
      timer.isRunning = false;
      timer.endAt = null;
      timer.alarmAt = timer.type === "alarm" ? null : timer.alarmAt;
      timer.remainingMs = 0;
      timer.completedCount += 1;
      state.history.unshift({
        id: createId(),
        timerId: timer.id,
        name: timer.name,
        completedAt: now
      });
      state.history = state.history.slice(0, HISTORY_LIMIT);
      changed = true;
    }
  });

  if (changed) {
    playCompletionTone();
    saveState();
  }

  renderAll();
}

function renderAll() {
  applyStaticTranslations();
  syncSettingControls();
  applyMotionSetting();
  renderBoard();
  renderSelectedPanel();
  renderProfileGrid();
  renderSavedProfiles();
  renderPresetGrid();
  renderHistory();
  updateFocusView();
}

function renderBoard() {
  const now = Date.now();
  const elements = [renderClockOrb(now), renderGlobeOrb(now)];

  if (state.timers.length) {
    elements.push(...state.timers.map((timer) => renderTimerOrb(timer, now)));
  }

  dom.timerBoard.replaceChildren(...elements);
}

function renderClockOrb(now) {
  const wrapper = document.createElement("article");
  wrapper.className = "clock-orb";
  const shell = createOrbShell({ color: "white", progress: 1, className: "clock-shell" });
  const time = formatClock(now);

  shell.innerHTML = `
    <div class="orb-content">
      <div class="${timeClassName(time)}">${time.main}<small>${time.trail}</small></div>
      <div class="orb-rule"></div>
      <div class="orb-title">${t("liveClock")}</div>
      <p class="clock-meta">${new Intl.DateTimeFormat("sv-SE", {
        weekday: "long",
        day: "numeric",
        month: "long"
      }).format(now)}</p>
    </div>
  `;

  wrapper.appendChild(shell);
  return wrapper;
}

function renderEmptyBoardCard() {
  const card = document.createElement("section");
  card.className = "board-empty";
  card.innerHTML = `
    <div class="board-empty-content">
      <p class="section-kicker">Tom board</p>
      <h3>Välj en profil innan timers visas.</h3>
      <p>
        Inga timer-cirklar visas förrän du väljer en professionell profil eller bygger en egen board.
        Öppna profilerna för klinik, fokusarbete, möten eller skapa en helt egen timeruppsättning.
      </p>
      <div class="board-empty-actions">
        <button class="primary-button" data-empty-action="open-library">Öppna profiler</button>
        <button class="ghost-button" data-empty-action="new-timer">Skapa egen timer</button>
      </div>
    </div>
  `;

  card.querySelectorAll("[data-empty-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.getAttribute("data-empty-action");
      if (action === "open-library") {
        openDrawer();
      }
      if (action === "new-timer") {
        openModal();
      }
    });
  });

  return card;
}

function renderGlobeOrb(now) {
  const wrapper = document.createElement("article");
  wrapper.className = "globe-orb";
  const sunUp = isSunUpAtLocation(locationState.lat, locationState.lon, now);

  const shell = createOrbShell({ color: "cyan", progress: 1, className: "globe-shell" });
  shell.innerHTML = `
      <div class="orb-content">
        <canvas class="globe-canvas" width="320" height="320" aria-label="Roterande jordglob"></canvas>
        <div class="orb-rule"></div>
        <div class="orb-title">${t("globeTitle")}</div>
        <p class="orb-meta">${escapeHtml(locationState.label)} • ${sunUp ? t("sunUp") : t("sunDown")}</p>
      </div>
    `;

  const canvas = shell.querySelector(".globe-canvas");
  if (canvas) {
    drawGlobe(canvas, now);
  }

  wrapper.appendChild(shell);
  return wrapper;
}

function drawGlobe(canvas, now) {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  const width = canvas.width;
  const height = canvas.height;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.34;
  const rotation = now / 6000;

  ctx.clearRect(0, 0, width, height);

  const glow = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.4);
  glow.addColorStop(0, "rgba(96, 246, 255, 0.22)");
  glow.addColorStop(1, "rgba(96, 246, 255, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.5, 0, Math.PI * 2);
  ctx.fill();

  const sphereFill = ctx.createRadialGradient(cx - radius * 0.2, cy - radius * 0.25, radius * 0.15, cx, cy, radius);
  sphereFill.addColorStop(0, "rgba(118, 245, 255, 0.16)");
  sphereFill.addColorStop(0.55, "rgba(18, 30, 52, 0.92)");
  sphereFill.addColorStop(1, "rgba(5, 10, 22, 0.98)");
  ctx.fillStyle = sphereFill;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  drawDayNightShade(ctx, cx, cy, radius, rotation, now);
  drawContinents(ctx, cx, cy, radius, rotation, now);
  ctx.restore();

  ctx.strokeStyle = "rgba(123, 241, 255, 0.3)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  for (let lat = -60; lat <= 60; lat += 30) {
    drawLatitude(ctx, cx, cy, radius, lat, rotation);
  }

  for (let lon = 0; lon < 180; lon += 30) {
    drawLongitude(ctx, cx, cy, radius, lon, rotation);
  }

  drawLocationDot(ctx, cx, cy, radius, rotation);
}

function projectPoint(latDeg, lonDeg, rotation) {
  const lat = (latDeg * Math.PI) / 180;
  const lon = (lonDeg * Math.PI) / 180;
  const x = Math.cos(lat) * Math.cos(lon);
  const y = Math.sin(lat);
  const z = Math.cos(lat) * Math.sin(lon);

  return {
    x: x * Math.cos(rotation) + z * Math.sin(rotation),
    y,
    z: -x * Math.sin(rotation) + z * Math.cos(rotation)
  };
}

function getSunPosition(now) {
  const date = new Date(now);
  const utcHours =
    date.getUTCHours() +
    date.getUTCMinutes() / 60 +
    date.getUTCSeconds() / 3600;
  const startOfYear = Date.UTC(date.getUTCFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - startOfYear) / 86400000);
  const declination = 23.44 * Math.sin(((2 * Math.PI) / 365) * (dayOfYear - 81));
  const subsolarLon = 180 - utcHours * 15;

  return {
    lat: declination,
    lon: ((subsolarLon + 540) % 360) - 180
  };
}

function daylightFactor(latDeg, lonDeg, now) {
  const sun = getSunPosition(now);
  const lat = (latDeg * Math.PI) / 180;
  const lon = (lonDeg * Math.PI) / 180;
  const sunLat = (sun.lat * Math.PI) / 180;
  const sunLon = (sun.lon * Math.PI) / 180;
  return (
    Math.sin(lat) * Math.sin(sunLat) +
    Math.cos(lat) * Math.cos(sunLat) * Math.cos(lon - sunLon)
  );
}

function isSunUpAtLocation(latDeg, lonDeg, now) {
  return daylightFactor(latDeg, lonDeg, now) > 0;
}

function drawDayNightShade(ctx, cx, cy, radius, rotation, now) {
  const sun = getSunPosition(now);
  const projectedSun = projectPoint(sun.lat, sun.lon, rotation);
  const screenSunY = -projectedSun.y;
  const gradient = ctx.createLinearGradient(
    cx - projectedSun.x * radius * 1.2,
    cy - screenSunY * radius * 1.2,
    cx + projectedSun.x * radius * 1.2,
    cy + screenSunY * radius * 1.2
  );

  gradient.addColorStop(0, "rgba(3, 8, 22, 0.78)");
  gradient.addColorStop(0.42, "rgba(5, 12, 28, 0.52)");
  gradient.addColorStop(0.62, "rgba(12, 28, 42, 0.16)");
  gradient.addColorStop(1, "rgba(112, 247, 255, 0.08)");
  ctx.fillStyle = gradient;
  ctx.fillRect(cx - radius - 20, cy - radius - 20, radius * 2 + 40, radius * 2 + 40);
}

function drawContinents(ctx, cx, cy, radius, rotation, now) {
  CONTINENT_BLOBS.forEach((blob) => {
    for (let lat = blob.lat - blob.ry; lat <= blob.lat + blob.ry; lat += 4) {
      for (let lon = blob.lon - blob.rx; lon <= blob.lon + blob.rx; lon += 4) {
        const ellipse =
          ((lat - blob.lat) * (lat - blob.lat)) / (blob.ry * blob.ry) +
          ((lon - blob.lon) * (lon - blob.lon)) / (blob.rx * blob.rx);

        if (ellipse > 1) {
          continue;
        }

        const point = projectPoint(lat, lon, rotation);
        if (point.z < -0.18) {
          continue;
        }

        const light = daylightFactor(lat, lon, now);
        const x = cx + point.x * radius;
        const y = cy - point.y * radius;
        const alpha = light > 0 ? 0.46 : 0.18;
        const size = light > 0 ? 2.6 : 2.1;

        ctx.fillStyle =
          light > 0
            ? `rgba(116, 245, 255, ${alpha})`
            : `rgba(42, 88, 108, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });
}

function drawLatitude(ctx, cx, cy, radius, lat, rotation) {
  ctx.beginPath();
  let started = false;
  for (let lon = -180; lon <= 180; lon += 6) {
    const point = projectPoint(lat, lon, rotation);
    if (point.z < -0.35) {
      started = false;
      continue;
    }
    const x = cx + point.x * radius;
    const y = cy - point.y * radius;
    if (!started) {
      ctx.moveTo(x, y);
      started = true;
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.strokeStyle = "rgba(120, 241, 255, 0.26)";
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawLongitude(ctx, cx, cy, radius, lon, rotation) {
  ctx.beginPath();
  let started = false;
  for (let lat = -90; lat <= 90; lat += 6) {
    const point = projectPoint(lat, lon, rotation);
    if (point.z < -0.35) {
      started = false;
      continue;
    }
    const x = cx + point.x * radius;
    const y = cy - point.y * radius;
    if (!started) {
      ctx.moveTo(x, y);
      started = true;
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.strokeStyle = "rgba(120, 241, 255, 0.22)";
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawLocationDot(ctx, cx, cy, radius, rotation) {
  const point = projectPoint(locationState.lat, locationState.lon, rotation);
  const x = cx + point.x * radius;
  const y = cy - point.y * radius;
  const alpha = point.z >= 0 ? 0.95 : 0.38;

  ctx.fillStyle = `rgba(255, 58, 58, ${alpha})`;
  ctx.shadowColor = "rgba(255, 58, 58, 0.9)";
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.arc(x, y, point.z >= 0 ? 6 : 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

function renderTimerOrb(timer, now) {
  const theme = COLOR_THEMES[timer.color];
  const wrapper = document.createElement("article");
  wrapper.className = "timer-orb";
  wrapper.dataset.type = timer.type;
  wrapper.dataset.state = timerState(timer, now);

  const button = document.createElement("button");
  button.type = "button";
  button.className = "orb-trigger";
  button.setAttribute("aria-label", `Välj timer ${timer.name}`);

  const shell = createOrbShell({
    color: timer.color,
    progress: progressForTimer(timer, now),
    selected: timer.id === state.selectedTimerId
  });

  const time = formatTimerDisplay(timer, now);
  const meta = timerMeta(timer, now);
  shell.innerHTML = `
    <div class="orb-content" style="color:${theme.text}">
      <div class="${timeClassName(time)}">${time.main}<small>${time.trail}</small></div>
      <div class="orb-rule"></div>
      <div class="orb-title">${escapeHtml(timer.name)}</div>
      <p class="orb-label">${escapeHtml(timer.label || meta.label)}</p>
      <p class="orb-meta">${escapeHtml(meta.meta)}</p>
    </div>
  `;

  button.appendChild(shell);
  button.addEventListener("click", () => {
    state.selectedTimerId = timer.id;
    renderAll();
  });
  button.addEventListener("dblclick", () => toggleTimer(timer.id));

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "orb-edit-button";
  editButton.setAttribute("aria-label", `Redigera ${timer.name}`);
  editButton.textContent = "✎";
  editButton.addEventListener("click", (event) => {
    event.stopPropagation();
    openModal(timer.id);
  });

  wrapper.appendChild(button);
  wrapper.appendChild(editButton);
  return wrapper;
}

function createOrbShell({ color, progress, selected = false, className = "" }) {
  const theme = COLOR_THEMES[color];
  const shell = document.createElement("div");
  shell.className = `orb-shell ${className}`.trim();
  if (selected) {
    shell.classList.add("selected");
  }
  shell.style.setProperty("--ring-color", theme.ring);
  shell.style.setProperty("--inner-glow", theme.glow);
  shell.style.setProperty("--progress", `${Math.max(0.02, Math.min(progress, 1))}turn`);
  return shell;
}

function renderSelectedPanel() {
  const timer = state.timers.find((item) => item.id === state.selectedTimerId) || state.timers[0] || null;
  const activeProfile = getActiveProfile();

  if (!timer) {
    dom.selectedPanel.innerHTML = `
      <div class="selected-hero">
        <div class="panel-heading">
          <p class="section-kicker">Boardstatus</p>
            <h3>Ingen profil aktiv</h3>
          </div>
        <p class="selected-copy">
          Börja med en professionell profil från biblioteket eller skapa en egen timer manuellt.
          När du är nöjd kan du spara upplägget som en egen profil.
        </p>
          <div class="selected-actions-secondary">
            <button class="primary-button" data-panel-action="open-library">${t("openLibrary")}</button>
            <button class="ghost-button" data-panel-action="new-timer">${t("newTimer")}</button>
            <button class="ghost-button" data-panel-action="reset-board">${t("resetBoard")}</button>
          </div>
        </div>
      `;

    dom.selectedPanel.querySelectorAll("[data-panel-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.getAttribute("data-panel-action");
        if (action === "open-library") {
          openDrawer();
        }
        if (action === "new-timer") {
          openModal();
        }
        if (action === "reset-board") {
          resetBoard();
        }
      });
    });
    return;
  }

  const now = Date.now();
  const runtime = getRuntimeMs(timer, now);
  const duration = timer.type === "countdown" ? timer.durationMs : runtime;
  const time = formatTimerDisplay(timer, now);
  const theme = COLOR_THEMES[timer.color];
  const profileLabel = activeProfile ? activeProfile.name : (state.settings.language === "en" ? "Custom board" : "Anpassad board");
  const profileTypeLabel = activeProfile ? (activeProfile.builtIn ? t("profile") : t("saved")) : t("custom");

  dom.selectedPanel.innerHTML = `
    <div class="selected-hero">
      <div class="selected-header">
        <div>
          <p class="section-kicker">Vald timer</p>
          <h3>${escapeHtml(timer.name)}</h3>
        </div>
        <span class="selected-tag">${timer.type === "alarm" ? "Alarm" : timer.type === "countdown" ? "Countdown" : "Stopwatch"}</span>
      </div>

      <div class="selected-preview">
        <div class="orb-shell selected" style="--ring-color:${theme.ring};--inner-glow:${theme.glow};--progress:${Math.max(0.02, Math.min(progressForTimer(timer, now), 1))}turn;width:min(100%, 250px);">
          <div class="orb-content" style="color:${theme.text}">
            <div class="${timeClassName(time)}">${time.main}<small>${time.trail}</small></div>
            <div class="orb-rule"></div>
            <div class="orb-title">${escapeHtml(timer.label || "Aktiv kontroll")}</div>
          </div>
        </div>
      </div>

      <p class="selected-copy">${escapeHtml(selectedDescription(timer, now))}</p>

      <div class="selected-stats">
        <div class="stat-chip"><span>Status</span><strong>${timerStatusLabel(timer, now)}</strong></div>
        <div class="stat-chip"><span>${t("board")}</span><strong>${escapeHtml(profileLabel)}</strong></div>
        <div class="stat-chip"><span>${state.settings.language === "en" ? "Time" : "Tid"}</span><strong>${formatLongDuration(duration)}</strong></div>
        <div class="stat-chip"><span>${t("mode")}</span><strong>${profileTypeLabel}</strong></div>
      </div>

      <div class="timer-actions">
        <button class="action-button action-button-primary" data-action="toggle">${timer.isRunning ? (state.settings.language === "en" ? "Pause" : "Pausa") : (state.settings.language === "en" ? "Start" : "Starta")}</button>
        <button class="action-button" data-action="reset">${state.settings.language === "en" ? "Reset" : "Återställ"}</button>
      </div>

      <div class="mini-action-row">
        <button class="mini-action" data-action="plus-1">+1 min</button>
        <button class="mini-action" data-action="plus-5">+5 min</button>
        <button class="mini-action" data-action="focus">Fokus</button>
      </div>

      <div class="mini-action-row">
        <button class="mini-action" data-action="edit">${state.settings.language === "en" ? "Edit" : "Redigera"}</button>
        <button class="mini-action" data-action="duplicate">${state.settings.language === "en" ? "Duplicate" : "Duplicera"}</button>
        <button class="mini-action" data-action="remove">${state.settings.language === "en" ? "Remove" : "Ta bort"}</button>
      </div>

      <div class="selected-actions-secondary">
        <button class="ghost-button" data-action="save-profile">${t("saveProfile")}</button>
        <button class="ghost-button" data-action="open-library">${t("openLibrary")}</button>
        <button class="ghost-button" data-action="reset-board">${t("resetBoard")}</button>
      </div>
    </div>
  `;

  dom.selectedPanel.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => handleSelectedAction(timer.id, button.getAttribute("data-action")));
  });
}

function renderProfileGrid() {
  const cards = PROFESSIONAL_PROFILES.map((profile) => {
    const card = document.createElement("article");
    card.className = "profile-card";
    if (state.activeProfileId === profile.id) {
      card.classList.add("is-active");
    }
    card.innerHTML = `
      <div class="profile-title-row">
        <strong>${escapeHtml(profile.name)}</strong>
        <span class="profile-badge">${profile.timers.length} timers</span>
      </div>
      <p class="profile-description">${escapeHtml(profile.description)}</p>
      <div class="profile-actions">
        <button class="primary-button" data-profile-id="${profile.id}">${state.settings.language === "en" ? "Load profile" : "Ladda profil"}</button>
      </div>
    `;
    card.querySelector("[data-profile-id]").addEventListener("click", () => applyProfile(profile));
    return card;
  });

  dom.profileGrid.replaceChildren(...cards);
}

function renderSavedProfiles() {
  if (!state.savedProfiles.length) {
    dom.savedProfileList.innerHTML = `<div class="saved-profile-empty">${state.settings.language === "en" ? "No saved profiles yet. Build a board and click Save profile." : "Inga profiler sparade ännu. Bygg en board och klicka på Spara profil."}</div>`;
    return;
  }

  const items = state.savedProfiles.map((profile) => {
    const item = document.createElement("article");
    item.className = "saved-profile-item";
    if (state.activeProfileId === profile.id) {
      item.classList.add("is-active");
    }
    item.innerHTML = `
      <div class="profile-title-row">
        <strong>${escapeHtml(profile.name)}</strong>
        <span class="profile-badge">${profile.timers.length} timers</span>
      </div>
      <p class="saved-profile-meta">${escapeHtml(profile.description)}</p>
      <div class="saved-profile-actions">
        <button class="ghost-button" data-saved-action="apply">${state.settings.language === "en" ? "Load" : "Ladda"}</button>
        <button class="ghost-button" data-saved-action="remove">${state.settings.language === "en" ? "Remove" : "Ta bort"}</button>
      </div>
    `;

    item.querySelectorAll("[data-saved-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.getAttribute("data-saved-action");
        if (action === "apply") {
          applyProfile(profile);
        }
        if (action === "remove") {
          removeSavedProfile(profile.id);
        }
      });
    });

    return item;
  });

  dom.savedProfileList.replaceChildren(...items);
}

function renderPresetGrid() {
  const buttons = TIMER_LIBRARY.map((preset) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "preset-button";
    button.innerHTML = `
      <span class="preset-title">${escapeHtml(preset.name)}</span>
      <span class="preset-description">${escapeHtml(preset.label)}</span>
    `;
    button.addEventListener("click", () => addPreset(preset));
    return button;
  });

  dom.presetGrid.replaceChildren(...buttons);
}

function renderHistory() {
  if (!state.history.length) {
    dom.historyList.innerHTML = `<div class="history-empty">${state.settings.language === "en" ? "No history yet. When a countdown or alarm finishes it will appear here." : "Ingen historik ännu. När en countdown eller alarm går i mål dyker den upp här."}</div>`;
    return;
  }

  const items = state.history.map((entry) => {
    const item = document.createElement("div");
    item.className = "history-item";
    item.innerHTML = `
      <div>
        <strong>${escapeHtml(entry.name)}</strong>
        <p>${state.settings.language === "en" ? "Finished" : "Färdig"}</p>
      </div>
      <time datetime="${new Date(entry.completedAt).toISOString()}">${formatHistoryTime(entry.completedAt)}</time>
    `;
    return item;
  });

  dom.historyList.replaceChildren(...items);
}

function syncSettingControls() {
  dom.soundToggle.checked = state.settings.soundEnabled;
  dom.millisecondsToggle.checked = state.settings.showMilliseconds;
  dom.motionToggle.checked = state.settings.ambientMotion;
}

function applyMotionSetting() {
  document.body.classList.toggle("motion-paused", !state.settings.ambientMotion);
}
function getActiveProfile() {
  const builtIn = PROFESSIONAL_PROFILES.find((profile) => profile.id === state.activeProfileId);
  if (builtIn) {
    return { ...builtIn, builtIn: true };
  }
  const saved = state.savedProfiles.find((profile) => profile.id === state.activeProfileId);
  if (saved) {
    return { ...saved, builtIn: false };
  }
  return null;
}

function timerState(timer, now) {
  if ((timer.type === "countdown" || timer.type === "alarm") && getRuntimeMs(timer, now) <= 0) {
    return "finished";
  }
  return timer.isRunning ? "running" : "idle";
}

function progressForTimer(timer, now) {
  if (timer.type === "countdown" || timer.type === "alarm") {
    const runtime = getRuntimeMs(timer, now);
    return timer.durationMs ? (timer.durationMs - runtime) / timer.durationMs : 0;
  }
  return ((getRuntimeMs(timer, now) % (60 * 1000)) / (60 * 1000)) || 0.04;
}

function getRuntimeMs(timer, now) {
  if (timer.type === "countdown" || timer.type === "alarm") {
    if (timer.type === "alarm" && timer.isRunning && timer.alarmAt) {
      return Math.max(0, timer.alarmAt - now);
    }
    if (timer.isRunning && timer.endAt) {
      return Math.max(0, timer.endAt - now);
    }
    return Math.max(timer.remainingMs, 0);
  }

  if (timer.isRunning && timer.startedAt) {
    return Math.max(now - timer.startedAt, 0);
  }
  return Math.max(timer.elapsedMs, 0);
}

function timerMeta(timer, now) {
  if (timer.type === "alarm") {
    const remaining = getRuntimeMs(timer, now);
    if (remaining <= 0) {
      return { label: t("done"), meta: t("alarmFinished") };
    }
    if (timer.isRunning) {
      return { label: t("active"), meta: `${t("timeLeft")} ${formatCompactDuration(remaining)}` };
    }
    return { label: t("ready"), meta: t("alarmReady") };
  }

  if (timer.type === "countdown") {
    const remaining = getRuntimeMs(timer, now);
    if (remaining <= 0) {
      return { label: t("done"), meta: t("readyForRestart") };
    }
    if (timer.isRunning) {
      return { label: t("active"), meta: `${t("timeLeft")} ${formatCompactDuration(remaining)}` };
    }
    return { label: t("paused"), meta: formatCompactDuration(timer.durationMs) };
  }

  if (timer.isRunning) {
    return { label: t("active"), meta: t("measuringLive") };
  }
  return { label: t("ready"), meta: t("pressStart") };
}

function selectedDescription(timer, now) {
  if (timer.type === "alarm") {
    const remaining = getRuntimeMs(timer, now);
    if (remaining <= 0) {
      return t("alarmFinished");
    }
    return t("alarmDescription");
  }

  if (timer.type === "countdown") {
    const remaining = getRuntimeMs(timer, now);
    if (remaining <= 0) {
      return t("countdownDescriptionFinished");
    }
    if (timer.isRunning) {
      return t("countdownDescriptionRunning");
    }
    return t("countdownDescriptionIdle");
  }

  return timer.isRunning
    ? t("stopwatchDescriptionRunning")
    : t("stopwatchDescriptionIdle");
}

function timerStatusLabel(timer, now) {
  if ((timer.type === "countdown" || timer.type === "alarm") && getRuntimeMs(timer, now) <= 0) {
    return t("done");
  }
  return timer.isRunning ? t("running") : t("ready");
}

function formatTimerDisplay(timer, now) {
  const runtime = getRuntimeMs(timer, now);
  return timer.type === "countdown" ? formatCountdown(runtime) : formatStopwatch(runtime, state.settings.showMilliseconds);
}

function formatClock(now) {
  const date = new Date(now);
  return {
    main: `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`,
    trail: `:${String(date.getSeconds()).padStart(2, "0")}`
  };
}

function formatCountdown(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return {
      main: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`,
      trail: `:${String(seconds).padStart(2, "0")}`
    };
  }

  return {
    main: `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
    trail: ""
  };
}

function formatStopwatch(ms, showMilliseconds) {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = ms % 1000;

  if (hours > 0) {
    return {
      main: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`,
      trail: `:${String(seconds).padStart(2, "0")}`
    };
  }

  if (!showMilliseconds) {
    return {
      main: `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
      trail: ""
    };
  }

  if (minutes === 0) {
    return {
      main: `${String(seconds).padStart(2, "0")}`,
      trail: `.${String(milliseconds).padStart(3, "0")}`
    };
  }

  return {
    main: `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
    trail: `.${String(Math.floor(milliseconds / 10)).padStart(2, "0")}`
  };
}

function formatCompactDuration(ms) {
  const totalMinutes = Math.round(ms / 60000);
  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return minutes ? `${hours} h ${minutes} min` : `${hours} h`;
  }
  return `${Math.max(totalMinutes, 0)} min`;
}

function formatLongDuration(ms) {
  const totalSeconds = Math.round(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours} h ${minutes} min`;
  }
  if (minutes > 0) {
    return `${minutes} min ${seconds} s`;
  }
  return `${seconds} s`;
}

function formatHistoryTime(timestamp) {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
    day: "numeric",
    month: "short"
  }).format(date);
}

function timeClassName(time) {
  const combinedLength = `${time.main}${time.trail}`.length;
  if (combinedLength >= 10) {
    return "orb-time is-micro";
  }
  if (combinedLength >= 8) {
    return "orb-time is-compact";
  }
  return "orb-time";
}

function handleSelectedAction(timerId, action) {
  switch (action) {
    case "toggle":
      toggleTimer(timerId);
      break;
    case "reset":
      resetTimer(timerId);
      break;
    case "plus-1":
      bumpTimer(timerId, 60 * 1000);
      break;
    case "plus-5":
      bumpTimer(timerId, 5 * 60 * 1000);
      break;
    case "focus":
      openFocus();
      break;
    case "edit":
      openModal(timerId);
      break;
    case "duplicate":
      duplicateTimer(timerId);
      break;
    case "remove":
      removeTimer(timerId);
      break;
    case "save-profile":
      saveCurrentProfile();
      break;
    case "open-library":
      openDrawer();
      break;
    case "reset-board":
      resetBoard();
      break;
    default:
      break;
  }
}

function toggleTimer(timerId) {
  updateTimer(timerId, (timer) => {
    const now = Date.now();
    if (timer.type === "countdown" || timer.type === "alarm") {
      if (getRuntimeMs(timer, now) <= 0) {
        timer.remainingMs = timer.durationMs;
      }
      if (timer.isRunning) {
        timer.remainingMs = getRuntimeMs(timer, now);
        timer.endAt = null;
        if (timer.type === "alarm") {
          timer.alarmAt = null;
        }
        timer.isRunning = false;
      } else {
        if (timer.type === "alarm") {
          timer.alarmAt = now + getRuntimeMs(timer, now);
        } else {
          timer.endAt = now + getRuntimeMs(timer, now);
        }
        timer.isRunning = true;
      }
      return;
    }

    if (timer.isRunning) {
      timer.elapsedMs = getRuntimeMs(timer, now);
      timer.startedAt = null;
      timer.isRunning = false;
    } else {
      timer.startedAt = now - timer.elapsedMs;
      timer.isRunning = true;
    }
  });
}

function resetTimer(timerId) {
  updateTimer(timerId, (timer) => {
    timer.isRunning = false;
    timer.endAt = null;
    timer.alarmAt = null;
    timer.startedAt = null;
    timer.remainingMs = timer.type === "countdown" || timer.type === "alarm" ? timer.durationMs : 0;
    timer.elapsedMs = 0;
  });
}

function bumpTimer(timerId, deltaMs) {
  updateTimer(timerId, (timer) => {
    if (timer.type !== "countdown" && timer.type !== "alarm") {
      return;
    }
    if (timer.type === "alarm" && timer.alarmAt) {
      timer.alarmAt += deltaMs;
    } else if (timer.isRunning && timer.endAt) {
      timer.endAt += deltaMs;
    } else {
      timer.remainingMs += deltaMs;
    }
    timer.durationMs += deltaMs;
  });
}

function duplicateTimer(timerId) {
  const source = state.timers.find((timer) => timer.id === timerId);
  if (!source) {
    return;
  }

  const duplicate = createTimer({
    ...source,
    id: createId(),
    name: `${source.name} Kopia`,
    remainingMs: source.type === "countdown" ? source.durationMs : 0,
    elapsedMs: 0,
    isRunning: false,
    endAt: null,
    startedAt: null,
    completedCount: 0
  });

  state.timers.unshift(duplicate);
  state.selectedTimerId = duplicate.id;
  state.activeProfileId = null;
  saveState();
  renderAll();
}

function removeTimer(timerId) {
  state.timers = state.timers.filter((timer) => timer.id !== timerId);
  ensureSelectedTimer();
  state.activeProfileId = null;
  saveState();
  renderAll();
}

function resetBoard() {
  state.timers = [];
  state.selectedTimerId = null;
  state.activeProfileId = null;
  saveState();
  renderAll();
}

function addPreset(preset) {
  const timer = createTimer(preset);
  state.timers.unshift(timer);
  state.selectedTimerId = timer.id;
  state.activeProfileId = null;
  saveState();
  renderAll();
  closeDrawer();
}

function applyProfile(profile) {
  state.timers = profile.timers.map((timer) => createTimer(timer));
  state.selectedTimerId = state.timers[0]?.id || null;
  state.activeProfileId = profile.id;
  saveState();
  renderAll();
  closeDrawer();
}

function buildProfileSeedList() {
  return state.timers.map((timer) => ({
    name: timer.name,
    label: timer.label,
    type: timer.type,
    durationMs: timer.type === "countdown" ? timer.durationMs : 0,
    color: timer.color
  }));
}

function saveCurrentProfile() {
  if (!state.timers.length) {
    window.alert(state.settings.language === "en" ? "Create or load timers first, then you can save the profile." : "Skapa eller ladda timers först, sedan kan du spara profilen.");
    return;
  }

  const existingSaved = state.savedProfiles.find((profile) => profile.id === state.activeProfileId) || null;
  const suggestedName = existingSaved?.name || getActiveProfile()?.name || (state.settings.language === "en" ? "My profile" : "Min profil");
  const name = window.prompt(state.settings.language === "en" ? "Profile name" : "Namn på profil", suggestedName);
  if (!name || !name.trim()) {
    return;
  }

  const timers = buildProfileSeedList();
  const description = `${timers.length} timers • ${timers.map((timer) => timer.name).slice(0, 3).join(", ")}${timers.length > 3 ? "..." : ""}`;

  if (existingSaved) {
    existingSaved.name = name.trim().slice(0, 36);
    existingSaved.description = description.slice(0, 90);
    existingSaved.timers = timers;
    existingSaved.updatedAt = Date.now();
    state.activeProfileId = existingSaved.id;
  } else {
    const profile = {
      id: createId(),
      name: name.trim().slice(0, 36),
      description: description.slice(0, 90),
      timers,
      updatedAt: Date.now()
    };
    state.savedProfiles.unshift(profile);
    state.activeProfileId = profile.id;
  }

  saveState();
  renderAll();
}

function removeSavedProfile(profileId) {
  state.savedProfiles = state.savedProfiles.filter((profile) => profile.id !== profileId);
  if (state.activeProfileId === profileId) {
    state.activeProfileId = null;
  }
  saveState();
  renderAll();
}

function clearSavedProfiles() {
  state.savedProfiles = [];
  if (!PROFESSIONAL_PROFILES.some((profile) => profile.id === state.activeProfileId)) {
    state.activeProfileId = null;
  }
  saveState();
  renderAll();
}

function setAiStatus(target, message) {
  if (!target) {
    return;
  }
  target.dataset.locked = "true";
  target.textContent = message;
}

function inferColorFromText(text) {
  const lower = text.toLowerCase();
  if (lower.includes("paus") || lower.includes("break") || lower.includes("triage")) return "red";
  if (lower.includes("lab") || lower.includes("svar") || lower.includes("reply") || lower.includes("intro")) return "cyan";
  if (lower.includes("patient") || lower.includes("nästa") || lower.includes("next") || lower.includes("uppfölj")) return "magenta";
  if (lower.includes("admin") || lower.includes("stopwatch") || lower.includes("vidimer") || lower.includes("validation")) return "lime";
  if (lower.includes("möte") || lower.includes("meeting") || lower.includes("besök") || lower.includes("visit")) return "yellow";
  if (lower.includes("djup") || lower.includes("focus") || lower.includes("fokus")) return "white";
  return "amber";
}

function parseDuration(text) {
  const match = text.match(/(\d+)\s*(tim|timmar|hour|hours|hr|hrs|h|minuter|minute|minutes|mins|min|m|sekunder|second|seconds|secs|sec|sek|s)\b/i);
  if (!match) {
    return null;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  if (unit.startsWith("tim") || unit.startsWith("hour") || unit.startsWith("hr") || unit === "h") return amount * 60 * 60 * 1000;
  if (unit.startsWith("sek") || unit.startsWith("sec") || unit.startsWith("second") || unit === "s") return amount * 1000;
  return amount * 60 * 1000;
}

function parseClockAlarm(text) {
  const match = text.match(/\b(\d{1,2})[:.](\d{2})\b/);
  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) {
    return null;
  }

  const now = new Date();
  const target = new Date(now);
  target.setHours(hours, minutes, 0, 0);
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }

  return {
    alarmAt: target.getTime(),
    durationMs: target.getTime() - now.getTime(),
    label: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
  };
}

function cleanTimerName(text) {
  return text
    .replace(/\b(skapa|lägg till|gör|bygg|create|add|make|build|timer|timers|countdown|alarm|stoppur|stopwatch|en|ett|a|an)\b/gi, "")
    .replace(/\d+\s*(tim|timmar|hour|hours|hr|hrs|h|minuter|minute|minutes|mins|min|m|sekunder|second|seconds|secs|sec|sek|s)\b/gi, "")
    .replace(/[:.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseAiPrompt(input) {
  const source = input.trim();
  if (!source) {
    return [];
  }

    const normalized = source
      .replace(/\n/g, ",")
      .replace(/\s+och\s+/gi, ",")
      .replace(/\s+and\s+/gi, ",")
      .replace(/\s+samt\s+/gi, ",");

  const rawSegments = normalized
    .split(/[,;]+/)
    .map((segment) => segment.trim())
    .filter(Boolean);

  const timers = [];

    rawSegments.forEach((segment, index) => {
      const lower = segment.toLowerCase();
      const isAlarm = lower.includes("alarm") || lower.includes("väck") || lower.includes("wake");

      if (isAlarm) {
        const clockAlarm = parseClockAlarm(segment);
        if (clockAlarm) {
        timers.push({
          name: cleanTimerName(segment) || `Alarm ${clockAlarm.label}`,
          label: `${state.settings.language === "en" ? "Alarm at" : "Alarm"} ${clockAlarm.label}`,
          type: "alarm",
          durationMs: clockAlarm.durationMs,
          remainingMs: clockAlarm.durationMs,
          alarmAt: clockAlarm.alarmAt,
          isRunning: true,
          color: inferColorFromText(segment)
        });
          return;
        }

        const alarmDurationMs = parseDuration(segment) || 5 * 60 * 1000;
        timers.push({
          name: cleanTimerName(segment) || `Alarm ${index + 1}`,
          label: state.settings.language === "en" ? "Alarm from AI prompt" : "Alarm från AI prompt",
          type: "alarm",
          durationMs: alarmDurationMs,
          remainingMs: alarmDurationMs,
          alarmAt: Date.now() + alarmDurationMs,
          isRunning: true,
          color: inferColorFromText(segment)
        });
        return;
      }

      if (lower.includes("stopwatch") || lower.includes("stoppur")) {
        const name = cleanTimerName(segment) || `Stopwatch ${index + 1}`;
        timers.push({
        name,
        label: state.settings.language === "en" ? "Created from AI prompt" : "Skapad från AI prompt",
        type: "stopwatch",
        durationMs: 0,
        color: inferColorFromText(segment),
      });
      return;
    }

    const durationMs = parseDuration(segment);
    if (!durationMs) {
      return;
    }

    const name = cleanTimerName(segment) || `Timer ${index + 1}`;
    timers.push({
      name: name.charAt(0).toUpperCase() + name.slice(1),
        label: state.settings.language === "en" ? "Created from AI prompt" : "Skapad från AI prompt",
        type: "countdown",
        durationMs,
        color: inferColorFromText(segment),
    });
  });

  return timers;
}

function createTimersFromPromptSource(promptInput, statusTarget, options = {}) {
  const prompt = promptInput?.value?.trim() || "";
  const timers = parseAiPrompt(prompt);

  if (!timers.length) {
    setAiStatus(statusTarget, t("aiNoTimers"));
    return;
  }

  const created = timers.map((timer) => createTimer(timer));
  state.timers = [...created, ...state.timers];
  state.selectedTimerId = created[0]?.id || state.selectedTimerId;
  state.activeProfileId = null;
  saveState();
  renderAll();

  setAiStatus(
    statusTarget,
    state.settings.language === "en"
      ? `${created.length} item${created.length > 1 ? "s" : ""} ${t("aiCreated")}`
      : `${created.length} objekt ${t("aiCreated")}`
  );

  if (options.closeModalAfterCreate) {
    closeModal();
  }
}

function createTimersFromPrompt() {
  createTimersFromPromptSource(dom.aiPromptInput, dom.aiStatus);
}

function startVoiceCaptureFor(promptInput, statusTarget) {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) {
    setAiStatus(statusTarget, t("aiSpeechUnsupported"));
    return;
  }

  if (speechRecognition) {
    speechRecognition.stop();
    speechRecognition = null;
  }

  speechRecognition = new Recognition();
  speechRecognition.lang = state.settings.language === "en" ? "en-US" : "sv-SE";
  speechRecognition.interimResults = false;
  speechRecognition.maxAlternatives = 1;

  speechRecognition.onstart = () => {
    setAiStatus(statusTarget, t("aiListening"));
  };

  speechRecognition.onresult = (event) => {
    const transcript = event.results?.[0]?.[0]?.transcript?.trim() || "";
    if (transcript) {
      promptInput.value = transcript;
      setAiStatus(statusTarget, t("aiSpeechCaptured"));
    } else {
      setAiStatus(statusTarget, t("aiNoTimers"));
    }
  };

  speechRecognition.onerror = () => {
    setAiStatus(statusTarget, t("aiSpeechError"));
  };

  speechRecognition.onend = () => {
    speechRecognition = null;
  };

  speechRecognition.start();
}

function startVoiceCapture() {
  startVoiceCaptureFor(dom.aiPromptInput, dom.aiStatus);
}

function updateTimer(timerId, mutator) {
  const timer = state.timers.find((entry) => entry.id === timerId);
  if (!timer) {
    return;
  }
  mutator(timer);
  saveState();
  renderAll();
}

function setModalMode(mode) {
  modalMode = mode === "ai" ? "ai" : "manual";
  const isAiMode = modalMode === "ai";

  dom.manualModeButton.classList.toggle("is-active", !isAiMode);
  dom.manualModeButton.setAttribute("aria-selected", String(!isAiMode));
  dom.aiModeButton.classList.toggle("is-active", isAiMode);
  dom.aiModeButton.setAttribute("aria-selected", String(isAiMode));
  dom.modalAiBuilder.classList.toggle("hidden", !isAiMode);
  dom.timerForm.classList.toggle("hidden", isAiMode);
}

function resetModalAiState() {
  dom.modalAiPromptInput.value = "";
  dom.modalAiStatus.dataset.locked = "false";
  dom.modalAiStatus.textContent = t("aiReady");
}

function openModal(timerId = null) {
  const timer = state.timers.find((entry) => entry.id === timerId) || null;
  dom.timerModalTitle.textContent = timer ? t("editTimer") : t("newTimer");
  dom.deleteTimerButton.classList.toggle("hidden", !timer);
  dom.timerIdInput.value = timer?.id || "";
  dom.timerNameInput.value = timer?.name || "";
  dom.timerLabelInput.value = timer?.label || "";
  dom.timerTypeInput.value = timer?.type || "countdown";
  dom.timerColorInput.value = timer?.color || "magenta";
  dom.timerDurationInput.value = timer ? Math.max(Math.round((timer.durationMs || 600000) / 60000), 1) : 10;
  dom.extraTimeInput.value = 0;
  dom.extraTimeUnitInput.value = "minutes";
  dom.modalModeSwitch.classList.toggle("hidden", Boolean(timer));
  resetModalAiState();
  setModalMode("manual");
  syncDurationVisibility();
  document.body.classList.add("modal-open");
  dom.overlay.classList.remove("hidden");
  dom.timerModal.classList.remove("hidden");
  dom.timerNameInput.focus();
}

function closeModal() {
  dom.timerModal.classList.add("hidden");
  document.body.classList.remove("modal-open");
  syncOverlay();
}

function syncDurationVisibility() {
  const countdownLike = dom.timerTypeInput.value === "countdown" || dom.timerTypeInput.value === "alarm";
  dom.durationField.classList.toggle("hidden", !countdownLike);
  document.getElementById("extraTimeFields")?.classList.toggle("hidden", !countdownLike);
}

function openDrawer() {
  document.body.classList.add("drawer-open");
  dom.overlay.classList.remove("hidden");
}

function closeDrawer() {
  document.body.classList.remove("drawer-open");
  syncOverlay();
}

function openFocus() {
  if (!state.selectedTimerId) {
    return;
  }
  isFocusOpen = true;
  dom.focusView.classList.remove("hidden");
  dom.overlay.classList.remove("hidden");
  updateFocusView();
}

function closeFocus() {
  isFocusOpen = false;
  dom.focusView.classList.add("hidden");
  syncOverlay();
}

function updateFocusView() {
  if (!isFocusOpen) {
    return;
  }

  const timer = state.timers.find((item) => item.id === state.selectedTimerId);
  if (!timer) {
    closeFocus();
    return;
  }

  const orb = renderTimerOrb(timer, Date.now()).querySelector(".orb-shell");
  orb.style.width = "100%";
  dom.focusOrb.replaceChildren(orb);
}

function syncOverlay() {
  const shouldShow = document.body.classList.contains("drawer-open") || !dom.timerModal.classList.contains("hidden") || isFocusOpen;
  dom.overlay.classList.toggle("hidden", !shouldShow);
}

function playCompletionTone() {
  if (!state.settings.soundEnabled) {
    return;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return;
  }

  try {
    const ctx = new AudioContextClass();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1240, ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.46);
  } catch (error) {
    console.warn("Could not play sound", error);
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

dom.menuButton.addEventListener("click", openDrawer);
dom.closeDrawerButton.addEventListener("click", closeDrawer);
dom.newTimerButton.addEventListener("click", () => openModal());
dom.langSvButton.addEventListener("click", () => setLanguage("sv"));
dom.langEnButton.addEventListener("click", () => setLanguage("en"));
dom.googleTranslateButton.addEventListener("click", openGoogleTranslate);
dom.saveProfileButton.addEventListener("click", saveCurrentProfile);
dom.resetBoardButton.addEventListener("click", resetBoard);
dom.clearProfilesButton.addEventListener("click", clearSavedProfiles);
dom.generateAiButton.addEventListener("click", createTimersFromPrompt);
dom.listenAiButton.addEventListener("click", startVoiceCapture);
dom.manualModeButton.addEventListener("click", () => setModalMode("manual"));
dom.aiModeButton.addEventListener("click", () => setModalMode("ai"));
dom.modalGenerateAiButton.addEventListener("click", () =>
  createTimersFromPromptSource(dom.modalAiPromptInput, dom.modalAiStatus, { closeModalAfterCreate: true })
);
dom.modalListenAiButton.addEventListener("click", () => startVoiceCaptureFor(dom.modalAiPromptInput, dom.modalAiStatus));
dom.cancelModalButton.addEventListener("click", closeModal);
dom.closeFocusButton.addEventListener("click", closeFocus);
dom.overlay.addEventListener("click", () => {
  closeDrawer();
  closeModal();
  closeFocus();
});

dom.timerTypeInput.addEventListener("change", syncDurationVisibility);

dom.timerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const id = dom.timerIdInput.value || createId();
  const name = dom.timerNameInput.value.trim();
  if (!name) {
    dom.timerNameInput.focus();
    return;
  }
  const type =
    dom.timerTypeInput.value === "stopwatch"
      ? "stopwatch"
      : dom.timerTypeInput.value === "alarm"
        ? "alarm"
        : "countdown";
  const baseDurationMs = Math.max(Number(dom.timerDurationInput.value) || 10, 1) * 60 * 1000;
  const extraValue = Math.max(Number(dom.extraTimeInput.value) || 0, 0);
  const extraUnit = dom.extraTimeUnitInput.value === "hours" ? "hours" : "minutes";
  const extraMs = extraValue * (extraUnit === "hours" ? 60 * 60 * 1000 : 60 * 1000);
  const existing = state.timers.find((timer) => timer.id === id);
  const now = Date.now();
  const existingCurrentMs = existing ? getRuntimeMs(existing, now) : 0;
  const isCountdownLike = type === "countdown" || type === "alarm";
  let durationMs = isCountdownLike ? baseDurationMs + extraMs : 0;
  let remainingMs = isCountdownLike ? durationMs : 0;

  if (existing && isCountdownLike && extraMs > 0) {
    remainingMs = Math.max(existingCurrentMs + extraMs, 60 * 1000);
    durationMs = Math.max(durationMs, remainingMs);
  }

  const timer = createTimer({
    id,
    name,
    label: dom.timerLabelInput.value.trim(),
    type,
    color: dom.timerColorInput.value,
    durationMs,
    remainingMs,
    alarmAt: type === "alarm" ? now + remainingMs : null
  });

  if (existing) {
    if (isCountdownLike && existing.isRunning) {
      timer.isRunning = true;
      if (type === "alarm") {
        timer.alarmAt = now + remainingMs;
      } else {
        timer.endAt = now + remainingMs;
      }
    }
    if (type === "stopwatch" && existing.type === "stopwatch") {
      timer.elapsedMs = existingCurrentMs;
      if (existing.isRunning) {
        timer.isRunning = true;
        timer.startedAt = now - existingCurrentMs;
      }
    }

    const index = state.timers.findIndex((entry) => entry.id === id);
    state.timers[index] = { ...timer, completedCount: existing.completedCount };
  } else {
    state.timers.unshift(timer);
  }

  state.selectedTimerId = id;
  state.activeProfileId = null;
  saveState();
  renderAll();
  closeModal();
});

dom.deleteTimerButton.addEventListener("click", () => {
  const timerId = dom.timerIdInput.value;
  if (!timerId) {
    return;
  }
  removeTimer(timerId);
  closeModal();
});

dom.soundToggle.addEventListener("change", () => {
  state.settings.soundEnabled = dom.soundToggle.checked;
  saveState();
});

dom.millisecondsToggle.addEventListener("change", () => {
  state.settings.showMilliseconds = dom.millisecondsToggle.checked;
  saveState();
  renderAll();
});

dom.motionToggle.addEventListener("change", () => {
  state.settings.ambientMotion = dom.motionToggle.checked;
  saveState();
  applyMotionSetting();
});

dom.clearHistoryButton.addEventListener("click", () => {
  state.history = [];
  saveState();
  renderHistory();
});

window.addEventListener("keydown", (event) => {
  const activeTag = document.activeElement?.tagName;
  if (activeTag === "INPUT" || activeTag === "SELECT" || activeTag === "TEXTAREA") {
    return;
  }

  if (event.code === "Space" && state.selectedTimerId) {
    event.preventDefault();
    toggleTimer(state.selectedTimerId);
  } else if (event.key.toLowerCase() === "n") {
    event.preventDefault();
    openModal();
  } else if (event.key.toLowerCase() === "f" && state.selectedTimerId) {
    event.preventDefault();
    openFocus();
  }
});
