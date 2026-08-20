"use client";

import { FormEvent, useState } from "react";
import {
  INDUSTRY_OPTIONS,
  QUANTITY_OPTIONS,
} from "@/lib/contact/content";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const subject = encodeURIComponent(
      `Trizen enquiry — ${data.get("industry") || "Packaging"}`,
    );
    const body = encodeURIComponent(
      [
        `Name: ${data.get("firstName")} ${data.get("lastName")}`,
        `Email: ${data.get("email")}`,
        `Phone: ${data.get("phone")}`,
        `Industry: ${data.get("industry")}`,
        `Quantity: ${data.get("quantity") || "Not specified"}`,
        "",
        "Requirement:",
        String(data.get("requirement") || ""),
        "",
        `Marketing updates: ${data.get("updates") ? "Yes" : "No"}`,
      ].join("\n"),
    );

    window.location.href = `mailto:contact@trizenpackaging.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} id="contact-form">
      <h2 className="contact-form-title">Send Us Your Requirements</h2>
      <p className="contact-form-sub">
        Tell us about your requirement — our team responds within 24 hours.
      </p>

      {submitted ? (
        <p className="contact-form-success">
          Your email client should open with your enquiry. If it did not, email{" "}
          <a href="mailto:contact@trizenpackaging.com">
            contact@trizenpackaging.com
          </a>{" "}
          directly.
        </p>
      ) : null}

      <div className="contact-field-row">
        <div>
          <label className="contact-label" htmlFor="firstName">
            First Name <span className="contact-req">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            className="contact-input"
            type="text"
            placeholder="First name"
            required
          />
        </div>
        <div>
          <label className="contact-label" htmlFor="lastName">
            Last Name <span className="contact-req">*</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            className="contact-input"
            type="text"
            placeholder="Last name"
            required
          />
        </div>
      </div>

      <div className="contact-field-row">
        <div>
          <label className="contact-label" htmlFor="email">
            Email <span className="contact-req">*</span>
          </label>
          <input
            id="email"
            name="email"
            className="contact-input"
            type="email"
            placeholder="your@email.com"
            required
          />
        </div>
        <div>
          <label className="contact-label" htmlFor="phone">
            Phone No <span className="contact-req">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            className="contact-input"
            type="tel"
            placeholder="+91 XXXXX XXXXX"
            required
          />
        </div>
      </div>

      <div className="contact-field-single">
        <label className="contact-label" htmlFor="industry">
          Service Needed <span className="contact-req">*</span>
        </label>
        <select id="industry" name="industry" className="contact-select" required>
          <option value="">Select Industry</option>
          {INDUSTRY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="contact-field-row">
        <div>
          <label className="contact-label" htmlFor="quantity">
            Quantity Required <span className="contact-badge">NEW</span>
          </label>
          <select id="quantity" name="quantity" className="contact-select">
            <option value="">Select quantity range</option>
            {QUANTITY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="contact-label" htmlFor="specs">
            Upload Specs / Design <span className="contact-badge">NEW</span>
          </label>
          <input
            id="specs"
            name="specs"
            className="contact-input contact-file"
            type="file"
          />
        </div>
      </div>

      <div className="contact-field-single">
        <label className="contact-label" htmlFor="requirement">
          Your Packaging Requirement <span className="contact-req">*</span>
        </label>
        <textarea
          id="requirement"
          name="requirement"
          className="contact-textarea"
          placeholder="Describe your product, packaging needs, compliance requirements, or any challenges..."
          required
        />
      </div>

      <label className="contact-check">
        <input type="checkbox" name="updates" />
        Keep me updated on thermoforming packaging insights
      </label>

      <button type="submit" className="contact-submit">
        Submit Enquiry →
      </button>

      <p className="contact-wa-note">
        Prefer WhatsApp?{" "}
        <a href="https://wa.me/919898701364" target="_blank" rel="noreferrer">
          Chat with us directly
        </a>
      </p>
    </form>
  );
}
