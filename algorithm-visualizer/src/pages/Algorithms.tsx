import AlgorithmCard from "../components/algorithmCards/AlgorithmCard";
import { algorithms } from "../data/algorithms";

export default function Algorithms() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-12">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Algorithm Explorer
        </h1>
        <p className="mt-3 text-slate-300">
          Browse available algorithms and open interactive visualizations.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {algorithms.map((algorithm) => (
          <AlgorithmCard key={algorithm.id} algorithm={algorithm} />
        ))}
      </div>
    </section>
  );
}