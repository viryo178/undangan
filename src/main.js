import "./style.css";

requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.body.classList.add("cover-ready");
  });
});

const audio       = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const musicLabel  = document.getElementById("musicLabel");
const iconPlay    = document.getElementById("iconPlay");
const iconPause   = document.getElementById("iconPause");
const musicBars   = document.getElementById("musicBars");
const musicPlayer = document.getElementById("musicPlayer");

let isPlaying = false;

function setPlayingState(playing) {
  isPlaying = playing;
  if (playing) {
    iconPlay.classList.add("hidden");
    iconPause.classList.remove("hidden");
    musicLabel.textContent = "Jeda Musik";
    musicBars.classList.add("playing");
  } else {
    iconPlay.classList.remove("hidden");
    iconPause.classList.add("hidden");
    musicLabel.textContent = "Putar Musik";
    musicBars.classList.remove("playing");
    audio.pause();
  }
}

async function playMusic() {
  try {
    await audio.play();
    setPlayingState(true);
    return true;
  } catch {
    setPlayingState(false);
    return false;
  }
}

musicToggle.addEventListener("click", () => {
  if (isPlaying) {
    setPlayingState(false);
  } else {
    playMusic();
  }
});
let autoplayTriggered = false;
function triggerAutoplay() {
  if (!autoplayTriggered) {
    autoplayTriggered = true;
    playMusic();
  }
}

// Coba putar segera saat halaman dibuka atau di-refresh. Jika browser
// memblokir autoplay bersuara, interaksi pertama pengunjung akan mencobanya lagi.
triggerAutoplay();

const resumeMusicOnFirstInteraction = async (event) => {
  // Biarkan tombol musik menangani kliknya sendiri agar tidak langsung terjeda.
  if (event.target instanceof Element && event.target.closest("#musicToggle")) return;
  if (!isPlaying) await playMusic();
  if (isPlaying) {
    document.removeEventListener("pointerdown", resumeMusicOnFirstInteraction);
    document.removeEventListener("keydown", resumeMusicOnFirstInteraction);
  }
};

document.addEventListener("pointerdown", resumeMusicOnFirstInteraction);
document.addEventListener("keydown", resumeMusicOnFirstInteraction);

const invitationSection = document.getElementById("ucapan");
const guestGate = document.getElementById("guestGate");
const guestGateForm = document.getElementById("guestGateForm");
const guestGateReady = document.getElementById("guestGateReady");
const guestNameInput = document.getElementById("guestName");
const guestGateError = document.getElementById("guestGateError");
let guestName = "";

function getGuestNameFromUrl() {
  const queryName = new URLSearchParams(window.location.search).get("to");
  if (queryName?.trim()) return queryName.trim();

  const basePath = "/undangan/";
  const path = window.location.pathname;
  const encodedName = path.startsWith(basePath)
    ? path.slice(basePath.length)
    : path.replace(/^\/+/, "");

  if (!encodedName || encodedName === "index.html" || encodedName === "generator.php") return "";

  try {
    return decodeURIComponent(encodedName.replace(/\/+$/, "")).trim();
  } catch {
    return "";
  }
}

function applyGuestName(name) {
  guestName = name.trim();
  const adaptiveSize = Math.max(13, Math.min(25, 28 - guestName.length * 0.3));
  document.querySelectorAll("[data-guest-name]").forEach((element) => {
    element.textContent = guestName || "Tamu Undangan";
    element.style.fontSize = `${adaptiveSize}px`;
    element.title = guestName;
  });
  const rsvpName = document.getElementById("rsvpName");
  const ucapanName = document.getElementById("ucapanName");
  if (rsvpName) rsvpName.value = guestName;
  if (ucapanName) ucapanName.value = guestName;
}

function openInvitation() {
  if (!guestName) {
    guestNameInput?.focus();
    return;
  }
  triggerAutoplay();
  guestGate?.classList.add("is-closing");
  document.body.classList.remove("invitation-locked");
  document.body.classList.add("invitation-opened");
  setTimeout(() => { if (guestGate) guestGate.hidden = true; }, 480);
  requestAnimationFrame(() => invitationSection?.scrollIntoView({ behavior: "smooth", block: "start" }));
}

guestGateForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = guestNameInput?.value.trim() || "";
  if (name.length < 2) {
    guestGateError.textContent = "Mohon masukkan nama terlebih dahulu.";
    return;
  }
  guestGateError.textContent = "";
  applyGuestName(name);
  localStorage.setItem("haziqGuest", JSON.stringify({ name }));
  guestGate?.classList.add("is-closing");
  setTimeout(() => document.body.classList.add("cover-personalized"), 180);
  setTimeout(() => { if (guestGate) guestGate.hidden = true; }, 480);
  document.getElementById("home")?.scrollIntoView({ block: "start" });
});

document.getElementById("guestEdit")?.addEventListener("click", () => {
  guestGateReady.hidden = true;
  guestGateForm.hidden = false;
  guestGate?.classList.remove("guest-ready");
  guestNameInput?.focus();
});
document.getElementById("guestOpenInvitation")?.addEventListener("click", openInvitation);

document.querySelectorAll("[data-open-invitation]").forEach((button) => {
  button.addEventListener("click", () => {
    if (guestName) openInvitation();
    else guestNameInput?.focus();
  });
});

const urlGuestName = getGuestNameFromUrl();
if (urlGuestName.length >= 2) {
  document.body.classList.add("url-personalized");
  applyGuestName(urlGuestName);
  if (guestNameInput) guestNameInput.value = urlGuestName;
  if (guestGateForm) guestGateForm.hidden = true;
  if (guestGateReady) guestGateReady.hidden = false;
  if (guestGate) guestGate.hidden = false;
  guestGate?.classList.remove("is-closing");
  guestGate?.classList.add("guest-ready");
}
const eventDate = new Date(2026, 8, 5, 7, 0, 0);
const elements = {
  days:    document.getElementById("days"),
  hours:   document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
};

const pad = (value) => String(value).padStart(2, "0");

function updateCountdown() {
  const distance = eventDate.getTime() - Date.now();

  if (distance <= 0) {
    Object.values(elements).forEach((el) => {
      if (el) el.textContent = "00";
    });
    return;
  }

  const day    = 1000 * 60 * 60 * 24;
  const hour   = 1000 * 60 * 60;
  const minute = 1000 * 60;

  const values = {
    days:    Math.floor(distance / day),
    hours:   Math.floor((distance % day) / hour),
    minutes: Math.floor((distance % hour) / minute),
    seconds: Math.floor((distance % minute) / 1000),
  };

  Object.entries(values).forEach(([key, value]) => {
    if (elements[key]) elements[key].textContent = pad(value);
  });
}

updateCountdown();
setInterval(updateCountdown, 1000);

const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    root: null,
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px",
  }
);

revealElements.forEach((el) => revealObserver.observe(el));

const sections = document.querySelectorAll("section[id]:not(.legacy-prayer):not(.legacy-ucapan):not(.legacy-rsvp)");
const navLinks = document.querySelectorAll(".mobile-bottom-nav a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    const sectionTop    = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - sectionHeight / 3) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").includes(current)) {
      link.classList.add("active");
    }
  });
});

navLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId      = this.getAttribute("href").substring(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  });
});

const submitRsvp = document.getElementById("submitRsvp");
if (submitRsvp) {
  submitRsvp.addEventListener("click", () => {
    const name   = document.getElementById("rsvpName")?.value.trim();
    const status = document.getElementById("rsvpStatus")?.value;
    if (!name || !status) {
      alert("Mohon lengkapi nama dan konfirmasi kehadiran.");
      return;
    }
    alert(`Terima kasih, ${name}! Konfirmasi kehadiran Anda telah kami terima. 🙏`);
    document.getElementById("rsvpForm")?.reset();
  });
}

const submitUcapan = document.getElementById("submitUcapan");
if (submitUcapan) {
  submitUcapan.addEventListener("click", () => {
    const name  = document.getElementById("ucapanName")?.value.trim();
    const pesan = document.getElementById("ucapanText")?.value.trim();
    if (!name || !pesan) {
      alert("Mohon lengkapi nama dan ucapan Anda.");
      return;
    }

    const groups = document.querySelectorAll("#historyTrack .history-group");
    groups.forEach((group) => {
      const card = document.createElement("article");
      card.className = "history-card";
      const header = document.createElement("div");
      const author = document.createElement("strong");
      const time = document.createElement("span");
      const message = document.createElement("p");
      author.textContent = name;
      time.textContent = "Baru saja";
      message.textContent = pesan;
      header.append(author, time);
      card.append(header, message);
      group.prepend(card);
    });

    const ucapanText = document.getElementById("ucapanText");
    if (ucapanText) ucapanText.value = "";
  });
}

// Floating guest chat. Messages are stored locally so the feature works without a server.
const chatToggle = document.getElementById("chatToggle");
const chatPanel = document.getElementById("chatPanel");
const chatClose = document.getElementById("chatClose");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");

function setChatOpen(open) {
  if (chatPanel) chatPanel.hidden = !open;
  chatToggle?.setAttribute("aria-expanded", String(open));
  if (open) setTimeout(() => chatInput?.focus(), 50);
}

function addChatMessage(message, persist = true) {
  if (!chatMessages) return;
  const bubble = document.createElement("div");
  bubble.className = "chat-bubble mine";
  const author = document.createElement("strong");
  author.textContent = guestName || "Tamu";
  const text = document.createElement("p");
  text.textContent = message;
  bubble.append(author, text);
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  if (persist) {
    const messages = JSON.parse(localStorage.getItem("haziqChat") || "[]");
    messages.push({ name: guestName || "Tamu", message });
    localStorage.setItem("haziqChat", JSON.stringify(messages.slice(-20)));
  }
}

try {
  JSON.parse(localStorage.getItem("haziqChat") || "[]").forEach((item) => {
    const previousName = guestName;
    guestName = item.name;
    addChatMessage(item.message, false);
    guestName = previousName;
  });
} catch { localStorage.removeItem("haziqChat"); }

chatToggle?.addEventListener("click", () => setChatOpen(chatPanel?.hidden ?? true));
chatClose?.addEventListener("click", () => setChatOpen(false));
chatForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = chatInput?.value.trim();
  if (!message) return;
  addChatMessage(message);
  chatForm.reset();
});

const shareButton = document.getElementById("shareButton");

function showShareToast(message) {
  document.querySelector(".share-toast")?.remove();
  const toast = document.createElement("div");
  toast.className = "share-toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2200);
}

shareButton?.addEventListener("click", async () => {
  const shareData = {
    title: "Undangan Khitanan Muhammad Haziq",
    text: `Kepada Yth. ${guestName || "Bapak/Ibu/Saudara/i"}, kami mengundang Anda ke acara khitanan Muhammad Haziq Syauqi Ramadhan.`,
    url: window.location.href,
  };
  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      showShareToast("Tautan undangan berhasil disalin");
    }
  } catch (error) {
    if (error?.name !== "AbortError") showShareToast("Belum dapat membagikan undangan");
  }
});

const quickActions = document.getElementById("quickActions");
const quickActionsToggle = document.getElementById("quickActionsToggle");

function closeQuickActions() {
  quickActions?.classList.remove("open");
  quickActionsToggle?.setAttribute("aria-expanded", "false");
}

quickActionsToggle?.addEventListener("click", () => {
  const open = !quickActions?.classList.contains("open");
  quickActions?.classList.toggle("open", open);
  quickActionsToggle.setAttribute("aria-expanded", String(open));
});
document.getElementById("quickMusic")?.addEventListener("click", () => { musicToggle?.click(); closeQuickActions(); });
document.getElementById("quickChat")?.addEventListener("click", () => { chatToggle?.click(); closeQuickActions(); });
document.getElementById("quickShare")?.addEventListener("click", () => { shareButton?.click(); closeQuickActions(); });
