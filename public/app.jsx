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

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const init = React.useMemo(parseHash, []);
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

  React.useEffect(() => {
    function onHash() {
      const { page, param } = parseHash();
      setRoute(page);
      setHashParam(param);
    }
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = React.useCallback(function(page, param) {
    param = param ?? null;
    const hash = buildHash(page, param);
    if (window.location.hash !== hash) window.location.hash = hash;
    setRoute(page);
    setHashParam(param);
  }, []);

  const Page = { home: Home, programmas: Programmas, playlist: Playlist, ondemand: OnDemand, alijst: ALijst,
                 beste106: Beste106, colofon: Colofon, wiezijnwij: WieZijnWij, vrijwilliger: Vrijwilliger, steun: Shop, logos: Logos, search: Search }[route];

  return (
    <div style={style}>
      <TopNav route={route} navigate={navigate}/>
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
