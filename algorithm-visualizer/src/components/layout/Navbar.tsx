import { Link, NavLink } from "react-router-dom";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `transition hover:text-white ${
    isActive ? "text-white" : "text-slate-300"
  }`;

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-bold tracking-tight text-white">
          Algorithm Visualizer
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/algorithms" className={navLinkClass}>
            Algorithms
          </NavLink>
        </nav>
      </div>
    </header>
  );
}