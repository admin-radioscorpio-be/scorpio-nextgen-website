// app.jsx — root

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#e6ff00",
  "paper": "#f4f2ec",
  "density": "regular",
  "showGrid": false,
  "displayWeight": 900
}/*EDITMODE-END*/;

function parseHash() {
  const raw = window.location.hash.replace(/^#\/?/, '');
  const [page, ...rest] = raw.split('/');
  return { page: page || 'home', param: rest.length ? rest.join('/') : null };
}

function buildHash(page, param) {
  if (!page || page === 'home') return '';
  return param ? `#/${page}/${param}` : `#/${page}`;
}

const GA_TITLES = {
  home: 'Home', programmas: "Programma's", ondemand: 'On Demand', playlist: 'Playlist',
  alijst: 'A-Lijst', beste106: 'Beste 106', vrijwilliger: 'Vrijwilliger worden',
  wiezijnwij: 'Wie zijn wij', colofon: 'Colofon', steun: 'Steun ons',
  logos: "Logo's", cookies: 'Cookiebeleid', search: 'Zoeken', notfound: 'Niet gevonden',
};

function gaPageView(page, param) {
  if (!window.gtag) return;
  window.gtag('event', 'page_view', {
    page_path: param ? `/${page}/${param}` : `/${page}`,
    page_title: GA_TITLES[page] || page,
    page_location: window.location.href,
  });
  window.gtag('event', 'conversion', { send_to: 'AW-670065704/x0zoCN7aj-UBEKjIwb8C' });
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const init = React.useMemo(() => window.__FORCE_ROUTE__
    ? { page: window.__FORCE_ROUTE__, param: null }
    : parseHash(), []);
  const [route, setRoute] = React.useState(init.page);
  const [hashParam, setHashParam] = React.useState(init.param);
  const [playing, setPlaying] = React.useState(false);
  const [sessionFeed, setSessionFeed] = React.useState(null);
  const [odNow, setOdNow] = React.useState(null);
  const [odTarget, setOdTarget] = React.useState(null);
  const nowPlaying = useNowPlaying();

  const style = {
    '--accent': t.accent,
    '--paper': t.paper,
  };

  React.useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [route]);

  // keep --nav-h in sync so the home hero can fill the viewport exactly
  React.useEffect(() => {
    const nav = document.querySelector('.topnav');
    if (!nav) return;
    const setH = () => document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
    setH();
    const ro = new ResizeObserver(setH);
    ro.observe(nav);
    window.addEventListener('resize', setH);
    return () => { ro.disconnect(); window.removeEventListener('resize', setH); };
  }, []);

  React.useEffect(() => {
    function onHash() {
      const { page, param } = parseHash();
      setRoute(page);
      setHashParam(param);
    }
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Track landing page on mount
  React.useEffect(() => { gaPageView(init.page, init.param); }, []);

  // Track live stream play (playing turns on while no episode session is active)
  const prevPlaying = React.useRef(false);
  React.useEffect(() => {
    if (playing && !prevPlaying.current && !sessionFeed && !odNow) {
      if (window.gtag) window.gtag('event', 'live_stream_play', { event_category: 'Audio' });
    }
    prevPlaying.current = playing;
  }, [playing]);

  // Track episode plays
  React.useEffect(() => {
    if (!sessionFeed) return;
    if (window.gtag) window.gtag('event', 'episode_play', {
      event_category: 'Audio',
      event_label: sessionFeed.showName
        ? `${sessionFeed.showName} — ${sessionFeed.title}`
        : sessionFeed.title,
    });
  }, [sessionFeed]);

  const navigate = React.useCallback(function(page, param) {
    param = param ?? null;
    const hash = buildHash(page, param);
    if (window.location.hash !== hash) window.location.hash = hash;
    setRoute(page);
    setHashParam(param);
    gaPageView(page, param);
  }, []);

  const Page = { home: Home, programmas: Programmas, playlist: Playlist, ondemand: OnDemand, alijst: ALijst,
                 beste106: Beste106, colofon: Colofon, wiezijnwij: WieZijnWij, vrijwilliger: Vrijwilliger, steun: Shop, logos: Logos, cookies: Cookies, search: Search, notfound: NotFound }[route];

  return (
    <div style={style}>
      <TopNav route={route} navigate={navigate} playing={playing} setPlaying={setPlaying}
              offLive={!!(odNow || sessionFeed)}
              returnToLive={() => { setOdNow(null); setSessionFeed(null); }}/> 
      <Ticker/>

      {Page
        ? <Page setRoute={setRoute} navigate={navigate} hashParam={hashParam}
                playing={playing} setPlaying={setPlaying} nowPlaying={nowPlaying}
                sessionFeed={sessionFeed} setSessionFeed={setSessionFeed}
                odNow={odNow} setOdNow={setOdNow}
                odTarget={odTarget} setOdTarget={setOdTarget}/>
        : <Stub route={route} navigate={navigate}/>}

      <Footer/>

      <Player playing={playing} setPlaying={setPlaying} accent={t.accent} nowPlaying={nowPlaying}
              sessionFeed={sessionFeed} setSessionFeed={setSessionFeed}
              odNow={odNow} onClearOd={() => setOdNow(null)}/>

      <TweaksPanel title="TWEAKS">
        <TweakSection label="Accent kleur"/>
        <TweakColor label="Accent" value={t.accent}
                    options={['#e6ff00', '#ff3b30', '#00d27a', '#ff6b00', '#3a86ff', '#ffffff']}
                    onChange={v => setTweak('accent', v)}/>
        <TweakSection label="Papier"/>
        <TweakColor label="Achtergrond" value={t.paper}
                    options={['#f4f2ec', '#ffffff', '#e8e6e0', '#f0ede4']}
                    onChange={v => setTweak('paper', v)}/>
      </TweaksPanel>

      <CookieConsent side="right"/>
    </div>
  );
}

function NotFound({ navigate }) {
  return (
    <>
      <section data-screen-label="404 — Header">
        <div className="page-hd">
          <div>
            <div className="crumb">/ 404</div>
            <h1>
              We hebben<br/>
              <span style={{color:'var(--mute)'}}>veel.</span>
            </h1>
          </div>
          <div className="aside">
            // Niet gevonden<br/>
            <b>Maar niet dit.</b>
            <span style={{display:'block', marginTop:14, color:'var(--mute)'}}>
              Moet iets heel<br/>obscuur zijn.
            </span>
          </div>
        </div>
      </section>
      <main className="shell" style={{paddingTop:0, paddingBottom:120}}>
        <div style={{borderTop:'1px solid var(--ink)', paddingTop:48, maxWidth:680}}>
          <p style={{
            fontFamily:'"Archivo", sans-serif',
            fontSize:'clamp(18px, 2.5vw, 26px)',
            fontWeight:500, lineHeight:1.45, marginBottom:40,
          }}>
            We leveren 168 uur radio per week, twintig-plus stemmen en een archief
            vol niche. Maar de pagina die je zocht bestaat niet — of toch niet meer.
          </p>
          <button className="play-cta filled" onClick={() => navigate('home')}>
            <span className="ico"><Ic.arrow/></span>
            Terug naar home
          </button>
        </div>
      </main>
    </>
  );
}

function Stub({ route, navigate }) {
  return (
    <section className="shell" style={{padding:'120px 24px 80px', minHeight:'60vh'}}>
      <div className="eyebrow" style={{color:'var(--mute)'}}>/ {route}</div>
      <h1 className="huge" style={{marginTop:14, marginBottom:24}}>—</h1>
      <p style={{fontSize:18, color:'var(--mute)', maxWidth:520, marginBottom:32}}>—</p>
      <button className="play-cta" onClick={() => navigate('home')}>
        <span className="ico"><Ic.arrow/></span>
        Terug naar home
      </button>
    </section>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
