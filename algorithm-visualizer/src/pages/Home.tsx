import { Link } from "react-router-dom";

const features = [
  {
    title: "Step Playback",
    description:
      "Watch algorithm state changes unfold clearly through guided, step-by-step animation.",
  },
  {
    title: "Clean UI",
    description:
      "Built like a real frontend product with reusable components and a polished layout.",
  },
  {
    title: "Algorithm Insights",
    description:
      "Understand the logic, traversal flow, and complexity behind each visualization.",
  },
];

export default function Home() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <div className="rounded-full border border-slate-700 bg-slate-900/60 px-5 py-2 text-sm text-slate-200">
          Interactive Algorithm Visualizer
        </div>

        <h1 className="mt-8 text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
          Learn algorithms visually, step by step.
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
          Interactive visualizations for sorting and tree traversal, including
          Merge Sort, BFS, and DFS — built with React and TypeScript.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/algorithms"
            className="rounded-2xl bg-cyan-500 px-8 py-4 text-lg font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Start Visualizing
          </Link>

          <a
            href="https://github.com/shruti-246/Algorithm_Visualizer"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-slate-700 px-8 py-4 text-lg font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-300"
          >
            View GitHub
          </a>
        </div>
      </div>

      <div className="mt-20 grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-sm transition hover:border-cyan-400 hover:shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-white">
              {feature.title}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-300">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}