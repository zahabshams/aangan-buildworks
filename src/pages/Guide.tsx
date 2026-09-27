import { Link, useParams } from "react-router-dom";
import { guides } from "@/lib/guides";

export default function Guide() {
  const { slug } = useParams();
  const guide = guides.find((item) => item.slug === slug);

  if (!guide) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-24" data-testid="guide-missing">
        <h1 className="text-4xl font-medium">That guide is not on this site.</h1>
        <Link to="/" className="mt-6 inline-block text-sm font-bold text-[#a38068]">
          Back to home
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-[#fafafa] text-[#1a1a1a]" data-testid="guide-page">
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-8 sm:py-24">
        <Link to="/#resources" className="text-xs font-bold uppercase tracking-[0.18em] text-[#a38068]" data-testid="guide-back-link">
          Home building guide
        </Link>
        <h1 className="mt-4 text-4xl font-medium leading-tight sm:text-5xl" data-testid="guide-title">
          {guide.title}
        </h1>
        <p className="mt-4 text-base leading-7 text-[#666]">{guide.summary}</p>
        <div className="mt-10 space-y-5 text-base leading-7 text-[#333]">
          {guide.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <Link to="/contact" className="mt-10 inline-flex h-12 items-center bg-[#1a1a1a] px-5 text-sm font-bold text-white" data-testid="guide-contact-link">
          Talk through my plot
        </Link>
      </article>
    </main>
  );
}
