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
    audio.play().catch(() => {});
  } else {
    iconPlay.classList.remove("hidden");
    iconPause.classList.add("hidden");
    musicLabel.textContent = "Putar Musik";
    musicBars.classList.remove("playing");
    audio.pause();
  }
}

musicToggle.addEventListener("click", () => {
  setPlayingState(!isPlaying);
});
let autoplayTriggered = false;
function triggerAutoplay() {
  if (!autoplayTriggered) {
    autoplayTriggered = true;
    setPlayingState(true);
  }
}

const invitationSection = document.getElementById("profile");
document.querySelectorAll("[data-open-invitation]").forEach((button) => {
  button.addEventListener("click", () => {
    triggerAutoplay();
    document.body.classList.remove("invitation-locked");
    document.body.classList.add("invitation-opened");
    requestAnimationFrame(() => {
      invitationSection?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
});
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

const sections = document.querySelectorAll("section[id]");
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

    const list = document.getElementById("ucapanList");
    if (list) {
      const item = document.createElement("div");
      item.className = "ucapan-item";
      item.style.animation = "fade-up 0.5s ease forwards";
      item.innerHTML = `
        <div class="ucapan-header">
          <strong>${name}</strong>
          <span class="ucapan-time">Baru saja</span>
        </div>
        <p>${pesan}</p>
      `;
      list.prepend(item);
    }

    document.getElementById("ucapanForm")?.reset();
  });
}
