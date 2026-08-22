import ContactForm from "@/components/trizen/ContactForm";
import FAQ from "@/components/trizen/FAQ";
import {
  CONTACT_FAQS,
  CONTACT_PEOPLE,
  STEPS,
  WHY_CHOOSE,
} from "@/lib/contact/content";

export default function ContactPage() {
  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-inner">
          <div className="contact-hero-copy">
            <div
              className="hey"
              data-label="Contact · Vapi / Daman, India · ISO 9001:2015"
            />
            <h1 className="hh1">
              <span className="headline-main">Contact Trizen Packaging</span>
              <span className="headline-sub">
                Custom Thermoforming Solutions, Vapi India
              </span>
            </h1>
            <p className="hdesc">
              Every product deserves packaging that protects, presents, and
              performs. At Trizen Packaging — based in Vapi/Daman, India — our
              ISO 9001:2015 certified team creates thermoforming solutions
              tailored to your exact requirements.
            </p>
            <div className="hbtns">
              <a href="#contact-form" className="bp">
                Send Your Requirements →
              </a>
              <a href="mailto:contact@trizenpackaging.com" className="bg2">
                Email Us Directly
              </a>
            </div>
            <div className="cprow">
              <span className="cp">ISO 9001:2015</span>
              <span className="cp">7–14 Day Prototype</span>
              <span className="cp">MOQ from 500 Units</span>
            </div>
          </div>

          <aside className="contact-quick-card">
            <p className="contact-quick-kicker">Quick Contact</p>
            {CONTACT_PEOPLE.map((person) => (
              <div key={person.name} className="contact-quick-row">
                <div>
                  <strong>{person.name}</strong>
                  <span>
                    {person.role} ·{" "}
                    <a href={`tel:${person.tel}`}>{person.phone}</a>
                  </span>
                </div>
              </div>
            ))}
            <div className="contact-quick-row">
              <div>
                <strong>Email</strong>
                <span>
                  <a href="mailto:contact@trizenpackaging.com">
                    contact@trizenpackaging.com
                  </a>
                </span>
              </div>
            </div>
            <div className="contact-quick-row">
              <div>
                <strong>Business Hours</strong>
                <span>Mon–Sat: 9:00 AM – 6:00 PM</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="contact-sec">
        <div className="contact-sec-in">
          <div className="contact-grid">
            <div className="contact-form-wrap">
              <ContactForm />
            </div>

            <div className="contact-info-side">
              <div className="contact-info-block">
                <h3>Address Details</h3>
                <div className="contact-addr-note">
                  Factory Address — add actual address
                  <small>
                    e.g. Plot No. XX, GIDC Industrial Area, Vapi, Gujarat
                    396195
                  </small>
                </div>
                <div className="contact-addr-note">
                  Office Address — add actual address
                  <small>
                    Required for local SEO and Google Business Profile
                  </small>
                </div>
              </div>

              <div className="contact-info-block">
                <h3>Location Map</h3>
                <p className="contact-map-caption">
                  Trizen Packaging · Vapi / Daman, Gujarat, India
                </p>
                <div className="contact-map">
                  <iframe
                    title="Trizen Packaging location — Vapi, Gujarat"
                    src="https://www.google.com/maps?q=GIDC+Vapi,+Gujarat,+India&hl=en&z=14&output=embed"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
                <a
                  className="contact-map-link"
                  href="https://www.google.com/maps/search/?api=1&query=GIDC+Vapi+Gujarat+India"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open in Google Maps →
                </a>
              </div>

              <div className="contact-info-block">
                <h3>Direct Contacts</h3>
                {CONTACT_PEOPLE.map((person) => (
                  <div key={person.name} className="contact-person">
                    <div>
                      <strong>{person.name}</strong>
                      <span>{person.role}</span>
                      <br />
                      <a href={`tel:${person.tel}`}>{person.phone}</a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="contact-info-block">
                <h3>Business Hours</h3>
                <div className="contact-hours-row">
                  <span className="day">Monday – Saturday</span>
                  <span className="time">9:00 AM – 6:00 PM</span>
                </div>
                <div className="contact-hours-row">
                  <span className="day">Sunday</span>
                  <span className="time">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-sec contact-sec-alt">
        <div className="contact-sec-in">
          <div className="ey">Why Choose Us</div>
          <h2 className="st">
            <span className="section-title-main">
              Why Choose Trizen Packaging
            </span>
            <span className="section-title-sub">for Your Enquiry</span>
          </h2>
          <p className="lead">
            When you contact Trizen Packaging, you speak directly with an ISO
            9001:2015 certified thermoforming manufacturer — not a reseller or
            agent.
          </p>
          <div className="contact-why-grid">
            {WHY_CHOOSE.map((item) => (
              <div key={item.title} className="contact-why-card">
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-sec">
        <div className="contact-sec-in">
          <div className="ey">Process</div>
          <h2 className="st">
            <span className="section-title-main">
              Ready to Protect Your Products
            </span>
            <span className="section-title-sub">with Premium Packaging?</span>
          </h2>
          <div className="contact-steps">
            {STEPS.map((step) => (
              <div key={step.num} className="contact-step">
                <div className="contact-step-num">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-sec contact-sec-alt">
        <div className="contact-sec-in contact-faq-wrap">
          <div className="ey">FAQs</div>
          <h2 className="st">
            <span className="section-title-main">
              Common Questions About Our Packaging
            </span>
            <span className="section-title-sub">Services &amp; Enquiries</span>
          </h2>
          <FAQ items={CONTACT_FAQS.map((item) => ({ q: item.q, a: item.a }))} />
        </div>
      </section>

      <a
        href="https://wa.me/919898701364"
        className="contact-wa-float"
        aria-label="Chat on WhatsApp"
        target="_blank"
        rel="noreferrer"
      >
        WhatsApp
      </a>
    </div>
  );
}
