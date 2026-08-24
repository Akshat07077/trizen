import Link from "next/link";
import { registry } from "@/lib/industries/registry";

const CAPABILITY_LINKS = [
  { href: "/manufacturing/thermoforming-packaging", label: "Thermoforming" },
  { href: "/manufacturing/vacuum-forming", label: "Vacuum Forming" },
  { href: "/manufacturing/blister-packaging", label: "Blister Packaging" },
  { href: "/manufacturing/clamshell-packaging", label: "Clamshell Packaging" },
  { href: "/manufacturing/materials", label: "Materials" },
  { href: "/expertise/cleanroom", label: "Cleanroom" },
] as const;

type SiteFooterProps = {
  industryLabel?: string;
};

export default function SiteFooter({ industryLabel }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <Link href="/" className="logo">
            <div className="lm">T</div>
            <div className="ln">
              Trizen<em>.</em>
            </div>
          </Link>
          <p>
            Custom thermoforming packaging manufacturer in Vapi, Gujarat. ISO
            9001:2015 certified OEM supply for medical, pharma, electronics,
            toys, FMCG and industrial programmes.
          </p>
          <a
            href="mailto:contact@trizenpackaging.com"
            className="site-footer-cta"
          >
            Request a Quote →
          </a>
        </div>

        <div>
          <h3>Industries</h3>
          <ul>
            {registry.allIndustriesNav.map((item) => (
              <li key={item.id}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Capabilities</h3>
          <ul>
            {CAPABILITY_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Contact</h3>
          <ul>
            <li>
              <a href="mailto:contact@trizenpackaging.com">
                contact@trizenpackaging.com
              </a>
            </li>
            <li>Vapi / Daman, Gujarat, India</li>
            <li>ISO 9001:2015</li>
            <li>Prototype in 7–14 business days</li>
          </ul>
          <div className="site-footer-map">
            <iframe
              title="Trizen Packaging — Vapi, Gujarat"
              src="https://www.google.com/maps?q=GIDC+Vapi,+Gujarat,+India&hl=en&z=14&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <a
            className="site-footer-map-link"
            href="https://www.google.com/maps/search/?api=1&query=GIDC+Vapi+Gujarat+India"
            target="_blank"
            rel="noreferrer"
          >
            Open map →
          </a>
        </div>
      </div>

      <div className="site-footer-bar">
        <p>
          © {year} Trizen Packaging
          {industryLabel ? ` · ${industryLabel}` : ""} · Vapi, Gujarat, India
        </p>
        <div className="site-footer-legal">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/manufacturing">Manufacturing</Link>
          <Link href="/expertise">Expertise</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
