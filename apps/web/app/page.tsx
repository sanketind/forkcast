import Link from "next/link";

export default function HomePage() {
  return (
    <div className="grid gap-6">
      <section className="hero-card">
        <p className="eyebrow">Stop guessing. Start running the kitchen like it knows tomorrow.</p>
        <h2>Daily restaurant decisions, not dashboard clutter.</h2>
        <p className="lead">
          Connect POS sales, local calendar signals, weather, and top SKUs to get tomorrow&apos;s
          revenue forecast, ingredient buying list, staffing plan, and action cards in one place.
        </p>
        <div className="nav-links">
          <Link className="button" href="/sign-in">
            Start MVP flow
          </Link>
          <Link className="button secondary" href="/dashboard">
            View demo dashboard
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="panel">
          <p className="eyebrow">Core outputs</p>
          <h3>What the owner sees</h3>
          <ul className="stack-list">
            <li>Daily revenue and order forecast</li>
            <li>Ingredient shopping list from recipe mappings</li>
            <li>Peak-hour staffing recommendation</li>
            <li>1-2 prioritized action cards with explanations</li>
          </ul>
        </article>
        <article className="panel">
          <p className="eyebrow">India-first signals</p>
          <h3>What the engine uses</h3>
          <ul className="stack-list">
            <li>Historical sales and day-of-week seasonality</li>
            <li>Holiday, festival, and fasting-day flags</li>
            <li>Weather conditions such as rain and heat</li>
            <li>Local event and exam pressure signals</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
