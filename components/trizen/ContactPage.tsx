import ContactForm from "@/components/trizen/ContactForm";
import ContactFAQ from "@/components/trizen/ContactFAQ";
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
          <div>
            <div className="contact-hero-ey">Vapi / Daman, India</div>
            <h1>
              Contact Trizen Packaging —
              <em> Custom Thermoforming</em> Solutions, Vapi India
            </h1>
            <p className="contact-hero-lead">
              Every product deserves packaging that protects, presents, and
              performs. At Trizen Packaging — based in{" "}
              <strong>Vapi/Daman, India</strong> — our{" "}
              <strong>ISO 9001:2015 certified</strong> team creates
              thermoforming solutions tailored to your exact requirements. Get
              your free consultation today.
            </p>
            <a href="#contact-form" className="contact-hero-btn">
              Send Your Requirements →
            </a>
          </div>

          <aside className="contact-quick-card">
            <p className="contact-quick-kicker">Quick Contact</p>
            {CONTACT_PEOPLE.map((person) => (
              <div key={person.name} className="contact-quick-row">
                <div className="contact-quick-ico" aria-hidden="true">
                  📞
                </div>
                <div>
                  <strong>{person.name}</strong>
                  <span>
                    {person.role} · {person.phone}
                  </span>
                </div>
              </div>
            ))}
            <div className="contact-quick-row">
              <div className="contact-quick-ico" aria-hidden="true">
                ✉
              </div>
              <div>
                <strong>Email</strong>
                <span>contact@trizenpackaging.com</span>
              </div>
            </div>
            <div className="contact-quick-row">
              <div className="contact-quick-ico" aria-hidden="true">
                🕐
              </div>
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
                <h3>Direct Contacts</h3>
                {CONTACT_PEOPLE.map((person) => (
                  <div key={person.name} className="contact-person">
                    <div className="contact-person-ico" aria-hidden="true">
                      👤
                    </div>
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

              <div className="contact-info-block">
                <h3>Email</h3>
                <p className="contact-email">
                  <a href="mailto:contact@trizenpackaging.com">
                    contact@trizenpackaging.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-sec contact-sec-alt">
        <div className="contact-sec-in">
          <div className="contact-eyebrow">Why Choose Us</div>
          <h2 className="contact-sec-title">
            Why Choose Trizen Packaging for Your Enquiry
          </h2>
          <p className="contact-sec-body">
            When you contact Trizen Packaging, you speak directly with an ISO
            9001:2015 certified thermoforming manufacturer — not a reseller or
            agent.
          </p>
          <div className="contact-why-grid">
            {WHY_CHOOSE.map((item) => (
              <div key={item.title} className="contact-why-card">
                <div className="contact-why-ico" aria-hidden="true">
                  {item.icon}
                </div>
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
          <div className="contact-eyebrow">Process</div>
          <h2 className="contact-sec-title">
            Ready to Protect Your Products with Premium Packaging?
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
          <div className="contact-eyebrow">FAQs</div>
          <h2 className="contact-sec-title">
            Common Questions About Our Packaging Services
          </h2>
          <ContactFAQ items={CONTACT_FAQS} />
        </div>
      </section>

      <a
        href="https://wa.me/919898701364"
        className="contact-wa-float"
        aria-label="Chat on WhatsApp"
        target="_blank"
        rel="noreferrer"
      >
        💬
      </a>
    </div>
  );
}
