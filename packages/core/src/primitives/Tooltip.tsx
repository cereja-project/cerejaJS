import * as T from "@radix-ui/react-tooltip";
import type { ReactElement } from "react";
export function Tooltip({
  content,
  children,
}: {
  content: string;
  children: ReactElement;
}) {
  return (
    <T.Provider>
      <T.Root>
        <T.Trigger asChild>{children}</T.Trigger>
        <T.Portal>
          <T.Content className="md-tooltip" sideOffset={6}>
            {content}
          </T.Content>
        </T.Portal>
      </T.Root>
    </T.Provider>
  );
}
