// alijst.jsx — A-Lijst: maandelijkse curatorselectie

const ALIJST_API = 'https://public.radioscorpio.be/api/alijst';

function normCovers(highlights) {
  const sorted = [...(highlights || [])].sort((a, b) => a.position - b.position);
  while (sorted.length < 6) sorted.push({ artist: '', title: '', link: '' });
  return sorted.map(h => ({ artist: h.artist || '', title: h.title || '', url: h.link || '', coverArtUrl: h.cover_art_url || '' }));
}

function normTracks(tracks) {
  return [...(tracks || [])].sort((a, b) => a.position - b.position)
    .map(t => ({ artist: t.artist || '', title: t.title || '', url: t.link || '' }));
}

function ALijst({ setRoute, navigate, hashParam }) {
  const [editions, setEditions] = React.useState([]);
  const [edId, setEdId] = React.useState(null);
  const [cache, setCache] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let cancelled = false;
    async function loadAll() {
      try {
        const r = await fetch(`${ALIJST_API}/lists`);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const { lists } = await r.json();
        if (cancelled) return;

        const details = await Promise.all(
          lists.map(e => fetch(`${ALIJST_API}/list/${e.id}`).then(r => r.json()))
        );
        if (cancelled) return;

        const cacheMap = Object.fromEntries(details.map(d => [d.id, d]));
        setCache(cacheMap);
        setEditions(lists);
        const fromHash = hashParam && lists.find(e => String(e.id) === String(hashParam));
        const initial = (fromHash || lists[0] || {}).id;
        setEdId(initial != null ? initial : null);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadAll();
    return () => { cancelled = true; };
  }, []);

  const listRef = React.useRef(null);
  const go = (id, scrollToList) => {
    setEdId(id);
    navigate('alijst', id);
    if (scrollToList && listRef.current) {
      const y = listRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) return (
    <div className="shell" style={{padding:'4rem 0', textAlign:'center', color:'var(--mute)'}}>
      Laden…
    </div>
  );
  if (error) return (
    <div className="shell" style={{padding:'4rem 0', textAlign:'center', color:'var(--mute)'}}>
      Kon de A-Lijst niet laden.
    </div>
  );
  if (!edId || !cache[edId]) return null;

  const idx = editions.findIndex(e => e.id === edId);
  const ed = cache[edId];
  const newer = editions[idx - 1]; // editions sorted newest-first
  const older = editions[idx + 1];

  const month     = alMonthName(ed.month);
  const year      = alYear(ed.month);
  const editionNo = alEditionNo(ed.month);
  const covers    = normCovers(ed.highlights);
  const tracks    = normTracks(ed.tracks);
  const tones     = ['t-ink', 't-accent', 't-paper'];
  const half      = Math.ceil(tracks.length / 2);
  const cols      = [tracks.slice(0, half), tracks.slice(half)];

  const Cover = (c, i, base) => {
    const n = base + i;
    const inner = (
      <>
        <div className={"al-cover-art " + tones[n % 3]}>
          {c.coverArtUrl && <img src={c.coverArtUrl} alt={`${c.artist} — ${c.title}`} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/>}
          {!c.coverArtUrl && <div className="tex"/>}
          <span className="tag">Uitgelicht</span>
          {!c.coverArtUrl && <span className="ph">[ Cover ]</span>}
        </div>
        <div className="al-cover-cap">
          <div className="who">
            <div className="artist">{c.artist}</div>
            <div className="title">{c.title}</div>
          </div>
          <span className="src">{alSource(c.url)} <Ic.arrow/></span>
        </div>
      </>
    );
    return c.url
      ? <a key={n} className="al-cover" href={c.url} target="_blank" rel="noopener noreferrer">{inner}</a>
      : <div key={n} className="al-cover">{inner}</div>;
  };

  const Track = (t, n) => {
    const inner = (
      <>
        <span className="num">{String(n + 1).padStart(2, '0')}</span>
        <div className="who">
          <div className="artist">{t.artist}</div>
          <div className="title">{t.title}</div>
        </div>
        <span className="src">{alSource(t.url)} <Ic.arrow/></span>
      </>
    );
    return t.url
      ? <a key={n} className="al-track" href={t.url} target="_blank" rel="noopener noreferrer">{inner}</a>
      : <div key={n} className="al-track">{inner}</div>;
  };

  return (
    <>
      {/* MASTHEAD ─────────────────────────────────────────── */}
      <section className="al-mast" data-screen-label="A-Lijst — Masthead">
        <div className="grid"/>
        <div className="inner">
          <div>
            <div className="al-eyebrow">
              <span className="dot pulse"/> Maandelijkse selectie · In hoogste rotatie
            </div>
            <h1>A<span className="dash">–</span>Lijst</h1>
            <p className="al-intro">
              De <b>A-lijst</b> is Radio Scorpio's muzikale selectie van het moment,
              toegediend via onze onnavolgbare nonstoplijst. Deze tracks staan momenteel
              in de hoogste rotatie. Klik op een track voor audio / video / disco.
            </p>
          </div>

          <div className="al-current">
            <div className="mo">{month}</div>
            <div className="yr">{year}</div>
            <div className="stat">
              <span>Editie {editionNo}</span>
              <span>{tracks.length} tracks</span>
            </div>
            <div className="al-step">
              <button onClick={() => older && go(older.id)} disabled={!older}>
                <Ic.arrow style={{transform:'rotate(180deg)'}}/> Ouder
              </button>
              <button onClick={() => newer && go(newer.id)} disabled={!newer}>
                Nieuwer <Ic.arrow/>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK EDITION SWITCHER ───────────────────────────── */}
      <div className="shell" style={{padding:0}}>
        <div className="al-editions">
          <span className="al-edchip label">/ Edities</span>
          {editions.map(e => (
            <button key={e.id}
                    className={"al-edchip" + (e.id === edId ? ' is-active' : '')}
                    onClick={() => go(e.id)}>
              {alMonthShort(e.month)} {String(alYear(e.month)).slice(2)}
            </button>
          ))}
        </div>
      </div>

      <main className="shell" style={{paddingTop: 0}}>

        {/* COVERS — single row of 6 ───────────────────────── */}
        <div className="al-covers al-covers--row" data-screen-label="A-Lijst — Covers">
          {covers.map((c, i) => Cover(c, i, 0))}
        </div>

        {/* THE LIST ───────────────────────────────────────── */}
        <div ref={listRef}>
          <SectHd num={editionNo}
                   title={<>De lijst<br/><span style={{color:'var(--mute)'}}>{month} {year}</span></>}/>
          <div className="al-list" style={{marginTop:-24}} data-screen-label="A-Lijst — Tracklijst">
            {cols.map((col, ci) => (
              <div className="col" key={ci}>
                {col.map((t, i) => Track(t, ci === 0 ? i : half + i))}
              </div>
            ))}
          </div>
        </div>

        {/* ARCHIVE ────────────────────────────────────────── */}
        <div data-screen-label="A-Lijst — Archief">
          <SectHd num="//" title="Archief" />
          <div className="al-arch-grid" style={{marginTop:-24, marginBottom:64}}>
            {editions.map(e => {
              const eCovers  = normCovers((cache[e.id] || {}).highlights);
              const eTracks  = normTracks((cache[e.id] || {}).tracks);
              const eEdNo    = alEditionNo(e.month);
              const eMonth   = alMonthName(e.month);
              const eYear    = alYear(e.month);
              return (
                <div key={e.id}
                     className={"al-arch" + (e.id === edId ? ' is-active' : '')}
                     onClick={() => go(e.id, true)}>
                  <div className="eno">Editie {eEdNo}</div>
                  <div className="al-arch-sw">
                    {eCovers.map((c, i) => (
                      <span key={i} className={['s-ink','s-accent','s-paper'][i % 3]}/>
                    ))}
                  </div>
                  <div className="mo">{eMonth}<br/>{eYear}</div>
                  <div className="al-arch-foot">
                    <span>{eTracks.length} tracks</span>
                    <span className="go">{e.id === edId ? 'Nu' : 'Bekijk →'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}

window.ALijst = ALijst;
