// search.jsx — Zoekresultaten (API-powered)

const SEARCH_CAP = 12;
const SEARCH_API = 'https://public.radioscorpio.be/api/search';

function srchMonogram(name) {
  const parts = String(name).split(/[\s/]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return String(name).slice(0, 2).toUpperCase();
}

function splitTitle(raw) {
  const s = String(raw);
  const m = s.match(/^(.*?)\t-\t(.*)$/) || s.match(/^(.*?) - (.*)$/);
  if (m) return { artist: m[1].trim(), track: m[2].trim() };
  return { artist: '', track: s };
}

function fmtDate(ts) {
  if (!ts) return '';
  const d = new Date(ts * 1000);
  return d.toLocaleDateString('nl-BE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function navFromLink(link, navigate) {
  if (!link) return;
  try {
    const hash = new URL(link).hash.replace(/^#\/?/, '');
    const [page, ...rest] = hash.split('/');
    if (page) navigate(page, rest.length ? rest.join('/') : null);
  } catch {}
}

function parseMeta(raw) {
  try { return typeof raw === 'string' ? JSON.parse(raw) : (raw || {}); } catch { return {}; }
}

function groupResults(results) {
  const shows = [];
  const afleveringen = [];
  const alijst = [];
  const playlist = [];
  const beste106 = [];

  (results || []).forEach(r => {
    const meta = parseMeta(r.display_meta);
    if (r.type === 'programma') {
      shows.push({ ...r, meta });
    } else if (r.type === 'aflevering') {
      afleveringen.push({ ...r, meta });
    } else if (r.type === 'a-lijst') {
      const { artist, track } = splitTitle(r.title);
      alijst.push({ ...r, meta, artist, track });
    } else if (r.type === 'playlist') {
      const { artist, track } = splitTitle(r.title);
      playlist.push({ ...r, meta, artist, track });
    } else if (r.type === 'beste106') {
      const { artist, track } = splitTitle(r.title);
      beste106.push({ ...r, meta, artist, track });
    }
  });

  return { shows, afleveringen, alijst, playlist, beste106 };
}

// ─── term highlighting ─────────────────────────────────────────────────
function srchTerms(q) { return (q || '').trim().toLowerCase().split(/\s+/).filter(Boolean); }
function hlt(text, terms) {
  if (!terms || !terms.length) return text;
  const esc = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const re = new RegExp('(' + esc.join('|') + ')', 'ig');
  const parts = String(text).split(re);
  return parts.map((p, i) => (i % 2 === 1 ? <mark key={i}>{p}</mark> : p));
}

// ─── shared result row ──────────────────────────────────────────────────
function SrchRow({ onClick, mark, primary, secondary, ctx, jump }) {
  const act = () => onClick && onClick();
  return (
    <div className="srch-row" onClick={act} role="link" tabIndex={0}
         onKeyDown={e => { if (e.key === 'Enter') act(); }}>
      <span className="srch-mark">{mark}</span>
      <div className="srch-main">
        <div className="t">{primary}</div>
        {secondary != null && <div className="s">{secondary}</div>}
      </div>
      <span className="srch-ctx">{ctx}</span>
      <span className="srch-arr">{jump} <Ic.arrow/></span>
    </div>
  );
}

// ─── page root ──────────────────────────────────────────────────────────
function Search({ navigate, hashParam }) {
  const q = hashParam || '';
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [rawResults, setRawResults] = React.useState(null);

  React.useEffect(() => {
    if (!q.trim()) { setRawResults(null); return; }
    setLoading(true);
    setError(null);
    fetch(SEARCH_API + '?q=' + encodeURIComponent(q))
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(data => { setRawResults(data.results || []); setLoading(false); })
      .catch(() => { setError('Zoeken mislukt — probeer opnieuw.'); setLoading(false); });
  }, [q]);

  const terms = srchTerms(q);
  const grouped = rawResults ? groupResults(rawResults) : null;

  const groups = grouped ? [
    {
      key: 'show', label: 'Shows', sub: 'Scorpio OD', items: grouped.shows,
      row: it => (
        <SrchRow key={'s' + it.source_id}
                 mark={srchMonogram(it.title)}
                 primary={hlt(it.title, terms)}
                 ctx={it.meta.isActive === false ? 'Archief' : 'Actief'}
                 jump="Open show"
                 onClick={() => navFromLink(it.meta.link, navigate)}/>
      ),
    },
    {
      key: 'aflevering', label: 'Afleveringen', sub: 'Scorpio OD', items: grouped.afleveringen,
      row: it => (
        <SrchRow key={'ep' + it.source_id}
                 mark={srchMonogram(it.meta.showName || it.title)}
                 primary={hlt(it.title, terms)}
                 secondary={it.meta.showName ? hlt(it.meta.showName, terms) : null}
                 ctx={it.meta.season || ''}
                 jump="Open aflevering"
                 onClick={() => navFromLink(it.meta.link, navigate)}/>
      ),
    },
    {
      key: 'a-lijst', label: 'A-Lijst', items: grouped.alijst,
      row: it => (
        <SrchRow key={'al' + it.source_id}
                 mark={<Ic.play/>}
                 primary={hlt(it.artist || it.title, terms)}
                 secondary={it.artist ? hlt(it.track, terms) : null}
                 ctx={it.meta.month || it.meta.year || ''}
                 jump="Naar A-Lijst"
                 onClick={() => navFromLink(it.meta.link, navigate)}/>
      ),
    },
    {
      key: 'playlist', label: 'Playlist', items: grouped.playlist,
      row: it => (
        <SrchRow key={'pl' + it.source_id}
                 mark={<Ic.play/>}
                 primary={hlt(it.artist || it.title, terms)}
                 secondary={it.artist ? hlt(it.track, terms) : null}
                 ctx={it.meta.date ? it.meta.date.split('-').reverse().join('/') + (it.meta.hour != null ? ` · ${it.meta.hour}u` : '') : ''}
                 jump="Naar playlist"
                 onClick={() => navFromLink(it.meta.link, navigate)}/>
      ),
    },
    {
      key: 'beste106', label: 'Beste 106', items: grouped.beste106,
      row: it => (
        <SrchRow key={'b' + it.source_id}
                 mark={srchMonogram(it.artist || it.title)}
                 primary={hlt(it.artist || it.title, terms)}
                 secondary={it.artist ? hlt(it.track, terms) : null}
                 ctx={it.meta.year ? String(it.meta.year) : ''}
                 jump="Naar Beste 106"
                 onClick={() => navFromLink(it.meta.link, navigate)}/>
      ),
    },
  ] : [];

  const total = grouped
    ? grouped.shows.length + grouped.afleveringen.length + grouped.alijst.length + grouped.playlist.length + grouped.beste106.length
    : 0;
  const live = groups.filter(g => g.items.length);

  return (
    <>
      <section data-screen-label="Zoeken — Resultaten">
        <div className="page-hd">
          <div>
            <div className="crumb">/ Zoeken{q ? <> · <span className="srch-q">"{q}"</span></> : ''}</div>
            <h1>Resultaten</h1>
          </div>
          <div className="aside">
            // Gevonden<br/>
            <b>{loading ? '…' : `${total} ${total === 1 ? 'resultaat' : 'resultaten'}`}</b>
            {!loading && grouped && (
              <span style={{ display: 'block', marginTop: 14 }}>
                {live.length} {live.length === 1 ? 'categorie' : 'categorieën'}
              </span>
            )}
          </div>
        </div>
      </section>

      <main className="shell" style={{ paddingTop: 0 }}>
        {loading && (
          <div className="od-empty">
            <div className="eyebrow" style={{ color: 'var(--mute)', marginBottom: 12 }}>// Zoeken…</div>
          </div>
        )}
        {error && (
          <div className="od-empty">
            <p style={{ color: 'var(--mute)' }}>{error}</p>
          </div>
        )}
        {!loading && !error && grouped && total === 0 && (
          <div className="od-empty">
            <div className="eyebrow" style={{ color: 'var(--mute)', marginBottom: 12 }}>// Niets gevonden</div>
            <p>Geen resultaten voor <b>"{q}"</b>. Probeer een artiest, track of show.</p>
          </div>
        )}
        {!loading && !error && !grouped && (
          <div className="od-empty">
            <p style={{ color: 'var(--mute)' }}>
              Typ iets in het zoekveld bovenaan om te zoeken in shows, afleveringen, A-Lijst, playlist en Beste 106.
            </p>
          </div>
        )}
        {!loading && !error && live.map(g => {
          const shown = g.items.slice(0, SEARCH_CAP);
          const rest = g.items.length - shown.length;
          return (
            <section className="srch-group" key={g.key}
                     data-screen-label={'Zoeken — ' + g.label}>
              <div className="srch-group-hd">
                <span className="lbl">{g.label}</span>
                {g.sub && <span className="sub">{g.sub}</span>}
                <span className="cnt">{g.items.length}</span>
              </div>
              <div className="srch-list">
                {shown.map((it, i) => g.row(it, i))}
                {rest > 0 && (
                  <div className="srch-more">+ {rest} {rest === 1 ? 'verdere match' : 'verdere matches'} — verfijn je zoekopdracht</div>
                )}
              </div>
            </section>
          );
        })}
        <div style={{ height: 64 }}/>
      </main>
    </>
  );
}

window.Search = Search;
