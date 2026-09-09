// ---------- Mobile nav ----------
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', links.classList.contains('open'));
    });
  }
});

// ---------- Helpers ----------
async function loadJSON(path) {
  try {
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load ' + path);
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}

// ---------- Home page dynamic content ----------
async function renderHome() {
  const data = await loadJSON('content/site.json');
  if (!data) return;

  const heroSection = document.querySelector('[data-hero-section]');
  if (heroSection && data.hero && data.hero.image) {
    heroSection.style.backgroundImage =
      `url('${data.hero.image}')`;
  }

  const heroTitle = document.querySelector('[data-hero-title]');
  const heroSub = document.querySelector('[data-hero-sub]');
  const heroEyebrow = document.querySelector('[data-hero-eyebrow]');
  if (data.hero) {
    if (heroTitle) heroTitle.textContent = data.hero.title;
    if (heroSub) heroSub.textContent = data.hero.subtitle;
    if (heroEyebrow) heroEyebrow.textContent = data.hero.eyebrow;
  }

  const statsWrap = document.querySelector('[data-stats]');
  if (statsWrap && Array.isArray(data.stats)) {
    statsWrap.innerHTML = '';
    data.stats.forEach(s => {
      const stat = el('div', 'stat');
      stat.innerHTML = `<span class="num">${s.num}</span><span class="label">${s.label}</span>`;
      statsWrap.appendChild(stat);
    });
  }

  const bioWrap = document.querySelector('[data-bio-paragraphs]');
  if (bioWrap && data.bio && Array.isArray(data.bio.paragraphs)) {
    bioWrap.innerHTML = data.bio.paragraphs.map(p => `<p>${p}</p>`).join('');
  }

  const topicsWrap = document.querySelector('[data-topics]');
  if (topicsWrap && Array.isArray(data.topics)) {
    topicsWrap.innerHTML = '';
    data.topics.forEach(t => {
      const card = el('div', 'topic');
      card.innerHTML = `<h3>${t.title}</h3><p>${t.description}</p>`;
      topicsWrap.appendChild(card);
    });
  }

  const testiWrap = document.querySelector('[data-testimonials]');
  if (testiWrap && Array.isArray(data.testimonials)) {
    testiWrap.innerHTML = '';
    data.testimonials.forEach(t => {
      const card = el('div', 'testi');
      card.innerHTML = `<p>“${t.quote}”</p><cite>${t.name}${t.role ? ', ' + t.role : ''}</cite>`;
      testiWrap.appendChild(card);
    });
  }
}

// ---------- Talks library ----------
let ALL_TALKS = [];
let activeTopic = 'All';

function renderTalks(list) {
  const wrap = document.querySelector('[data-talk-list]');
  if (!wrap) return;
  wrap.innerHTML = '';
  if (!list.length) {
    wrap.appendChild(el('div', 'empty-state', 'No talks match your search yet. Try a different keyword.'));
    return;
  }
  list.forEach(t => {
    const item = el('div', 'talk-item');
    const link = t.videoUrl
      ? `<a class="btn watch" href="${t.videoUrl}" target="_blank" rel="noopener">Watch</a>`
      : '';
    item.innerHTML = `
      <div>
        <h3>${t.title}</h3>
        <div class="meta">${t.topic}${t.date ? ' · ' + t.date : ''}</div>
        <p>${t.description || ''}</p>
      </div>
      ${link}
    `;
    wrap.appendChild(item);
  });
}

function applyTalkFilters() {
  const query = (document.querySelector('[data-talk-search]')?.value || '').toLowerCase().trim();
  const filtered = ALL_TALKS.filter(t => {
    const matchesTopic = activeTopic === 'All' || t.topic === activeTopic;
    const haystack = [t.title, t.topic, t.description, (t.keywords || []).join(' ')]
      .join(' ').toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    return matchesTopic && matchesQuery;
  });
  renderTalks(filtered);
}

async function renderTalksPage() {
  const listWrap = document.querySelector('[data-talk-list]');
  if (!listWrap) return;
  const data = await loadJSON('content/talks.json');
  if (!data || !Array.isArray(data.talks)) return;

  ALL_TALKS = data.talks;

  const topics = ['All', ...new Set(ALL_TALKS.map(t => t.topic).filter(Boolean))];
  const filterWrap = document.querySelector('[data-talk-filters]');
  if (filterWrap) {
    filterWrap.innerHTML = '';
    topics.forEach(topic => {
      const btn = el('button', topic === 'All' ? 'active' : '', topic);
      btn.addEventListener('click', () => {
        activeTopic = topic;
        filterWrap.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyTalkFilters();
      });
      filterWrap.appendChild(btn);
    });
  }

  const search = document.querySelector('[data-talk-search]');
  if (search) search.addEventListener('input', applyTalkFilters);

  renderTalks(ALL_TALKS);
}

// ---------- Events ----------
async function renderEventsPage() {
  const upcomingWrap = document.querySelector('[data-events-upcoming]');
  const pastWrap = document.querySelector('[data-events-past]');
  if (!upcomingWrap && !pastWrap) return;

  const data = await loadJSON('content/events.json');
  if (!data || !Array.isArray(data.events)) return;

  const renderList = (wrap, events, emptyMsg) => {
    if (!wrap) return;
    wrap.innerHTML = '';
    if (!events.length) {
      wrap.appendChild(el('div', 'empty-state', emptyMsg));
      return;
    }
    events.forEach(e => {
      const item = el('div', 'event-item');
      const link = e.link ? `<a class="btn" href="${e.link}" target="_blank" rel="noopener">Details</a>` : '';
      item.innerHTML = `
        <div class="date">${e.date || ''}</div>
        <div>
          <h3>${e.title}</h3>
          <div class="place">${e.location || ''}</div>
          <p>${e.description || ''}</p>
        </div>
        ${link}
      `;
      wrap.appendChild(item);
    });
  };

  renderList(upcomingWrap, data.events.filter(e => e.type !== 'past'),
    'No upcoming events listed yet — check back soon.');
  renderList(pastWrap, data.events.filter(e => e.type === 'past'),
    'Past events will be listed here.');
}

document.addEventListener('DOMContentLoaded', () => {
  renderHome();
  renderTalksPage();
  renderEventsPage();
});

