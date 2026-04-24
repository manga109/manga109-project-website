(function () {
  const ASSET_BASE = new URL('.', document.currentScript.src).href;
  const DATA = window.MANGA_EXPLORE || [];
  const body = document.getElementById('explore-body');
  const search = document.getElementById('search');
  const filterEra = document.getElementById('filter-era');
  const filterAudience = document.getElementById('filter-audience');
  const filterGenre = document.getElementById('filter-genre');
  const filterS = document.getElementById('filter-s');
  const count = document.getElementById('count');
  const empty = document.getElementById('empty-state');
  const table = document.getElementById('explore-table');

  // Populate filter dropdowns
  function unique(key) {
    return [...new Set(DATA.map((d) => d[key]).filter(Boolean))].sort();
  }
  function fillSelect(el, values) {
    values.forEach((v) => {
      const o = document.createElement('option');
      o.value = v;
      o.textContent = v;
      el.appendChild(o);
    });
  }
  fillSelect(filterEra, unique('era'));
  fillSelect(filterAudience, unique('audience'));
  fillSelect(filterGenre, unique('genre'));

  let sortKey = 'num';
  let sortAsc = true;

  function render() {
    const q = search.value.trim().toLowerCase();
    const era = filterEra.value;
    const aud = filterAudience.value;
    const gen = filterGenre.value;
    const onlyS = filterS.checked;

    let rows = DATA.filter((d) => {
      if (era && d.era !== era) return false;
      if (aud && d.audience !== aud) return false;
      if (gen && d.genre !== gen) return false;
      if (onlyS && !d.s) return false;
      if (q) {
        const hay = `${d.title} ${d.folder} ${d.author} ${d.publisher} ${d.genre} ${d.audience} ${d.era}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    rows.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'number' && typeof bv === 'number') return sortAsc ? av - bv : bv - av;
      if (typeof av === 'boolean' || typeof bv === 'boolean')
        return sortAsc ? (bv ? 1 : 0) - (av ? 1 : 0) : (av ? 1 : 0) - (bv ? 1 : 0);
      return sortAsc
        ? String(av || '').localeCompare(String(bv || ''), 'ja')
        : String(bv || '').localeCompare(String(av || ''), 'ja');
    });

    count.textContent = `${rows.length} / ${DATA.length}`;
    empty.hidden = rows.length > 0;

    body.innerHTML = rows
      .map((d) => {
        const title = d.url
          ? `<a href="${d.url}" target="_blank" rel="noopener">${escape(d.title)}</a>`
          : escape(d.title);
        const sBadge = d.s ? '<span class="badge-s">✓</span>' : '<span class="badge-no">—</span>';
        const coverSrc = `${ASSET_BASE}asset/images_crop/${encodeURIComponent(d.folder)}.jpg`;
        return `
          <tr>
            <td class="num-col">${d.num}</td>
            <td class="cover-cell"><img src="${coverSrc}" alt="" loading="lazy" onerror="this.style.display='none'"></td>
            <td class="title-col">${title}</td>
            <td class="folder-col"><code>${escape(d.folder)}</code></td>
            <td>${escape(d.author)}</td>
            <td><span class="pill pill-era">${escape(d.era)}</span></td>
            <td>${escape(d.publisher)}</td>
            <td><span class="pill pill-aud">${escape(d.audience)}</span></td>
            <td><span class="pill pill-gen">${escape(d.genre)}</span></td>
            <td class="num-col">${d.pages}</td>
            <td>${sBadge}</td>
          </tr>`;
      })
      .join('');
  }

  function escape(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Events
  [search, filterEra, filterAudience, filterGenre, filterS].forEach((el) => {
    el.addEventListener('input', render);
    el.addEventListener('change', render);
  });
  table.querySelectorAll('th.sortable').forEach((th) => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      if (sortKey === key) sortAsc = !sortAsc;
      else {
        sortKey = key;
        sortAsc = true;
      }
      table.querySelectorAll('th').forEach((t) => t.classList.remove('sort-asc', 'sort-desc'));
      th.classList.add(sortAsc ? 'sort-asc' : 'sort-desc');
      render();
    });
  });

  render();
})();
