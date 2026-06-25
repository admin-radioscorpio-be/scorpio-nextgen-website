// shop.jsx — Steun ons: t-shirt shop teaser → externe webshop

const SHOP_URL = 'https://radioscorpio.myspreadshop.be';

const SHOP_ITEMS = [
  {
    id: 'tee-black',
    name: 'Logo-tee — zwart op zwart',
    note: 'Steun ons om de ether reclamevrij te houden',
    image: 'https://image.spreadshirtmedia.net/image-server/v1/products/T814A1271PA8554PT17X37Y72D167008269W17443H4490Cx000000/views/1,width=650,height=650,appearanceId=1256.jpg',
  },
  {
    id: 'tee-white',
    name: 'Logo-tee — wit op wit',
    note: 'Steun ons om de ether reclamevrij te houden',
    image: 'https://image.spreadshirtmedia.net/image-server/v1/products/T6A4PA8124PT17X64Y51D11685405W24877H6356/views/1,width=650,height=650,appearanceId=231.jpg',
  },
];

function Shop({ setRoute }) {
  return (
    <>
      <section data-screen-label="Shop — Header">
        <div className="page-hd">
          <div>
            <div className="crumb">/ Steun ons · Shop</div>
            <h1>Steun<br/>ons</h1>
          </div>
          <div className="aside">
            // Merch &amp; support<br/>
            <b>Geen reclame</b>
            <span style={{display:'block', marginTop:14, color:'var(--mute)'}}>
              Wel jouw schouders<br/>onder de radio.
            </span>
          </div>
        </div>
      </section>

      <main className="shell" data-screen-label="Shop — Content" style={{paddingTop: 0}}>
        <p className="sh-intro">
          Trotse SCORPIO-drager? Onze nieuwe collectie is binnen. Zwart op zwart,
          wit op wit. Elke
          aankoop houdt de zender reclamevrij in de ether.
        </p>

        {/* Product grid ──────────────────────────────────── */}
        <div className="sh-grid">
          {SHOP_ITEMS.map((it, i) => (
            <a className="sh-card" key={it.id} href={SHOP_URL} target="_blank" rel="noopener">
              <div className="sh-slot">
                <img src={it.image} alt={it.name} style={{width:'100%', height:'100%', objectFit:'cover', display:'block'}}/>
              </div>
              <div className="sh-card-body">
                <div className="sh-card-name">{it.name}</div>
                <div className="sh-card-note">{it.note}</div>
                <span className="sh-card-cta">Bekijk in shop →</span>
              </div>
            </a>
          ))}
        </div>

        {/* CTA bar ───────────────────────────────────────── */}
        <a className="sh-cta-bar" href={SHOP_URL} target="_blank" rel="noopener">
          <div>
            <div className="eyebrow" style={{color:'var(--accent)', marginBottom:10}}>// Volledige collectie</div>
            <h3>Naar de webshop</h3>
            <p>T-shirts, totebags en tassen — prijzen en bestellen op onze shop.</p>
          </div>
          <span className="sh-cta-arrow"><Ic.arrow/></span>
        </a>

        <p className="sh-note">
          <b>v.z.w. Radio Scorpio</b> — een onafhankelijke, reclamevrije
          vrijwilligersradio. De opbrengst van de shop gaat integraal naar de
          werking van de zender.
        </p>
      </main>
    </>
  );
}

window.Shop = Shop;
