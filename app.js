const STORAGE_KEY = "aitimer-free-v1";
const HISTORY_LIMIT = 12;

const COLOR_THEMES = {
  magenta: {
    ring: "#ff2bd6",
    glow: "rgba(255, 43, 214, 0.28)",
    text: "#ff6ee7",
  },
  cyan: {
    ring: "#00f5ff",
    glow: "rgba(0, 245, 255, 0.28)",
    text: "#7dfaff",
  },
  lime: {
    ring: "#33ff4f",
    glow: "rgba(51, 255, 79, 0.26)",
    text: "#98ffaa",
  },
  amber: {
    ring: "#ff9f1c",
    glow: "rgba(255, 159, 28, 0.28)",
    text: "#ffc266",
  },
  red: {
    ring: "#ff3131",
    glow: "rgba(255, 49, 49, 0.28)",
    text: "#ff8484",
  },
  yellow: {
    ring: "#ffef29",
    glow: "rgba(255, 239, 41, 0.28)",
    text: "#fff27e",
  },
  white: {
    ring: "#ffffff",
    glow: "rgba(255, 255, 255, 0.18)",
    text: "#ffffff",
  },
};

const PRESET_LIBRARY = [
  {
    name: "Nästa patient",
    label: "Snabb återställning mellan möten",
    type: "countdown",
    durationMs: 10 * 60 * 1000,
    color: "magenta",
  },
  {
    name: "Laboratoriesvar",
    label: "Standard väntetid för svar",
    type: "countdown",
    durationMs: 10 * 60 * 1000,
    color: "lime",
  },
  {
    name: "Besökstid",
    label: "Håll koll på pågående besök",
    type: "countdown",
    durationMs: 20 * 60 * 1000,
    color: "yellow",
  },
  {
    name: "Verifiering",
    label: "Tid per patient vidimering",
    type: "stopwatch",
    durationMs: 0,
    color: "cyan",
  },
  {
    name: "5 min paus",
    label: "Kort reset mellan block",
    type: "countdown",
    durationMs: 5 * 60 * 1000,
    color: "red",
  },
  {
    name: "Pomodoro",
    label: "25 min fokus / helt gratis",
    type: "countdown",
    durationMs: 25 * 60 * 1000,
    color: "amber",
  },
];

const DEFAULT_TIMERS = [
  {
    name: "Besökstid 20 min",
    label: "Tid för besök",
    type: "countdown",
    durationMs: 20 * 60 * 1000,
    color: "yellow",
  },
  {
    name: "Nästa patient",
    label: "Nästa pat",
    type: "countdown",
    durationMs: 10 * 60 * 1000,
    color: "magenta",
  },
  {
    name: "Vidimering",
    label: "Tid per patient",
    type: "stopwatch",
    durationMs: 0,
    color: "lime",
  },
  {
    name: "Laboratoriesvar",
    label: "Lab svar",
    type: "countdown",
    durationMs: 10 * 60 * 1000,
    color: "cyan",
  },
  {
    name: "5 min",
    label: "Kort paus",
    type: "countdown",
    durationMs: 5 * 60 * 1000,
    color: "red",
  },
];

const dom = {
  timerBoard: document.getElementById("timerBoard"),
  selectedPanel: document.getElementById("selectedPanel"),
  presetGrid: document.getElementById("presetGrid"),
  historyList: document.getElementById("historyList"),
  overlay: document.getElementById("overlay"),
  menuButton: document.getElementById("menuButton"),
  closeDrawerButton: document.getElementById("closeDrawerButton"),
  newTimerButton: document.getElementById("newTimerButton"),
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
  closeFocusButton: document.getElementById("closeFocusButton"),
};

let state = loadState();
let isFocusOpen = false;

ensureSelectedTimer();
renderAll();
window.setInterval(tick, 100);

function loadState() {
  const base = {
    settings: {
      soundEnabled: true,
      showMilliseconds: true,
      ambientMotion: true,
    },
    timers: DEFAULT_TIMERS.map((timer) => createTimer(timer)),
    history: [],
    selectedTimerId: null,
  };

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      base.selectedTimerId = base.timers[0]?.id ?? null;
      return base;
    }

    const parsed = JSON.parse(raw);
    const timers = Array.isArray(parsed.timers)
      ? parsed.timers.map((timer) => normalizeTimer(timer)).filter(Boolean)
      : base.timers;

    return {
      settings: {
        ...base.settings,
        ...(parsed.settings || {}),
      },
      timers: timers.length ? timers : base.timers,
      history: Array.isArray(parsed.history) ? parsed.history.slice(0, HISTORY_LIMIT) : [],
      selectedTimerId: parsed.selectedTimerId || timers[0]?.id || base.timers[0]?.id || null,
    };
  } catch (error) {
    console.warn("Kunde inte läsa lokal state", error);
    base.selectedTimerId = base.timers[0]?.id ?? null;
    return base;
  }
}

function createTimer(seed) {
  return normalizeTimer({
    id: seed.id || crypto.randomUUID(),
    name: seed.name,
    label: seed.label || "",
    type: seed.type || "countdown",
    color: seed.color || "cyan",
    durationMs: Math.max(Number(seed.durationMs) || 0, seed.type === "countdown" ? 60 * 1000 : 0),
    remainingMs:
      seed.type === "countdown"
        ? Math.max(Number(seed.remainingMs ?? seed.durationMs) || 0, 0)
        : 0,
    elapsedMs: Math.max(Number(seed.elapsedMs) || 0, 0),
    isRunning: Boolean(seed.isRunning),
    endAt: seed.endAt || null,
    startedAt: seed.startedAt || null,
    completedCount: Number(seed.completedCount) || 0,
  });
}

function normalizeTimer(timer) {
  if (!timer || !timer.name) {
    return null;
  }

  const type = timer.type === "stopwatch" ? "stopwatch" : "countdown";
  const normalized = {
    id: timer.id || crypto.randomUUID(),
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
    completedCount: Number(timer.completedCount) || 0,
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
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function ensureSelectedTimer() {
  const exists = state.timers.some((timer) => timer.id === state.selectedTimerId);
  if (!exists) {
    state.selectedTimerId = state.timers[0]?.id ?? null;
  }
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
        id: crypto.randomUUID(),
        timerId: timer.id,
        name: timer.name,
        completedAt: now,
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
  renderPresetGrid();
  renderHistory();
  updateFocusView();
}

function renderBoard() {
  const now = Date.now();
  const elements = [renderClockOrb(now), ...state.timers.map((timer) => renderTimerOrb(timer, now))];
  dom.timerBoard.replaceChildren(...elements);
}

function renderClockOrb(now) {
  const wrapper = document.createElement("article");
  wrapper.className = "clock-orb";
  const shell = createOrbShell({
    color: "white",
    progress: 1,
    className: "clock-shell",
  });
  const time = formatClock(now);
  shell.innerHTML = `
    <div class="orb-content">
      <div class="orb-time">${time.main}<small>${time.trail}</small></div>
      <div class="orb-rule"></div>
      <div class="orb-title">Live clock</div>
      <p class="clock-meta">${new Intl.DateTimeFormat("sv-SE", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(now)}</p>
    </div>
  `;
  wrapper.appendChild(shell);
  return wrapper;
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
    selected: timer.id === state.selectedTimerId,
  });

  const time = formatTimerDisplay(timer, now);
  const meta = timerMeta(timer, now);
  shell.innerHTML = `
    <div class="orb-content" style="color:${theme.text}">
      <div class="orb-time">${time.main}<small>${time.trail}</small></div>
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

  button.addEventListener("dblclick", () => {
    toggleTimer(timer.id);
  });

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
  const timer = state.timers.find((item) => item.id === state.selectedTimerId) || state.timers[0];
  if (!timer) {
    dom.selectedPanel.innerHTML = `
      <div class="selected-hero">
        <div class="panel-heading">
          <p class="section-kicker">Vald timer</p>
          <h3>Ingen timer ännu</h3>
        </div>
        <p class="selected-copy">Öppna sidopanelen och lägg till en preset för att komma igång.</p>
      </div>
    `;
    return;
  }

  const now = Date.now();
  const runtime = getRuntimeMs(timer, now);
  const duration = timer.type === "countdown" ? timer.durationMs : runtime;
  const time = formatTimerDisplay(timer, now);
  const theme = COLOR_THEMES[timer.color];

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
            <div class="orb-time">${time.main}<small>${time.trail}</small></div>
            <div class="orb-rule"></div>
            <div class="orb-title">${escapeHtml(timer.label || "Aktiv kontroll")}</div>
          </div>
        </div>
      </div>

      <p class="selected-copy">${escapeHtml(selectedDescription(timer, now))}</p>

      <div class="selected-stats">
        <div class="stat-chip">
          <span>Status</span>
          <strong>${timerStatusLabel(timer, now)}</strong>
        </div>
        <div class="stat-chip">
          <span>Avklarad</span>
          <strong>${timer.completedCount} ggr</strong>
        </div>
        <div class="stat-chip">
          <span>Tid</span>
          <strong>${formatLongDuration(duration)}</strong>
        </div>
        <div class="stat-chip">
          <span>Färg</span>
          <strong>${timer.color}</strong>
        </div>
      </div>

      <div class="timer-actions">
        <button class="action-button action-button-primary" data-action="toggle">
          ${timer.isRunning ? "Pausa" : "Starta"}
        </button>
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
    </div>
  `;

  dom.selectedPanel.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.getAttribute("data-action");
      handleSelectedAction(timer.id, action);
    });
  });
}

function renderPresetGrid() {
  const buttons = PRESET_LIBRARY.map((preset) => {
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
    dom.historyList.innerHTML = `<div class="history-empty">Ingen historik ännu. När en countdown går i mål dyker den upp här.</div>`;
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
      return { label: "Färdig", meta: "Återställ eller starta om" };
    }
    if (timer.isRunning) {
      return { label: "Aktiv", meta: `Kvar ${formatLongDuration(remaining)}` };
    }
    return { label: "Pausad", meta: `Preset ${formatLongDuration(timer.durationMs)}` };
  }

  if (timer.isRunning) {
    return { label: "Spårar nu", meta: "Dubbelklicka för paus" };
  }
  return { label: "Redo", meta: "Starta när du vill mäta" };
}

function selectedDescription(timer, now) {
  if (timer.type === "countdown") {
    const remaining = getRuntimeMs(timer, now);
    if (remaining <= 0) {
      return "Timern har gått i mål. Återställ för att köra samma intervall igen eller redigera tiden för ett nytt scenario.";
    }
    if (timer.isRunning) {
      return "Den här countdownen rullar live. Du kan lägga till minuter i farten eller hoppa in i fokusläge för en ren fullscreen-visning.";
    }
    return "Timern är pausad och väntar. Justera tiden, byt färg eller starta när nästa block börjar.";
  }

  return timer.isRunning
    ? "Stopwatchen mäter aktivt. Perfekt för ärendetid, moment per patient eller andra öppna arbetsflöden."
    : "Stopwatchen är redo att starta. Bra när du inte vet exakt hur länge ett moment kommer att ta.";
}

function timerStatusLabel(timer, now) {
  if (timer.type === "countdown" && getRuntimeMs(timer, now) <= 0) {
    return "Färdig";
  }
  return timer.isRunning ? "Kör" : "Redo";
}

function formatTimerDisplay(timer, now) {
  const runtime = getRuntimeMs(timer, now);
  if (timer.type === "countdown") {
    return formatCountdown(runtime);
  }
  return formatStopwatch(runtime, state.settings.showMilliseconds);
}

function formatClock(now) {
  const date = new Date(now);
  return {
    main: `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`,
    trail: `:${String(date.getSeconds()).padStart(2, "0")}`,
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
      trail: `:${String(seconds).padStart(2, "0")}`,
    };
  }

  return {
    main: `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
    trail: "",
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
      trail: `:${String(seconds).padStart(2, "0")}`,
    };
  }

  if (!showMilliseconds) {
    return {
      main: `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
      trail: "",
    };
  }

  if (minutes === 0) {
    return {
      main: `${String(seconds).padStart(2, "0")}`,
      trail: `.${String(milliseconds).padStart(3, "0")}`,
    };
  }

  return {
    main: `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
    trail: `.${String(Math.floor(milliseconds / 10)).padStart(2, "0")}`,
  };
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
    month: "short",
  }).format(date);
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

    const now = Date.now();
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
    id: crypto.randomUUID(),
    name: `${source.name} Kopia`,
    remainingMs: source.type === "countdown" ? source.durationMs : 0,
    elapsedMs: 0,
    isRunning: false,
    endAt: null,
    startedAt: null,
    completedCount: 0,
  });
  state.timers.unshift(duplicate);
  state.selectedTimerId = duplicate.id;
  saveState();
  renderAll();
}

function removeTimer(timerId) {
  if (state.timers.length === 1) {
    resetTimer(timerId);
    return;
  }

  state.timers = state.timers.filter((timer) => timer.id !== timerId);
  ensureSelectedTimer();
  saveState();
  renderAll();
}

function addPreset(preset) {
  const timer = createTimer(preset);
  state.timers.unshift(timer);
  state.selectedTimerId = timer.id;
  saveState();
  renderAll();
  closeDrawer();
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
  const isCountdown = dom.timerTypeInput.value === "countdown";
  dom.durationField.classList.toggle("hidden", !isCountdown);
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
  const shouldShow =
    document.body.classList.contains("drawer-open") ||
    !dom.timerModal.classList.contains("hidden") ||
    isFocusOpen;
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
    console.warn("Kunde inte spela ljud", error);
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

  const id = dom.timerIdInput.value || crypto.randomUUID();
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
    remainingMs: type === "countdown" ? durationMs : 0,
  });

  if (existing) {
    const index = state.timers.findIndex((entry) => entry.id === id);
    state.timers[index] = {
      ...timer,
      completedCount: existing.completedCount,
    };
  } else {
    state.timers.unshift(timer);
  }

  state.selectedTimerId = id;
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
  if (activeTag === "INPUT" || activeTag === "SELECT" || !state.selectedTimerId) {
    return;
  }

  if (event.code === "Space") {
    event.preventDefault();
    toggleTimer(state.selectedTimerId);
  } else if (event.key.toLowerCase() === "n") {
    event.preventDefault();
    openModal();
  } else if (event.key.toLowerCase() === "f") {
    event.preventDefault();
    openFocus();
  }
});
