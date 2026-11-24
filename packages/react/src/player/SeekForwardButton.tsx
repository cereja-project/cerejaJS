import { SeekButton } from "./SeekBackButton";
export function SeekForwardButton({ seconds }: { seconds?: number }) {
  return <SeekButton seconds={seconds} direction={1} />;
}
