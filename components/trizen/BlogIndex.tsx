import Link from "next/link";
import type { BlogIndex, BlogIndexPost } from "@/lib/blog/types";

type BlogIndexPageProps = {
  content: BlogIndex;
};

const TOPIC_CHIPS = [
  { label: "Sustainability", slug: "rpet-revolution-thermoforming-packaging" },
  { label: "Processes", slug: "vacuum-vs-pressure-forming" },
  { label: "Medical & Pharma", slug: "medical-pharma-thermoforming-packaging" },
  { label: "Industry 4.0", slug: "industry-4-0-thermoforming" },
] as const;

function cardVariant(slug: string): string {
  if (slug.includes("rpet")) return "is-green";
  if (slug.includes("medical")) return "is-mauve";
  if (slug.includes("industry")) return "is-gold";
  return "is-violet";
}

function shortCategory(category: string): string {
  return category.split("·")[0].trim();
}

function PostCard({
  post,
  index,
  featured = false,
}: {
  post: BlogIndexPost;
  index: number;
  featured?: boolean;
}) {
  const num = String(index + 1).padStart(2, "0");
  const variant = cardVariant(post.slug);

  if (featured) {
    return (
      <article className={`blog-featured ${variant}`}>
        <div className="blog-featured-visual" aria-hidden="true">
          <span className="blog-featured-num">{num}</span>
          <span className="blog-featured-tag">{shortCategory(post.category)}</span>
        </div>
        <div className="blog-featured-body">
          <div className="blog-featured-meta">
            <span className="blog-card-cat">{post.category}</span>
            <span className="blog-card-read">{post.readLabel}</span>
          </div>
          <h2 className="blog-featured-title">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h2>
          <p className="blog-featured-excerpt">{post.excerpt}</p>
          <div className="blog-featured-foot">
            <span className="blog-featured-date">{post.dateLabel}</span>
            <Link href={`/blog/${post.slug}`} className="blog-featured-btn">
              Read featured article →
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={`blog-card ${variant}`}>
      <div className="blog-card-top">
        <span className="blog-card-num">{num}</span>
        <span className="blog-card-tag">{shortCategory(post.category)}</span>
      </div>
      <div className="blog-card-meta">
        <span className="blog-card-cat">{shortCategory(post.category)}</span>
        <span className="blog-card-read">{post.readMins} min</span>
      </div>
      <h3 className="blog-card-title">
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </h3>
      <p className="blog-card-excerpt">{post.excerpt}</p>
      <div className="blog-card-foot">
        <span>{post.dateLabel}</span>
        <Link href={`/blog/${post.slug}`} className="blog-card-link">
          Read →
        </Link>
      </div>
    </article>
  );
}

export default function BlogIndexPage({ content }: BlogIndexPageProps) {
  const [featured, ...rest] = content.posts;

  return (
    <div className="blog-page blog-index-page">
      <section className="blog-hero">
        <div className="blog-hero-inner">
          <div className="blog-hero-copy">
            <p className="blog-ey" data-label={content.heroEy} />
            <h1 className="blog-hh1">
              <span className="blog-headline-main">{content.heroTitle}</span>
              <span className="blog-headline-sub">
                Thermoforming knowledge from Vapi — materials, processes,
                regulated industries
              </span>
            </h1>
            <p className="blog-lead">{content.heroDesc}</p>
            <div className="blog-hero-chips">
              {TOPIC_CHIPS.map((chip) => (
                <Link
                  key={chip.slug}
                  href={`/blog/${chip.slug}`}
                  className="blog-hero-chip"
                >
                  {chip.label}
                </Link>
              ))}
            </div>
          </div>

          <aside className="blog-hero-stats" aria-label="Blog at a glance">
            <p className="blog-aside-kicker">At a Glance</p>
            <div className="blog-stat-grid">
              <div className="blog-stat-item">
                <span className="blog-stat-n">{content.posts.length}</span>
                <span className="blog-stat-l">Expert articles</span>
              </div>
              <div className="blog-stat-item">
                <span className="blog-stat-n">4</span>
                <span className="blog-stat-l">Core topics</span>
              </div>
              <div className="blog-stat-item">
                <span className="blog-stat-n">Vapi</span>
                <span className="blog-stat-l">Manufacturing floor</span>
              </div>
              <div className="blog-stat-item">
                <span className="blog-stat-n">ISO</span>
                <span className="blog-stat-l">9001 · GMP · CR8</span>
              </div>
            </div>
            <Link href="/contact" className="blog-hero-stats-cta">
              Talk to manufacturing →
            </Link>
          </aside>
        </div>
      </section>

      <section className="blog-sec">
        <div className="blog-sec-in">
          <div className="blog-sec-head">
            <div>
              <p className="blog-ey" data-label="All Articles" />
              <h2 className="blog-h2">Latest from Trizen Packaging</h2>
            </div>
            <p className="blog-sec-count">
              {content.posts.length} articles · Updated {content.posts[0]?.dateLabel}
            </p>
          </div>

          {featured ? <PostCard post={featured} index={0} featured /> : null}

          {rest.length > 0 ? (
            <div className="blog-card-grid">
              {rest.map((post, i) => (
                <PostCard key={post.slug} post={post} index={i + 1} />
              ))}
            </div>
          ) : null}
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
