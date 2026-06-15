// beste106.jsx — De Beste 106: jaarlijkse albumselectie (best-of-year)

function Beste106({ setRoute, navTarget }) {
  const [edId, setEdId] = React.useState(BESTE106.current);
  const editions = BESTE106.editions;          // newest-first
  const idx = Math.max(0, editions.findIndex(e => e.id === edId));
  const ed = editions[idx];
  const newer = editions[idx - 1];
  const older = editions[idx + 1];

  // Deep-link from search: open the requested edition.
  React.useEffect(() => {
    if (navTarget && navTarget.editionId) setEdId(navTarget.editionId);
  }, [navTarget]);

  // index of the album to flash (only when its edition is active)
  const hlIdx = (navTarget && navTarget.highlight && navTarget.highlight.editionId === ed.id)
    ? navTarget.highlight.albumIdx : -1;

  React.useEffect(() => {
    if (hlIdx < 0) return;
    const id = setTimeout(() => {
      const el = document.querySelector('.al-track[data-trk="' + hlIdx + '"]');
      if (el) window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - 120, behavior: 'smooth' });
    }, 90);
    return () => clearTimeout(id);
  }, [hlIdx, edId]);

  const listRef = React.useRef(null);
  const go = (id, scrollToList) => {
    setEdId(id);
    if (scrollToList && listRef.current) {
      const y = listRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const topCovers = ed.featured.slice(0, 3);
  const botCovers = ed.featured.slice(3, 6);
  const tones = ['t-ink', 't-accent', 't-paper'];

  const half = Math.ceil(ed.albums.length / 2);
  const cols = [ed.albums.slice(0, half), ed.albums.slice(half)];

  const Cover = (c, i, base) => {
    const n = base + i;            // 0-based position in featured
    const inner = (
      <>
        <div className={"al-cover-art " + tones[n % 3]}>
          <span className="tag">#{String(c.rank).padStart(3, '0')} · Album van het jaar</span>
          <span className="ph">[ Hoes ]</span>
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

  const Album = (a, n) => {
    const hit = n === hlIdx;
    const inner = (
      <>
        <span className="num">{String(n + 1).padStart(3, '0')}</span>
        <div className="who">
          <div className="artist">{a.artist}</div>
          <div className="title">{a.title}</div>
        </div>
        <span className="src">{alSource(a.url)} <Ic.arrow/></span>
      </>
    );
    const cls = "al-track b106-album" + (hit ? " is-hit" : "") + (n < 3 ? " is-podium" : "");
    return a.url
      ? <a key={n} data-trk={n} className={cls} href={a.url} target="_blank" rel="noopener noreferrer">{inner}</a>
      : <div key={n} data-trk={n} className={cls}>{inner}</div>;
  };

  return (
    <>
      {/* MASTHEAD ─────────────────────────────────────────── */}
      <section className="al-mast b106-mast" data-screen-label="Beste 106 — Masthead">
        <div className="grid"/>
        <div className="inner">
          <div>
            <div className="al-eyebrow">
              <span className="dot pulse"/> Jaarlijkse selectie · 106 platen van het jaar
            </div>
            <h1>De Beste<span className="b106-num"> 106</span></h1>
            <p className="al-intro">
              De <b>Beste 106</b> is onze jaarlijkse balans: honderdzes platen die het jaar
              bepaalden, gekozen door de Scorpio-vrijwilligers en uitgezonden in een volledige
              eindejaarsmarathon — van #106 tot de plaat van het jaar op #001.
              Klik op een album voor audio / video / disco.
            </p>
          </div>

          <div className="al-current b106-current">
            <div className="b106-yr">{ed.year}</div>
            <div className="stat">
              <span>{ed.editionNo}</span>
              <span>{ed.albumCount} albums</span>
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

      {/* QUICK YEAR SWITCHER ──────────────────────────────── */}
      <div className="shell" style={{padding:0}}>
        <div className="al-editions">
          <span className="al-edchip label">/ Jaargangen</span>
          {editions.map(e => (
            <button key={e.id}
                    className={"al-edchip" + (e.id === ed.id ? ' is-active' : '')}
                    onClick={() => go(e.id)}>
              {e.year}
            </button>
          ))}
        </div>
      </div>

      <main className="shell" style={{paddingTop: 0}}>

        {/* TOP / PODIUM COVERS ────────────────────────────── */}
        <div className="al-covers" data-screen-label="Beste 106 — Podium">
          {topCovers.map((c, i) => Cover(c, i, 0))}
        </div>

        {/* THE LIST ───────────────────────────────────────── */}
        <div ref={listRef}>
          <SectHd num={ed.year}
                   title={<>De lijst<br/><span style={{color:'var(--mute)'}}>106 albums · {ed.year}</span></>}/>
          <div className="al-list b106-list" style={{marginTop:-24}} data-screen-label="Beste 106 — Albumlijst">
            {cols.map((col, ci) => (
              <div className="col" key={ci}>
                {col.map((a, i) => Album(a, ci === 0 ? i : half + i))}
              </div>
            ))}
          </div>
        </div>

        {/* ARCHIVE ────────────────────────────────────────── */}
        <div data-screen-label="Beste 106 — Archief">
          <SectHd num="//" title="Vorige jaargangen" />
          <div className="al-arch-grid" style={{marginTop:-24, marginBottom:64}}>
            {editions.map(e => (
              <div key={e.id}
                   className={"al-arch" + (e.id === ed.id ? ' is-active' : '')}
                   onClick={() => go(e.id, true)}>
                <div className="eno">{e.editionNo}</div>
                <div className="al-arch-sw">
                  {e.featured.map((c, i) => (
                    <span key={i} className={['s-ink','s-accent','s-paper'][i % 3]}/>
                  ))}
                </div>
                <div className="mo b106-arch-yr">{e.year}</div>
                <div className="al-arch-foot">
                  <span>{e.albumCount} albums</span>
                  <span className="go">{e.id === ed.id ? 'Nu' : 'Bekijk →'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

window.Beste106 = Beste106;
