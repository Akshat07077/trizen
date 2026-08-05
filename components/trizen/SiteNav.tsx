import Link from "next/link";
import { Fragment } from "react";

type SiteNavProps = {
  trail?: { href?: string; label: string }[];
};

export default function SiteNav({
  trail = [
    { href: "/", label: "Home" },
    { href: "#", label: "Industries" },
    { href: "/toy", label: "Toys" },
  ],
}: SiteNavProps) {
  return (
    <nav className="snav">
      <div className="ni">
        <Link href="/" className="logo">
          <div className="lm">T</div>
          <div className="ln">
            Trizen<em>.</em>
          </div>
        </Link>
        <div className="ntrail">
          {trail.map((item, index) => (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 ? <span>›</span> : null}
              {item.href ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span>{item.label}</span>
              )}
            </Fragment>
          ))}
        </div>
        <a href="mailto:contact@trizenpackaging.com" className="ncta">
          Get a Quote
        </a>
      </div>
    </nav>
  );
}
