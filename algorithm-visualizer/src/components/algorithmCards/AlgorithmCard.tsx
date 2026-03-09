import { Link } from "react-router-dom";
import type { Algorithm } from "../../types/algorithm";

interface Props {
  algorithm: Algorithm;
}

export default function AlgorithmCard({ algorithm }: Props) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <h2 className="text-xl font-semibold text-white">
        {algorithm.name}
      </h2>

      <p className="mt-3 text-sm text-slate-300">
        {algorithm.description}
      </p>

      <div className="mt-4 text-sm text-slate-400">
        Avg: {algorithm.complexity.average}
      </div>

      <Link
        to={`/visualizer/${algorithm.id}`}
        className="mt-5 inline-block rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-cyan-400"
      >
        Visualize
      </Link>
    </article>
  );
}