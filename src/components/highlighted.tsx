export function Highlighted({
  text,
  needles,
}: {
  text: string;
  needles: string[];
}) {
  const unique = [...new Set(needles.filter((n) => n && n.length > 1))];
  if (!unique.length) return <>{text}</>;

  const escaped = unique.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(re);

  return (
    <>
      {parts.map((part, i) =>
        unique.some((n) => n.toLowerCase() === part.toLowerCase()) ? (
          <mark key={`${part}-${i}`} className="rounded-xs bg-mark text-ink">
            {part}
          </mark>
        ) : (
          <span key={`${part}-${i}`}>{part}</span>
        ),
      )}
    </>
  );
}
