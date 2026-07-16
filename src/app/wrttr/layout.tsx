// Scopes the muted burnt-orange accent (globals.css `.wrttr`) to every
// writing-surface route in one place.
export default function WrttrLayout({ children }: { children: React.ReactNode }) {
  return <div className="wrttr">{children}</div>;
}
