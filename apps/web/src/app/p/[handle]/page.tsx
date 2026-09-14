import Link from 'next/link';
import { createStarterPortfolio } from '@skillpage/portfolio-core';

export default function PublicPortfolio({ params }: { params: { handle: string } }) {
  const document = createStarterPortfolio();
  document.profile.name = params.handle.replace(/-/g, ' ');
  document.profile.handle = params.handle;
  document.profile.headline = 'Independent professional building useful things.';
  document.profile.bio = 'This is the public SkillPage renderer foundation. Published portfolio documents will eventually be loaded from the portfolio service without coupling the page to Marketplace or Payments.';

  return (
    <main className="min-h-screen bg-white text-[#171717]">
      <article className="mx-auto max-w-5xl px-6 py-8 md:px-10">
        <header className="flex items-center justify-between border-b border-black/10 pb-6">
          <span className="text-sm font-semibold">{document.profile.name}</span>
          <div className="flex items-center gap-4 text-xs text-black/45">
            <span>Portfolio</span>
            <Link href="/studio" className="hover:text-black">Create yours</Link>
          </div>
        </header>
        <section className="py-24 md:py-36">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/40">Available for selected projects</p>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.96] tracking-[-0.06em] md:text-7xl">{document.profile.headline}</h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-black/50">{document.profile.bio}</p>
          <div className="mt-9 flex gap-3">
            <a href="#work" className="rounded-full bg-[#171717] px-5 py-3 text-sm font-medium text-white">View work</a>
            <a href="mailto:hello@example.com" className="rounded-full border border-black/10 px-5 py-3 text-sm font-medium">Get in touch</a>
          </div>
        </section>
        <section id="work" className="border-t border-black/10 py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/35">Selected work</p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {['A case study', 'Another project'].map((title) => (
              <div key={title} className="rounded-2xl border border-black/10 p-5">
                <div className="aspect-[1.5] rounded-xl bg-[#f0f0ed]" />
                <h2 className="mt-5 text-lg font-semibold">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-black/50">Project content will be rendered from the published portfolio document.</p>
              </div>
            ))}
          </div>
        </section>
        <footer className="border-t border-black/10 py-7 text-xs text-black/40">Built with SkillPage · @{document.profile.handle}</footer>
      </article>
    </main>
  );
}
