import Link from "next/link";
import SiteNav from "@/components/trizen/SiteNav";
import SiteFooter from "@/components/trizen/SiteFooter";
import { registry } from "@/lib/industries/registry";
import "@/styles/trizen-violet.css";
import "@/styles/site-chrome.css";

export default function Home() {
  const industries = registry.allIndustriesNav;

  return (
    <>
    <SiteNav />
    <div className="home-hub">
      <header className="home-header">
        <p className="home-ey">Trizen Packaging · Vapi, Gujarat · ISO 9001:2015</p>
        <h1>Thermoforming Packaging Manufacturer India</h1>
        <p className="home-lead">
          Violet editorial site migration — all industry pages rebuilt in Next.js
          with sticky sidebar, JSON content, and shared components.
        </p>
      </header>

      <section className="home-grid">
        <h2>Industries</h2>
        <ul>
          {industries.map((item) => (
            <li key={item.id}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-grid">
        <h2>Manufacturing capabilities</h2>
        <ul>
          <li>
            <Link href="/manufacturing">Manufacturing Overview</Link>
          </li>
          <li>
            <Link href="/manufacturing/thermoforming-packaging">
              Thermoforming Packaging
            </Link>
          </li>
          <li>
            <Link href="/manufacturing/vacuum-forming">Vacuum Forming</Link>
          </li>
          <li>
            <Link href="/manufacturing/pressure-forming">Pressure Forming</Link>
          </li>
          <li>
            <Link href="/manufacturing/blister-packaging">Blister Packaging</Link>
          </li>
          <li>
            <Link href="/manufacturing/clamshell-packaging">
              Clamshell Packaging
            </Link>
          </li>
          <li>
            <Link href="/manufacturing/plastic-packaging">Plastic Packaging</Link>
          </li>
          <li>
            <Link href="/manufacturing/materials">Materials</Link>
          </li>
        </ul>
      </section>

      <section className="home-grid">
        <h2>Company</h2>
        <ul>
          <li>
            <Link href="/about">About Us</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
      </section>

      <section className="home-grid">
        <h2>Expertise</h2>
        <ul>
          <li>
            <Link href="/expertise/hub">Expertise Hub</Link>
          </li>
          <li>
            <Link href="/expertise/unique-offer">A Unique Offer</Link>
          </li>
          <li>
            <Link href="/expertise/cleanroom">Cleanroom Capability</Link>
          </li>
          <li>
            <Link href="/expertise/contract-manufacturing">
              Contract Manufacturing
            </Link>
          </li>
          <li>
            <Link href="/expertise/rnd-innovation">R&D Innovation</Link>
          </li>
        </ul>
      </section>

      <style>{`
        .home-hub {
          max-width: 920px;
          margin: 0 auto;
          padding: 64px 24px 96px;
          font-family: var(--fb, Roboto, sans-serif);
          color: var(--ink, #1a1d2e);
        }
        .home-ey {
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--secondary, #5b6a8a);
          margin-bottom: 12px;
        }
        .home-header h1 {
          font-family: var(--fh, Roboto, sans-serif);
          font-size: clamp(28px, 4vw, 44px);
          color: var(--primary, #36356c);
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }
        .home-lead {
          font-size: 16px;
          line-height: 1.65;
          color: var(--muted, #5b6578);
          max-width: 640px;
        }
        .home-grid {
          margin-top: 40px;
        }
        .home-grid h2 {
          font-size: 13px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--violet, #36356c);
          margin-bottom: 14px;
        }
        .home-grid ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 10px;
        }
        .home-grid a {
          display: block;
          padding: 14px 16px;
          background: #fff;
          border: 1px solid var(--line, #e2e8f0);
          color: var(--primary, #36356c);
          text-decoration: none;
          font-weight: 600;
          clip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .home-grid a:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(54, 53, 108, 0.1);
        }
      `}</style>
    </div>
    <SiteFooter />
    </>
  );
}
