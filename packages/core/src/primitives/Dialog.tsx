import * as D from "@radix-ui/react-dialog";
import { useId, type ReactNode } from "react";
import { useMediaConfig } from "../config";
import { Button } from "./Button";
export function Dialog({
  title,
  description,
  open,
  onOpenChange,
  children,
  trigger,
  onCloseAutoFocus,
  onOpenAutoFocus,
}: {
  title: string;
  description?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  trigger?: ReactNode;
  onCloseAutoFocus?: (event: Event) => void;
  onOpenAutoFocus?: (event: Event) => void;
}) {
  const { labels } = useMediaConfig();
  const descriptionId = useId();
  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <D.Trigger asChild>{trigger}</D.Trigger>}
      <D.Portal>
        <D.Overlay className="md-overlay" />
        <D.Content
          className="md-dialog"
          aria-describedby={description ? descriptionId : undefined}
          onCloseAutoFocus={onCloseAutoFocus}
          onOpenAutoFocus={onOpenAutoFocus}
        >
          <header className="md-dialog-header">
            <D.Title>{title}</D.Title>
            <D.Close asChild>
              <Button>{labels.close}</Button>
            </D.Close>
          </header>
          {description && (
            <D.Description id={descriptionId}>{description}</D.Description>
          )}
          {children}
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}
