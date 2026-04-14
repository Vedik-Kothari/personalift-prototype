export const SAMPLE_PAGE_URL = "https://demo.personalift.local/sample-landing";

export const SAMPLE_PAGE_HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Northstar CRM | Pipeline Visibility for Fast Teams</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #fbfcfe;
        --ink: #172033;
        --muted: #5d6a85;
        --line: #dbe5f1;
        --card: white;
        --brand: #2251ff;
        --brand-soft: #eff3ff;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Inter, Arial, sans-serif;
        color: var(--ink);
        background: var(--bg);
      }
      .nav, .hero, .section, .footer {
        width: min(1120px, calc(100% - 32px));
        margin: 0 auto;
      }
      .nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 22px 0;
      }
      .logo { font-weight: 800; letter-spacing: -0.03em; }
      .nav a { margin-left: 18px; color: var(--muted); text-decoration: none; }
      .hero {
        display: grid;
        grid-template-columns: 1.1fr 0.9fr;
        gap: 36px;
        align-items: center;
        padding: 36px 0 52px;
      }
      .pill {
        display: inline-flex;
        padding: 8px 12px;
        border-radius: 999px;
        background: var(--brand-soft);
        color: var(--brand);
        font-size: 13px;
        font-weight: 700;
      }
      h1 {
        font-size: clamp(40px, 6vw, 62px);
        line-height: 0.95;
        margin: 18px 0 16px;
      }
      .lead {
        color: var(--muted);
        font-size: 18px;
        line-height: 1.6;
        max-width: 56ch;
      }
      .actions {
        display: flex;
        gap: 14px;
        flex-wrap: wrap;
        margin-top: 24px;
      }
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 14px 20px;
        border-radius: 14px;
        border: 1px solid transparent;
        font-weight: 700;
        text-decoration: none;
      }
      .btn-primary {
        background: var(--brand);
        color: white;
      }
      .btn-secondary {
        border-color: var(--line);
        color: var(--ink);
        background: white;
      }
      .hero-card, .card {
        background: var(--card);
        border: 1px solid var(--line);
        border-radius: 24px;
        box-shadow: 0 24px 80px rgba(21, 31, 53, 0.08);
      }
      .hero-card {
        overflow: hidden;
      }
      .hero-card img {
        display: block;
        width: 100%;
        height: 100%;
        min-height: 340px;
        object-fit: cover;
      }
      .section {
        padding: 30px 0 22px;
      }
      .section h2 {
        margin: 0 0 14px;
        font-size: 32px;
      }
      .grid {
        display: grid;
        gap: 18px;
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
      .card {
        padding: 22px;
      }
      .quote {
        color: var(--muted);
      }
      .pricing {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 18px;
      }
      .footer {
        padding: 28px 0 50px;
        color: var(--muted);
      }
      @media (max-width: 840px) {
        .hero, .grid, .pricing {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <header class="nav">
      <div class="logo">Northstar CRM</div>
      <nav>
        <a href="#features">Features</a>
        <a href="#proof">Proof</a>
        <a href="#pricing">Pricing</a>
      </nav>
    </header>
    <main>
      <section class="hero">
        <div>
          <div class="pill">Revenue clarity for scaling sales teams</div>
          <h1>See every deal, forecast, and bottleneck in one place.</h1>
          <p class="lead">Northstar gives lean revenue teams one clear workspace for pipeline hygiene, coaching, and weekly forecasting without a messy rollout.</p>
          <div class="actions">
            <a class="btn btn-primary" href="#pricing">Book a Demo</a>
            <a class="btn btn-secondary" href="#features">See Product Tour</a>
          </div>
        </div>
        <div class="hero-card">
          <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80" alt="CRM dashboard overview" />
        </div>
      </section>
      <section class="section" id="features">
        <h2>Features</h2>
        <div class="grid">
          <article class="card">
            <h3>Live Pipeline Board</h3>
            <p class="quote">Track rep activity, stage movement, and stuck deals without spreadsheet cleanup.</p>
          </article>
          <article class="card">
            <h3>Forecast Calls</h3>
            <p class="quote">Run tighter reviews with confidence intervals and rep-by-rep risk signals.</p>
          </article>
          <article class="card">
            <h3>Coaching Feed</h3>
            <p class="quote">Spot objections and improve close rates with snippets tied to real opportunities.</p>
          </article>
        </div>
      </section>
      <section class="section" id="proof">
        <h2>Customer Proof</h2>
        <div class="grid">
          <article class="card">
            <strong>31% faster weekly forecast prep</strong>
            <p class="quote">Growth-stage SaaS teams cut spreadsheet work and got cleaner numbers for board meetings.</p>
          </article>
          <article class="card">
            <strong>4.8/5 from revenue ops leaders</strong>
            <p class="quote">Teams praise the simple rollout and clearer rep coaching loops.</p>
          </article>
          <article class="card">
            <strong>Works with your stack</strong>
            <p class="quote">Syncs with Salesforce, HubSpot, Gong, Slack, and CSV imports.</p>
          </article>
        </div>
      </section>
      <section class="section" id="pricing">
        <h2>Pricing</h2>
        <div class="pricing">
          <article class="card">
            <h3>Starter</h3>
            <p class="quote">For teams under 10 reps.</p>
            <strong>$49 / seat</strong>
          </article>
          <article class="card">
            <h3>Growth</h3>
            <p class="quote">For teams scaling outbound and inbound.</p>
            <strong>$79 / seat</strong>
          </article>
          <article class="card">
            <h3>Enterprise</h3>
            <p class="quote">Custom workflows and premium onboarding.</p>
            <strong>Custom</strong>
          </article>
        </div>
      </section>
    </main>
    <footer class="footer">Northstar CRM. Build revenue confidence without changing your stack.</footer>
  </body>
</html>`;
