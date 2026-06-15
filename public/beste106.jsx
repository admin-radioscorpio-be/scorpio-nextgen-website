// beste106.jsx — De Beste 106: jaarlijkse albumselectie

const BESTE106_API = 'https://public.radioscorpio.be/api/beste106';

function alSource(url) {
  if (!url) return '';
  try {
    const h = new URL(url).hostname.replace('www.', '');
    if (h.includes('discogs'))   return 'Discogs';
    if (h.includes('bandcamp'))  return 'Bandcamp';
    if (h.includes('spotify'))   return 'Spotify';
    if (h.includes('youtube'))   return 'YouTube';
    if (h.includes('wikipedia')) return 'Wikipedia';
    return h;
  } catch { return ''; }
}

function useBeste106() {
  const [lists, setLists]               = React.useState([]);
  const [currentId, setCurrentId]       = React.useState(null);
  const [edition, setEdition]           = React.useState(null);
  const [listsLoading, setListsLoading] = React.useState(true);
  const [edLoading, setEdLoading]       = React.useState(false);
  const [error, setError]               = React.useState(null);

  React.useEffect(() => {
    fetch(`${BESTE106_API}/list`)
      .then(r => r.json())
      .then(data => {
        const ls = data.lists ?? [];
        setLists(ls);
        if (ls.length > 0) setCurrentId(ls[0].id); // API returns year DESC → first = newest
        setListsLoading(false);
      })
      .catch(e => { setError(e.message); setListsLoading(false); });
  }, []);

  React.useEffect(() => {
    if (!currentId) return;
    setEdLoading(true);
    setEdition(null);
    fetch(`${BESTE106_API}/list/${currentId}`)
      .then(r => r.json())
      .then(data => { setEdition(data); setEdLoading(false); })
      .catch(e => { setError(e.message); setEdLoading(false); });
  }, [currentId]);

  return { lists, currentId, setCurrentId, edition, listsLoading, edLoading, error };
}

function Beste106() {
  const { lists, currentId, setCurrentId, edition, listsLoading, edLoading, error } = useBeste106();

  const listRef = React.useRef(null);
  const go = (id, scrollToList) => {
    setCurrentId(id);
    if (scrollToList && listRef.current) {
      const y = listRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const idx   = lists.findIndex(e => e.id === currentId);
  const newer = idx > 0 ? lists[idx - 1] : null;
  const older = idx >= 0 && idx < lists.length - 1 ? lists[idx + 1] : null;

  const tones = ['t-ink', 't-accent', 't-paper'];
  const albums = edition?.albums ?? [];
  const topCovers = albums.filter(a => a.position <= 3);
  const half = Math.ceil(albums.length / 2);
  const cols  = [albums.slice(0, half), albums.slice(half)];

  const Cover = (a, i) => {
    const url = a.artist_page_url;
    const inner = (
      <>
        <div className={"al-cover-art " + tones[i % 3]}>
          <span className="tag">#{String(a.position).padStart(3, '0')} · Album van het jaar</span>
          {a.artwork_url
            ? <img src={a.artwork_url} alt={a.album}
                   style={{width:'100%', height:'100%', objectFit:'cover'}}/>
            : <span className="ph">[ Hoes ]</span>
          }
        </div>
        <div className="al-cover-cap">
          <div className="who">
            <div className="artist">{a.artist}</div>
            <div className="title">{a.album}</div>
          </div>
          {url && <span className="src">{alSource(url)} <Ic.arrow/></span>}
        </div>
      </>
    );
    return url
      ? <a key={i} className="al-cover" href={url} target="_blank" rel="noopener noreferrer">{inner}</a>
      : <div key={i} className="al-cover">{inner}</div>;
  };

  const Album = (a, n) => {
    const url = a.artist_page_url;
    const inner = (
      <>
        <span className="num">{String(a.position).padStart(3, '0')}</span>
        <div className="who">
          <div className="artist">{a.artist}</div>
          <div className="title">{a.album}</div>
        </div>
        {url && <span className="src">{alSource(url)} <Ic.arrow/></span>}
      </>
    );
    const cls = "al-track b106-album" + (a.position <= 3 ? " is-podium" : "");
    return url
      ? <a key={n} data-trk={n} className={cls} href={url} target="_blank" rel="noopener noreferrer">{inner}</a>
      : <div key={n} data-trk={n} className={cls}>{inner}</div>;
  };

  if (listsLoading) {
    return (
      <section className="shell" style={{padding:'120px 24px 80px', minHeight:'60vh'}}>
        <div className="crumb">/ Beste 106</div>
        <h1 style={{marginTop:14, color:'var(--mute)'}}>Laden…</h1>
      </section>
    );
  }

  if (error) {
    return (
      <section className="shell" style={{padding:'120px 24px 80px', minHeight:'60vh'}}>
        <div className="crumb">/ Beste 106</div>
        <h1 style={{marginTop:14}}>Kon data niet laden</h1>
        <p style={{color:'var(--mute)', marginTop:16}}>{error}</p>
      </section>
    );
  }

  const ed = lists.find(l => l.id === currentId);
  if (!ed) return null;

  return (
    <>
      {/* MASTHEAD ─────────────────────────────────────────── */}
      <section className="al-mast b106-mast" data-screen-label="Beste 106 — Masthead">
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
              <span>{edLoading ? '…' : `${albums.length} albums`}</span>
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

      {/* YEAR SWITCHER ────────────────────────────────────── */}
      <div className="shell" style={{padding:0}}>
        <div className="al-editions">
          <span className="al-edchip label">/ Jaargangen</span>
          {lists.map(e => (
            <button key={e.id}
                    className={"al-edchip" + (e.id === currentId ? ' is-active' : '')}
                    onClick={() => go(e.id)}>
              {e.year}
            </button>
          ))}
        </div>
      </div>

      <main className="shell" style={{paddingTop:0, paddingBottom:64}}>

        {edLoading ? (
          <div style={{padding:'64px 0', textAlign:'center', color:'var(--mute)'}}>Laden…</div>
        ) : (
          <>
            {/* TOP COVERS ──────────────────────────────────── */}
            <div className="al-covers" data-screen-label="Beste 106 — Podium">
              {topCovers.map((c, i) => Cover(c, i))}
            </div>

            {/* THE LIST ────────────────────────────────────── */}
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
          </>
        )}

        {/* ARCHIVE ─────────────────────────────────────────── */}
        <div data-screen-label="Beste 106 — Archief">
          <SectHd num="//" title="Vorige jaargangen"/>
          <div className="al-arch-grid" style={{marginTop:-24, marginBottom:64}}>
            {lists.map(e => (
              <div key={e.id}
                   className={"al-arch" + (e.id === currentId ? ' is-active' : '')}
                   onClick={() => go(e.id, true)}>
                <div className="al-arch-sw">
                  {[0,1,2].map(i => <span key={i} className={['s-ink','s-accent','s-paper'][i]}/>)}
                </div>
                <div className="mo b106-arch-yr">{e.year}</div>
                <div className="al-arch-foot">
                  <span>106 albums</span>
                  <span className="go">{e.id === currentId ? 'Nu' : 'Bekijk →'}</span>
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
