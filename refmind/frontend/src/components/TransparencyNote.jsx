export const TRANSPARENCY_DISCLAIMER =
  "We don't have access to official VAR data \u2014 nobody does, it's not public. So our AI reasons from the official rules and real referee reports, and we're transparent about that uncertainty instead of pretending to know more than we do."

export default function TransparencyNote({ className = '' }) {
  return (
    <aside
      className={`rounded-lg border border-accent-gold/35 bg-accent-gold/10 px-5 py-4 ${className}`}
    >
      <blockquote className="m-0 border-none p-0">
        <p className="text-sm text-gray-200 leading-relaxed text-left italic">
          &ldquo;{TRANSPARENCY_DISCLAIMER}&rdquo;
        </p>
      </blockquote>
    </aside>
  )
}
