// components.jsx — shared bits

// ─── Share helper ─────────────────────────────────────────────────────
async function shareUrl(url) {
  try {
    if (navigator.share) {
      await navigator.share({ url, title: 'Radio Scorpio 106 FM' });
    } else {
      await navigator.clipboard.writeText(url);
    }
  } catch (_) {}
}

// ─── Icons (inline svg) ────────────────────────────────────────────────
const Ic = {
  play:   (p) => <svg viewBox="0 0 16 16" className={"ic-svg "+(p.cls||"")} {...p}><path d="M3 2 L13 8 L3 14 Z" fill="currentColor"/></svg>,
  pause:  (p) => <svg viewBox="0 0 16 16" className={"ic-svg "+(p.cls||"")} {...p}><rect x="3" y="2" width="3.5" height="12" fill="currentColor"/><rect x="9.5" y="2" width="3.5" height="12" fill="currentColor"/></svg>,
  skip:   (p) => <svg viewBox="0 0 16 16" className={"ic-svg "+(p.cls||"")} {...p}><path d="M2 2 L10 8 L2 14 Z" fill="currentColor"/><rect x="11" y="2" width="2" height="12" fill="currentColor"/></svg>,
  search: (p) => <svg viewBox="0 0 16 16" className={"ic-svg "+(p.cls||"")} {...p}><circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M11 11 L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/></svg>,
  user:   (p) => <svg viewBox="0 0 16 16" className={"ic-svg "+(p.cls||"")} {...p}><circle cx="8" cy="5" r="3" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M2 15 C2 11 5 9 8 9 C11 9 14 11 14 15" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>,
  vol:    (p) => <svg viewBox="0 0 16 16" className={"ic-svg "+(p.cls||"")} {...p}><path d="M2 6 L2 10 L5 10 L9 13 L9 3 L5 6 Z" fill="currentColor"/><path d="M11 5 C12.5 6.5 12.5 9.5 11 11" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square"/></svg>,
  arrow:  (p) => <svg viewBox="0 0 16 16" className={"ic-svg "+(p.cls||"")} {...p}><path d="M2 8 L13 8 M9 4 L13 8 L9 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/></svg>,
  share:  (p) => <svg viewBox="0 0 16 16" className={"ic-svg "+(p.cls||"")} {...p}><circle cx="4" cy="8" r="2" fill="none" stroke="currentColor" strokeWidth="1.4"/><circle cx="12" cy="3" r="2" fill="none" stroke="currentColor" strokeWidth="1.4"/><circle cx="12" cy="13" r="2" fill="none" stroke="currentColor" strokeWidth="1.4"/><path d="M5.7 7 L10.3 4 M5.7 9 L10.3 12" stroke="currentColor" strokeWidth="1.4"/></svg>,
  heart:  (p) => <svg viewBox="0 0 16 16" className={"ic-svg "+(p.cls||"")} {...p}><path d="M8 14 C8 14 1 9.5 1 5 C1 2.5 3 1 5 1 C6.5 1 8 2 8 4 C8 2 9.5 1 11 1 C13 1 15 2.5 15 5 C15 9.5 8 14 8 14 Z" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>,
  menu:   (p) => <svg viewBox="0 0 16 16" className={"ic-svg "+(p.cls||"")} {...p}><path d="M2 4 H14 M2 8 H14 M2 12 H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/></svg>,
  close:  (p) => <svg viewBox="0 0 16 16" className={"ic-svg "+(p.cls||"")} {...p}><path d="M3 3 L13 13 M13 3 L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/></svg>,
  ig:     (p) => <svg viewBox="0 0 16 16" className={"ic-svg "+(p.cls||"")} {...p}><rect x="2.3" y="2.3" width="11.4" height="11.4" rx="3.4" fill="none" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="8" r="2.9" fill="none" stroke="currentColor" strokeWidth="1.3"/><circle cx="11.3" cy="4.7" r="0.95" fill="currentColor"/></svg>,
  fb:     (p) => <svg viewBox="0 0 16 16" className={"ic-svg "+(p.cls||"")} {...p}><path d="M9.4 3.4 C8 3.4 7.1 4.2 7.1 5.8 V12.8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M5.3 7.4 H9.3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  mixcloud:(p) => <svg viewBox="0 0 16 16" className={"ic-svg "+(p.cls||"")} {...p}><path d="M1.8 11 V8.4 a2.6 2.6 0 0 1 5.2 0 V11 M7 11 V6.8 a2.8 2.8 0 0 1 5.6 0 V11 L14.2 11" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  yt:     (p) => <svg viewBox="0 0 16 16" className={"ic-svg "+(p.cls||"")} {...p}><rect x="1.6" y="4" width="12.8" height="8" rx="2.4" fill="none" stroke="currentColor" strokeWidth="1.3"/><path d="M6.7 6.4 L10.2 8 L6.7 9.6 Z" fill="currentColor"/></svg>,

};

// shared social set — nav cluster + overflow-menu row (footer keeps its own list)
const SOCIALS = [
  ['Instagram', 'ig',       'https://www.instagram.com/radioscorpio106fm'],
  ['Facebook',  'fb',       'https://www.facebook.com/radioscorpio'],
  ['Mixcloud',  'mixcloud', 'https://www.mixcloud.com/RadioScorpio'],
];

// ─── Top nav ──────────────────────────────────────────────────────────
function TopNav({ route, navigate }) {
  const items = [
    ['home', 'Home'],
    ['programmas', "Programma's"],
    ['playlist', 'Playlist'],
    ['ondemand', 'On demand'],
    ['alijst', 'A-Lijst'],
    ['beste106', 'Beste 106'],
  ];


  const [searchOpen, setSearchOpen] = React.useState(false);
  const [q, setQ] = React.useState('');
  const inputRef = React.useRef(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef(null);


  React.useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus();
  }, [searchOpen]);


  // close the overflow menu on outside click / Escape
  React.useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [menuOpen]);

  // overflow links — the pages that don't live in the main nav
  const goMenu = (r) => { setMenuOpen(false); navigate(r); };
  const overflow = [
    ['Wie zijn we',       () => goMenu('wiezijnwij')],
    ['Word vrijwilliger', () => goMenu('vrijwilliger')],
    ['Steun ons',         () => goMenu('steun')],
    ["Logo's & pers",     () => goMenu('logos')],
    ['Contact',           () => goMenu('colofon')],
  ];


  const submitTerm = () => {
    const term = q.trim();
    if (!term) { inputRef.current && inputRef.current.focus(); return; }
    navigate('search', term);
  };
  const onSubmit = (e) => { e.preventDefault(); submitTerm(); };
  const onIcon = () => {
    if (!searchOpen) { setSearchOpen(true); return; }
    if (q.trim()) submitTerm();
    else setSearchOpen(false);
  };

  return (
    <header className="topnav">
      <div className="inner">
        <a className="brand" onClick={() => navigate('home')} style={{cursor:'pointer'}}>
          <img src="assets/logo.png" alt="Radio Scorpio 106 FM"/>
        </a>
        <nav>
          {items.map(([k, lbl]) => (
            <a key={k}
               className={route === k ? 'is-active' : ''}
               onClick={() => navigate(k)}
               style={{cursor:'pointer'}}>{lbl}</a>
          ))}
        </nav>
        <div className="util">
           <div className="nav-menu" ref={menuRef}>
            <button className={"ic" + (menuOpen ? ' is-active' : '')}
                    aria-label={menuOpen ? 'Menu sluiten' : 'Meer'}
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen(o => !o)}>
              {menuOpen ? <Ic.close/> : <Ic.menu/>}
            </button>
            {menuOpen && (
              <div className="nav-menu-pop" role="menu">
                <div className="nav-menu-cap">Meer</div>
                {overflow.map(([lbl, fn]) => (
                  <a key={lbl} role="menuitem" onClick={fn}>{lbl}<span className="nav-menu-arr">→</span></a>
                ))}
                <div className="nav-menu-social">
                  {SOCIALS.map(([label, icon, url]) => {
                    const Icon = Ic[icon];
                    return (
                      <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                         aria-label={label} title={label}
                         onClick={() => setMenuOpen(false)}><Icon/></a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <form className={"nav-search" + (searchOpen ? ' is-open' : '')}
                role="search" onSubmit={onSubmit}>
            <input ref={inputRef} className="nav-search-input" type="text"
                   placeholder="Artiest, track, show…"
                   value={q}
                   onChange={e => setQ(e.target.value)}
                   onKeyDown={e => { if (e.key === 'Escape') setSearchOpen(false); }}
                   tabIndex={searchOpen ? 0 : -1}
                   aria-hidden={!searchOpen}/>
            <button type="button"
                    className={"ic nav-search-btn" + (searchOpen ? ' is-active' : '')}
                    aria-label={searchOpen ? 'Zoek' : 'Zoeken openen'}
                    onClick={onIcon}><Ic.search/></button>
          </form>
          <button className="ic" aria-label="Delen" onClick={() => shareUrl(window.location.href)}><Ic.share/></button>
          {/* login icon hidden until CMS auth is enabled */}
          {false && <a href="/_emdash/api/auth/oauth/google" className="ic" aria-label="Inloggen"><Ic.user/></a>}
          <span className="nav-sep" aria-hidden="true"></span>
          <div className="nav-social">
            {SOCIALS.map(([label, icon, url]) => {
              const Icon = Ic[icon];
              return (
                <a key={label} className="ic" href={url} target="_blank" rel="noopener noreferrer"
                   aria-label={label} title={label}><Icon/></a>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── Ticker ───────────────────────────────────────────────────────────
function Ticker() {
  return (
    <div className="ticker">
      <div className="track"/>
    </div>
  );
}

// ─── Persistent bottom player ─────────────────────────────────────────
const STREAM_URL  = 'https://stream.radioscorpio.be/stream';
const WS_URL      = 'wss://nowplaying.radioscorpio.be/ws';

function useNowPlaying() {
  const [track, setTrack]   = React.useState(null);   // { title, image }
  const [show, setShow]     = React.useState(null);   // { name, start, end }
  const [upcoming, setUpcoming] = React.useState(null); // { name, start }
  const wsRef = React.useRef(null);

  React.useEffect(() => {
    let destroyed = false;
    let retryTimer = null;

    function connect() {
      if (destroyed) return;
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onmessage = (e) => {
        let msg;
        try { msg = JSON.parse(e.data); } catch { return; }

        if (msg.type === 'track_change') {
          const s = msg.data?.stream;
          if (s?.title) setTrack({ title: s.title, image: s.image || null });
        } else if (msg.type === 'schedule_update') {
          const cur = msg.data?.currentshow;
          const nxt = msg.data?.upcomingshow;
          if (cur) setShow({ name: cur.showName, start: cur.startClock, end: cur.endClock });
          if (nxt) setUpcoming({ name: nxt.showName, start: nxt.startClock });
        }
      };

      ws.onclose = () => {
        if (!destroyed) retryTimer = setTimeout(connect, 5000);
      };
      ws.onerror = () => ws.close();
    }

    connect();
    return () => {
      destroyed = true;
      clearTimeout(retryTimer);
      wsRef.current?.close();
    };
  }, []);

  return { track, show, upcoming };
}

function Player({ playing, setPlaying, accent, nowPlaying, sessionFeed, setSessionFeed, odNow, onClearOd }) {
  if (odNow) return <ODPlayer odNow={odNow} playing={playing} setPlaying={setPlaying}
                              accent={accent} onClearOd={onClearOd}/>;

  const [vol, setVol] = React.useState(100);
  const [bars] = React.useState(() =>
    Array.from({length: 64}, () => 0.2 + Math.random() * 0.8)
  );
  const [progress, setProgress] = React.useState(0.42);
  const audioRef = React.useRef(null);
  const { track, show, upcoming } = nowPlaying;

  const isSession = !!sessionFeed;

  // Create the live audio element once
  React.useEffect(() => {
    const audio = new Audio(STREAM_URL);
    audio.volume = vol / 100;
    audioRef.current = audio;
    return () => { audio.pause(); audioRef.current = null; };
  }, []);

  // Live audio: pause whenever a session is active, otherwise follow playing state
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isSession || !playing) {
      audio.pause();
    } else {
      audio.play().catch(() => setPlaying(false));
    }
  }, [playing, isSession]);

  // Sync volume
  React.useEffect(() => {
    if (audioRef.current) audioRef.current.volume = vol / 100;
  }, [vol]);

  // Media Session — register action handlers once
  React.useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.setActionHandler('play',  () => setPlaying(true));
    navigator.mediaSession.setActionHandler('pause', () => setPlaying(false));
    navigator.mediaSession.setActionHandler('stop',  () => setPlaying(false));
  }, []);

  // Media Session — update metadata when live track changes
  React.useEffect(() => {
    if (!('mediaSession' in navigator) || isSession) return;
    const parts  = track?.title?.split(' - ') ?? [];
    const artist = parts.length > 1 ? parts[0].trim() : 'Radio Scorpio';
    const title  = parts.length > 1 ? parts.slice(1).join(' - ').trim() : (track?.title ?? 'Radio Scorpio 106 FM');
    navigator.mediaSession.metadata = new MediaMetadata({
      title, artist, album: 'Radio Scorpio 106 FM',
      artwork: track?.image ? [{ src: track.image, sizes: '250x250', type: 'image/jpeg' }] : [],
    });
  }, [track]);

  // Media Session — sync playback state
  React.useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
  }, [playing]);

  React.useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setProgress(p => (p + 0.0008) % 1), 80);
    return () => clearInterval(t);
  }, [playing]);

  const activeBar  = Math.floor(progress * bars.length);
  const trackLabel = track?.title ?? '—';
  const showLabel  = show ? `Nu: ${show.name} · ${show.start}–${show.end}` : 'Nu: —';
  const nextLabel  = upcoming
    ? <span>Straks <b>{upcoming.start} {upcoming.name}</b></span>
    : <span>Straks —</span>;

  // Mixcloud widget URL — dark=1 matches our dark player background
  const mixcloudSrc = isSession
    ? `https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&dark=1&autoplay=1&feed=${encodeURIComponent(sessionFeed.feed)}`
    : null;

  return (
    <footer className="player">
      {/* ── Left ── */}
      <div className="left">
        {!isSession && (
          <button className="play" onClick={() => setPlaying(p => !p)} aria-label={playing ? 'Pauze' : 'Speel'}>
            {playing ? <Ic.pause cls="lg"/> : <Ic.play cls="lg"/>}
          </button>
        )}
        {isSession ? (
          <div>
            <div className="live" style={{color:'var(--accent)'}}>
              <span className="dot" style={{background:'var(--accent)', marginRight:8}}/>
              Sessie · Mixcloud
            </div>
            <div className="track">{sessionFeed.showName}</div>
            <div className="show">{sessionFeed.title}</div>
          </div>
        ) : (
          <>
            {track?.image && (
              <img src={track.image} alt="" className="track-art"
                   style={{width:40,height:40,borderRadius:3,objectFit:'cover',flexShrink:0}}/>
            )}
            <div>
              <div className="live"><span className="dot pulse"/> Live · 106 FM</div>
              <div className="track">{trackLabel}</div>
              <div className="show">{showLabel}</div>
            </div>
          </>
        )}
      </div>

      {/* ── Center: Mixcloud widget in session mode, waveform in live mode ── */}
      <div className="center">
        {isSession ? (
          <iframe
            key={sessionFeed.feed}
            src={mixcloudSrc}
            allow="autoplay"
            style={{ width: '100%', height: 60, border: 'none', display: 'block' }}
            title="Mixcloud player"
          />
        ) : (
          <div className="wave" aria-hidden="true">
            {bars.map((h, i) => (
              <div key={i} className={"bar" + (i <= activeBar && playing ? " on" : "")}
                   style={{ height: `${h * 100}%`,
                            background: i <= activeBar && playing ? accent : undefined }}/>
            ))}
          </div>
        )}
      </div>

      {/* ── Right ── */}
      <div className="right">
        {isSession ? (
          <button onClick={() => setSessionFeed(null)} style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            background: 'none', border: '1px solid rgba(244,242,236,0.35)',
            color: 'var(--paper)', padding: '7px 14px', cursor: 'pointer',
          }}>
            ← Terug live
          </button>
        ) : (
          <>
            <div className="nextup">{nextLabel}</div>
            <div className="vol">
              <Ic.vol/>
              <input type="range" min="0" max="100" value={vol} onChange={e => setVol(+e.target.value)} />
            </div>
          </>
        )}
      </div>
    </footer>
  );
}

// ─── On-demand footer player (Mixcloud-style scrubber) ─────────────────
function fmtTime(sec) {
  sec = Math.max(0, Math.floor(sec));
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
function ODPlayer({ odNow, playing, setPlaying, accent, onClearOd }) {
  const { episode, show } = odNow;
  const total = episode.durationMin * 60;
  const [elapsed, setElapsed] = React.useState(0);
  const [vol, setVol] = React.useState(100);

  React.useEffect(() => { setElapsed(0); }, [episode.id]);
  React.useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setElapsed(e => Math.min(e + 1, total)), 1000);
    return () => clearInterval(t);
  }, [playing, total]);

  const pct = total ? (elapsed / total) * 100 : 0;
  const seek = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setElapsed(Math.round(((e.clientX - r.left) / r.width) * total));
  };

  return (
    <footer className="player od-player">
      <div className="left">
        <button className="play" onClick={() => setPlaying(p => !p)} aria-label={playing ? 'Pauze' : 'Speel'}>
          {playing ? <Ic.pause cls="lg"/> : <Ic.play cls="lg"/>}
        </button>
        <div className="od-player-art">{show.name.slice(0, 2).toUpperCase()}</div>
        <div style={{ minWidth: 0 }}>
          <div className="live" style={{ color: accent }}>● Scorpio OD · {episode.season}</div>
          <div className="track">{episode.title}</div>
          <div className="show">{show.name} #{episode.num} · {show.dj}</div>
        </div>
      </div>
      <div className="center od-scrub-wrap">
        <span className="od-time">{fmtTime(elapsed)}</span>
        <div className="od-scrub" onClick={seek}>
          <div className="od-scrub-fill" style={{ width: `${pct}%`, background: accent }}/>
          <div className="od-scrub-knob" style={{ left: `${pct}%`, background: accent }}/>
        </div>
        <span className="od-time">{episode.duration}</span>
      </div>
      <div className="right">
        <button className="od-tolive" onClick={onClearOd}>← Live</button>
        <div className="vol">
          <Ic.vol/>
          <input type="range" min="0" max="100" value={vol} onChange={e => setVol(+e.target.value)} />
        </div>
      </div>
    </footer>
  );
}

// ─── Section header ───────────────────────────────────────────────────
function SectHd({ num, title, more, onMore }) {
  return (
    <div className="sect-hd">
      <div className="num">/ {num}</div>
      <h2>{title}</h2>
      {more && <a className="more" onClick={onMore} style={{cursor:'pointer'}}>{more} →</a>}
    </div>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────
function Footer() {
  return (
    <div className="foot">
      <div className="inner">
        <div className="grid">
          <div className="brand-cell">
            <img src="assets/logo.png" alt="Radio Scorpio"/>
            <p>Onafhankelijk gemeenschapsradio sinds 1980. Vrijwilligersradio uit Leuven, 24 uur per dag, 7 dagen per week.</p>
          </div>
          <div>
            
          </div>
          <div>
           
          </div>
          <div>
            <h4>Over</h4>
            <ul>
              <li><a href="#/wiezijnwij" style={{cursor:'pointer'}}>Wie zijn wij</a></li>
              <li><a href="#/colofon" style={{cursor:'pointer'}}>Contact</a></li>
              <li><a href="#/vrijwilliger" style={{cursor:'pointer'}}>Word vrijwilliger</a></li>
              <li><a href="#/steun" style={{cursor:'pointer'}}>Steun</a></li>
              <li><a href="#/logos" style={{cursor:'pointer'}}>Logo's</a></li>
            </ul>
          </div>
          <div>
            <h4>Volg</h4>
            <ul>
              {SOCIALS.map(([label, , url]) => (
                <li key={label}><a href={url} target="_blank" rel="noopener noreferrer">{label}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="bot">
          <span>© 1980—2026 Radio Scorpio VZW · Leuven</span>
          <a href="#/cookies" style={{cursor:'pointer'}}>Cookiebeleid</a>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Ic, TopNav, Ticker, Player, ODPlayer, fmtTime, SectHd, Footer, useNowPlaying });
