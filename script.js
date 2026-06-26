// ==========================================================================
// Terminal Preloader Screen Logic
// ==========================================================================
function runPreloader() {
  const logContainer = document.getElementById("preloader-log");
  const progressBar = document.getElementById("preloader-fill");
  const progressText = document.getElementById("preloader-percentage");
  if (!logContainer) return;

  // Clear static placeholder logs
  logContainer.innerHTML = "";

  const addLog = (tag, text, type) => {
    const div = document.createElement("div");
    div.className = "log-line";
    const tagSpan = document.createElement("span");
    tagSpan.className = `log-tag ${type}`;
    tagSpan.textContent = tag;
    const textSpan = document.createElement("span");
    textSpan.className = "log-text";
    textSpan.textContent = text;
    div.appendChild(tagSpan);
    div.appendChild(textSpan);
    logContainer.appendChild(div);
    // Auto scroll logs
    logContainer.scrollTop = logContainer.scrollHeight;
  };

  const updateProgress = (pct) => {
    if (progressBar) progressBar.style.width = `${pct}%`;
    if (progressText) progressText.textContent = `${pct}%`;
  };

  // Immediate start
  addLog("SYS", "init ahmed.profile --speedrun", "sys");
  updateProgress(15);

  // We define an async sequence to load real resources
  (async () => {
    await new Promise(r => setTimeout(r, 250));

    // Load Database Content
    addLog("SYS", "Connecting to database...", "sys");
    updateProgress(35);
    await new Promise(r => setTimeout(r, 200));

    let dbResult;
    try {
      const dbTimeout = new Promise((resolve) => setTimeout(() => resolve({ success: false, source: "timeout" }), 4000));
      dbResult = await Promise.race([loadData(), dbTimeout]);
    } catch (e) {
      dbResult = { success: false, source: "error" };
    }

    if (dbResult.source === "firebase" && dbResult.success) {
      addLog("OK", "Firebase cloud content resolved successfully", "ok");
    } else if (dbResult.source === "local") {
      addLog("OK", "Local cached profile content loaded", "ok");
    } else {
      addLog("WARN", "Database timeout/offline, using fallback defaults", "lua");
    }
    updateProgress(60);
    await new Promise(r => setTimeout(r, 250));

    // Load Roblox Live Count
    addLog("SYS", "Fetching Roblox live count for active games...", "sys");
    updateProgress(75);
    await new Promise(r => setTimeout(r, 200));

    let robloxResult = null;
    try {
      const robloxTimeout = new Promise(resolve => setTimeout(() => resolve(null), 3500));
      robloxResult = await Promise.race([updateRobloxLiveStats(), robloxTimeout]);
    } catch (e) {
      console.error("Roblox preloading fetch failed:", e);
    }

    if (robloxResult) {
      // Find Driving Simulator in the stats results to log
      const mainGameStats = robloxResult["14875626099"];
      if (mainGameStats) {
        addLog("OK", `Roblox stats resolved: ${mainGameStats.playing} playing!`, "ready");
      } else {
        addLog("OK", "Roblox live stats resolved successfully", "ready");
      }
    } else {
      addLog("WARN", "Roblox API offline/timeout, showing offline values", "lua");
    }
    updateProgress(90);
    await new Promise(r => setTimeout(r, 250));

    // Start background interval for live refreshes (every 5 seconds)
    if (robloxInterval) clearInterval(robloxInterval);
    robloxInterval = setInterval(updateRobloxLiveStats, 5000);

    // Final compile
    addLog("READY", "Ahmed portfolio compiled successfully!", "ready");
    updateProgress(100);
    await new Promise(r => setTimeout(r, 450));

    dismissPreloader();
  })();
}


function dismissPreloader() {
  const preloader = document.getElementById("terminal-preloader");
  if (preloader) {
    preloader.classList.add("fade-out");
    document.body.classList.remove("preloader-active");
    
    setTimeout(() => {
      preloader.remove();
    }, 450);
  }
}

// Trigger preloader script immediately
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", runPreloader);
} else {
  runPreloader();
}

// ==========================================================================
// Baseline CMS Portfolio Data & State Configuration
// ==========================================================================
const DEFAULT_PORTFOLIO_DATA = {
  siteTitle: "Ahmed",
  heroKicker: "19-year-old creator · Roblox scripting · CS student",
  heroTagline: "Building games & creating content with curiosity, craft, and a little chaos.",
  heroLabels: ["Roblox Developer", "Video Editor", "YouTube Creator", "2nd-year CS Student"],
  avatarUrl: "assets/avatar.png",
  portraitCaption: "Games, edits, scripts, study notes, repeat.",
  aboutTitle: "Who am I?",
  aboutLead: "Ahmed is a 19-year-old Roblox developer focused on scripting, a YouTube content creator, a video editor, and a 2nd-year Computer Science student.",
  aboutBody: "He likes turning ideas into playable systems, watchable videos, and cleaner creative workflows. His work sits between logic and personality: scripting mechanics, shaping content, editing with rhythm, and learning the fundamentals that make better software possible.",
  belief1Title: "Make it feel fun first.",
  belief1Desc: "Good gameplay starts with a simple loop that feels satisfying before it gets complicated.",
  belief2Title: "Keep learning in public.",
  belief2Desc: "Every script, edit, upload, and class project is a chance to get sharper.",
  belief3Title: "Craft beats noise.",
  belief3Desc: "Clean timing, clear systems, and thoughtful details make creative work stand out.",
  hiringStatus: "available",
  hiringStatusText: "Available for Commissions",
  youtubeVideos: [
    { title: "The EASIEST Beginner Guide to Scripting (Roblox)", id: "P2ECl-mLmvY" },
    { title: "Roblox How To Code - How To Script On Roblox - Episode 1", id: "_K7stCkqFBY" },
    { title: "Roblox Scripting (Full Guide for Beginners)", id: "xGZ1-9nC9qU" },
    { title: "Roblox advanced pathfinding tutorial", id: "dQw4w9WgXcQ" }
  ],
  stats: [
    { target: "15", suffix: "", desc: "Roblox Commissions Finished", class: "commission" },
    { target: "3.1", suffix: "M", desc: "Roblox Game Visits", class: "visits" },
    { target: "34.7", suffix: "K", desc: "YouTube Subscribers", class: "subs" },
    { target: "5", suffix: "M", desc: "Total YouTube Views", class: "views" }
  ],
  experience: [
    { title: "Roblox Scripting", desc: "Building gameplay systems, interactive mechanics, and scripted features for Roblox experiences." },
    { title: "Content Creation (YouTube)", desc: "Creating videos with a clear idea, a watchable structure, and a consistent creative direction." },
    { title: "Video Editing", desc: "Editing for pacing, flow, cuts, and polish so each video feels clean and energetic." },
    { title: "Computer Science Student", desc: "Studying Computer Science in the 2nd year and building foundations in programming and problem-solving." }
  ],
  works: [
    { title: "Driving Simulator", desc: "A Roblox game project shaped around scripting-driven interaction and playful systems.", url: "https://www.roblox.com/games/14875626099/driving-simulator", category: "roblox", imgClass: "image-one", isOwnGame: true, showActive: true },
    { title: "Grow Your Leg", desc: "A playful Roblox experience built around a memorable concept and quick progression.", url: "https://www.roblox.com/games/106419822021709/Grow-Your-Leg", category: "roblox", imgClass: "image-two", isOwnGame: false, showActive: true },
    { title: "YouTube @t.i1", desc: "Ahmed's YouTube channel for creator-led videos, edits, and content experiments.", url: "https://www.youtube.com/@t.i1", category: "content", imgClass: "image-three", isOwnGame: false, showActive: false }
  ],
  links: [
    { title: "YouTube @t.i1", url: "https://www.youtube.com/@t.i1", icon: "fa-brands fa-youtube", subtitle: "" },
    { title: "Discord", url: "https://discord.gg/H6T2DgzWFj", icon: "fa-brands fa-discord", subtitle: "@4pd_" }
  ]
};

let currentPortfolioData = { ...DEFAULT_PORTFOLIO_DATA };

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector("#nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section[id]");
const marqueeTrack = document.querySelector("[data-marquee-track]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function closeMenu() {
  menuToggle.classList.remove("active");
  navMenu.classList.remove("open");
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
}

function toggleMenu() {
  const isOpen = navMenu.classList.toggle("open");
  menuToggle.classList.toggle("active", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
}

function setActiveLink(sectionId) {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${sectionId}`;
    link.classList.toggle("active", isActive);
  });
}

function prepareMarquee() {
  if (!marqueeTrack || reducedMotion) {
    return;
  }

  const originalGroup = marqueeTrack.querySelector(".marquee-group");
  if (!originalGroup) return;

  // Clear previous clones to recalculate correctly on resize/load
  const groups = marqueeTrack.querySelectorAll(".marquee-group");
  groups.forEach((group, index) => {
    if (index > 0) {
      group.remove();
    }
  });

  const groupWidth = originalGroup.offsetWidth;
  if (!groupWidth) return;

  const viewportWidth = window.innerWidth;
  // Calculate how many clones are needed to fill the viewport plus one extra to scroll smoothly
  const clonesNeeded = Math.ceil(viewportWidth / groupWidth) + 1;
  const totalGroupsNeeded = Math.max(2, clonesNeeded + 1);

  for (let i = 1; i < totalGroupsNeeded; i++) {
    const clone = originalGroup.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    marqueeTrack.appendChild(clone);
  }

  // Set CSS custom property for exact animation translation
  marqueeTrack.style.setProperty("--marquee-end", `-${groupWidth}px`);
}

function initializeRevealElements() {
  const elements = document.querySelectorAll(".reveal");
  if (elements.length === 0) return;
  
  if (reducedMotion) {
    elements.forEach((element) => element.classList.add("visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    elements.forEach((element) => revealObserver.observe(element));
  }
}

initializeRevealElements();

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      setActiveLink(entry.target.id);
    }
  });
}, {
  rootMargin: "-35% 0px -55% 0px",
  threshold: 0
});

sections.forEach((section) => sectionObserver.observe(section));

// Initialize marquee and bind to load and resize events to prevent calculation issues
prepareMarquee();
window.addEventListener("load", prepareMarquee);
window.addEventListener("resize", prepareMarquee);

menuToggle.addEventListener("click", toggleMenu);

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (navMenu.classList.contains("open")) {
      closeMenu();
    }
  });
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navMenu.classList.contains("open")) {
    closeMenu();
  }
});

// ==========================================================================
// Premium Interactive Elements (Custom Cursor & Hero Grid Mouse Glow)
// ==========================================================================
const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

if (!isTouchDevice && !reducedMotion) {
  document.body.classList.add("has-custom-cursor");

  // Create cursor elements dynamically
  const dot = document.createElement("div");
  dot.className = "custom-cursor-dot";
  dot.setAttribute("data-cursor-dot", "");
  dot.innerHTML = '<span class="cursor-dot-inner"></span>';
  
  const outline = document.createElement("div");
  outline.className = "custom-cursor-outline";
  outline.setAttribute("data-cursor-outline", "");

  document.body.appendChild(dot);
  document.body.appendChild(outline);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  let dotX = mouseX;
  let dotY = mouseY;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Click particles logic
  const particleColors = ["#ff8a3d", "#f7c948", "#8ecae6", "#b7d99c", "#f4a7b9"];

  function createClickParticles(x, y) {
    const particleCount = 8;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "cursor-particle";
      
      const color = particleColors[Math.floor(Math.random() * particleColors.length)];
      particle.style.backgroundColor = color;
      
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      
      const angle = Math.random() * Math.PI * 2;
      const distance = 25 + Math.random() * 45;
      
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      
      particle.style.setProperty("--tx", `${tx}px`);
      particle.style.setProperty("--ty", `${ty}px`);
      
      document.body.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 600);
    }
  }

  window.addEventListener("mousedown", (e) => {
    dot.classList.add("cursor-clicking");
    outline.classList.add("cursor-clicking");
    createClickParticles(e.clientX, e.clientY);
  });

  window.addEventListener("mouseup", () => {
    dot.classList.remove("cursor-clicking");
    outline.classList.remove("cursor-clicking");
  });

  function animateCursor() {
    const outlineLerp = 0.16;
    const dotLerp = 0.35;
    
    cursorX += (mouseX - cursorX) * outlineLerp;
    cursorY += (mouseY - cursorY) * outlineLerp;
    
    dotX += (mouseX - dotX) * dotLerp;
    dotY += (mouseY - dotY) * dotLerp;

    dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
    outline.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(animateCursor);
  }
  requestAnimationFrame(animateCursor);

  // Function to attach hover listeners
  function addHoverListeners() {
    const hoverables = document.querySelectorAll("a, button, .work-card, .video-card, .link-button, .menu-toggle, .belief-card, .experience-item, .portrait-card, .stats-card, .admin-fab, .admin-login-trigger, .draggable-sticker, .bg-creature");
    hoverables.forEach((el) => {
      // Avoid duplicate event listener bindings
      if (el.dataset.hasCursorListener) return;
      el.dataset.hasCursorListener = "true";

      el.addEventListener("mouseenter", () => {
        dot.classList.add("cursor-hover");
        outline.classList.add("cursor-hover");
      });
      el.addEventListener("mouseleave", () => {
        dot.classList.remove("cursor-hover");
        outline.classList.remove("cursor-hover");
      });
    });
  }

  // Initial attachment
  addHoverListeners();

  // Re-attach hover listeners when window loads to ensure all elements are bound
  window.addEventListener("load", addHoverListeners);

  // Hero Grid Glow Tracking
  const heroSection = document.querySelector("#hero");
  const gridGlow = document.querySelector("[data-grid-glow]");

  if (heroSection && gridGlow) {
    heroSection.addEventListener("mousemove", (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;
      
      gridGlow.style.setProperty("--mouse-x", `${xPercent}%`);
      gridGlow.style.setProperty("--mouse-y", `${yPercent}%`);
    });
  }
}

// ==========================================================================
// True Dark Mode Switch & Persistence
// ==========================================================================
const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = themeToggle ? themeToggle.querySelector("i") : null;

// Apply saved theme on load (default to dark)
const currentTheme = localStorage.getItem("theme") || "dark";
if (currentTheme === "light") {
  document.body.classList.remove("dark-theme");
  if (themeIcon) {
    themeIcon.classList.replace("fa-sun", "fa-moon");
  }
} else {
  document.body.classList.add("dark-theme");
  if (themeIcon) {
    themeIcon.classList.replace("fa-moon", "fa-sun");
  }
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    const isDark = document.body.classList.contains("dark-theme");
    localStorage.setItem("theme", isDark ? "dark" : "light");

    if (themeIcon) {
      if (isDark) {
        themeIcon.classList.replace("fa-moon", "fa-sun");
      } else {
        themeIcon.classList.replace("fa-sun", "fa-moon");
      }
    }
  });
}

// ==========================================================================
// Scroll Progress Bar
// ==========================================================================
const scrollProgress = document.querySelector(".scroll-progress");
if (scrollProgress) {
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = `${scrollPercent}%`;
  });
}

// ==========================================================================
// Interactive Works Grid Filtering (Smooth Cross-Fade)
// ==========================================================================
const filterBtns = document.querySelectorAll(".filter-btn");
const workGrid = document.querySelector(".work-grid");

if (filterBtns.length > 0 && workGrid) {
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("active")) return;

      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.dataset.filter;

      // 1. Fade out the entire grid container
      workGrid.classList.add("filtering");

      // 2. Once faded out, swap elements and fade back in
      setTimeout(() => {
        const activeCards = document.querySelectorAll(".work-card");
        activeCards.forEach((card) => {
          const isMatch = category === "all" || card.dataset.category === category;

          if (isMatch) {
            card.style.display = ""; // restore display
            card.classList.remove("hidden");
          } else {
            card.classList.add("hidden");
            card.style.display = "none"; // hide immediately
          }
        });

        // 3. Fade the grid container back in
        workGrid.classList.remove("filtering");
      }, 250);
    });
  });
}

// ==========================================================================
// Animated Stats Counters
// ==========================================================================
const animateCounters = () => {
  const cards = document.querySelectorAll(".stats-card");
  if (cards.length === 0) return;

  if (reducedMotion) {
    cards.forEach((card) => {
      const counterEl = card.querySelector(".counter");
      if (counterEl) {
        counterEl.textContent = card.getAttribute("data-target");
      }
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const counterEl = card.querySelector(".counter");
        if (!counterEl) return;
        
        const targetStr = card.getAttribute("data-target");
        const target = parseFloat(targetStr);
        const isFloat = targetStr.includes(".");
        
        const duration = 1600; // 1.6s count up animation
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / duration, 1);
          
          // Cubic ease-out
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentValue = target * easeProgress;
          
          if (isFloat) {
            counterEl.textContent = currentValue.toFixed(1);
          } else {
            counterEl.textContent = Math.floor(currentValue);
          }
          
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counterEl.textContent = targetStr; // Snap to final exact representation
          }
        }
        
        requestAnimationFrame(updateCounter);
        observer.unobserve(card); // Count once per page load
      }
    });
  }, { threshold: 0.15 });

  cards.forEach((card) => observer.observe(card));
};

// Run counters animation on DOM load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", animateCounters);
} else {
  animateCounters();
}


// ==========================================================================
// YouTube Video Lightbox Controller
// ==========================================================================
const lightboxModal = document.getElementById("lightbox-modal");
const lightboxIframe = document.getElementById("lightbox-iframe");
const lightboxClose = document.getElementById("lightbox-close");
const lightboxOverlay = document.getElementById("lightbox-overlay");

function openLightbox(videoId) {
  if (lightboxModal && lightboxIframe) {
    lightboxIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    lightboxModal.classList.add("open");
    lightboxModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
}

function closeLightbox() {
  if (lightboxModal && lightboxIframe) {
    lightboxIframe.src = "";
    lightboxModal.classList.remove("open");
    lightboxModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
}

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
if (lightboxOverlay) lightboxOverlay.addEventListener("click", closeLightbox);

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightboxModal && lightboxModal.classList.contains("open")) {
    closeLightbox();
  }
});

// ==========================================================================
// Google Firebase CMS Engine Implementation
// ==========================================================================
const adminEmail = typeof ADMIN_EMAIL !== "undefined" ? ADMIN_EMAIL : "essam123syam@gmail.com";
let db = null;
let useFirebase = false;

// Check configuration parameters
if (typeof firebaseConfig !== "undefined" && firebaseConfig.apiKey && firebaseConfig.projectId) {
  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    useFirebase = true;
    console.log("Firebase CMS Engine initialized successfully.");
  } catch (error) {
    console.error("Error setting up Firebase compatibility SDK:", error);
  }
} else {
  console.log("Firebase is unconfigured. Running in client-only Simulation mode.");
}

// Dynamic DOM Render Function
function renderPortfolio(data) {
  // Update titles & captions
  document.title = data.siteTitle;
  const brandName = document.getElementById("brand-name");
  if (brandName) brandName.textContent = data.siteTitle;
  
  const brandAvatar = document.getElementById("brand-avatar");
  if (brandAvatar && data.avatarUrl) brandAvatar.src = data.avatarUrl;
  
  const footerText = document.getElementById("footer-text");
  if (footerText) footerText.textContent = `© 2026 ${data.siteTitle}`;
  
  // Hero
  const heroKicker = document.getElementById("hero-kicker");
  if (heroKicker) heroKicker.textContent = data.heroKicker;
  
  const heroTitle = document.getElementById("hero-title");
  if (heroTitle) heroTitle.textContent = data.siteTitle;
  
  const heroTagline = document.getElementById("hero-tagline");
  if (heroTagline) heroTagline.textContent = data.heroTagline;
  
  const heroAvatar = document.getElementById("hero-avatar");
  if (heroAvatar && data.avatarUrl) heroAvatar.src = data.avatarUrl;
  
  const portraitCaption = document.getElementById("portrait-caption");
  if (portraitCaption) portraitCaption.textContent = data.portraitCaption;
  
  const heroLabels = document.getElementById("hero-labels");
  if (heroLabels) {
    heroLabels.innerHTML = "";
    (data.heroLabels || []).forEach(label => {
      const span = document.createElement("span");
      span.textContent = label;
      heroLabels.appendChild(span);
    });
  }
  
  // About
  const aboutTitle = document.getElementById("about-title");
  if (aboutTitle) aboutTitle.textContent = data.aboutTitle;
  
  const aboutLead = document.getElementById("about-lead");
  if (aboutLead) aboutLead.textContent = data.aboutLead;
  
  const aboutBody = document.getElementById("about-body");
  if (aboutBody) aboutBody.textContent = data.aboutBody;
  
  // Beliefs
  const beliefGrid = document.getElementById("belief-grid");
  if (beliefGrid) {
    beliefGrid.innerHTML = `
      <article class="belief-card reveal">
        <span>01</span>
        <h2>${data.belief1Title}</h2>
        <p>${data.belief1Desc}</p>
      </article>
      <article class="belief-card reveal">
        <span>02</span>
        <h2>${data.belief2Title}</h2>
        <p>${data.belief2Desc}</p>
      </article>
      <article class="belief-card reveal">
        <span>03</span>
        <h2>${data.belief3Title}</h2>
        <p>${data.belief3Desc}</p>
      </article>
    `;
  }
  
  // Experience List
  const experienceList = document.getElementById("experience-list");
  if (experienceList) {
    experienceList.innerHTML = "";
    (data.experience || []).forEach(item => {
      const article = document.createElement("article");
      article.className = "experience-item reveal";
      article.innerHTML = `
        <span>${item.title}</span>
        <p>${item.desc}</p>
      `;
      experienceList.appendChild(article);
    });
  }
  
  // Stats Panel
  const statsGrid = document.getElementById("stats-grid");
  if (statsGrid) {
    statsGrid.innerHTML = "";
    (data.stats || []).forEach(item => {
      const article = document.createElement("article");
      article.className = `stats-card ${item.class} reveal`;
      article.setAttribute("data-target", item.target);
      if (item.suffix) article.setAttribute("data-suffix", item.suffix);
      
      article.innerHTML = `
        <div class="stats-number"><span class="counter">0</span>${item.suffix ? `<span class="suffix">${item.suffix}</span>` : ''}</div>
        <div class="stats-desc">${item.desc}</div>
      `;
      statsGrid.appendChild(article);
    });
  }
  
  // Works Grid
  const workGrid = document.getElementById("work-grid");
  if (workGrid) {
    workGrid.innerHTML = "";
    (data.works || []).forEach(item => {
      const article = document.createElement("article");
      
      const isOwn = !!item.isOwnGame;
      const showActive = !!item.showActive;
      const placeId = extractPlaceId(item.url);
      
      if (isOwn) {
        article.className = "work-card reveal featured-work";
      } else {
        article.className = "work-card reveal";
      }
      article.setAttribute("data-category", item.category);
      
      let imgStyle = "";
      if (item.imgClass.startsWith("http") || item.imgClass.includes("/") || item.imgClass.includes(".")) {
        imgStyle = `style="background: url('${item.imgClass}') center/cover no-repeat;"`;
      } else {
        imgStyle = `class="work-image ${item.imgClass}"`;
      }
      
      let badgeHTML = "";
      if (isOwn || (showActive && placeId)) {
        badgeHTML += `<div class="card-badge-container">`;
        if (isOwn) {
          badgeHTML += `<span class="badge badge-own">⭐ MY GAME</span>`;
        }
        if (showActive && placeId) {
          badgeHTML += `
            <span class="badge badge-live">
              <span class="live-dot"></span>
              <span id="roblox-live-players-${placeId}" class="live-count-text">Loading...</span>
            </span>
          `;
        }
        badgeHTML += `</div>`;
      }
      
      let titleHTML = item.title;
      if (isOwn) {
        titleHTML = `${item.title} <span class="title-sparkle" title="My Featured Game">✨</span>`;
      }
      
      article.innerHTML = `
        <div ${imgStyle} role="img" aria-label="${item.title} screenshot">
          ${badgeHTML}
        </div>
        <div class="work-body">
          <h3>${titleHTML}</h3>
          <p>${item.desc}</p>
          <a class="button" href="${item.url}" target="_blank" rel="noreferrer">View</a>
        </div>
      `;
      workGrid.appendChild(article);
    });
  }
  
  // Links Grid
  const linkGrid = document.getElementById("link-grid");
  if (linkGrid) {
    linkGrid.innerHTML = "";
    (data.links || []).forEach(item => {
      const a = document.createElement("a");
      a.className = "link-button reveal";
      a.href = item.url;
      a.target = "_blank";
      a.rel = "noreferrer";
      
      let content = `
        <div class="link-content">
          <i class="${item.icon || 'fa-solid fa-link'}" aria-hidden="true"></i>
      `;
      
      if (item.subtitle) {
        content += `
          <div>
            <span>${item.title}</span>
            <p class="link-username">${item.subtitle}</p>
          </div>
        `;
      } else {
        content += `
          <span>${item.title}</span>
        `;
      }
      
      content += `</div>`;
      a.innerHTML = content;
      linkGrid.appendChild(a);
    });
  }

  // Hiring Status Badge
  const hiringNav = document.getElementById("hiring-status-nav");
  if (hiringNav) {
    hiringNav.classList.remove("available", "busy", "away");
    const status = data.hiringStatus || "available";
    hiringNav.classList.add(status);
    const statusTextEl = hiringNav.querySelector(".status-text");
    if (statusTextEl) {
      statusTextEl.textContent = data.hiringStatusText || "Available";
    }
  }


  // Featured Videos Grid
  const videoGrid = document.getElementById("video-grid");
  if (videoGrid) {
    videoGrid.innerHTML = "";
    (data.youtubeVideos || []).forEach(video => {
      const article = document.createElement("article");
      article.className = "video-card reveal";
      article.dataset.videoId = video.id;
      article.innerHTML = `
        <div class="video-thumbnail-container">
          <img class="video-thumbnail" src="https://img.youtube.com/vi/${video.id}/mqdefault.jpg" alt="${video.title} thumbnail">
          <div class="video-play-overlay">
            <div class="video-play-btn">
              <i class="fa-solid fa-play"></i>
            </div>
          </div>
        </div>
        <div class="video-body-card">
          <h4>${video.title}</h4>
        </div>
      `;
      
      article.addEventListener("click", () => {
        openLightbox(video.id);
      });
      
      videoGrid.appendChild(article);
    });
  }

  // Trigger reveal observers and stats counting
  initializeRevealElements();
  animateCounters();
  
  // Custom cursor hooks
  if (typeof addHoverListeners === "function") {
    addHoverListeners();
  }

  // Fetch Roblox Live Counts immediately whenever portfolio is rendered
  if (typeof updateRobloxLiveStats === "function") {
    updateRobloxLiveStats().catch(err => console.warn("Roblox stats render update failed:", err));
  }
}

// Database Loading Logic
// Database Loading Logic
function loadData() {
  return new Promise((resolve) => {
    if (useFirebase && db) {
      db.collection("portfolio").doc("content").get()
        .then((doc) => {
          if (doc.exists) {
            const fetchedData = doc.data();
            currentPortfolioData = { ...DEFAULT_PORTFOLIO_DATA, ...fetchedData };
            renderPortfolio(currentPortfolioData);
            resolve({ success: true, source: "firebase" });
          } else {
            renderPortfolio(DEFAULT_PORTFOLIO_DATA);
            resolve({ success: true, source: "fallback" });
          }
        })
        .catch((err) => {
          console.error("Error fetching database documents, falling back to local defaults:", err);
          renderPortfolio(DEFAULT_PORTFOLIO_DATA);
          resolve({ success: false, source: "fallback", error: err });
        });
    } else {
      // Local fallback check
      const localData = localStorage.getItem("portfolio_fallback_data");
      if (localData) {
        try {
          currentPortfolioData = { ...DEFAULT_PORTFOLIO_DATA, ...JSON.parse(localData) };
        } catch (e) {
          console.error("Error reading localStorage:", e);
        }
      }
      renderPortfolio(currentPortfolioData);
      resolve({ success: true, source: "local" });
    }
  });
}

// ==========================================================================
// Roblox Live Player Count Fetcher & Visits Sync (General, multi-game support)
// ==========================================================================
const KNOWN_ROBLOX_GAMES = {
  "14875626099": "5125369493", // Driving Simulator
  "106419822021709": "9509768227" // Grow Your Leg
};

let resolvedUniverseCache = { ...KNOWN_ROBLOX_GAMES };
let robloxInterval = null;
let lastPlayerCounts = {};

function extractPlaceId(url) {
  if (!url) return null;
  const match = url.match(/\/games\/(\d+)/) || url.match(/\/place\/(\d+)/);
  return match ? match[1] : null;
}

// Animate numbers dynamically to show a lively live load
function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const currentValue = Math.floor(progress * (end - start) + start);
    obj.textContent = `${currentValue.toLocaleString()} playing`;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

async function fetchRobloxLiveCounts(works) {
  const activeWorks = (works || []).filter(w => w.category === "roblox" && w.showActive);
  if (activeWorks.length === 0) return null;

  const proxy = "https://api.allorigins.win/raw?url=";
  const proxy2 = "https://corsproxy.io/?url=";
  
  // Resolve all Universe IDs in parallel
  const resolvePromises = activeWorks.map(async (work) => {
    const placeId = extractPlaceId(work.url);
    if (!placeId) return null;
    
    if (resolvedUniverseCache[placeId]) {
      return { placeId, universeId: resolvedUniverseCache[placeId], work };
    }
    
    // Dynamic resolve
    const universeUrl = `https://apis.roblox.com/universes/v1/places/${placeId}/universe`;
    try {
      const uRes = await fetch(`${proxy}${encodeURIComponent(universeUrl)}`);
      if (uRes.ok) {
        const uData = await uRes.json();
        if (uData && uData.universeId) {
          resolvedUniverseCache[placeId] = uData.universeId.toString();
          return { placeId, universeId: uData.universeId.toString(), work };
        }
      }
    } catch (e) {
      console.warn(`AllOrigins failed resolving place ${placeId}, trying CorsProxy`, e);
    }
    
    try {
      const uRes = await fetch(`${proxy2}${encodeURIComponent(universeUrl)}`);
      if (uRes.ok) {
        const uData = await uRes.json();
        if (uData && uData.universeId) {
          resolvedUniverseCache[placeId] = uData.universeId.toString();
          return { placeId, universeId: uData.universeId.toString(), work };
        }
      }
    } catch (e) {
      console.error(`Failed to resolve universe ID for place ${placeId}`, e);
    }
    
    return null;
  });

  const resolvedItems = (await Promise.all(resolvePromises)).filter(Boolean);
  if (resolvedItems.length === 0) return null;

  const universeIds = resolvedItems.map(item => item.universeId).join(",");
  const gamesUrl = `https://games.roblox.com/v1/games?universeIds=${universeIds}`;
  
  let gamesData = null;
  
  // Fetch details from Roblox
  try {
    const gRes = await fetch(`${proxy}${encodeURIComponent(gamesUrl)}`);
    if (gRes.ok) {
      gamesData = await gRes.json();
    }
  } catch (e) {
    console.warn("AllOrigins failed fetching games data, trying CorsProxy", e);
  }

  if (!gamesData) {
    try {
      const gRes = await fetch(`${proxy2}${encodeURIComponent(gamesUrl)}`);
      if (gRes.ok) {
        gamesData = await gRes.json();
      }
    } catch (e) {
      console.error("Failed to fetch games details from Roblox", e);
    }
  }

  if (gamesData && gamesData.data) {
    const results = {};
    gamesData.data.forEach(game => {
      const uId = game.id.toString();
      const matched = resolvedItems.find(item => item.universeId === uId);
      if (matched) {
        results[matched.placeId] = {
          playing: game.playing,
          visits: game.visits,
          name: game.name
        };
      }
    });
    return results;
  }
  
  return null;
}

function updateRobloxLiveStats() {
  return new Promise(async (resolve) => {
    const data = currentPortfolioData;
    if (!data || !data.works) {
      resolve(null);
      return;
    }
    
    const stats = await fetchRobloxLiveCounts(data.works);
    if (!stats) {
      resolve(null);
      return;
    }

    data.works.forEach(work => {
      const placeId = extractPlaceId(work.url);
      if (!placeId || !stats[placeId]) return;

      const gameStats = stats[placeId];
      const playingCount = gameStats.playing;
      
      const labelEl = document.getElementById(`roblox-live-players-${placeId}`);
      if (labelEl) {
        const lastCount = lastPlayerCounts[placeId] || 0;
        if (lastCount !== playingCount) {
          animateValue(labelEl, lastCount, playingCount, 1000);
          lastPlayerCounts[placeId] = playingCount;
        } else {
          labelEl.textContent = `${playingCount.toLocaleString()} playing`;
        }
        const badgeLive = labelEl.closest(".badge-live");
        if (badgeLive) {
          badgeLive.classList.add("active-live");
        }
      }
    });

    resolve(stats);
  });
}

// Database Write Logic
function saveCMSData(updatedData) {
  if (useFirebase && db) {
    const user = firebase.auth().currentUser;
    if (user && user.email === adminEmail) {
      db.collection("portfolio").doc("content").set(updatedData)
        .then(() => {
          alert("Changes saved to Firestore cloud successfully!");
          currentPortfolioData = updatedData;
          renderPortfolio(currentPortfolioData);
          closeCMSModal();
        })
        .catch((error) => {
          alert(`Failed to save: ${error.message}`);
        });
    } else {
      alert(`Unauthorized: You must be logged in as ${adminEmail}.`);
    }
  } else {
    localStorage.setItem("portfolio_fallback_data", JSON.stringify(updatedData));
    currentPortfolioData = updatedData;
    renderPortfolio(currentPortfolioData);
    alert("Saved changes locally! (No Firebase configured. Changes will persist only on your browser)");
    closeCMSModal();
  }
}

// Tab Switching Mechanism
const tabBtns = document.querySelectorAll(".cms-tab-btn");
const tabContents = document.querySelectorAll(".cms-tab-content");

tabBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    tabBtns.forEach(b => b.classList.remove("active"));
    tabContents.forEach(c => c.classList.remove("active"));
    
    btn.classList.add("active");
    const targetContent = document.getElementById(`tab-${btn.dataset.tab}`);
    if (targetContent) targetContent.classList.add("active");
  });
});

// Modal Open/Close Event Hooks
function openCMSModal() {
  populateDashboard();
  const modal = document.getElementById("cms-modal");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeCMSModal() {
  const modal = document.getElementById("cms-modal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

function openLoginModal() {
  if (useFirebase && firebase.auth().currentUser) {
    openCMSModal();
  } else {
    document.getElementById("cms-auth-error").style.display = "none";
    const modal = document.getElementById("cms-login-modal");
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  }
}

function closeLoginModal() {
  const modal = document.getElementById("cms-login-modal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

// Bind auth and modal buttons
document.getElementById("admin-fab").addEventListener("click", openCMSModal);
document.getElementById("cms-modal-close").addEventListener("click", closeCMSModal);
document.getElementById("cms-modal-overlay").addEventListener("click", closeCMSModal);

document.getElementById("admin-login-trigger").addEventListener("click", () => {
  if (useFirebase) {
    openLoginModal();
  } else {
    // Simulator mode: bypass login screen entirely
    document.getElementById("admin-fab").style.display = "flex";
    openCMSModal();
  }
});

// Secret easter egg: double-click the avatar logo to trigger login
const brandAvatarEl = document.getElementById("brand-avatar");
if (brandAvatarEl) {
  brandAvatarEl.addEventListener("dblclick", () => {
    if (useFirebase) {
      openLoginModal();
    } else {
      document.getElementById("admin-fab").style.display = "flex";
      openCMSModal();
    }
  });
}

document.getElementById("cms-login-close").addEventListener("click", closeLoginModal);
document.getElementById("cms-login-overlay").addEventListener("click", closeLoginModal);

// Form Population Mechanics
function populateDashboard() {
  const form = document.getElementById("cms-form");
  if (!form) return;
  
  form.elements["siteTitle"].value = currentPortfolioData.siteTitle || "";
  form.elements["heroKicker"].value = currentPortfolioData.heroKicker || "";
  form.elements["heroTagline"].value = currentPortfolioData.heroTagline || "";
  form.elements["heroLabels"].value = (currentPortfolioData.heroLabels || []).join(", ");
  form.elements["avatarUrl"].value = currentPortfolioData.avatarUrl || "";
  form.elements["portraitCaption"].value = currentPortfolioData.portraitCaption || "";
  
  form.elements["aboutTitle"].value = currentPortfolioData.aboutTitle || "";
  form.elements["aboutLead"].value = currentPortfolioData.aboutLead || "";
  form.elements["aboutBody"].value = currentPortfolioData.aboutBody || "";
  
  form.elements["belief1Title"].value = currentPortfolioData.belief1Title || "";
  form.elements["belief1Desc"].value = currentPortfolioData.belief1Desc || "";
  form.elements["belief2Title"].value = currentPortfolioData.belief2Title || "";
  form.elements["belief2Desc"].value = currentPortfolioData.belief2Desc || "";
  form.elements["belief3Title"].value = currentPortfolioData.belief3Title || "";
  form.elements["belief3Desc"].value = currentPortfolioData.belief3Desc || "";
  
  const statComm = currentPortfolioData.stats.find(s => s.class === "commission") || {};
  form.elements["statCommTarget"].value = statComm.target || "0";
  form.elements["statCommSuffix"].value = statComm.suffix || "";
  form.elements["statCommDesc"].value = statComm.desc || "";

  const statVisits = currentPortfolioData.stats.find(s => s.class === "visits") || {};
  form.elements["statVisitsTarget"].value = statVisits.target || "0";
  form.elements["statVisitsSuffix"].value = statVisits.suffix || "";
  form.elements["statVisitsDesc"].value = statVisits.desc || "";

  const statSubs = currentPortfolioData.stats.find(s => s.class === "subs") || {};
  form.elements["statSubsTarget"].value = statSubs.target || "0";
  form.elements["statSubsSuffix"].value = statSubs.suffix || "";
  form.elements["statSubsDesc"].value = statSubs.desc || "";

  const statViews = currentPortfolioData.stats.find(s => s.class === "views") || {};
  form.elements["statViewsTarget"].value = statViews.target || "0";
  form.elements["statViewsSuffix"].value = statViews.suffix || "";
  form.elements["statViewsDesc"].value = statViews.desc || "";

  form.elements["hiringStatus"].value = currentPortfolioData.hiringStatus || "available";
  form.elements["hiringStatusText"].value = currentPortfolioData.hiringStatusText || "Available for Commissions";
  
  const vids = currentPortfolioData.youtubeVideos || [];
  for (let i = 1; i <= 4; i++) {
    const video = vids[i - 1] || { title: "", id: "" };
    form.elements[`vid${i}Title`].value = video.title || "";
    form.elements[`vid${i}Id`].value = video.id || "";
  }

  renderExperienceEditor();
  renderWorksEditor();
  renderLinksEditor();
}

// List Editor Renderers
function renderExperienceEditor() {
  const container = document.getElementById("experience-list-editor");
  if (!container) return;
  container.innerHTML = "";
  
  (currentPortfolioData.experience || []).forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "cms-list-item-card";
    card.innerHTML = `
      <div class="cms-item-header">
        <span class="cms-item-index">Role #${index + 1}</span>
        <button type="button" class="cms-remove-btn" onclick="removeExperienceItem(${index})">Remove</button>
      </div>
      <div class="form-group">
        <label>Role Name / Skill</label>
        <input type="text" class="exp-title-input" value="${item.title}" required>
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea class="exp-desc-input" rows="2" required>${item.desc}</textarea>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderWorksEditor() {
  const container = document.getElementById("works-list-editor");
  if (!container) return;
  container.innerHTML = "";
  
  (currentPortfolioData.works || []).forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "cms-list-item-card";
    card.innerHTML = `
      <div class="cms-item-header">
        <span class="cms-item-index">Project #${index + 1}</span>
        <button type="button" class="cms-remove-btn" onclick="removeWorkItem(${index})">Remove</button>
      </div>
      <div class="form-group">
        <label>Project Title</label>
        <input type="text" class="work-title-input" value="${item.title}" required>
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea class="work-desc-input" rows="2" required>${item.desc}</textarea>
      </div>
      <div class="form-group">
        <label>Project URL</label>
        <input type="url" class="work-url-input" value="${item.url}" required>
      </div>
      <div class="form-grid-2">
        <div class="form-group">
          <label>Category</label>
          <select class="work-category-input">
            <option value="roblox" ${item.category === "roblox" ? "selected" : ""}>Roblox Games</option>
            <option value="content" ${item.category === "content" ? "selected" : ""}>Content & Editing</option>
          </select>
        </div>
        <div class="form-group">
          <label>Screenshot URL or Class</label>
          <input type="text" class="work-img-input" value="${item.imgClass}" required>
        </div>
      </div>
      <div class="form-grid-2" style="margin-top: 10px; display: flex; gap: 20px; border-top: 1.5px dashed var(--ink); padding-top: 10px;">
        <div class="form-group-checkbox" style="display: flex; align-items: center; gap: 8px;">
          <input type="checkbox" class="work-owngame-input" id="own-game-${index}" ${item.isOwnGame ? "checked" : ""}>
          <label for="own-game-${index}" style="margin: 0; cursor: pointer; font-size: 0.85rem;">Ahmed's Own Game (Featured)</label>
        </div>
        <div class="form-group-checkbox" style="display: flex; align-items: center; gap: 8px;">
          <input type="checkbox" class="work-showactive-input" id="show-active-${index}" ${item.showActive ? "checked" : ""}>
          <label for="show-active-${index}" style="margin: 0; cursor: pointer; font-size: 0.85rem;">Display Live Active Players</label>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderLinksEditor() {
  const container = document.getElementById("links-list-editor");
  if (!container) return;
  container.innerHTML = "";
  
  (currentPortfolioData.links || []).forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "cms-list-item-card";
    card.innerHTML = `
      <div class="cms-item-header">
        <span class="cms-item-index">Link #${index + 1}</span>
        <button type="button" class="cms-remove-btn" onclick="removeLinkItem(${index})">Remove</button>
      </div>
      <div class="form-group">
        <label>Link Label</label>
        <input type="text" class="link-title-input" value="${item.title}" required>
      </div>
      <div class="form-group">
        <label>Link URL</label>
        <input type="url" class="link-url-input" value="${item.url}" required>
      </div>
      <div class="form-grid-2">
        <div class="form-group">
          <label>FontAwesome Icon Class</label>
          <input type="text" class="link-icon-input" value="${item.icon || 'fa-solid fa-link'}" placeholder="e.g. fa-brands fa-youtube">
        </div>
        <div class="form-group">
          <label>Subtitle (e.g. @username)</label>
          <input type="text" class="link-subtitle-input" value="${item.subtitle || ''}" placeholder="Optional">
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Global scope bindings for list removal functions
window.removeExperienceItem = (index) => {
  currentPortfolioData.experience.splice(index, 1);
  renderExperienceEditor();
};

window.removeWorkItem = (index) => {
  currentPortfolioData.works.splice(index, 1);
  renderWorksEditor();
};

window.removeLinkItem = (index) => {
  currentPortfolioData.links.splice(index, 1);
  renderLinksEditor();
};

// Add item handlers
document.getElementById("btn-add-experience").addEventListener("click", () => {
  currentPortfolioData.experience.push({ title: "New Role", desc: "Description here" });
  renderExperienceEditor();
});

document.getElementById("btn-add-work").addEventListener("click", () => {
  currentPortfolioData.works.push({ 
    title: "New Project", 
    desc: "Description here", 
    url: "https://", 
    category: "roblox", 
    imgClass: "assets/avatar.png",
    isOwnGame: false,
    showActive: false
  });
  renderWorksEditor();
});

document.getElementById("btn-add-link").addEventListener("click", () => {
  currentPortfolioData.links.push({ title: "New Link", url: "https://", icon: "fa-solid fa-link", subtitle: "" });
  renderLinksEditor();
});

// Save Dashboard Content Trigger
document.getElementById("cms-save-btn").addEventListener("click", () => {
  const form = document.getElementById("cms-form");
  if (!form.reportValidity()) return;
  
  const updatedData = {
    siteTitle: form.elements["siteTitle"].value.trim(),
    heroKicker: form.elements["heroKicker"].value.trim(),
    heroTagline: form.elements["heroTagline"].value.trim(),
    heroLabels: form.elements["heroLabels"].value.split(",").map(s => s.trim()).filter(Boolean),
    avatarUrl: form.elements["avatarUrl"].value.trim(),
    portraitCaption: form.elements["portraitCaption"].value.trim(),
    
    aboutTitle: form.elements["aboutTitle"].value.trim(),
    aboutLead: form.elements["aboutLead"].value.trim(),
    aboutBody: form.elements["aboutBody"].value.trim(),
    
    belief1Title: form.elements["belief1Title"].value.trim(),
    belief1Desc: form.elements["belief1Desc"].value.trim(),
    belief2Title: form.elements["belief2Title"].value.trim(),
    belief2Desc: form.elements["belief2Desc"].value.trim(),
    belief3Title: form.elements["belief3Title"].value.trim(),
    belief3Desc: form.elements["belief3Desc"].value.trim(),
    
    stats: [
      {
        class: "commission",
        target: form.elements["statCommTarget"].value.trim(),
        suffix: form.elements["statCommSuffix"].value.trim(),
        desc: form.elements["statCommDesc"].value.trim()
      },
      {
        class: "visits",
        target: form.elements["statVisitsTarget"].value.trim(),
        suffix: form.elements["statVisitsSuffix"].value.trim(),
        desc: form.elements["statVisitsDesc"].value.trim()
      },
      {
        class: "subs",
        target: form.elements["statSubsTarget"].value.trim(),
        suffix: form.elements["statSubsSuffix"].value.trim(),
        desc: form.elements["statSubsDesc"].value.trim()
      },
      {
        class: "views",
        target: form.elements["statViewsTarget"].value.trim(),
        suffix: form.elements["statViewsSuffix"].value.trim(),
        desc: form.elements["statViewsDesc"].value.trim()
      }
    ],
    
    experience: Array.from(document.querySelectorAll("#experience-list-editor .cms-list-item-card")).map(card => ({
      title: card.querySelector(".exp-title-input").value.trim(),
      desc: card.querySelector(".exp-desc-input").value.trim()
    })),
    
    works: Array.from(document.querySelectorAll("#works-list-editor .cms-list-item-card")).map(card => ({
      title: card.querySelector(".work-title-input").value.trim(),
      desc: card.querySelector(".work-desc-input").value.trim(),
      url: card.querySelector(".work-url-input").value.trim(),
      category: card.querySelector(".work-category-input").value,
      imgClass: card.querySelector(".work-img-input").value.trim(),
      isOwnGame: card.querySelector(".work-owngame-input").checked,
      showActive: card.querySelector(".work-showactive-input").checked
    })),
    
    links: Array.from(document.querySelectorAll("#links-list-editor .cms-list-item-card")).map(card => ({
      title: card.querySelector(".link-title-input").value.trim(),
      url: card.querySelector(".link-url-input").value.trim(),
      icon: card.querySelector(".link-icon-input").value.trim(),
      subtitle: card.querySelector(".link-subtitle-input").value.trim()
    })),
    
    hiringStatus: form.elements["hiringStatus"].value,
    hiringStatusText: form.elements["hiringStatusText"].value.trim(),
    
    youtubeVideos: [
      {
        title: form.elements["vid1Title"].value.trim(),
        id: form.elements["vid1Id"].value.trim()
      },
      {
        title: form.elements["vid2Title"].value.trim(),
        id: form.elements["vid2Id"].value.trim()
      },
      {
        title: form.elements["vid3Title"].value.trim(),
        id: form.elements["vid3Id"].value.trim()
      },
      {
        title: form.elements["vid4Title"].value.trim(),
        id: form.elements["vid4Id"].value.trim()
      }
    ]
  };
  
  saveCMSData(updatedData);
});

// Logout Mechanism
document.getElementById("cms-logout-btn").addEventListener("click", () => {
  if (useFirebase) {
    firebase.auth().signOut().then(() => {
      closeCMSModal();
      document.getElementById("admin-fab").style.display = "none";
      alert("Signed out successfully.");
    });
  } else {
    closeCMSModal();
    document.getElementById("admin-fab").style.display = "none";
    alert("Signed out from local simulation mode.");
  }
});

// Google Authentication Sign In Button
document.getElementById("google-signin-btn").addEventListener("click", () => {
  if (useFirebase) {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        if (user.email === adminEmail) {
          closeLoginModal();
          document.getElementById("admin-fab").style.display = "flex";
          alert(`Welcome back, ${user.displayName}! Access granted.`);
          openCMSModal();
        } else {
          document.getElementById("cms-auth-error").textContent = `Access denied: Account ${user.email} is not authorized.`;
          document.getElementById("cms-auth-error").style.display = "block";
          firebase.auth().signOut();
        }
      })
      .catch((error) => {
        document.getElementById("cms-auth-error").textContent = error.message;
        document.getElementById("cms-auth-error").style.display = "block";
      });
  }
});

// Auth Listener
if (useFirebase) {
  firebase.auth().onAuthStateChanged((user) => {
    if (user && user.email === adminEmail) {
      document.getElementById("admin-fab").style.display = "flex";
    } else {
      document.getElementById("admin-fab").style.display = "none";
      if (user) {
        firebase.auth().signOut();
      }
    }
  });
}

// ==========================================================================
// Side Margin Creative Interactions (Draggable Stickers & Companion Mascot)
// ==========================================================================

function initSideMarginElements() {
  const isWideScreen = window.innerWidth >= 1200;
  if (!isWideScreen) return;

  // 1. Draggable Stickers Logic & Random Placement
  const stickers = document.querySelectorAll(".draggable-sticker");

  if (!window.hasInitializedStickerPositions) {
    stickers.forEach((sticker, index) => {
      const onLeft = index % 2 === 0;
      let leftVal, topVal;
      const randomRot = Math.floor(Math.random() * 30) - 15; // -15deg to 15deg
      sticker.style.transform = `rotate(${randomRot}deg)`;

      // Save initial rotation in dataset so it can be restored on mouseup/touchend
      sticker.dataset.initialRotation = randomRot;

      if (onLeft) {
        leftVal = 2 + Math.random() * 5; // 2% to 7%
        const bandMin = index === 0 ? 15 : (index === 2 ? 40 : 65);
        topVal = bandMin + Math.random() * 15;
        sticker.style.left = `${leftVal}%`;
        sticker.style.right = "auto";
      } else {
        const rightVal = 2 + Math.random() * 5; // 2% to 7%
        const bandMin = index === 1 ? 20 : 50;
        topVal = bandMin + Math.random() * 20;
        sticker.style.right = `${rightVal}%`;
        sticker.style.left = "auto";
      }
      sticker.style.top = `${topVal}%`;
    });
    window.hasInitializedStickerPositions = true;
  }
  
  stickers.forEach(sticker => {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    sticker.addEventListener("mousedown", dragStart);
    sticker.addEventListener("touchstart", dragStart, { passive: false });

    sticker.addEventListener("mouseenter", () => {
      if (!isDragging) {
        const initRot = sticker.dataset.initialRotation || 0;
        sticker.style.transform = `rotate(${parseFloat(initRot) + 5}deg) scale(1.08)`;
      }
    });

    sticker.addEventListener("mouseleave", () => {
      if (!isDragging) {
        const initRot = sticker.dataset.initialRotation || 0;
        sticker.style.transform = `rotate(${initRot}deg) scale(1)`;
      }
    });

    function dragStart(e) {
      if (e.target.tagName === "BUTTON" || e.target.tagName === "A") return;
      
      isDragging = true;
      sticker.style.cursor = "grabbing";

      const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;

      startX = clientX;
      startY = clientY;

      const rect = sticker.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;

      sticker.style.left = `${initialLeft}px`;
      sticker.style.top = `${initialTop}px`;
      sticker.style.right = "auto";
      sticker.style.bottom = "auto";

      if (typeof createClickParticles === "function") {
        createClickParticles(clientX, clientY);
      }

      document.addEventListener("mousemove", dragMove);
      document.addEventListener("touchmove", dragMove, { passive: false });
      document.addEventListener("mouseup", dragEnd);
      document.addEventListener("touchend", dragEnd);

      if (e.type === "touchstart") {
        e.preventDefault();
      }
    }

    function dragMove(e) {
      if (!isDragging) return;

      const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

      const dx = clientX - startX;
      const dy = clientY - startY;

      sticker.style.left = `${initialLeft + dx}px`;
      sticker.style.top = `${initialTop + dy}px`;

      if (e.type === "touchmove") {
        e.preventDefault();
      }
    }

    function dragEnd() {
      if (!isDragging) return;
      isDragging = false;
      sticker.style.cursor = "grab";

      const initRot = sticker.dataset.initialRotation || 0;
      sticker.style.transform = `rotate(${initRot}deg) scale(1)`;

      document.removeEventListener("mousemove", dragMove);
      document.removeEventListener("touchmove", dragMove);
      document.removeEventListener("mouseup", dragEnd);
      document.removeEventListener("touchend", dragEnd);
    }
  });

  // 2. Desktop Mascot Eye-Tracking & Speech Bubble
  const mascot = document.getElementById("mascot-wrapper");
  const pupilLeft = document.getElementById("pupil-left");
  const pupilRight = document.getElementById("pupil-right");
  const bubble = document.getElementById("mascot-bubble");

  const MASCOT_QUOTES = [
    "Need more coffee to debug this! ☕",
    "Roblox Game visits: 3.1M and counting! 🎮",
    "Fun fact: Lua tables are 1-indexed! 🌙",
    "Studying for CS exams... 99% loaded 📚",
    "Roblox scripting is where coding meets chaos! 👾",
    "Did you click on the driving simulator? 🚗",
    "Video editing pacing is all about rhythm! 🎬",
    "Try toggling the dark theme! 🌙",
    "Local variables in Lua are faster! 🧠",
    "Have a great day browsing! ✨"
  ];

  let bubbleTimeout = null;

  window.addEventListener("mousemove", (e) => {
    if (!mascot || !pupilLeft || !pupilRight) return;

    const rectLeft = pupilLeft.getBoundingClientRect();
    const rectRight = pupilRight.getBoundingClientRect();

    const eyeLeftCenter = { x: rectLeft.left + 3.5, y: rectLeft.top + 3.5 };
    const eyeRightCenter = { x: rectRight.left + 3.5, y: rectRight.top + 3.5 };

    updatePupil(pupilLeft, eyeLeftCenter, e.clientX, e.clientY);
    updatePupil(pupilRight, eyeRightCenter, e.clientX, e.clientY);
  });

  function updatePupil(pupil, center, mouseX, mouseY) {
    const dx = mouseX - center.x;
    const dy = mouseY - center.y;
    const angle = Math.atan2(dy, dx);
    const distance = Math.min(2.5, Math.hypot(dx, dy) / 60);

    const offsetX = Math.cos(angle) * distance;
    const offsetY = Math.sin(angle) * distance;

    const baseCX = pupil.id === "pupil-left" ? 28 : 52;
    const baseCY = 46;

    pupil.setAttribute("cx", String(baseCX + offsetX));
    pupil.setAttribute("cy", String(baseCY + offsetY));
  }

  if (mascot && bubble) {
    mascot.addEventListener("click", () => {
      const quote = MASCOT_QUOTES[Math.floor(Math.random() * MASCOT_QUOTES.length)];
      bubble.textContent = quote;
      bubble.classList.add("show");

      if (bubbleTimeout) clearTimeout(bubbleTimeout);

      bubbleTimeout = setTimeout(() => {
        bubble.classList.remove("show");
      }, 4000);
    });
  }
}

// Bind load and resize listeners
window.addEventListener("load", () => {
  initSideMarginElements();
  initBackgroundDecorations();
});

window.addEventListener("resize", () => {
  initSideMarginElements();
  initBackgroundDecorations();
});

// ==========================================================================
// Background Decorations Engine (Lights/Petals and Walking/Flying Creatures)
// ==========================================================================

function initBackgroundDecorations() {
  const container = document.getElementById("bg-decorations");
  if (!container) return;

  // Clear previous elements if re-initialized
  container.innerHTML = "";

  // 1. Spawn Ambient Particles (Glows for dark theme, petals for light theme)
  const particleCount = 18;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "bg-light-particle";
    
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    particle.style.left = `${x}%`;
    particle.style.top = `${y}%`;
    
    const scale = 0.5 + Math.random() * 0.8;
    const delay = Math.random() * -15; 
    const duration = 12 + Math.random() * 10;
    
    particle.style.animationDelay = `${delay}s`;
    particle.style.animationDuration = `${duration}s`;
    
    const mx = (Math.random() * 200 - 100) + "px";
    const my = (Math.random() * -200 - 80) + "px";
    particle.style.setProperty("--mx", mx);
    particle.style.setProperty("--my", my);
    
    container.appendChild(particle);
    
    setTimeout(() => {
      particle.style.opacity = "1";
    }, 100);
  }

  // 2. Periodically spawn background floating creatures (Max 3 co-existing)
  function spawnCreature() {
    const activeCreatures = container.querySelectorAll(".bg-creature");
    if (activeCreatures.length >= 3) return;

    if (activeCreatures.length > 0 && Math.random() > 0.6) return;

    const isDark = document.body.classList.contains("dark-theme");
    const creature = document.createElement("div");
    creature.className = "bg-creature";
    
    let animationClass = "";
    let duration = 20;

    if (isDark) {
      // Cats: lazy dreamy sinusoidal drift
      const catPaths = ["cat-drift-l", "cat-drift-r"];
      animationClass = catPaths[Math.floor(Math.random() * catPaths.length)];
      duration = 18 + Math.random() * 10;

      // Random vertical start position
      const topPos = 15 + Math.random() * 60;
      creature.style.top = `${topPos}%`;

      const cats = ["🐈‍⬛", "🐈", "🐱"];
      const catEmoji = cats[Math.floor(Math.random() * cats.length)];
      creature.innerHTML = `<div class="bg-creature-cat">${catEmoji}</div>`;

    } else {
      // Light mode: butterflies or birds
      const type = Math.random();

      if (type < 0.5) {
        // Butterfly: erratic zigzag or loop
        const butterflyPaths = ["butterfly-flutter-l", "butterfly-flutter-r", "butterfly-loop"];
        animationClass = butterflyPaths[Math.floor(Math.random() * butterflyPaths.length)];
        duration = 12 + Math.random() * 7;
        creature.innerHTML = `<div class="bg-creature-butterfly">🦋</div>`;
      } else {
        // Bird: soaring glide or dramatic dive
        const birdPaths = ["bird-soar-l", "bird-soar-r", "bird-dive"];
        animationClass = birdPaths[Math.floor(Math.random() * birdPaths.length)];
        duration = 11 + Math.random() * 8;

        const birds = ["🐦", "🕊️", "🦆"];
        const birdEmoji = birds[Math.floor(Math.random() * birds.length)];
        creature.innerHTML = `<div class="bg-creature-bird">${birdEmoji}</div>`;

        // Birds get a random top position when soaring
        if (animationClass === "bird-soar-l" || animationClass === "bird-soar-r") {
          const topPos = 10 + Math.random() * 50;
          creature.style.top = `${topPos}%`;
        }
      }
    }
    
    // Set duration via CSS custom property for animation classes that use var(--dur)
    creature.style.setProperty("--dur", `${duration}s`);
    creature.classList.add(animationClass);

    // Interactive Click logic for creatures
    creature.addEventListener("click", () => {
      if (creature.dataset.clicked === "true") return;
      creature.dataset.clicked = "true";

      const inner = creature.querySelector(".bg-creature-cat, .bg-creature-butterfly, .bg-creature-bird");
      if (inner) {
        inner.style.animation = "none";
        void inner.offsetWidth;
        inner.style.transition = "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.5), opacity 0.4s ease";
        inner.style.transform = "scale(2.5) rotate(360deg)";
        inner.style.opacity = "0";
      }

      const textBubble = document.createElement("div");
      textBubble.className = "creature-text-bubble";
      
      let soundText = "✨";
      const htmlContent = creature.innerHTML;
      if (htmlContent.includes("🐈") || htmlContent.includes("🐱") || htmlContent.includes("🐈‍⬛")) {
        const catSounds = ["Meow! 🐾", "Purr... 🐱", "Mrrph! 🐈‍⬛", "Mew! 💕", "Nyan! 🌈"];
        soundText = catSounds[Math.floor(Math.random() * catSounds.length)];
      } else if (htmlContent.includes("🦋")) {
        const butterflySounds = ["Flutter! 🦋", "✨", "Fly! 🌸", "Flutter... ✨"];
        soundText = butterflySounds[Math.floor(Math.random() * butterflySounds.length)];
      } else if (htmlContent.includes("🐦") || htmlContent.includes("🕊️") || htmlContent.includes("🦆")) {
        const birdSounds = ["Chirp! 🎵", "Tweet! 🕊️", "Quack! 🦆", "Flap flap! 🐦"];
        soundText = birdSounds[Math.floor(Math.random() * birdSounds.length)];
      }

      textBubble.innerText = soundText;
      creature.appendChild(textBubble);

      setTimeout(() => {
        if (creature.parentNode) creature.remove();
      }, 750);
    });
    
    container.appendChild(creature);
    
    setTimeout(() => {
      if (creature.parentNode) creature.remove();
    }, duration * 1000 + 500);
  }

  // Spawn initial creatures with a stagger so the screen is lively fast
  spawnCreature();
  setTimeout(spawnCreature, 2500);
  
  if (window.bgCreatureInterval) clearInterval(window.bgCreatureInterval);
  window.bgCreatureInterval = setInterval(spawnCreature, 6000 + Math.random() * 4000);
}

// Initial Database Trigger (Only if preloader is not present to handle loading workflow)
if (!document.getElementById("terminal-preloader")) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadData);
  } else {
    loadData();
  }
}


