'use strict';

// ── State ─────────────────────────────────────────────────────────────────────

let currentView = 'formatted';
let lastSchemas = [];

// ── Helpers ───────────────────────────────────────────────────────────────────

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function getSchemaType(data) {
  if (!data || typeof data !== 'object') return 'Unknown';
  if (data['@type']) {
    const t = data['@type'];
    return Array.isArray(t) ? t.join(', ') : t;
  }
  return 'Unknown';
}

// ── Extraction ────────────────────────────────────────────────────────────────

const EXTRACT_SCRIPT = `(function () {
  const schemas = [];

  // Recursively unpack @graph arrays so every entity becomes its own schema.
  // @context is inherited from the parent document when an entity omits it,
  // matching the JSON-LD spec. Handles nested @graph and top-level arrays.
  function flattenJsonLd(item, inheritedContext) {
    if (!item || typeof item !== 'object') return [];
    var ctx = item['@context'] || inheritedContext;

    if (Array.isArray(item['@graph'])) {
      var out = [];
      item['@graph'].forEach(function (entity) {
        // Give each entity the resolved @context if it doesn't have its own
        var withCtx = (ctx && !entity['@context'])
          ? Object.assign({}, entity, { '@context': ctx })
          : entity;
        flattenJsonLd(withCtx, ctx).forEach(function (e) { out.push(e); });
      });
      return out;
    }

    // Plain entity - ensure it carries the resolved context
    if (ctx && !item['@context']) {
      return [ Object.assign({}, item, { '@context': ctx }) ];
    }
    return [item];
  }

  // JSON-LD
  document.querySelectorAll('script[type="application/ld+json"]').forEach(function (el) {
    var raw = el.textContent.trim();
    if (!raw) return;
    try {
      var parsed = JSON.parse(raw);
      var topLevel = Array.isArray(parsed) ? parsed : [parsed];
      topLevel.forEach(function (item) {
        flattenJsonLd(item, null).forEach(function (entity) {
          schemas.push({ source: 'JSON-LD', data: entity, error: null });
        });
      });
    } catch (e) {
      schemas.push({ source: 'JSON-LD', data: null, error: e.message, raw: raw });
    }
  });

  // Microdata
  document.querySelectorAll('[itemscope]').forEach(function (root) {
    if (root.closest('[itemscope]') !== root) return; // skip nested
    // Collapse runs of whitespace/newlines that textContent picks up from markup
    function cleanText(t) { return t.replace(/\\s+/g, ' ').trim(); }
    function extractItem(el) {
      const obj = {};
      const type = el.getAttribute('itemtype');
      if (type) obj['@type'] = type.split('/').pop();
      el.querySelectorAll('[itemprop]').forEach(function (prop) {
        if (prop.closest('[itemscope]') !== el && prop.closest('[itemscope]') !== prop) return;
        const name = prop.getAttribute('itemprop');
        let value;
        if (prop.hasAttribute('itemscope'))      value = extractItem(prop);
        else if (prop.tagName === 'META')        value = prop.getAttribute('content');
        else if (prop.tagName === 'LINK' || prop.tagName === 'A') value = prop.getAttribute('href');
        else if (prop.tagName === 'IMG')         value = prop.getAttribute('src');
        else if (prop.tagName === 'TIME')        value = prop.getAttribute('datetime') || cleanText(prop.textContent);
        else                                     value = cleanText(prop.textContent);
        if (obj[name] !== undefined) {
          if (!Array.isArray(obj[name])) obj[name] = [obj[name]];
          obj[name].push(value);
        } else { obj[name] = value; }
      });
      return obj;
    }
    schemas.push({ source: 'Microdata', data: extractItem(root), error: null });
  });

  return schemas;
})()`;

function extractSchemas() {
  chrome.devtools.inspectedWindow.eval(EXTRACT_SCRIPT, (result, exceptionInfo) => {
    if (exceptionInfo) {
      renderError('Could not inspect page: ' + (exceptionInfo.value || exceptionInfo.description));
      return;
    }
    lastSchemas = result || [];
    renderSchemas(lastSchemas);
  });
}

// ── Rendering ─────────────────────────────────────────────────────────────────

function renderSchemas(schemas) {
  const content = document.getElementById('content');
  const countEl = document.getElementById('schema-count');

  if (!schemas.length) {
    countEl.textContent = '';
    content.innerHTML = `<div id="empty-state">
      <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
      <p>No Schema.org data found on this page.</p></div>`;
    return;
  }

  countEl.textContent = `${schemas.length} schema${schemas.length !== 1 ? 's' : ''} found`;
  content.innerHTML = '';

  schemas.forEach((schema, index) => {
    const card = document.createElement('div');
    card.className = 'schema-card';

    if (schema.error) {
      card.classList.add('error-card');
      card.innerHTML = `
        <div class="schema-card-header">
          <span class="schema-type-badge" style="background:#7a2222;color:#f48771">Parse Error</span>
          <span class="schema-source-label">${schema.source} #${index + 1}</span>
          <span class="collapse-icon">▼</span>
        </div>
        <div class="schema-card-body">
          <p class="error-message">${escapeHtml(schema.error)}</p>
          ${schema.raw ? `<pre class="json-view" style="color:#888;margin-top:8px">${escapeHtml(schema.raw)}</pre>` : ''}
        </div>`;
    } else {
      const type = getSchemaType(schema.data);
      card.innerHTML = `
        <div class="schema-card-header">
          <span class="schema-type-badge">${escapeHtml(type)}</span>
          <span class="schema-source-label">${schema.source}</span>
          <span class="collapse-icon">▼</span>
        </div>
        <div class="schema-card-body">
          <pre class="json-view">${
            currentView === 'formatted'
              ? syntaxHighlight(schema.data)
              : escapeHtml(JSON.stringify(schema.data, null, 2))
          }</pre>
        </div>`;
    }

    card.querySelector('.schema-card-header').addEventListener('click', () => {
      card.classList.toggle('collapsed');
    });
    content.appendChild(card);
  });
}

function renderError(message) {
  document.getElementById('schema-count').textContent = '';
  document.getElementById('content').innerHTML = `<div id="empty-state">
    <svg viewBox="0 0 24 24" style="fill:#7a2222"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
    <p style="color:#f48771">${escapeHtml(message)}</p></div>`;
}

function syntaxHighlight(json) {
  const str = JSON.stringify(json, null, 2);
  return str.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    match => {
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          return `<span class="json-key">"${escapeHtml(match.slice(1, -2))}"</span>:`;
        }
        return `<span class="json-string">${escapeHtml(match)}</span>`;
      }
      if (/true|false/.test(match)) return `<span class="json-bool">${match}</span>`;
      if (/null/.test(match))       return `<span class="json-null">${match}</span>`;
      return `<span class="json-number">${match}</span>`;
    }
  );
}

// ── Init ──────────────────────────────────────────────────────────────────────

document.getElementById('refresh-btn').addEventListener('click', extractSchemas);

// View toggle
document.querySelectorAll('.toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentView = btn.dataset.view;
    renderSchemas(lastSchemas);
  });
});

// Auto-refresh on navigation
// onNavigated fires for both full loads and history-API navigations.
// We show a "Scanning…" state immediately, then wait for the page to settle.
chrome.devtools.network.onNavigated.addListener(() => {
  lastSchemas = [];

  document.getElementById('schema-count').textContent = 'Scanning…';
  document.getElementById('content').innerHTML = `
    <div id="empty-state">
      <svg viewBox="0 0 24 24" style="animation:spin 1s linear infinite">
        <path d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z"/>
      </svg>
      <p>Scanning new page…</p>
    </div>`;

  // 1 500 ms gives most pages enough time to inject their JSON-LD
  // (frameworks often do it after DOMContentLoaded).
  setTimeout(extractSchemas, 1500);
});

// Kick off initial extraction
extractSchemas();
