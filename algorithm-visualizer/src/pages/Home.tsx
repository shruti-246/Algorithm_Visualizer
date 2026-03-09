import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-7xl flex-col items-center justify-center px-6 py-16 text-center">
      <p className="mb-3 rounded-full border border-slate-700 px-4 py-1 text-sm text-slate-300">
        Interactive frontend project
      </p>

      <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
        Learn algorithms visually, step by step.
      </h1>

      <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
        A production-style algorithm visualizer built with React, TypeScript,
        and reusable animation architecture.
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Link
          to="/algorithms"
          className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          Explore Algorithms
        </Link>

        <a
          href="#features"
          className="rounded-xl border border-slate-600 px-6 py-3 font-semibold text-slate-200 transition hover:border-slate-400 hover:text-white"
        >
          Learn More
        </a>
      </div>

      <div
        id="features"
        className="mt-20 grid w-full max-w-5xl gap-6 md:grid-cols-3"
      >
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-left">
          <h2 className="text-lg font-semibold text-white">Step Playback</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Watch comparisons, swaps, and state changes one step at a time.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-left">
          <h2 className="text-lg font-semibold text-white">Clean UI</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Built like a real frontend product with reusable components and
            polished layout.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-left">
          <h2 className="text-lg font-semibold text-white">
            Algorithm Insights
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Understand time complexity, space complexity, and the logic behind
            each step.
          </p>
        </div>
      </div>
    </section>
  );
}