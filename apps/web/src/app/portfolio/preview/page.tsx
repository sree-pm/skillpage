import { createStarterPortfolio } from '@skillpage/portfolio-core';

export default function PortfolioPreview() {
  const document = createStarterPortfolio();
  document.profile.name = 'Sree Durairaj';
  document.profile.handle = 'sree';
  document.profile.headline = 'AI-native founder building agentic software for small businesses.';
  document.profile.bio = 'A polished public portfolio should make the work, thinking and outcomes obvious within seconds. This preview demonstrates the independent renderer boundary that will later load a published portfolio version.';
  document.profile.skills = ['Product Strategy', 'AI Products', 'Agentic Systems', 'Growth'];
  document.profile.projects = [
    { id: 'p1', title: 'AI Product System', description: 'A structured product and delivery system for turning manual operations into autonomous workflows.', tags: ['AI', 'Product'] },
    { id: 'p2', title: 'Local Business Growth', description: 'A presence and reputation workflow designed around measurable local search signals.', tags: ['SaaS', 'Growth'] },
  ];

  return (
    <main className="min-h-screen bg-white text-[#171717]">
      <article className="mx-auto max-w-5xl px-6 md:px-10">
        <header className="flex items-center justify-between border-b border-black/10 py-7">
          <span className="text-sm font-semibold tracking-[-0.02em]">{document.profile.name}</span>
          <span className="text-xs text-black/40">@{document.profile.handle}</span>
        </header>
        <section className="py-24 md:py-36">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/35">Available for selected projects</p>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.96] tracking-[-0.06em] md:text-7xl">{document.profile.headline}</h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-black/50">{document.profile.bio}</p>
          <div className="mt-9 flex gap-3"><a href="#work" className="rounded-full bg-[#171717] px-5 py-3 text-sm font-medium text-white">View work</a><a href="/studio" className="rounded-full border border-black/10 px-5 py-3 text-sm font-medium">Edit this style</a></div>
        </section>
        <section id="work" className="border-t border-black/10 py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/35">Selected work</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Work that shows the thinking.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">{document.profile.projects.map((project) => <article key={project.id} className="rounded-2xl border border-black/10 p-5"><div className="aspect-[1.55] rounded-xl bg-[#f0f0ed]" /><h3 className="mt-5 text-xl font-semibold tracking-[-0.03em]">{project.title}</h3><p className="mt-2 text-sm leading-6 text-black/50">{project.description}</p><div className="mt-4 flex gap-2">{project.tags.map((tag) => <span key={tag} className="rounded-full bg-[#f5f5f2] px-3 py-1 text-[10px] text-black/50">{tag}</span>)}</div></article>)}</div>
        </section>
        <section className="border-t border-black/10 py-20"><p className="max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.04em]">The same portfolio content can later power a marketplace profile, hiring flow and reputation layer without changing this renderer.</p></section>
        <footer className="border-t border-black/10 py-8 text-xs text-black/35">Built with SkillPage</footer>
      </article>
    </main>
  );
}
