import Link from "next/link";
import type { BlogIndex } from "@/lib/blog/types";

type BlogIndexPageProps = {
  content: BlogIndex;
};

export default function BlogIndexPage({ content }: BlogIndexPageProps) {
  return (
    <div className="blog-page">
      <section className="blog-hero">
        <div className="blog-hero-inner">
          <div className="blog-hero-copy">
            <p className="blog-ey" data-label={content.heroEy} />
            <h1 className="blog-hh1">{content.heroTitle}</h1>
            <p className="blog-lead">{content.heroDesc}</p>
          </div>
          <aside className="blog-hero-aside" aria-label="Blog topics">
            <p className="blog-aside-kicker">Topics</p>
            <ul className="blog-topic-list">
              <li>Sustainability & rPET</li>
              <li>Thermoforming processes</li>
              <li>Medical & pharma</li>
              <li>Industry 4.0 manufacturing</li>
            </ul>
            <Link href="/contact" className="blog-aside-cta">
              Talk to manufacturing →
            </Link>
          </aside>
        </div>
      </section>

      <section className="blog-sec">
        <div className="blog-sec-in">
          <p className="blog-ey" data-label="All Articles" />
          <h2 className="blog-h2">Latest from Trizen Packaging</h2>
          <div className="blog-card-grid">
            {content.posts.map((post, index) => (
              <article key={post.slug} className="blog-card">
                <div className="blog-card-meta">
                  <span className="blog-card-cat">{post.category}</span>
                  <span className="blog-card-read">{post.readLabel}</span>
                </div>
                <p className="blog-card-num">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="blog-card-title">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <div className="blog-card-foot">
                  <span>{post.dateLabel}</span>
                  <Link href={`/blog/${post.slug}`} className="blog-card-link">
                    Read article →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="blog-cta">
        <div className="blog-cta-in">
          <p className="blog-ey" data-label="Next Step" />
          <h2 className="blog-h2">Have a packaging brief?</h2>
          <p className="blog-lead">
            Share your product sample or specification — we map process,
            material, and documentation within 24 business hours.
          </p>
          <div className="blog-cta-btns">
            <Link href="/contact" className="bp">
              Contact manufacturing →
            </Link>
            <a href="mailto:contact@trizenpackaging.com" className="bg2">
              Email us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
