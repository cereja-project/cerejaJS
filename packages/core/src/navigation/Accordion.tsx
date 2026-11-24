import { useId, useState, type ReactNode } from "react";
export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  disabled?: boolean;
}
export interface AccordionProps {
  items: AccordionItem[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}
export function Accordion({
  items,
  value,
  defaultValue = [],
  onValueChange,
}: AccordionProps) {
  const [internal, setInternal] = useState(defaultValue),
    id = useId(),
    open = value ?? internal;
  return (
    <div className="md-accordion">
      {items.map((item, i) => {
        const expanded = open.includes(item.id);
        return (
          <div className="md-accordion-item" key={item.id}>
            <h3 className="md-accordion-heading">
              <button
                type="button"
                id={`${id}-trigger-${i}`}
                disabled={item.disabled}
                aria-expanded={expanded}
                aria-controls={`${id}-content-${i}`}
                onClick={() => {
                  const next = expanded
                    ? open.filter((v) => v !== item.id)
                    : [...open, item.id];
                  if (value === undefined) setInternal(next);
                  onValueChange?.(next);
                }}
              >
                {item.title}
                <span aria-hidden="true">{expanded ? "−" : "+"}</span>
              </button>
            </h3>
            <div
              id={`${id}-content-${i}`}
              aria-labelledby={`${id}-trigger-${i}`}
              hidden={!expanded}
              className="md-accordion-panel"
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
