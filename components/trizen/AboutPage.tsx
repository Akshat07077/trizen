import Link from "next/link";
import {
  ABOUT_CAPABILITIES,
  ABOUT_INDUSTRIES,
  ABOUT_INNOVATION,
  ABOUT_QUALITY,
  ABOUT_STATS,
  ABOUT_SUSTAINABILITY,
  ABOUT_TIMELINE,
  ABOUT_WHY,
} from "@/lib/about/content";

export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-inner">
          <div className="about-hero-copy">
            <div
              className="hey"
              data-label="About · Vapi / Daman, India · Since 2005"
            />
            <h1 className="hh1">
              <span className="headline-main">About Trizen Packaging</span>
              <span className="headline-sub">
                Thermoforming Manufacturer India, 20 Years
              </span>
            </h1>
            <p className="hdesc">
              Trizen Packaging is a specialised thermoforming packaging
              manufacturer based in <strong>Vapi/Daman, India</strong>, serving
              regulated and commercial industries since 2005.{" "}
              <strong>ISO 9001:2015 certified</strong> and operating a{" "}
              <strong>Cleanroom Class 100,000 (ISO Class 8)</strong> facility, we
              deliver medical thermoforming packaging, pharmaceutical blister
              packaging, and precision industrial packaging — from concept to
              production under one certified roof.
            </p>
            <div className="hbtns">
              <Link href="/contact" className="bp">
                Talk to Our Team →
              </Link>
              <a href="mailto:contact@trizenpackaging.com" className="bg2">
                Email Us Directly
              </a>
            </div>
            <div className="cprow">
              <span className="cp">ISO 9001:2015</span>
              <span className="cp">Cleanroom Class 100K</span>
              <span className="cp">Since 2005</span>
              <span className="cp">10+ Industries</span>
            </div>
          </div>

          <aside className="about-stats-card" aria-label="Company highlights">
            <p className="about-stats-kicker">At a Glance</p>
            <div className="about-stats-grid">
              {ABOUT_STATS.map((stat) => (
                <div key={stat.label} className="about-stat">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="about-sec">
        <div className="about-sec-in">
          <div className="about-story">
            <div>
              <div className="hey" data-label="Our Story" />
              <h2 className="about-h2">
                20 Years of Thermoforming Excellence — Since 2005
              </h2>
              <p className="about-body">
                Trizen Packaging was built on a single principle: that packaging
                for regulated industries must be engineered with the same rigour
                as the products it protects. Since 2005, we have grown from a
                focused thermoforming operation into a full-capability packaging
                manufacturer with in-house design, prototyping, cleanroom
                production, and quality systems aligned with ISO 9001:2015 and
                GMP requirements.
              </p>
              <p className="about-body">
                Based in <strong>Vapi/Daman</strong> — one of India&apos;s most
                strategically located industrial zones — our facility serves
                medical device companies, pharmaceutical manufacturers,
                automotive component suppliers, and large industrial OEMs who
                return for consistent quality, compliance documentation, and
                manufacturing reliability.
              </p>
              <p className="about-body">
                Our primary expertise is in regulated sectors. Medical device
                packaging and pharmaceutical packaging account for 70% of our
                production. Every other industry we serve benefits from the same
                quality discipline built for those demanding sectors.
              </p>

              <ol className="about-timeline">
                {ABOUT_TIMELINE.map((item) => (
                  <li key={item.year}>
                    <span className="about-tl-year">{item.year}</span>
                    <strong>{item.title}</strong>
                    <p>{item.text}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="about-story-visual" aria-hidden="true">
              <div className="about-viz about-viz-main">
                <span>Facility</span>
                <em>Production floor photo</em>
              </div>
              <div className="about-viz">
                <span>Cleanroom</span>
              </div>
              <div className="about-viz">
                <span>Lines</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-sec about-sec-alt">
        <div className="about-sec-in">
          <div className="hey" data-label="What We Do" />
          <h2 className="about-h2">
            Custom Thermoforming Capabilities India — End-to-End
          </h2>
          <p className="about-body about-body-narrow">
            We manufacture high-performance thermoformed packaging across four
            core product formats — each developed from in-house design through
            to certified production.
          </p>
          <div className="about-cap-grid">
            {ABOUT_CAPABILITIES.map((item) => (
              <article key={item.num} className="about-cap">
                <span className="about-num">{item.num}</span>
                <strong>{item.title}</strong>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-sec">
        <div className="about-sec-in">
          <div className="hey" data-label="Quality & Compliance" />
          <h2 className="about-h2">
            ISO 9001:2015 Certified | Cleanroom Packaging Expertise | Vapi,
            India
          </h2>
          <div className="about-quality">
            <div className="about-quality-list">
              {ABOUT_QUALITY.map((item) => (
                <article key={item.num} className="about-quality-item">
                  <span className="about-num">{item.num}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.desc}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="about-quality-panel" aria-hidden="true">
              <span>Cleanroom / QC</span>
              <em>Facility photo placeholder</em>
            </div>
          </div>
        </div>
      </section>

      <section className="about-sec about-sec-alt">
        <div className="about-sec-in">
          <div className="hey" data-label="Innovation & Technology" />
          <h2 className="about-h2">
            Packaging R&amp;D and Innovation — In-House, No Outsourcing
          </h2>
          <p className="about-body about-body-narrow">
            We invest in technology that gives our clients faster prototypes,
            tighter tolerances, and more reliable production. All development
            happens in-house — no dependency on external tooling vendors or
            design agencies.
          </p>
          <div className="about-innov-grid">
            {ABOUT_INNOVATION.map((item, i) => (
              <article key={item.title} className="about-innov">
                <span className="about-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <strong>{item.title}</strong>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-sec">
        <div className="about-sec-in">
          <div className="about-sustain">
            <div>
              <div className="hey" data-label="Sustainability" />
              <h2 className="about-h2">
                Responsible Manufacturing — rPET &amp; Circular Packaging
              </h2>
              <p className="about-body">
                We are committed to responsible thermoforming manufacturing.
                Sustainability is not a marketing position — it is a material
                and process discipline that we apply across our production.
              </p>
              <ul className="about-sustain-list">
                {ABOUT_SUSTAINABILITY.map((item) => (
                  <li key={item.title}>
                    <strong>{item.title}</strong>
                    <p>{item.desc}</p>
                  </li>
                ))}
              </ul>
              <Link href="/expertise/rnd-innovation" className="about-outline">
                Explore R&amp;D Innovation →
              </Link>
            </div>
            <div className="about-sustain-panel" aria-hidden="true">
              <span>rPET &amp; Circular</span>
              <em>Material &amp; process discipline</em>
            </div>
          </div>
        </div>
      </section>

      <section className="about-sec about-sec-alt">
        <div className="about-sec-in">
          <div className="hey" data-label="Industries We Serve" />
          <h2 className="about-h2">
            Advanced Thermoforming Solutions Gujarat &amp; India — 10+
            Industries
          </h2>
          <p className="about-body about-body-narrow">
            Medical and pharmaceutical packaging is our primary focus (70% of
            production). We also serve commercial and industrial industries with
            the same manufacturing quality.
          </p>
          <div className="about-ind-grid">
            {ABOUT_INDUSTRIES.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`about-ind${item.primary ? " is-primary" : ""}`}
              >
                <strong>{item.name}</strong>
                <span>
                  View →
                  {item.primary ? (
                    <em className="about-priority">Priority</em>
                  ) : null}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="about-sec">
        <div className="about-sec-in">
          <div className="hey" data-label="Why Choose Us" />
          <h2 className="about-h2">
            Thermoforming Packaging OEM Expertise India — What Sets Us Apart
          </h2>
          <div className="about-why-grid">
            {ABOUT_WHY.map((item, i) => (
              <article key={item.title} className="about-why">
                <span className="about-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <strong>{item.title}</strong>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="about-cta-in">
          <h2>Connect With Our Team</h2>
          <p>
            Ready to discuss your thermoforming packaging requirements? Our
            specialists respond within 24 business hours.
          </p>
          <div className="about-cta-btns">
            <a href="mailto:contact@trizenpackaging.com" className="bp">
              Email Us
            </a>
            <a
              href="https://wa.me/919898701364"
              className="bg2"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp Us
            </a>
            <Link href="/contact" className="bg2">
              Full Contact Details →
            </Link>
          </div>
          <p className="about-cta-meta">
            Vapi / Daman, India · Response within 24 business hours
          </p>
        </div>
      </section>
    </div>
  );
}
