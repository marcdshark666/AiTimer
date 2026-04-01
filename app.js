const STORAGE_KEY = "aitimer-free-v2";
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
  cancelModalButton: document.getElementById("cancelModalButton"),
  deleteTimerButton: document.getElementById("deleteTimerButton"),
  timerIdInput: document.getElementById("timerIdInput"),
  timerNameInput: document.getElementById("timerNameInput"),
  timerLabelInput: document.getElementById("timerLabelInput"),
  timerTypeInput: document.getElementById("timerTypeInput"),
  timerColorInput: document.getElementById("timerColorInput"),
  timerDurationInput: document.getElementById("timerDurationInput"),
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

ensureSelectedTimer();
renderAll();
window.setInterval(tick, 100);

function createId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadState() {
  const base = {
    version: 2,
    settings: {
      soundEnabled: true,
      showMilliseconds: true,
      ambientMotion: true
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
  return normalizeTimer({
    id: seed.id || createId(),
    name: seed.name,
    label: seed.label || "",
    type: seed.type || "countdown",
    color: seed.color || "cyan",
    durationMs: Math.max(Number(seed.durationMs) || 0, seed.type === "countdown" ? 60 * 1000 : 0),
    remainingMs: seed.type === "countdown" ? Math.max(Number(seed.remainingMs ?? seed.durationMs) || 0, 0) : 0,
    elapsedMs: Math.max(Number(seed.elapsedMs) || 0, 0),
    isRunning: Boolean(seed.isRunning),
    endAt: seed.endAt || null,
    startedAt: seed.startedAt || null,
    completedCount: Number(seed.completedCount) || 0
  });
}

function normalizeTimer(timer) {
  if (!timer || !timer.name) {
    return null;
  }

  const type = timer.type === "stopwatch" ? "stopwatch" : "countdown";
  const normalized = {
    id: timer.id || createId(),
    name: String(timer.name).slice(0, 32),
    label: String(timer.label || "").slice(0, 48),
    type,
    color: COLOR_THEMES[timer.color] ? timer.color : "cyan",
    durationMs: type === "countdown" ? Math.max(Number(timer.durationMs) || 60 * 1000, 60 * 1000) : 0,
    remainingMs: type === "countdown" ? Math.max(Number(timer.remainingMs ?? timer.durationMs) || 0, 0) : 0,
    elapsedMs: type === "stopwatch" ? Math.max(Number(timer.elapsedMs) || 0, 0) : 0,
    isRunning: Boolean(timer.isRunning),
    endAt: timer.endAt || null,
    startedAt: timer.startedAt || null,
    completedCount: Number(timer.completedCount) || 0
  };

  if (normalized.type === "countdown" && normalized.isRunning && !normalized.endAt) {
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
    if (timer.type === "countdown" && timer.isRunning && timer.endAt && timer.endAt <= now) {
      timer.isRunning = false;
      timer.endAt = null;
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
  const elements = [renderClockOrb(now)];

  if (!state.timers.length) {
    elements.push(renderEmptyBoardCard());
  } else {
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
      <div class="orb-title">Live clock</div>
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

function renderTimerOrb(timer, now) {
  const theme = COLOR_THEMES[timer.color];
  const wrapper = document.createElement("article");
  wrapper.className = "timer-orb";
  wrapper.dataset.type = timer.type;
  wrapper.dataset.state = timerState(timer, now);

  const button = document.createElement("button");
  button.type = "button";
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

  wrapper.appendChild(button);
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
          <button class="primary-button" data-panel-action="open-library">Profiler</button>
          <button class="ghost-button" data-panel-action="new-timer">Ny timer</button>
          <button class="ghost-button" data-panel-action="reset-board">Reset board</button>
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
  const profileLabel = activeProfile ? activeProfile.name : "Anpassad board";
  const profileTypeLabel = activeProfile ? (activeProfile.builtIn ? "Profil" : "Sparad") : "Custom";

  dom.selectedPanel.innerHTML = `
    <div class="selected-hero">
      <div class="selected-header">
        <div>
          <p class="section-kicker">Vald timer</p>
          <h3>${escapeHtml(timer.name)}</h3>
        </div>
        <span class="selected-tag">${timer.type === "countdown" ? "Countdown" : "Stopwatch"}</span>
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
        <div class="stat-chip"><span>Board</span><strong>${escapeHtml(profileLabel)}</strong></div>
        <div class="stat-chip"><span>Tid</span><strong>${formatLongDuration(duration)}</strong></div>
        <div class="stat-chip"><span>Läge</span><strong>${profileTypeLabel}</strong></div>
      </div>

      <div class="timer-actions">
        <button class="action-button action-button-primary" data-action="toggle">${timer.isRunning ? "Pausa" : "Starta"}</button>
        <button class="action-button" data-action="reset">Återställ</button>
      </div>

      <div class="mini-action-row">
        <button class="mini-action" data-action="plus-1">+1 min</button>
        <button class="mini-action" data-action="plus-5">+5 min</button>
        <button class="mini-action" data-action="focus">Fokus</button>
      </div>

      <div class="mini-action-row">
        <button class="mini-action" data-action="edit">Redigera</button>
        <button class="mini-action" data-action="duplicate">Duplicera</button>
        <button class="mini-action" data-action="remove">Ta bort</button>
      </div>

      <div class="selected-actions-secondary">
        <button class="ghost-button" data-action="save-profile">Spara profil</button>
        <button class="ghost-button" data-action="open-library">Profiler</button>
        <button class="ghost-button" data-action="reset-board">Reset board</button>
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
        <button class="primary-button" data-profile-id="${profile.id}">Ladda profil</button>
      </div>
    `;
    card.querySelector("[data-profile-id]").addEventListener("click", () => applyProfile(profile));
    return card;
  });

  dom.profileGrid.replaceChildren(...cards);
}

function renderSavedProfiles() {
  if (!state.savedProfiles.length) {
    dom.savedProfileList.innerHTML = '<div class="saved-profile-empty">Inga profiler sparade ännu. Bygg en board och klicka på Spara profil.</div>';
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
        <button class="ghost-button" data-saved-action="apply">Ladda</button>
        <button class="ghost-button" data-saved-action="remove">Ta bort</button>
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
    dom.historyList.innerHTML = '<div class="history-empty">Ingen historik ännu. När en countdown går i mål dyker den upp här.</div>';
    return;
  }

  const items = state.history.map((entry) => {
    const item = document.createElement("div");
    item.className = "history-item";
    item.innerHTML = `
      <div>
        <strong>${escapeHtml(entry.name)}</strong>
        <p>Countdown färdig</p>
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
  if (timer.type === "countdown" && getRuntimeMs(timer, now) <= 0) {
    return "finished";
  }
  return timer.isRunning ? "running" : "idle";
}

function progressForTimer(timer, now) {
  if (timer.type === "countdown") {
    const runtime = getRuntimeMs(timer, now);
    return timer.durationMs ? (timer.durationMs - runtime) / timer.durationMs : 0;
  }
  return ((getRuntimeMs(timer, now) % (60 * 1000)) / (60 * 1000)) || 0.04;
}

function getRuntimeMs(timer, now) {
  if (timer.type === "countdown") {
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
  if (timer.type === "countdown") {
    const remaining = getRuntimeMs(timer, now);
    if (remaining <= 0) {
      return { label: "Klar", meta: "Redo för ny start" };
    }
    if (timer.isRunning) {
      return { label: "Aktiv", meta: `Kvar ${formatCompactDuration(remaining)}` };
    }
    return { label: "Pausad", meta: formatCompactDuration(timer.durationMs) };
  }

  if (timer.isRunning) {
    return { label: "Aktiv", meta: "Mäter live" };
  }
  return { label: "Redo", meta: "Tryck start" };
}

function selectedDescription(timer, now) {
  if (timer.type === "countdown") {
    const remaining = getRuntimeMs(timer, now);
    if (remaining <= 0) {
      return "Timern har gått i mål. Återställ för att köra samma intervall igen eller spara upplägget som profil.";
    }
    if (timer.isRunning) {
      return "Den här countdownen rullar live. Du kan lägga till minuter i farten eller öppna fokusläge för en ren fullscreen-visning.";
    }
    return "Timern väntar i standby. Justera tiden, byt färg eller spara hela boarden som en professionell profil.";
  }

  return timer.isRunning
    ? "Stopwatchen mäter aktivt. Perfekt för öppna arbetsflöden där sluttiden inte är bestämd från start."
    : "Stopwatchen är redo att starta. Bra när du vill mäta verklig tidsåtgång utan förinställd sluttid.";
}

function timerStatusLabel(timer, now) {
  if (timer.type === "countdown" && getRuntimeMs(timer, now) <= 0) {
    return "Klar";
  }
  return timer.isRunning ? "Kör" : "Redo";
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
    if (timer.type === "countdown") {
      if (getRuntimeMs(timer, now) <= 0) {
        timer.remainingMs = timer.durationMs;
      }
      if (timer.isRunning) {
        timer.remainingMs = getRuntimeMs(timer, now);
        timer.endAt = null;
        timer.isRunning = false;
      } else {
        timer.endAt = now + getRuntimeMs(timer, now);
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
    timer.startedAt = null;
    timer.remainingMs = timer.type === "countdown" ? timer.durationMs : 0;
    timer.elapsedMs = 0;
  });
}

function bumpTimer(timerId, deltaMs) {
  updateTimer(timerId, (timer) => {
    if (timer.type !== "countdown") {
      return;
    }
    if (timer.isRunning && timer.endAt) {
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
    window.alert("Skapa eller ladda timers först, sedan kan du spara profilen.");
    return;
  }

  const existingSaved = state.savedProfiles.find((profile) => profile.id === state.activeProfileId) || null;
  const suggestedName = existingSaved?.name || getActiveProfile()?.name || "Min profil";
  const name = window.prompt("Namn på profil", suggestedName);
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

function setAiStatus(message) {
  dom.aiStatus.textContent = message;
}

function inferColorFromText(text) {
  const lower = text.toLowerCase();
  if (lower.includes("paus") || lower.includes("triage")) return "red";
  if (lower.includes("lab") || lower.includes("svar") || lower.includes("intro")) return "cyan";
  if (lower.includes("patient") || lower.includes("nästa") || lower.includes("uppfölj")) return "magenta";
  if (lower.includes("admin") || lower.includes("stopwatch") || lower.includes("vidimer")) return "lime";
  if (lower.includes("möte") || lower.includes("besök")) return "yellow";
  if (lower.includes("djup") || lower.includes("fokus")) return "white";
  return "amber";
}

function parseDuration(text) {
  const match = text.match(/(\d+)\s*(tim|timmar|h|min|m|minuter|sek|sekunder|s)\b/i);
  if (!match) {
    return null;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  if (unit.startsWith("tim") || unit === "h") return amount * 60 * 60 * 1000;
  if (unit.startsWith("sek") || unit === "s") return amount * 1000;
  return amount * 60 * 1000;
}

function cleanTimerName(text) {
  return text
    .replace(/\b(skapa|lägg till|gör|bygg|timer|timers|en|ett)\b/gi, "")
    .replace(/\d+\s*(tim|timmar|h|min|m|minuter|sek|sekunder|s)\b/gi, "")
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
    .replace(/\s+samt\s+/gi, ",");

  const rawSegments = normalized
    .split(/[,;]+/)
    .map((segment) => segment.trim())
    .filter(Boolean);

  const timers = [];

  rawSegments.forEach((segment, index) => {
    const lower = segment.toLowerCase();
    if (lower.includes("stopwatch") || lower.includes("stoppur")) {
      const name = cleanTimerName(segment) || `Stopwatch ${index + 1}`;
      timers.push({
        name,
        label: "Skapad från AI prompt",
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
      label: "Skapad från AI prompt",
      type: "countdown",
      durationMs,
      color: inferColorFromText(segment),
    });
  });

  return timers;
}

function createTimersFromPrompt() {
  const prompt = dom.aiPromptInput.value.trim();
  const timers = parseAiPrompt(prompt);

  if (!timers.length) {
    setAiStatus("Jag hittade inga tydliga timers. Prova till exempel: besök 20 min, labsvar 10 min, paus 5 min.");
    return;
  }

  const created = timers.map((timer) => createTimer(timer));
  state.timers = [...created, ...state.timers];
  state.selectedTimerId = created[0]?.id || state.selectedTimerId;
  state.activeProfileId = null;
  saveState();
  renderAll();
  setAiStatus(`${created.length} timer${created.length > 1 ? "s" : ""} skapades från AI-prompten.`);
}

function startVoiceCapture() {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) {
    setAiStatus("Röststyrning stöds inte i den här webbläsaren. Skriv prompten i stället.");
    return;
  }

  if (speechRecognition) {
    speechRecognition.stop();
    speechRecognition = null;
  }

  speechRecognition = new Recognition();
  speechRecognition.lang = "sv-SE";
  speechRecognition.interimResults = false;
  speechRecognition.maxAlternatives = 1;

  speechRecognition.onstart = () => {
    setAiStatus("Lyssnar nu. Beskriv timers med minuter eller säg stopwatch.");
  };

  speechRecognition.onresult = (event) => {
    const transcript = event.results?.[0]?.[0]?.transcript?.trim() || "";
    if (transcript) {
      dom.aiPromptInput.value = transcript;
      setAiStatus("Röst fångad. Klicka på Skapa med AI för att bygga timers.");
    } else {
      setAiStatus("Jag hörde inget tydligt. Försök igen.");
    }
  };

  speechRecognition.onerror = () => {
    setAiStatus("Kunde inte läsa mikrofonen. Kontrollera tillstånd och försök igen.");
  };

  speechRecognition.onend = () => {
    speechRecognition = null;
  };

  speechRecognition.start();
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
function openModal(timerId = null) {
  const timer = state.timers.find((entry) => entry.id === timerId) || null;
  dom.timerModalTitle.textContent = timer ? "Redigera timer" : "Ny timer";
  dom.deleteTimerButton.classList.toggle("hidden", !timer);
  dom.timerIdInput.value = timer?.id || "";
  dom.timerNameInput.value = timer?.name || "";
  dom.timerLabelInput.value = timer?.label || "";
  dom.timerTypeInput.value = timer?.type || "countdown";
  dom.timerColorInput.value = timer?.color || "magenta";
  dom.timerDurationInput.value = timer ? Math.max(Math.round((timer.durationMs || 600000) / 60000), 1) : 10;
  syncDurationVisibility();
  dom.overlay.classList.remove("hidden");
  dom.timerModal.classList.remove("hidden");
  dom.timerNameInput.focus();
}

function closeModal() {
  dom.timerModal.classList.add("hidden");
  syncOverlay();
}

function syncDurationVisibility() {
  dom.durationField.classList.toggle("hidden", dom.timerTypeInput.value !== "countdown");
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
dom.saveProfileButton.addEventListener("click", saveCurrentProfile);
dom.resetBoardButton.addEventListener("click", resetBoard);
dom.clearProfilesButton.addEventListener("click", clearSavedProfiles);
dom.generateAiButton.addEventListener("click", createTimersFromPrompt);
dom.listenAiButton.addEventListener("click", startVoiceCapture);
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
  const type = dom.timerTypeInput.value === "stopwatch" ? "stopwatch" : "countdown";
  const durationMs = Math.max(Number(dom.timerDurationInput.value) || 10, 1) * 60 * 1000;
  const existing = state.timers.find((timer) => timer.id === id);

  const timer = createTimer({
    id,
    name: dom.timerNameInput.value.trim(),
    label: dom.timerLabelInput.value.trim(),
    type,
    color: dom.timerColorInput.value,
    durationMs,
    remainingMs: type === "countdown" ? durationMs : 0
  });

  if (existing) {
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
  if (activeTag === "INPUT" || activeTag === "SELECT") {
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
