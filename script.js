const ANHS_CONFIG = {
  clubSlug: "the-anhs-protocol-cote",
  memberLimit: 6,
  apiBase: "https://api.chess.com/pub",
  fallbackAvatar: "anhs-club-logo.png",
  joinLink:
    "https://www.chess.com/club/the-anhs-protocol-cote/join?utm_campaign=club_invite_link&utm_source=chesscom&utm_medium=copy",
  sections: [
    "home",
    "registry",
    "command",
    "social"
  ]
};

const ANHS_STATE = {
  currentSection: "home",
  members: [],
  newestMembers: [],
  randomMember: null,
  registryLoaded: false,
  registryLoading: false,
  bootStarted: false
};

const app = document.getElementById("app");
const sidebar = document.getElementById("sidebar");
const navToggle = document.getElementById("navToggle");
const nav =
  document.getElementById("mainNav") ||
  document.querySelector(".sidebar-nav");

let bootTimer = null;

function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  })[character]);
}

function safeText(value, fallback = "") {
  if (
    value === undefined ||
    value === null ||
    String(value).trim() === ""
  ) {
    return fallback;
  }

  return String(value);
}

async function fetchJson(url, timeout = 10000) {
  const controller = new AbortController();

  const timer = setTimeout(
    () => controller.abort(),
    timeout
  );

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json"
      },
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(
        `Request failed: ${response.status}`
      );
    }

    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function highestRating(stats = {}) {
  const ratingTypes = {
    chess_rapid: "Rapid",
    chess_blitz: "Blitz",
    chess_bullet: "Bullet",
    chess_daily: "Daily",
    chess960_daily: "Chess960"
  };

  const ratings = Object.entries(ratingTypes)
    .map(([key, label]) => ({
      label,
      rating:
        Number(
          stats?.[key]?.last?.rating
        ) || 0
    }))
    .filter(item => item.rating > 0)
    .sort(
      (a, b) => b.rating - a.rating
    );

  return ratings[0] || {
    label: "Unrated",
    rating: "—"
  };
}

function formatJoinDate(timestamp) {
  if (!timestamp) {
    return "Unknown";
  }

  const date = new Date(
    Number(timestamp) * 1000
  );

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric"
    }
  );
}

function relativeTime(timestamp) {
  if (!timestamp) {
    return "Unknown";
  }

  const difference = Math.max(
    0,
    Math.floor(
      Date.now() / 1000 -
      Number(timestamp)
    )
  );

  const minutes =
    Math.floor(difference / 60);

  const hours =
    Math.floor(minutes / 60);

  const days =
    Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ago`;
  }

  if (hours > 0) {
    return `${hours}h ago`;
  }

  if (minutes > 0) {
    return `${minutes}m ago`;
  }

  return "just now";
}

function systemHeader(
  kicker,
  title,
  description
) {
  return `
    <header class="system-page-header">
      <div class="system-kicker">
        ${escapeHtml(kicker)}
      </div>

      <h1>
        ${escapeHtml(title)}
      </h1>

      <p>
        ${escapeHtml(description)}
      </p>
    </header>
  `;
}

function renderHome() {
  return `
    ${systemHeader(
      "ANHS PROTOCOL // 01",
      "SYSTEM OVERVIEW",
      "The central interface of The ANHS Protocol — COTE."
    )}

    <section class="system-panel">
      <div class="panel-label">
        <span>ACADEMY IDENTIFICATION</span>
        <span>ANHS-OS</span>
      </div>

<div class="home-intro-grid">

  <div class="home-intro-logo">

    <img
      src="anhs-club-logo.png"
      alt="The ANHS Protocol club logo"
      style="
        width:160px;
        height:160px;
        object-fit:contain;
        filter:
          drop-shadow(
            0 0 24px
            rgba(87,227,239,.12)
          );
      "
    >

  </div>


  <div>

    <div
      class="system-kicker"
      style="margin-bottom:10px;"
    >
      THE ANHS PROTOCOL — COTE
    </div>

          <h2
            style="
              margin:0;
              color:var(--text-primary,#e8f1fc);
              font-size:30px;
            "
          >
            Advanced Nurturing High School
          </h2>

          <p
            style="
              color:var(--text-muted,#8e9ab2);
              line-height:1.8;
              max-width:620px;
              margin-top:12px;
            "
          >
            A centralized academy interface for
            student registry, command protocols,
            academy directives, communications,
            events and social systems.
          </p>
        </div>
      </div>
    </section>

    <br><br>

    <section class="system-panel">
      <div class="panel-label">
        <span>MODULE DIRECTORY</span>
        <span>04 SYSTEMS</span>
      </div>

      <div class="registry-grid">

        <a href="#home" class="member-card">
          <div
            class="member-avatar"
            style="
              display:grid;
              place-items:center;
              font-size:20px;
            "
          >
            01
          </div>

          <div>
            <div class="member-name">HOME</div>
            <div class="member-meta">
              SYSTEM OVERVIEW
            </div>
          </div>

          <div class="member-time">ACTIVE</div>
        </a>

        <a href="#registry" class="member-card">
          <div
            class="member-avatar"
            style="
              display:grid;
              place-items:center;
              font-size:20px;
            "
          >
            02
          </div>

          <div>
            <div class="member-name">REGISTRY</div>
            <div class="member-meta">
              STUDENT DATABASE
            </div>
          </div>

          <div class="member-time">→</div>
        </a>

        <a href="#command" class="member-card">
          <div
            class="member-avatar"
            style="
              display:grid;
              place-items:center;
              font-size:20px;
            "
          >
            03
          </div>

          <div>
            <div class="member-name">COMMAND</div>
            <div class="member-meta">
              DIRECTIVES & CONTROL
            </div>
          </div>

          <div class="member-time">→</div>
        </a>

        <a href="#social" class="member-card">
          <div
            class="member-avatar"
            style="
              display:grid;
              place-items:center;
              font-size:20px;
            "
          >
            04
          </div>

          <div>
            <div class="member-name">SOCIAL</div>
            <div class="member-meta">
              NETWORK & RADIO
            </div>
          </div>

          <div class="member-time">→</div>
        </a>

      </div>
    </section>

    <br><br>

    <section class="system-panel">
      <div class="panel-label">
        <span>SYSTEM BOOT LOG</span>
        <span>LIVE</span>
      </div>

      <div
        class="system-terminal"
        id="homeBootLog"
      >
        <div class="terminal-line">
          <span class="terminal-prompt">&gt;</span>
          <span class="terminal-muted">
            Initializing ANHS operating system...
          </span>
        </div>
      </div>
    </section>
  `;
}

function renderRegistry() {
  return `
    ${systemHeader(
      "ANHS PROTOCOL // 02",
      "PERSONNEL REGISTRY",
      "Live student registration data retrieved from the official Chess.com club."
    )}

    <section class="system-panel">
      <div class="panel-label">
        <span>NEWEST REGISTERED PERSONNEL</span>
        <span>CHESS.COM PUBAPI</span>
      </div>

      <div
        id="memberBoard"
        class="registry-grid"
        aria-live="polite"
      >
        <div
          class="system-terminal"
          style="grid-column:1/-1;"
        >
          <div class="terminal-line">
            <span class="terminal-prompt">&gt;</span>
            <span class="terminal-muted">
              Synchronizing academy registry...
            </span>
          </div>
        </div>
      </div>

      <div
        style="
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:15px;
          flex-wrap:wrap;
          margin-top:20px;
          padding-top:17px;
          border-top:1px solid var(--border);
        "
      >
        <span
          id="memberUpdated"
          style="
            color:#536078;
            font-size:9px;
            letter-spacing:.08em;
          "
        >
          Awaiting registry synchronization
        </span>

        <button
          class="system-button"
          id="refreshMembers"
          type="button"
        >
          REFRESH REGISTRY
        </button>
      </div>
    </section>

    <br><br>

    <section class="system-panel">
      <div class="panel-label">
        <span>PERSONNEL SELECTION</span>
        <span>RANDOMIZED</span>
      </div>

      <div
        id="randomMember"
        class="personnel-selection"
      >
        <div>
          <div class="personnel-id">
            SUBJECT SELECTION
          </div>

          <h2 class="personnel-name">
            AWAITING REGISTRY
          </h2>

          <div class="personnel-status">
            DATABASE SYNCHRONIZATION REQUIRED
          </div>
        </div>
      </div>

      <div
        style="
          display:flex;
          gap:10px;
          margin-top:24px;
        "
      >
        <button
          class="system-button"
          id="rerollMember"
          type="button"
        >
          REROLL SUBJECT
        </button>

        <a
          class="system-button"
          href="https://www.chess.com/clubs/members/the-anhs-protocol-cote?sort=12"
          target="_blank"
          rel="noopener noreferrer"
        >
          FULL REGISTRY ↗
        </a>
      </div>
    </section>
  `;
}

function renderCommand() {
  const directives = [
    "Respect every member.",
    "Fair Play is mandatory.",
    "English is the primary language.",
    "Compete with honor.",
    "Help strengthen the academy.",
    "Friendly banter is welcome; accusations and hostility are not.",
    "Keep discussions calm and constructive.",
    "Consult an administrator before posting official club-related content.",
    "Rules may evolve as the academy grows."
  ];

  const directiveHTML = directives
    .map(
      (directive, index) => `
        <div
          class="member-card"
          style="
            grid-template-columns:40px 1fr;
          "
        >
          <div
            style="
              color:var(--accent,#c1121f);
              font-size:10px;
              font-weight:800;
            "
          >
            ${String(index + 1).padStart(2, "0")}
          </div>

          <div>
            <div class="member-name">
              ${escapeHtml(directive)}
            </div>

            <div class="member-meta">
              AUTHORIZED ACADEMY DIRECTIVE
            </div>
          </div>
        </div>
      `
    )
    .join("");

  return `
    ${systemHeader(
      "ANHS PROTOCOL // 03",
      "COMMAND CENTER",
      "Administrative systems, academy directives and operational protocols."
    )}

    <section class="system-panel">
      <div class="panel-label">
        <span>COMMAND MODULES</span>
        <span>ONLINE</span>
      </div>

      <div class="registry-grid">

        <a
          class="member-card"
          href="https://www.chess.com/club/the-anhs-protocol-cote/announcements"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div
            class="member-avatar"
            style="
              display:grid;
              place-items:center;
            "
          >
            📡
          </div>

          <div>
            <div class="member-name">
              ANNOUNCEMENTS
            </div>

            <div class="member-meta">
              CHESS.COM CLUB ANNOUNCEMENTS
            </div>
          </div>

          <div class="member-time">↗</div>
        </a>

        <a
          class="member-card"
          href="https://www.chess.com/clubs/forum/the-anhs-protocol-cote"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div
            class="member-avatar"
            style="
              display:grid;
              place-items:center;
            "
          >
            💬
          </div>

          <div>
            <div class="member-name">
              COMMUNICATIONS
            </div>

            <div class="member-meta">
              ACADEMY FORUM
            </div>
          </div>

          <div class="member-time">↗</div>
        </a>

        <a
          class="member-card"
          href="https://www.chess.com/clubs/forum/view/member-feedback-3"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div
            class="member-avatar"
            style="
              display:grid;
              place-items:center;
            "
          >
            📝
          </div>

          <div>
            <div class="member-name">
              FEEDBACK
            </div>

            <div class="member-meta">
              MEMBER FEEDBACK PORTAL
            </div>
          </div>

          <div class="member-time">↗</div>
        </a>

        <a
          class="member-card"
          href="https://www.chess.com/clubs/forum/view/official-advertising-forum-22-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div
            class="member-avatar"
            style="
              display:grid;
              place-items:center;
            "
          >
            📢
          </div>

          <div>
            <div class="member-name">
              PROMOTION
            </div>

            <div class="member-meta">
              OFFICIAL ADVERTISING FORUM
            </div>
          </div>

          <div class="member-time">↗</div>
        </a>

        <a
          class="member-card"
          href="https://www.chess.com/club/anhs-protocol-giveaway"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div
            class="member-avatar"
            style="
              display:grid;
              place-items:center;
            "
          >
            🎁
          </div>

          <div>
            <div class="member-name">
              REWARD CENTER
            </div>

            <div class="member-meta">
              ACADEMY REWARDS
            </div>
          </div>

          <div class="member-time">↗</div>
        </a>

        <a
          class="member-card"
          href="https://www.chess.com/clubs/events/the-anhs-protocol-cote"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div
            class="member-avatar"
            style="
              display:grid;
              place-items:center;
            "
          >
            ♟
          </div>

          <div>
            <div class="member-name">
              OAA EVENTS
            </div>

            <div class="member-meta">
              ACADEMY EVENT NETWORK
            </div>
          </div>

          <div class="member-time">↗</div>
        </a>

      </div>
    </section>

    <br><br>

    <section class="system-panel">
      <div class="panel-label">
        <span>CORE DIRECTIVES</span>
        <span>AUTHORIZED</span>
      </div>

      <div class="registry-grid">
        ${directiveHTML}
      </div>
    </section>

    <br><br>

    <section class="system-panel">
      <div class="panel-label">
        <span>DISCIPLINE PROTOCOL</span>
        <span>3 LEVELS</span>
      </div>

      <div class="registry-grid">

        <div class="member-card">
          <div
            class="member-avatar"
            style="
              display:grid;
              place-items:center;
            "
          >
            01
          </div>

          <div>
            <div class="member-name">
              WARNING
            </div>

            <div class="member-meta">
              FORMAL NOTICE & CORRECTION
            </div>
          </div>
        </div>

        <div class="member-card">
          <div
            class="member-avatar"
            style="
              display:grid;
              place-items:center;
            "
          >
            02
          </div>

          <div>
            <div class="member-name">
              MUTE
            </div>

            <div class="member-meta">
              TEMPORARY COMMUNICATION RESTRICTION
            </div>
          </div>
        </div>

        <div class="member-card">
          <div
            class="member-avatar"
            style="
              display:grid;
              place-items:center;
            "
          >
            03
          </div>

          <div>
            <div class="member-name">
              BAN
            </div>

            <div class="member-meta">
              REMOVAL FOR SERIOUS OR REPEATED VIOLATIONS
            </div>
          </div>
        </div>

      </div>
    </section>
  `;
}

function renderSocial() {

  return `
    <section class="page social-page">

      <div class="page-header">

        <div>

          <div class="eyebrow">
            COMMUNICATION NODE // SOCIAL
          </div>

          <h1>
            SOCIAL
          </h1>

          <p class="page-description">
            External communication channels, club media,
            and ANHS Radio.
          </p>

        </div>

        <div class="system-status">

          <span class="status-dot"></span>

          <span>
            NETWORK ONLINE
          </span>

        </div>

      </div>


      <div class="social-grid">

        <article class="panel social-channel-panel">

          <div class="panel-header">

            <span>
              CHANNELS
            </span>

            <span class="panel-code">
              COM-01
            </span>

          </div>


          <div class="channel-list">

            <a
              class="social-channel"
              href="https://www.chess.com/club/the-anhs-protocol-cote"
              target="_blank"
              rel="noopener noreferrer"
            >

              <div class="channel-icon">
                ♟
              </div>

              <div class="channel-info">

                <strong>
                  CHESS.COM
                </strong>

                <small>
                  THE ANHS PROTOCOL — COTE
                </small>

              </div>

              <span class="channel-arrow">
                ↗
              </span>

            </a>


            <a
              class="social-channel"
              href="https://discord.gg/bvT5Cfs2ny"
            >

              <div class="channel-icon">
                ◈
              </div>

              <div class="channel-info">

                <strong>
                  DISCORD
                </strong>

                <small>
                  CLUB COMMUNICATION NETWORK
                </small>

              </div>

              <span class="channel-arrow">
                ↗
              </span>

            </a>


            <a
              class="social-channel"
              href="https://anhs-protocol.vercel.app/"
            >

              <div class="channel-icon">
                ◎
              </div>

              <div class="channel-info">

                <strong>
                  COMMUNITY
                </strong>

                <small>
                  EXTERNAL CLUB NETWORK
                </small>

              </div>

              <span class="channel-arrow">
                ↗
              </span>

            </a>

          </div>

        </article>


        <article class="panel network-panel">

          <div class="panel-header">

            <span>
              NETWORK STATUS
            </span>

            <span class="panel-code">
              SYS-04
            </span>

          </div>


          <div class="system-readout">

            <div class="readout-row">
              <span>CONNECTION</span>
              <strong class="online">ESTABLISHED</strong>
            </div>

            <div class="readout-row">
              <span>CLUB NODE</span>
              <strong>ANHS-COTE</strong>
            </div>

            <div class="readout-row">
              <span>ACCESS</span>
              <strong>PUBLIC</strong>
            </div>

            <div class="readout-row">
              <span>PROTOCOL</span>
              <strong>ACTIVE</strong>
            </div>

          </div>


          <div class="terminal-note">

            <span>&gt;</span>

            <span>
              ALL COMMUNICATION CHANNELS
              OPERATIONAL.
            </span>

          </div>

        </article>

      </div>


      <article class="panel radio-panel">

        <div class="panel-header">

          <span>
            ANHS RADIO
          </span>

          <span class="panel-code">
            MEDIA-07
          </span>

        </div>


        <div class="radio-layout">

          <div class="radio-cover-wrap">

            <img
              id="radioCover"
              class="radio-cover"
              src="anhs-club-logo.png"
              alt="ANHS Radio cover"
            >

          </div>


          <div class="radio-player">

            <div class="radio-system-label">

              <span class="status-dot"></span>

              AUDIO TRANSMISSION

            </div>


            <h2 id="radioTitle">
              INITIALIZING...
            </h2>


            <p id="radioArtist">
              Establishing ANHS Radio connection...
            </p>


            <div class="radio-progress">

              <span id="elapsed">
                0:00
              </span>

              <input
                id="progress"
                type="range"
                min="0"
                max="100"
                value="0"
                step="0.1"
                aria-label="Track progress"
              >

              <span id="duration">
                0:00
              </span>

            </div>


            <div class="radio-controls">

              <button
                id="radioPrev"
                type="button"
                aria-label="Previous track"
              >
                ◀◀
              </button>

              <button
                id="radioPlay"
                class="radio-play"
                type="button"
                aria-label="Play or pause"
              >
                ▶ PLAY
              </button>

              <button
                id="radioNext"
                type="button"
                aria-label="Next track"
              >
                ▶▶
              </button>

            </div>


            <div class="radio-volume">

              <span>
                VOL
              </span>

              <input
                id="radioVolume"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value="0.75"
                aria-label="Volume"
              >

            </div>

          </div>

        </div>


        <div class="radio-playlist">

          <div class="playlist-header">

            <span>
              TRANSMISSION QUEUE
            </span>

            <span>
              <span class="status-dot"></span>
              LIVE
            </span>

          </div>


          <div
            id="trackList"
            class="track-list"
          >

            <div class="system-terminal">

              <div class="terminal-line">

                <span class="terminal-prompt">
                  &gt;
                </span>

                <span>
                  SCANNING AUDIO DATABASE...
                </span>

              </div>

            </div>

          </div>

        </div>

      </article>


      <div class="social-footer-readout">

        <span>
          ANHS PROTOCOL
        </span>

        <span>
          //
        </span>

        <span>
          SOCIAL COMMUNICATION NODE
        </span>

        <span>
          //
        </span>

        <span>
          STATUS: ONLINE
        </span>

      </div>

    </section>
  `;

}

const pages = {
  home: renderHome,
  registry: renderRegistry,
  command: renderCommand,
  social: renderSocial
};

function updateNavigation(currentSection) {
  document
    .querySelectorAll(
      ".nav-item, .main-nav a"
    )
    .forEach(link => {
      const href =
        link.getAttribute("href") || "";

      const section =
        href
          .replace("#", "")
          .trim()
          .toLowerCase();

      link.classList.toggle(
        "active",
        section === currentSection
      );
    });
}

function closeSidebar() {
  sidebar?.classList.remove("open");
  nav?.classList.remove("open");

  navToggle?.setAttribute(
    "aria-expanded",
    "false"
  );
}

function toggleSidebar() {
  const target =
    sidebar || nav;

  if (!target) {
    return;
  }

  const isOpen =
    target.classList.toggle("open");

  navToggle?.setAttribute(
    "aria-expanded",
    String(isOpen)
  );
}

function startHomeBoot() {
  clearInterval(bootTimer);

  const box =
    document.getElementById(
      "homeBootLog"
    );

  if (!box) {
    return;
  }

  const messages = [
    "ANHS OS kernel initialized.",
    "Academy identification verified.",
    "Club network connection established.",
    "Student registry subsystem loaded.",
    "Chess.com public interface detected.",
    "Command module loaded.",
    "Directive protocol loaded.",
    "Social network module loaded.",
    "TBX exchange subsystem detected.",
    "ANHS Radio subsystem standing by.",
    "Security clearance verified.",
    "All primary systems operational."
  ];

  let messageIndex = 0;

  box.innerHTML = "";

  const addLine = () => {
    if (!document.body.contains(box)) {
      clearInterval(bootTimer);
      return;
    }

    if (messageIndex >= messages.length) {
      clearInterval(bootTimer);
      return;
    }

    const line =
      document.createElement("div");

    line.className =
      "terminal-line";

    line.innerHTML = `
      <span class="terminal-prompt">
        &gt;
      </span>

      <span class="terminal-ok">
        ${escapeHtml(
          messages[messageIndex++]
        )}
      </span>
    `;

    box.appendChild(line);
  };

  addLine();

  bootTimer = setInterval(
    addLine,
    380
  );
}

async function fetchClubMembers() {

  const url =
    `${ANHS_CONFIG.apiBase}/club/${ANHS_CONFIG.clubSlug}/members`;

  const club =
    await fetchJson(url);

  const recent = [
    ...(club.weekly || []),
    ...(club.monthly || [])
  ];

  const unique = new Map();

  recent.forEach(member => {
    if (
      member &&
      member.username
    ) {
      unique.set(
        member.username.toLowerCase(),
        member
      );
    }
  });

  return [
    ...unique.values()
  ].sort(
    (a, b) =>
      (b.joined || 0) -
      (a.joined || 0)
  );

}

async function fetchMemberData(member) {
  const username =
    safeText(
      member?.username,
      ""
    );

  if (!username) {
    return {
      ...member,
      profile: {},
      topRating: {
        label: "Unrated",
        rating: "—"
      }
    };
  }

  const [
    profileResult,
    statsResult
  ] = await Promise.allSettled([
    fetchJson(
      `${ANHS_CONFIG.apiBase}/player/${encodeURIComponent(username)}`
    ),
    fetchJson(
      `${ANHS_CONFIG.apiBase}/player/${encodeURIComponent(username)}/stats`
    )
  ]);

  const profile =
    profileResult.status === "fulfilled"
      ? profileResult.value || {}
      : {};

  const stats =
    statsResult.status === "fulfilled"
      ? statsResult.value || {}
      : {};

  return {
    ...member,
    username,
    profile,
    topRating: highestRating(stats)
  };
}

async function loadRegistry(force = false) {
  if (
    ANHS_STATE.registryLoading
  ) {
    return;
  }

  if (
    ANHS_STATE.registryLoaded &&
    !force
  ) {
    renderNewestMembers();
    renderRandomMember();
    return;
  }

  const board =
    document.getElementById(
      "memberBoard"
    );

  const updated =
    document.getElementById(
      "memberUpdated"
    );

  const refresh =
    document.getElementById(
      "refreshMembers"
    );

  if (!board) {
    return;
  }

  ANHS_STATE.registryLoading =
    true;

  if (refresh) {
    refresh.disabled = true;
    refresh.textContent =
      "SYNCHRONIZING…";
  }

  board.innerHTML = `
    <div
      class="system-terminal"
      style="grid-column:1/-1;"
    >
      <div class="terminal-line">
        <span class="terminal-prompt">&gt;</span>
        <span class="terminal-muted">
          Contacting Chess.com registry...
        </span>
      </div>
    </div>
  `;

  try {
    const allMembers =
      await fetchClubMembers();

    if (!allMembers.length) {
      throw new Error(
        "No members were returned."
      );
    }

    allMembers.sort(
      (a, b) =>
        Number(b?.joined || 0) -
        Number(a?.joined || 0)
    );

    ANHS_STATE.members =
      allMembers;

    const newest =
      allMembers.slice(
        0,
        ANHS_CONFIG.memberLimit
      );

    const records =
      await Promise.all(
        newest.map(fetchMemberData)
      );

    ANHS_STATE.newestMembers =
      records;

    const validRecords =
      records.filter(
        member =>
          member.profile &&
          Object.keys(
            member.profile
          ).length > 0
      );

    if (validRecords.length) {
      ANHS_STATE.randomMember =
        validRecords[
          Math.floor(
            Math.random() *
            validRecords.length
          )
        ];
    } else {
      ANHS_STATE.randomMember =
        records[0] || null;
    }

    ANHS_STATE.registryLoaded =
      true;

    renderNewestMembers();
    renderRandomMember();

    if (updated) {
      updated.textContent =
        `Registry synchronized ${new Date().toLocaleTimeString(
          [],
          {
            hour: "numeric",
            minute: "2-digit"
          }
        )} • ${records.length} newest members`;
    }

  } catch (error) {
    console.error(
      "ANHS registry synchronization failed:",
      error
    );

    board.innerHTML = `
      <div
        class="system-terminal"
        style="grid-column:1/-1;"
      >
        <div class="terminal-line">
          <span class="terminal-prompt">&gt;</span>
          <span>
            REGISTRY SYNCHRONIZATION FAILED
          </span>
        </div>

        <div
          class="terminal-line"
          style="margin-top:8px;"
        >
          <span class="terminal-prompt">&gt;</span>
          <span class="terminal-muted">
            Chess.com public API may be temporarily unavailable.
          </span>
        </div>

        <div style="margin-top:18px;">
          <button
            class="system-button"
            id="retryMembers"
            type="button"
          >
            RETRY CONNECTION
          </button>
        </div>
      </div>
    `;

    document
      .getElementById("retryMembers")
      ?.addEventListener(
        "click",
        () => loadRegistry(true)
      );

    if (updated) {
      updated.textContent =
        "Public API connection unavailable";
    }
  } finally {
    ANHS_STATE.registryLoading =
      false;

    if (refresh) {
      refresh.disabled = false;
      refresh.textContent =
        "REFRESH REGISTRY";
    }
  }
}

function renderNewestMembers() {
  const board =
    document.getElementById(
      "memberBoard"
    );

  if (!board) {
    return;
  }

  const records =
    ANHS_STATE.newestMembers;

  if (!records.length) {
    board.innerHTML = `
      <div
        class="system-terminal"
        style="grid-column:1/-1;"
      >
        <div class="terminal-line">
          <span class="terminal-prompt">&gt;</span>
          <span>
            NO REGISTRY DATA AVAILABLE
          </span>
        </div>
      </div>
    `;

    return;
  }

  const now =
    Math.floor(
      Date.now() / 1000
    );

  board.innerHTML =
    records
      .map(member => {
        const username =
          safeText(
            member?.username,
            "UNKNOWN"
          );

        const profile =
          member?.profile || {};

        const avatar =
          safeText(
            profile.avatar,
            ANHS_CONFIG.fallbackAvatar
          );

        const joined =
          formatJoinDate(
            member?.joined
          );

        const lastOnline =
          Number(
            profile.last_online || 0
          );

        const online =
          lastOnline > 0 &&
          now - lastOnline < 600;

        const country =
          safeText(
            profile.country,
            ""
          )
            .split("/")
            .pop();

        const rating =
          member?.topRating || {
            label: "Unrated",
            rating: "—"
          };

        return `
          <a
            class="member-card"
            href="https://www.chess.com/member/${encodeURIComponent(username)}"
            target="_blank"
            rel="noopener noreferrer"
          >

            <div
              style="
                position:relative;
                width:54px;
                height:54px;
              "
            >
              <img
                class="member-avatar"
                src="${escapeHtml(avatar)}"
                alt="${escapeHtml(username)}"
                loading="lazy"
                onerror="this.src='${ANHS_CONFIG.fallbackAvatar}'"
              >

              <span
                style="
                  position:absolute;
                  right:-1px;
                  bottom:1px;
                  width:10px;
                  height:10px;
                  border-radius:50%;
                  background:${online ? "var(--green,#4bdd91)" : "#4b566c"};
                  border:2px solid var(--panel,#111a2b);
                "
                title="${online ? "Recently online" : "Offline"}"
              ></span>
            </div>

            <div>
              <div class="member-name">
                ${escapeHtml(username)}
              </div>

              <div class="member-meta">
                ${
                  country
                    ? escapeHtml(country)
                    : "ANHS"
                }
                · Joined ${escapeHtml(joined)}
              </div>
            </div>

            <div
              style="
                text-align:right;
                white-space:nowrap;
              "
            >
              <div
                style="
                  color:var(--text-primary,#dce7f7);
                  font-size:13px;
                  font-weight:800;
                "
              >
                ${escapeHtml(
                  rating.rating
                )}
              </div>

              <div
                style="
                  margin-top:4px;
                  color:#62718a;
                  font-size:8px;
                  letter-spacing:.08em;
                "
              >
                ${escapeHtml(
                  rating.label
                )}
              </div>
            </div>

          </a>
        `;
      })
      .join("");
}

function renderRandomMember() {
  const box =
    document.getElementById(
      "randomMember"
    );

  if (!box) {
    return;
  }

  const member =
    ANHS_STATE.randomMember;

  if (!member) {
    box.innerHTML = `
      <div>
        <div class="personnel-id">
          SUBJECT SELECTION
        </div>

        <h2 class="personnel-name">
          AWAITING DATA
        </h2>

        <div class="personnel-status">
          REGISTRY SYNCHRONIZATION REQUIRED
        </div>
      </div>
    `;

    return;
  }

  const username =
    safeText(
      member.username,
      "UNKNOWN"
    );

  const profile =
    member.profile || {};

  const avatar =
    safeText(
      profile.avatar,
      ANHS_CONFIG.fallbackAvatar
    );

  const lastOnline =
    Number(
      profile.last_online || 0
    );

  const online =
    lastOnline > 0 &&
    (
      Math.floor(Date.now() / 1000) -
      lastOnline
    ) < 600;

  const joined =
    formatJoinDate(
      member.joined
    );

  const country =
    safeText(
      profile.country,
      ""
    )
      .split("/")
      .pop();

  box.innerHTML = `
    <div>
      <img
        class="personnel-avatar"
        src="${escapeHtml(avatar)}"
        alt="${escapeHtml(username)}"
        onerror="this.src='${ANHS_CONFIG.fallbackAvatar}'"
      >
    </div>

    <div>
      <div class="personnel-id">
        RANDOM PERSONNEL // ACTIVE RECORD
      </div>

      <h2 class="personnel-name">
        ${escapeHtml(username)}
      </h2>

      <div class="personnel-status">
        ● ${online ? "RECENTLY ONLINE" : "OFFLINE"}
      </div>

      <div
        style="
          display:flex;
          gap:18px;
          flex-wrap:wrap;
          margin-top:15px;
          color:#68768d;
          font-size:9px;
          letter-spacing:.08em;
        "
      >
        <span>
          JOINED ${escapeHtml(joined)}
        </span>

        <span>
          ${
            country
              ? escapeHtml(country)
              : "ANHS"
          }
        </span>
      </div>

      <div style="margin-top:18px;">
        <a
          class="system-button"
          href="https://www.chess.com/member/${encodeURIComponent(username)}"
          target="_blank"
          rel="noopener noreferrer"
        >
          VIEW PROFILE ↗
        </a>
      </div>
    </div>
  `;
}

async function rerollMember() {
  if (!ANHS_STATE.members.length) {
    await loadRegistry();
  }

  if (!ANHS_STATE.members.length) {
    return;
  }

  const candidates =
    ANHS_STATE.members;

  if (candidates.length === 1) {
    ANHS_STATE.randomMember =
      await fetchMemberData(
        candidates[0]
      );

    renderRandomMember();
    return;
  }

  let selected;

  do {
    selected =
      candidates[
        Math.floor(
          Math.random() *
          candidates.length
        )
      ];
  } while (
    ANHS_STATE.randomMember &&
    selected.username ===
      ANHS_STATE.randomMember.username
  );

  if (
    !selected.profile ||
    !Object.keys(
      selected.profile
    ).length
  ) {
    selected =
      await fetchMemberData(
        selected
      );
  }

  ANHS_STATE.randomMember =
    selected;

  renderRandomMember();
}

function bindRegistryEvents() {
  document
    .getElementById(
      "refreshMembers"
    )
    ?.addEventListener(
      "click",
      () => loadRegistry(true)
    );

  document
    .getElementById(
      "rerollMember"
    )
    ?.addEventListener(
      "click",
      rerollMember
    );
}

function bindSocialEvents() {
  const radioButton =
    document.getElementById(
      "openRadio"
    );

  if (!radioButton) {
    return;
  }

  radioButton.addEventListener(
    "click",
    () => {
      if (
        typeof window.renderRadioPage ===
        "function"
      ) {
        window.renderRadioPage();
      }
    }
  );
}

function render() {
  if (!app) {
    console.error(
      "ANHS OS: #app was not found."
    );

    return;
  }

  const hash =
    (
      location.hash ||
      "#home"
    )
      .replace("#", "")
      .trim()
      .toLowerCase();

  const route =
    ANHS_CONFIG.sections.includes(hash)
      ? hash
      : "home";

  ANHS_STATE.currentSection =
    route;

  const renderer =
    pages[route] ||
    pages.home;

  if (
    route !== "social" &&
    typeof window.stopRadioForNavigation ===
      "function"
  ) {
    window.stopRadioForNavigation();
  }

  app.innerHTML =
    renderer();

  updateNavigation(route);
  closeSidebar();

  if (route === "home") {
    startHomeBoot();
  }

  if (route === "registry") {
    bindRegistryEvents();
    loadRegistry();
  }

  if (route === "social") {
    bindSocialEvents();
  }

  try {
    app.focus({
      preventScroll: true
    });
  } catch {
    // Ignore focus errors.
  }
}

window.addEventListener(
  "hashchange",
  render
);

document
  .querySelectorAll(
    ".nav-item, .main-nav a"
  )
  .forEach(link => {
    link.addEventListener(
      "click",
      closeSidebar
    );
  });

if (navToggle) {
  navToggle.addEventListener(
    "click",
    toggleSidebar
  );
}

document.addEventListener(
  "keydown",
  event => {
    if (event.key === "Escape") {
      closeSidebar();
    }
  }
);

function bootANHS() {
  if (ANHS_STATE.bootStarted) {
    return;
  }

  ANHS_STATE.bootStarted =
    true;

  console.log(
    "%c ANHS PROTOCOL ",
    "color:#c1121f;font-weight:900;font-size:14px;"
  );

  console.log(
    "%c ANHS OS // SYSTEM ONLINE ",
    "color:#4bdd91;font-weight:800;"
  );

  console.log(
    "Club:",
    ANHS_CONFIG.clubSlug
  );

  console.log(
    "Modules:",
    ANHS_CONFIG.sections.join(
      " / "
    )
  );

  render();
}

if (
  document.readyState ===
  "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    bootANHS
  );
} else {
  bootANHS();
}