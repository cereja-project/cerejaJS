import { useRef, useState } from "react";
import * as D from "@radix-ui/react-dropdown-menu";
import { Button } from "./Button";
export interface MenuItem {
  id: string;
  label: string;
  checked?: boolean;
  disabled?: boolean;
  onSelect: () => void;
}
export function Menu({
  label,
  items,
  portalContainer,
}: {
  label: string;
  items: MenuItem[];
  portalContainer?: HTMLElement | null;
}) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const container =
    portalContainer ??
    trigger.current?.closest<HTMLElement>("[data-media-player]") ??
    undefined;
  return (
    <D.Root open={open} onOpenChange={setOpen}>
      <D.Trigger asChild>
        <Button ref={trigger}>
          {label}
          <span aria-hidden="true"> ▾</span>
        </Button>
      </D.Trigger>
      <D.Portal container={container}>
        <D.Content className="md-menu" sideOffset={6} aria-label={label}>
          {items.map((item) =>
            typeof item.checked === "boolean" ? (
              <D.CheckboxItem
                className="md-menu-item"
                key={item.id}
                checked={item.checked}
                disabled={item.disabled}
                onSelect={item.onSelect}
              >
                <D.ItemIndicator aria-hidden="true">✓ </D.ItemIndicator>
                {item.label}
              </D.CheckboxItem>
            ) : (
              <D.Item
                className="md-menu-item"
                key={item.id}
                disabled={item.disabled}
                onSelect={item.onSelect}
              >
                {item.label}
              </D.Item>
            ),
          )}
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}
