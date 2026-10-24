// Rubric row status: a quiet ring while pending, then one of three outcomes.
// Every state is always in the DOM; only opacity and transform change.

export type Status = "pending" | "pass" | "miss" | "penalty";

const layer =
  "absolute inset-0 transition-[opacity,transform] duration-500 ease-(--ease-brand)";

function shown(active: boolean) {
  return active ? "opacity-100 scale-100" : "opacity-0 scale-50";
}

export function StatusIcon({ status }: { status: Status }) {
  return (
    <span className="relative block size-6 shrink-0" aria-hidden="true">
      <svg viewBox="0 0 24 24" className={`${layer} ${status === "pending" ? "opacity-100" : "opacity-0"}`}>
        <circle cx="12" cy="12" r="10.25" fill="none" stroke="rgb(30 21 48 / 0.2)" strokeWidth="1.5" strokeDasharray="2.5 3" />
      </svg>
      <svg viewBox="0 0 24 24" className={`${layer} ${shown(status === "pass")}`}>
        <circle cx="12" cy="12" r="11" fill="#2F7D5B" />
        <path d="m7.5 12.3 3 3 6-6.3" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg viewBox="0 0 24 24" className={`${layer} ${shown(status === "miss")}`}>
        <circle cx="12" cy="12" r="10.25" fill="#FBEFF4" stroke="#B3265F" strokeWidth="1.5" />
        <path d="m8.8 8.8 6.4 6.4m0-6.4-6.4 6.4" fill="none" stroke="#B3265F" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <svg viewBox="0 0 24 24" className={`${layer} ${shown(status === "penalty")}`}>
        <circle cx="12" cy="12" r="11" fill="#8A1B49" />
        <path d="M7.5 12h9" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  );
}
