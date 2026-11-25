import { useMediaConfig } from "../config";
export function Breadcrumbs({
  label,
  items,
}: {
  label?: string;
  items: Array<{ label: string; href?: string }>;
}) {
  const { labels } = useMediaConfig();
  return (
    <nav aria-label={label ?? labels.breadcrumbs} className="md-breadcrumbs">
      <ol>
        {items.map((item, i) => (
          <li key={`${i}:${item.label}`}>
            {i > 0 && <span aria-hidden="true">/</span>}
            {i === items.length - 1 ? (
              <span aria-current="page">{item.label}</span>
            ) : item.href ? (
              <a href={item.href}>{item.label}</a>
            ) : (
              <span>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
