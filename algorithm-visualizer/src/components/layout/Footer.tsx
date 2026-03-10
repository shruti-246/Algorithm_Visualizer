export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-6 py-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        
        <p>© 2026 Algorithm Visualizer</p>

        <p>Built with React, TypeScript, Vite, and Tailwind CSS</p>

        <p>
          Created by{" "}
          <a
            href="https://github.com/shruti-246"
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 hover:underline"
          >
            Shruti Debnath
          </a>
        </p>

      </div>
    </footer>
  );
}