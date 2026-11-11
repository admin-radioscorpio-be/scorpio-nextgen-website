// forms.jsx — generic form page, defined in my-scorpio → Formulieren.
// Served at www.radioscorpio.be/<slug> (src/pages/[slug].astro) and #/formulier/<slug>.

const FORMS_API = 'https://public.radioscorpio.be/api/form/public';
// Cloudflare Turnstile site key (public). Leave empty to disable the widget;
// the worker only enforces Turnstile when TURNSTILE_SECRET is set.
const TURNSTILE_SITEKEY = '0x4AAAAAAF86c83jITkgj42X';
const FORM_MAX_FILE = 5 * 1024 * 1024;
const FORM_FILE_ACCEPT = '.pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp';

// Plain text → paragraphs, line breaks kept, e-mail addresses and links clickable.
function FormRichText({ text }) {
  if (!text) return null;
  const linkify = (line, key) => {
    const parts = line.split(/((?:https?:\/\/|www\.)[^\s]+|[\w.+-]+@[\w-]+\.[\w.-]+)/g);
    return parts.map((p, i) => {
      if (/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(p)) return <a key={`${key}-${i}`} href={`mailto:${p}`}>{p}</a>;
      if (/^(https?:\/\/|www\.)/.test(p)) {
        const href = p.startsWith('www.') ? `https://${p}` : p;
        return <a key={`${key}-${i}`} href={href} target="_blank" rel="noopener">{p}</a>;
      }
      return p;
    });
  };
  return text.split(/\n\s*\n/).map((para, pi) => (
    <p key={pi} className="fm-para">
      {para.split('\n').map((line, li, arr) => (
        <React.Fragment key={li}>
          {linkify(line, `${pi}-${li}`)}
          {li < arr.length - 1 && <br/>}
        </React.Fragment>
      ))}
    </p>
  ));
}

function useTurnstile(containerRef, enabled) {
  const [token, setToken] = React.useState('');
  const widgetId = React.useRef(null);

  React.useEffect(() => {
    if (!enabled || !containerRef.current) return;
    let cancelled = false;
    const render = () => {
      if (cancelled || !window.turnstile || widgetId.current !== null) return;
      widgetId.current = window.turnstile.render(containerRef.current, {
        sitekey: TURNSTILE_SITEKEY,
        callback: setToken,
        'expired-callback': () => setToken(''),
        'error-callback': () => setToken(''),
      });
    };
    if (window.turnstile) render();
    else {
      let s = document.querySelector('script[data-turnstile]');
      if (!s) {
        s = document.createElement('script');
        s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        s.async = true;
        s.dataset.turnstile = '1';
        document.head.appendChild(s);
      }
      s.addEventListener('load', render);
    }
    return () => {
      cancelled = true;
      if (widgetId.current !== null && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [enabled, containerRef.current]);

  const reset = () => {
    setToken('');
    if (widgetId.current !== null && window.turnstile) window.turnstile.reset(widgetId.current);
  };
  return [token, reset];
}

function emptyValues(fields) {
  const v = {};
  (fields || []).forEach(f => { if (f.type !== 'file') v[f.name] = f.type === 'checkbox' ? false : ''; });
  return v;
}

// Secret test link for draft forms: www.radioscorpio.be/<slug>?test=<code>
// (for embedded forms: www.radioscorpio.be/?test=<code>#/<page>)
function formTestQuery() {
  const t = new URLSearchParams(window.location.search).get('test');
  return t && /^[a-f0-9]{8,64}$/.test(t) ? `?test=${t}` : '';
}

// Loads a form definition. state: loading | ready | notfound | error
function useFormDefinition(slug) {
  const [form, setForm] = React.useState(null);
  const [state, setState] = React.useState('loading');
  React.useEffect(() => {
    let alive = true;
    setState('loading');
    if (!/^[a-z0-9-]{2,60}$/.test(slug || '')) { setState('notfound'); return; }
    fetch(`${FORMS_API}/${slug}${formTestQuery()}`)
      .then(async r => {
        if (r.status === 404) { if (alive) setState('notfound'); return; }
        if (!r.ok) throw new Error();
        const data = await r.json();
        if (!alive) return;
        setForm(data);
        setState('ready');
      })
      .catch(() => alive && setState('error'));
    return () => { alive = false; };
  }, [slug]);
  return { form, setForm, state };
}

function FormTestBanner() {
  return (
    <div className="fm-test-banner">
      <b>Testversie</b> — dit formulier is nog niet publiek. Inzendingen worden als TEST gemarkeerd.
    </div>
  );
}

// The form itself (fields, Turnstile, submit, thank-you / closed message).
// Used by the standalone form page and by forms embedded in other pages.
function FormBody({ form, setForm, eyebrow = '// Vul in', submitLabel = 'Versturen', footer, againLabel = 'Nog een inzending' }) {
  const slug = form.slug;
  const [values, setValues] = React.useState(() => emptyValues(form.fields));
  const [files, setFiles] = React.useState({});
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [sent, setSent] = React.useState(null);
  const tsRef = React.useRef(null);
  const [tsToken, tsReset] = useTurnstile(tsRef, !!TURNSTILE_SITEKEY && form.availability === 'open' && !sent);

  const setVal = (name, v) => setValues(prev => ({ ...prev, [name]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    for (const f of form.fields) {
      if (f.type !== 'file') continue;
      const file = files[f.name];
      if (f.required && !file) { setError(`${f.label} is verplicht.`); return; }
      if (file && file.size > FORM_MAX_FILE) { setError(`${f.label}: bestand is te groot (max 5 MB).`); return; }
    }
    if (TURNSTILE_SITEKEY && !tsToken) { setError('Even geduld: de beveiligingscontrole is nog bezig.'); return; }

    const fd = new FormData();
    form.fields.forEach(f => {
      if (f.type === 'file') { if (files[f.name]) fd.append(f.name, files[f.name]); }
      else if (f.type === 'checkbox') fd.append(f.name, values[f.name] ? 'on' : '');
      else fd.append(f.name, values[f.name] ?? '');
    });
    fd.append('_hp', e.target.elements._hp?.value || '');
    if (tsToken) fd.append('cf-turnstile-response', tsToken);

    setSubmitting(true);
    try {
      const res = await fetch(`${FORMS_API}/${slug}/submit${formTestQuery()}`, { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.availability) setForm(prev => ({ ...prev, availability: data.availability }));
        throw new Error(data.error || 'Versturen mislukt.');
      }
      // success_text comes back with {placeholders} already filled in
      setSent({ text: data.success_text || form.success_text || 'Bedankt! Je inzending is goed ontvangen.' });
      setValues(emptyValues(form.fields));
      setFiles({});
      if (window.gtag && !form.preview) window.gtag('event', 'form_submit', { event_category: 'Formulier', event_label: slug });
    } catch (err) {
      setError(err.message || 'Er is iets misgegaan. Probeer opnieuw.');
      tsReset();
    } finally {
      setSubmitting(false);
    }
  };

  const closedMsg = {
    not_yet: 'Inschrijvingen zijn nog niet geopend.',
    closed:  'Inschrijvingen zijn afgesloten.',
    full:    'Volzet! Het maximum aantal inschrijvingen is bereikt.',
  }[form.availability];

  if (sent) {
    return (
      <div className="vr-sent">
        <div className="vr-sent-mark">✓</div>
        <h3>Verstuurd!</h3>
        <p style={{whiteSpace:'pre-line'}}>{sent.text}</p>
        <button className="play-cta filled" onClick={() => setSent(null)}>
          <span className="ico"><Ic.arrow/></span>
          {againLabel}
        </button>
      </div>
    );
  }

  if (closedMsg) {
    return (
      <div className="vr-sent">
        <h3>{form.availability === 'full' ? 'Volzet' : 'Gesloten'}</h3>
        <p>{closedMsg}</p>
      </div>
    );
  }

  return (
    <form className="vr-form" onSubmit={submit} noValidate={false}>
      <div className="eyebrow" style={{color:'var(--ink)', marginBottom:18}}>{eyebrow}</div>

      {form.fields.map(f => <FormField key={f.name} f={f}
        value={values[f.name]} onChange={v => setVal(f.name, v)}
        file={files[f.name]} onFile={file => setFiles(prev => ({ ...prev, [f.name]: file }))}/>)}

      {/* Honeypot: hidden from people, bots fill it in. */}
      <div aria-hidden="true" style={{position:'absolute', left:'-10000px', width:1, height:1, overflow:'hidden'}}>
        <label>Laat dit leeg<input type="text" name="_hp" tabIndex={-1} autoComplete="off" defaultValue=""/></label>
      </div>

      {TURNSTILE_SITEKEY && <div ref={tsRef} style={{marginBottom:18}}/>}

      {error && <p style={{color:'#c0392b', fontSize:13, margin:'0 0 12px'}}>{error}</p>}
      <button type="submit" className="vr-submit" disabled={submitting}>
        {submitting ? 'Versturen…' : <>{submitLabel} <Ic.arrow/></>}
      </button>
      <p className="vr-form-foot">
        {footer || 'We gebruiken je gegevens enkel hiervoor en wissen ze na afloop.'}
      </p>
    </form>
  );
}

/**
 * Embed a form from my-scorpio → Formulieren in any page:
 *   <ScorpioForm slug="vrijwilliger-aanmelding" fallback={<OldForm/>} onLoad={form => …}/>
 * While the form is not available (not published, no test link, API down) the
 * fallback is shown, so a page can switch over by just publishing the form.
 */
function ScorpioForm({ slug, fallback = null, onLoad, ...bodyProps }) {
  const { form, setForm, state } = useFormDefinition(slug);
  React.useEffect(() => { if (state === 'ready' && onLoad) onLoad(form); }, [state, form]);

  if (state === 'loading') return <div className="eyebrow" style={{color:'var(--mute)'}}>// Laden…</div>;
  if (state !== 'ready') {
    return fallback || <p style={{color:'var(--mute)'}}>Dit formulier is momenteel niet beschikbaar.</p>;
  }
  return (
    <>
      {form.preview && <FormTestBanner/>}
      <FormBody form={form} setForm={setForm} {...bodyProps}/>
    </>
  );
}

// Standalone form page: www.radioscorpio.be/<slug>
function FormPage({ hashParam }) {
  const slug = (hashParam || window.__FORCE_PARAM__ || '').toLowerCase();
  const { form, setForm, state: loadState } = useFormDefinition(slug);
  // Embedded-only forms have no page of their own.
  const state = loadState === 'ready' && form.embed_only ? 'notfound' : loadState;

  React.useEffect(() => {
    if (state === 'ready') document.title = `${form.title} — Radio Scorpio 106 FM`;
  }, [state, form]);

  if (state === 'loading') {
    return <main className="shell" style={{padding:'80px 24px', minHeight:'50vh'}}><div className="eyebrow" style={{color:'var(--mute)'}}>// Laden…</div></main>;
  }

  if (state === 'notfound' || state === 'error') {
    return (
      <>
        <section><div className="page-hd"><div>
          <div className="crumb">/ {slug || 'formulier'}</div>
          <h1>{state === 'notfound' ? 'Niet gevonden' : 'Oeps'}</h1>
        </div></div></section>
        <main className="shell" style={{paddingTop:32, paddingBottom:80}}>
          <p className="vr-intro">
            {state === 'notfound'
              ? 'Dit formulier bestaat niet (meer) of is nog niet online.'
              : 'Het formulier kon niet geladen worden. Probeer het straks opnieuw.'}
          </p>
          <button className="play-cta filled" onClick={() => { window.location.href = '/'; }}>
            <span className="ico"><Ic.arrow/></span> Naar de homepage
          </button>
        </main>
      </>
    );
  }

  return (
    <>
      <section data-screen-label={`Formulier — ${form.title}`}>
        <div className="page-hd">
          <div>
            <div className="crumb">/ {form.slug}</div>
            <h1 className="fm-title">{form.title}</h1>
          </div>
          {form.kicker && <div className="aside"><b>{form.kicker}</b></div>}
        </div>
      </section>

      <main className="shell" style={{paddingTop: 32}}>
        {form.preview && <FormTestBanner/>}
        <div className="vr-apply fm-apply">
          <div className="vr-roles fm-info">
            <div className="eyebrow" style={{color:'var(--mute)', marginBottom:18}}>// Praktisch</div>
            <FormRichText text={form.intro}/>
          </div>
          <div className="vr-form-wrap">
            <FormBody form={form} setForm={setForm}/>
          </div>
        </div>
      </main>
    </>
  );
}

function FormField({ f, value, onChange, file, onFile }) {
  const label = <span>{f.label}{f.required ? ' *' : ''}</span>;
  const help = f.help ? <small className="fm-help">{f.help}</small> : null;
  const common = { name: f.name, required: !!f.required, placeholder: f.placeholder || undefined };

  switch (f.type) {
    case 'textarea':
      return <label className="vr-field">{label}<textarea rows="4" {...common} value={value} onChange={e => onChange(e.target.value)}/>{help}</label>;
    case 'select':
      return (
        <label className="vr-field">{label}
          <select {...common} value={value} onChange={e => onChange(e.target.value)}>
            <option value="" disabled>Maak een keuze…</option>
            {(f.options || []).map(o => <option key={o} value={o}>{o}</option>)}
          </select>{help}
        </label>
      );
    case 'checkbox':
      return (
        <label className="fm-check">
          <input type="checkbox" name={f.name} required={!!f.required} checked={!!value} onChange={e => onChange(e.target.checked)}/>
          <span>{f.label}{f.required ? ' *' : ''}{f.help && <small className="fm-help">{f.help}</small>}</span>
        </label>
      );
    case 'file':
      return (
        <label className="vr-field">{label}
          <input type="file" name={f.name} accept={FORM_FILE_ACCEPT} required={!!f.required && !file}
                 onChange={e => onFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}/>
          {help || <small className="fm-help">PDF, JPG of PNG, max. 5 MB</small>}
        </label>
      );
    case 'number':
      return <label className="vr-field">{label}<input type="number" inputMode="numeric" min={f.min} max={f.max} {...common} value={value} onChange={e => onChange(e.target.value)}/>{help}</label>;
    default: {
      const type = { email: 'email', tel: 'tel' }[f.type] || 'text';
      const auto = { email: 'email', tel: 'tel' }[f.type];
      return <label className="vr-field">{label}<input type={type} autoComplete={auto} {...common} value={value} onChange={e => onChange(e.target.value)}/>{help}</label>;
    }
  }
}

window.FormPage = FormPage;
window.ScorpioForm = ScorpioForm;
