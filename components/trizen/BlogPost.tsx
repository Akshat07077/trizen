import Link from "next/link";
import BlogFAQ from "@/components/trizen/BlogFAQ";
import { slugifyHeading } from "@/lib/blog/get-page";
import type { BlogBlock, BlogPost as BlogPostType } from "@/lib/blog/types";

type BlogPostProps = {
  post: BlogPostType;
  related: { slug: string; title: string; category: string }[];
};

function RichText({ html, text }: { html?: string; text: string }) {
  if (html && /<(strong|em)\b/i.test(html)) {
    return (
      <span
        dangerouslySetInnerHTML={{
          __html: html.replace(/<(?!\/?(strong|em)\b)[^>]*>/gi, ""),
        }}
      />
    );
  }
  return <>{text}</>;
}

function BlockView({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case "h2": {
      const id = slugifyHeading(block.text);
      return (
        <h2 id={id} className="blog-h2 blog-art-h2">
          {block.text}
        </h2>
      );
    }
    case "h3":
      return <h3 className="blog-h3">{block.text}</h3>;
    case "p":
      return (
        <p className="blog-p">
          <RichText html={block.html} text={block.text} />
        </p>
      );
    case "bullet":
      return (
        <div className="blog-bullet">
          <span className="blog-bullet-dot" aria-hidden="true" />
          <p>
            <RichText html={block.html} text={block.text} />
          </p>
        </div>
      );
    case "callout":
      return (
        <aside className="blog-callout">
          <RichText html={block.html} text={block.text} />
        </aside>
      );
    case "stats":
      return (
        <div className="blog-stats">
          {block.items.map((item) => (
            <div key={item.label} className="blog-stat">
              <div className="blog-stat-val">{item.value}</div>
              <div className="blog-stat-lbl">{item.label}</div>
            </div>
          ))}
        </div>
      );
    case "checklist":
      return (
        <ul className="blog-checklist">
          {block.items.map((item) => (
            <li key={item.slice(0, 48)}>{item.replace(/^✓\s*/, "")}</li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div className="blog-table-wrap">
          <table className="blog-table">
            {block.headers.length ? (
              <thead>
                <tr>
                  {block.headers.map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
            ) : null}
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "image":
      return (
        <div className="blog-img-ph" aria-hidden="true">
          <span className="blog-img-label">{block.label}</span>
        </div>
      );
    case "midCta":
      return (
        <div className="blog-mid-cta">
          <div>
            <h4>{block.title}</h4>
            <p>{block.text}</p>
          </div>
          <Link href="/contact" className="blog-mid-cta-btn">
            {block.button}
          </Link>
        </div>
      );
    default:
      return null;
  }
}

export default function BlogPost({ post, related }: BlogPostProps) {
  const h2Ids = post.blocks
    .filter((b): b is Extract<BlogBlock, { type: "h2" }> => b.type === "h2")
    .map((b) => slugifyHeading(b.text));

  const tocLinks = post.toc
    .filter((item) => !/faq/i.test(item.label))
    .map((item, index) => ({
      ...item,
      href: `#${h2Ids[index] || slugifyHeading(item.label)}`,
    }));

  return (
    <div className="blog-page blog-article-page">
      <section className="blog-article-hero">
        <div className="blog-article-hero-in">
          <nav className="blog-crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/blog">Blog</Link>
            <span>/</span>
            <span>{post.category.split("·")[0].trim()}</span>
          </nav>
          <p className="blog-cat-pill">{post.category}</p>
          <h1 className="blog-article-h1">{post.heroTitle}</h1>
          <div className="blog-article-meta">
            <span>{post.dateLabel}</span>
            <span>{post.readLabel}</span>
          </div>
          <p className="blog-article-intro">{post.intro}</p>
        </div>
      </section>

      <div className="blog-article-layout">
        <article className="blog-article">
          {tocLinks.length > 0 ? (
            <div className="blog-toc blog-toc-mobile">
              <p className="blog-toc-hd">In this article</p>
              <ol>
                {tocLinks.map((item) => (
                  <li key={item.n}>
                    <a href={item.href}>
                      <span>{item.n}</span>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          {post.blocks.map((block, index) => (
            <BlockView key={`${block.type}-${index}`} block={block} />
          ))}

          {post.faqs.length > 0 ? <BlogFAQ items={post.faqs} /> : null}

          <div className="blog-article-end">
            <Link href="/blog" className="blog-back">
              ← All articles
            </Link>
            <Link href="/contact" className="bp">
              Discuss your brief →
            </Link>
          </div>
        </article>

        <aside className="blog-sidebar">
          {tocLinks.length > 0 ? (
            <div className="blog-toc">
              <p className="blog-toc-hd">In this article</p>
              <ol>
                {tocLinks.map((item) => (
                  <li key={item.n}>
                    <a href={item.href}>
                      <span>{item.n}</span>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          <div className="blog-side-card">
            <p className="blog-aside-kicker">Manufacture with Trizen</p>
            <p>
              ISO 9001:2015 · GMP · Cleanroom Class 8 — custom thermoforming from
              Vapi.
            </p>
            <Link href="/contact" className="blog-aside-cta">
              Get a quote →
            </Link>
          </div>

          {related.length > 0 ? (
            <div className="blog-side-card">
              <p className="blog-aside-kicker">More articles</p>
              <ul className="blog-related">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link href={`/blog/${item.slug}`}>{item.title}</Link>
                    <span>{item.category.split("·")[0].trim()}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
