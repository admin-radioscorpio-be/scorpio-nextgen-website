// ondemand.jsx — SCORPIO OD (on-demand archive)

const OD_API = 'https://public.radioscorpio.be/api/metadata';

// ─── Helpers ──────────────────────────────────────────────────────────────

function mixcloudFeed(url) {
  try { return new URL(url).pathname; }
  catch { return url; }
}

function fmtOdDate(ts) {
  return new Date(ts * 1000).toLocaleDateString('nl-BE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    timeZone: 'Europe/Brussels',
  });
}

function fmtSeconds(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

// ─── Cover art square-vs-rect detection ──────────────────────────────────

function useCoverArtType(ref, src) {
  React.useEffect(() => {
    if (!ref.current || !src) return;
    const img = ref.current.querySelector('img');
    if (!img) return;
    const apply = () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      ref.current.setAttribute('data-art', ratio < 0.9 ? 'rect' : 'square');
    };
    if (img.complete && img.naturalWidth > 0) apply();
    else img.addEventListener('load', apply);
  }, [src]);
}

// ─── Show social links ────────────────────────────────────────────────────

function ShowLinks({ links }) {
  if (!links) return null;
  const items = [
    links.email     && { key: 'email',     href: `mailto:${links.email}`, Icon: Ic.email,    label: 'E-mail' },
    links.facebook  && { key: 'facebook',  href: links.facebook,          Icon: Ic.fb,       label: 'Facebook' },
    links.instagram && { key: 'instagram', href: links.instagram,         Icon: Ic.ig,       label: 'Instagram' },
    links.mixcloud  && { key: 'mixcloud',  href: links.mixcloud,          Icon: Ic.mixcloud, label: 'Mixcloud' },
    links.website   && { key: 'website',   href: links.website,           Icon: Ic.globe,    label: 'Website' },
  ].filter(Boolean);
  if (!items.length) return null;
  return (
    <div className="od-show-links">
      {items.map(({ key, href, Icon, label }) => (
        <a key={key} href={href}
           target={key === 'email' ? undefined : '_blank'}
           rel={key === 'email' ? undefined : 'noopener noreferrer'}
           className="ic od-show-link-ic"
           title={label} aria-label={label}>
          <Icon/>
        </a>
      ))}
    </div>
  );
}

// ─── API hooks ────────────────────────────────────────────────────────────

function useODShows() {
  const [shows, setShows]     = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError]     = React.useState(null);

  React.useEffect(() => {
    fetch(`${OD_API}/od/shows?limit=100`)
      .then(r => r.json())
      .then(data => { setShows(data.shows ?? []); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  return { shows, loading, error };
}

function useODSeasons(showid) {
  const [seasons, setSeasons] = React.useState([]);

  React.useEffect(() => {
    if (!showid) return;
    setSeasons([]);
    fetch(`${OD_API}/od/shows/${showid}/seasons`)
      .then(r => r.json())
      .then(data => setSeasons(data.seasons?.map(s => s.season) ?? []))
      .catch(() => {});
  }, [showid]);

  return seasons;
}

function useODEpisodes(showid, season) {
  const [episodes, setEpisodes]       = React.useState([]);
  const [loading, setLoading]         = React.useState(true);
  const [error, setError]             = React.useState(null);
  const [nextCursor, setNextCursor]   = React.useState(null);
  const [loadingMore, setLoadingMore] = React.useState(false);

  React.useEffect(() => {
    if (!showid) return;
    setLoading(true);
    setEpisodes([]);
    setNextCursor(null);

    const params = new URLSearchParams({ limit: '20' });
    if (season && season !== 'Alles') params.set('season', season);

    fetch(`${OD_API}/od/shows/${showid}/episodes?${params}`)
      .then(r => r.json())
      .then(data => {
        setEpisodes(data.episodes ?? []);
        setNextCursor(data.nextCursor ?? null);
        setLoading(false);
      })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [showid, season]);

  function loadMore() {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    const params = new URLSearchParams({ limit: '20', cursor: nextCursor });
    if (season && season !== 'Alles') params.set('season', season);

    fetch(`${OD_API}/od/shows/${showid}/episodes?${params}`)
      .then(r => r.json())
      .then(data => {
        setEpisodes(e => [...e, ...(data.episodes ?? [])]);
        setNextCursor(data.nextCursor ?? null);
        setLoadingMore(false);
      })
      .catch(() => setLoadingMore(false));
  }

  return { episodes, loading, error, nextCursor, loadMore, loadingMore };
}

function useODTracklist(episode) {
  const [items, setItems]     = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!episode?.id) return;
    setLoading(true);
    setItems([]);

    fetch(`${OD_API}/od/episodes/${episode.id}`)
      .then(r => r.json())
      .then(data => { setItems(data.tracklist ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [episode?.id]);

  return { items, loading };
}

// ─── Flipping wordmark ────────────────────────────────────────────────────
function ODWordmark() {
  const words = ['On Demand', 'OverDose', 'Off the Dial', 'Open Door', 'Odd Discoveries', 'Own Detour', 'Original Drops', 'Offbeat Diamonds', 'Off Doctrine', 'Other Dimension'];
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setI(x => (x + 1) % words.length), 1900);
    return () => clearInterval(t);
  }, []);
  return <span key={i} className="od-flip">{words[i]}</span>;
}



// ─── Shows list ───────────────────────────────────────────────────────────
function odMonogram(name) {
  const parts = name.split(/[\s/]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function ODShows({ shows, loading, error, tag, onOpen }) {
  let filtered = shows.filter(s => s.episodeCount > 0);
  if (tag && tag !== 'Alles') filtered = filtered.filter(s => s.tags?.includes(tag));
  filtered = [...filtered].sort((a, b) => (b.lastEpisodeDate ?? 0) - (a.lastEpisodeDate ?? 0));

  if (loading) return (
    <div className="od-empty">
      <div className="eyebrow" style={{ color: 'var(--mute)', marginBottom: 12 }}>// Laden</div>
      <p>Shows ophalen…</p>
    </div>
  );
  if (error) return (
    <div className="od-empty">
      <div className="eyebrow" style={{ color: 'var(--mute)', marginBottom: 12 }}>// Fout</div>
      <p>Kon shows niet laden.</p>
    </div>
  );
  if (!filtered.length) return (
    <div className="od-empty">
      <div className="eyebrow" style={{ color: 'var(--mute)', marginBottom: 12 }}>// Leeg</div>
      <p>Geen shows gevonden.</p>
    </div>
  );

  return (
    <div className="od-show-list" style={{ borderTop: '1px solid var(--ink)', marginTop: 24 }}>
      <div className="od-show-head">
        <span></span><span>show</span>
        <span>archief</span><span></span>
      </div>
      {filtered.map(s => (
        <div className="od-show-row" key={s.showid} onClick={() => onOpen(s)}>
          <div className="od-show-art">
            {s.imageURL
              ? <img src={s.imageURL} alt={s.showName} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
              : odMonogram(s.showName)
            }
          </div>
          <div className="od-show-name">
            <div className="t">
              {s.showName}
              {!s.isActive && <span className="od-dormant">Inactief</span>}
            </div>
            <div className="s">{s.description ?? ''}</div>
          </div>
          <span className="od-show-meta">
            {s.episodeCount} afl.{s.lastEpisodeDate ? ` · ${fmtOdDate(s.lastEpisodeDate)}` : ''}
          </span>
          <span className="od-show-arr">→</span>
        </div>
      ))}
    </div>
  );
}

// ─── Episode list ─────────────────────────────────────────────────────────
function ODEpisodes({ show, onOpen, onBack, pendingEpisodeId, onPendingResolved }) {
  const [season, setSeason]   = React.useState('Alles');
  const seasons               = useODSeasons(show.showid);
  const { episodes, loading, error, nextCursor, loadMore, loadingMore } = useODEpisodes(show.showid, season);
  const sentinel              = React.useRef(null);
  const loadMoreRef           = React.useRef(loadMore);
  const coverRef              = React.useRef(null);
  useCoverArtType(coverRef, show.imageURL);

  // Auto-select episode from deep link: keep paginating until found
  React.useEffect(() => {
    if (!pendingEpisodeId || loading || loadingMore) return;
    const ep = episodes.find(e => e.id === pendingEpisodeId);
    if (ep) { onOpen(ep); onPendingResolved?.(); return; }
    if (nextCursor) loadMore();
  }, [pendingEpisodeId, episodes, loading, loadingMore, nextCursor]);

  // Per-season descending episode numbers (oldest = #1, newest = #N)
  const epNums = React.useMemo(() => {
    const totals = {};
    episodes.forEach(ep => { totals[ep.season] = (totals[ep.season] || 0) + 1; });
    const counters = {};
    return episodes.map(ep => {
      counters[ep.season] = (counters[ep.season] || 0) + 1;
      return totals[ep.season] - counters[ep.season] + 1;
    });
  }, [episodes]);

  React.useEffect(() => { loadMoreRef.current = loadMore; });
  React.useEffect(() => { setSeason('Alles'); }, [show.showid]);

  React.useEffect(() => {
    if (!sentinel.current || !nextCursor) return;
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) loadMoreRef.current();
    }, { rootMargin: '300px' });
    io.observe(sentinel.current);
    return () => io.disconnect();
  }, [nextCursor]);

  return (
    <section data-screen-label="OD — Episodes">
      <div className="od-subhead">
        <button className="od-back" onClick={onBack}>← Alle shows</button>
      </div>

      <div className="now-big od-show" style={{ maxWidth: 1440, margin: '0 auto' }}>
        <div className="cover" ref={coverRef}>
          {show.imageURL
            ? <img src={show.imageURL} alt={show.showName}
                   style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
            : <span className="ph">[ {show.showName.toUpperCase()} ]</span>
          }
        </div>
        <div className="info">
          <ShowLinks links={show.links}/>
          <div>
            <div className="lbl">// Scorpio OD</div>
            <div className="artist" style={{ fontSize: 'clamp(34px,5.5vw,72px)' }}>{show.showName}</div>
            <div className="title" style={{ marginTop: 12 }}>
              {show.episodeCount} afleveringen
              {show.lastEpisodeDate ? ` · laatste: ${fmtOdDate(show.lastEpisodeDate)}` : ''}
            </div>
          </div>
          {show.tags?.length > 0 && (
            <div className="row" style={{ flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
                             letterSpacing: '0.08em', textTransform: 'uppercase',
                             color: 'rgba(10,10,10,0.55)' }}>
                {show.tags.join(' · ')}
              </span>
            </div>
          )}
        </div>
      </div>

      <main className="shell" style={{ paddingTop: 0, paddingBottom: 64 }}>
        {show.description && (
          <p className="od-detail-desc" style={{ whiteSpace: 'pre-line', paddingTop: 24, paddingBottom: 0 }}>{show.description}</p>
        )}
        <div className="od-eptools">
          <span className="od-eptools-lbl">Afleveringen · nieuwste eerst</span>
          <label className="od-select">
            <span>Seizoen</span>
            <select value={season} onChange={e => setSeason(e.target.value)}>
              <option value="Alles">Alle seizoenen</option>
              {seasons.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
        </div>

        {loading && (
          <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--mute)' }}>Laden…</div>
        )}
        {error && (
          <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--mute)' }}>
            Kon afleveringen niet laden.
          </div>
        )}

        {!loading && !error && (
          <div className="od-eplist">
            <div className="od-ep-head">
              <span>datum</span><span>seizoen</span><span>#</span>
              <span>aflevering</span><span></span>
            </div>
            {episodes.map((ep, i) => (
              <div className="od-ep-row" key={ep.id} onClick={() => onOpen(ep)}>
                <span className="od-ep-date">{fmtOdDate(ep.episodeDate)}</span>
                <span className="od-ep-season">{ep.season}</span>
                <span className="od-ep-num">{String(epNums[i]).padStart(2, '0')}</span>
                <div className="od-ep-title">
                  <div className="t">{ep.title}</div>
                  <div className="s">{ep.description ?? ''}</div>
                </div>
                <span className="od-ep-play"><Ic.play/></span>
              </div>
            ))}
            {nextCursor && (
              <div ref={sentinel} className="od-sentinel">
                {loadingMore && <span className="eyebrow">Meer laden…</span>}
              </div>
            )}
            {!nextCursor && episodes.length === 0 && (
              <div style={{ padding: '32px 0', color: 'var(--mute)' }}>Geen afleveringen gevonden.</div>
            )}
          </div>
        )}
      </main>
    </section>
  );
}

// ─── Episode detail + tracklist ───────────────────────────────────────────
function ODDetail({ episode, show, onBack, onPlay, isCurrent }) {
  const { items, loading: trackLoading } = useODTracklist(episode);
  const coverRef = React.useRef(null);
  useCoverArtType(coverRef, episode.imageURL);

  return (
    <section data-screen-label="OD — Episode detail">
      <div className="od-subhead">
        <button className="od-back" onClick={onBack}>← {show.showName}</button>
      </div>

      <div className="now-big od-detail" style={{ maxWidth: 1440, margin: '0 auto' }}>
        <div className="cover" ref={coverRef}>
          {episode.imageURL
            ? <img src={episode.imageURL} alt={episode.title}
                   style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
            : <span className="ph">[ {show.showName.toUpperCase()} ]</span>
          }
        </div>
        <div className="info">
          <div>
            <div className="lbl">// Scorpio OD · {episode.season}</div>
            <div className="artist" style={{ fontSize: 'clamp(34px,5.5vw,72px)' }}>{episode.title}</div>
            <div className="title" style={{ marginTop: 12 }}>
              {show.showName} · {fmtOdDate(episode.episodeDate)}
            </div>
          </div>
        </div>
        <div className="od-detail-action">
          <button className="od-detail-bigplay" onClick={() => onPlay(episode, show)}>
            <span className="ico">{isCurrent ? <Ic.pause/> : <Ic.play/>}</span>
            <span className="lbl">{isCurrent ? 'Speelt nu' : 'Speel aflevering'}</span>
          </button>
        </div>
      </div>

      <main className="shell" style={{ paddingTop: 0 }}>
        {episode.description && (
          <p className="od-detail-desc" style={{ whiteSpace: 'pre-line', paddingTop: 24, paddingBottom: 32 }}>{episode.description}</p>
        )}
        {trackLoading && (
          <div style={{ padding: '32px 0', color: 'var(--mute)' }}>Playlist laden…</div>
        )}
        {!trackLoading && items.length > 0 && (
          <>
            <div className="pl-head" style={{ borderTop: 0 }}>
              <span>/ #</span><span>offset</span><span></span><span>artiest · titel</span>
            </div>
            {(() => {
              let trackNum = 0;
              return items.map((t, i) => {
                if (t.chapter) {
                  return (
                    <div key={i} className="pl-row" style={{ opacity: 0.5 }}>
                      <span className="num">—</span>
                      <span className="time">{fmtSeconds(t.startSeconds)}</span>
                      <div className="cover"/>
                      <div>
                        <div className="artist">{t.chapter}</div>
                      </div>
                    </div>
                  );
                }
                trackNum++;
                return (
                  <div key={i} className="pl-row">
                    <span className="num">{String(trackNum).padStart(3, '0')}</span>
                    <span className="time">{fmtSeconds(t.startSeconds)}</span>
                    <div className="cover">
                      {t.artworkURL
                        ? <img src={t.artworkURL} alt={t.artistName ?? ''}
                               style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                        : <span style={{ color: 'var(--mute)', fontSize: 10 }}>—</span>
                      }
                    </div>
                    <div>
                      <div className="artist">{t.artistName ?? '—'}</div>
                      <div className="title">{t.songName ?? '—'}</div>
                    </div>
                  </div>
                );
              });
            })()}
          </>
        )}
        {!trackLoading && items.length === 0 && (
          <div style={{ padding: '32px 0', color: 'var(--mute)' }}>
            Geen playlist beschikbaar voor deze aflevering.
          </div>
        )}
        <div style={{ height: 64 }}/>
      </main>
    </section>
  );
}

// ─── Page root ────────────────────────────────────────────────────────────
function OnDemand({ setRoute, navigate, hashParam, sessionFeed, setSessionFeed, setPlaying, odTarget, setOdTarget }) {
  const [view, setView]                  = React.useState('shows');
  const [tag, setTag]                    = React.useState('Alles');
  const [show, setShow]                  = React.useState(null);
  const [episode, setEpisode]            = React.useState(null);
  const [pendingEpisodeId, setPendingEpisodeId] = React.useState(null);
  const { shows, loading, error }        = useODShows();

  // On mount: parse hash deep-link (e.g. "#/ondemand/42" or "#/ondemand/42/1337")
  React.useEffect(() => {
    if (!hashParam) return;
    const parts = hashParam.split('/');
    const showid = Number(parts[0]);
    if (!showid) return;
    const episodeid = parts[1] ? Number(parts[1]) : null;
    setOdTarget({ showid, episodeid });
  }, []);

  // Collect all unique tags from loaded shows for the filter chips
  const allTags = React.useMemo(() => {
    const tags = new Set(shows.flatMap(s => s.tags ?? []).filter(Boolean));
    return ['Alles', ...[...tags].sort()];
  }, [shows]);

  // Deep-link: once shows are loaded, navigate to the target show (and optionally episode)
  React.useEffect(() => {
    if (!odTarget || loading || !shows.length) return;
    const match = shows.find(s => s.showid === odTarget.showid);
    if (match) {
      setShow(match);
      setView('episodes');
      if (odTarget.episodeid) setPendingEpisodeId(odTarget.episodeid);
      window.scrollTo({ top: 0 });
    }
    setOdTarget(null);
  }, [odTarget, loading, shows]);

  const openShow = (s) => {
    setShow(s);
    setView('episodes');
    navigate('ondemand', String(s.showid));
    window.scrollTo({ top: 0 });
  };
  const openEp = (ep) => {
    setEpisode(ep);
    setView('detail');
    navigate('ondemand', `${show.showid}/${ep.id}`);
    window.scrollTo({ top: 0 });
  };

  const play = (ep, s) => {
    setSessionFeed({
      feed:     mixcloudFeed(ep.mixcloudURL),
      title:    ep.title,
      showName: s.showName,
      image:    ep.imageURL ?? null,
    });
  };

  return (
    <>
      <section data-screen-label="OD — Header">
        <div className="page-hd od-hero">
          <div>
            <div className="crumb">/ Scorpio OD · herbeluister het archief</div>
            <h1 className="od-h1">
              Scorpio <span className="od-od">OD</span>
            </h1>
            <div className="od-expand">→&nbsp;<ODWordmark/></div>
          </div>
          <div className="aside">
            // Archief<br/>
            <b>{loading ? '…' : `${shows.length} shows`}</b>
            <span style={{ display: 'block', marginTop: 14, color: 'var(--mute)' }}>
              Live opname archief
            </span>
          </div>
        </div>

        {view === 'shows' && (
          <div className="chips" style={{flexWrap:'wrap', rowGap:6}}>
            {allTags.map(g => (
              <button key={g} className={'chip' + (tag === g ? ' is-active' : '')}
                      onClick={() => setTag(g)}>{g}</button>
            ))}
          </div>
        )}
      </section>

      <main className="shell" style={{ paddingTop: 0, paddingBottom: 64 }}>
        {view === 'shows' && (
          <ODShows shows={shows} loading={loading} error={error}
                   tag={tag} onOpen={openShow}/>
        )}
      </main>

      {view === 'episodes' && show && (
        <ODEpisodes show={show} onOpen={openEp}
                    pendingEpisodeId={pendingEpisodeId}
                    onPendingResolved={() => setPendingEpisodeId(null)}
                    onBack={() => { setView('shows'); navigate('ondemand'); }}/>
      )}

      {view === 'detail' && episode && show && (
        <ODDetail episode={episode} show={show}
                  onBack={() => { setView('episodes'); navigate('ondemand', String(show.showid)); }}
                  onPlay={play}
                  isCurrent={!!episode.mixcloudURL && sessionFeed?.feed === mixcloudFeed(episode.mixcloudURL)}/>
      )}
    </>
  );
}

window.OnDemand = OnDemand;
