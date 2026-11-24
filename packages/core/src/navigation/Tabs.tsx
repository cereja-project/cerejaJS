import {
  useId,
  useRef,
  useState,
  type ReactNode,
  type KeyboardEvent,
} from "react";
export interface TabItem {
  value: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}
export interface TabsProps {
  label: string;
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
}
export function Tabs({
  label,
  items,
  value,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
}: TabsProps) {
  const id = useId(),
    [internal, setInternal] = useState(
      defaultValue ?? items.find((t) => !t.disabled)?.value,
    ),
    [focused, setFocused] = useState<string | null>(null);
  const refs = useRef(new Map<string, HTMLButtonElement>());
  const enabled = items.filter((t) => !t.disabled);
  const requested = value ?? internal,
    selected = enabled.some((t) => t.value === requested)
      ? requested
      : enabled[0]?.value;
  const focusValue = enabled.some((t) => t.value === focused)
    ? focused
    : selected;
  function activate(next: string) {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  }
  function key(e: KeyboardEvent<HTMLButtonElement>, current: string) {
    const index = enabled.findIndex((t) => t.value === current);
    let target: string | undefined;
    if (e.key === "Home") target = enabled[0]?.value;
    else if (e.key === "End") target = enabled.at(-1)?.value;
    else if (
      e.key === (orientation === "horizontal" ? "ArrowRight" : "ArrowDown")
    )
      target = enabled[(index + 1) % enabled.length]?.value;
    else if (e.key === (orientation === "horizontal" ? "ArrowLeft" : "ArrowUp"))
      target = enabled[(index - 1 + enabled.length) % enabled.length]?.value;
    if (target) {
      e.preventDefault();
      setFocused(target);
      refs.current.get(target)?.focus();
    }
  }
  return (
    <div className="md-tabs">
      <div
        role="tablist"
        aria-label={label}
        aria-orientation={orientation}
        className="md-tablist"
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node))
            setFocused(null);
        }}
      >
        {items.map((tab, i) => (
          <button
            type="button"
            role="tab"
            key={tab.value}
            id={`${id}-tab-${i}`}
            aria-controls={`${id}-panel-${i}`}
            aria-selected={selected === tab.value}
            disabled={tab.disabled}
            tabIndex={!tab.disabled && focusValue === tab.value ? 0 : -1}
            ref={(node) => {
              if (node) refs.current.set(tab.value, node);
              else refs.current.delete(tab.value);
            }}
            onFocus={() => setFocused(tab.value)}
            onKeyDown={(e) => key(e, tab.value)}
            onClick={() => activate(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {items.map((tab, i) => (
        <div
          key={tab.value}
          id={`${id}-panel-${i}`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${i}`}
          tabIndex={0}
          hidden={selected !== tab.value}
          className="md-tabpanel"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
