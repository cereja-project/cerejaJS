import { useState } from "react";
import { Slider } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
export function Example() {
  const [number, setNumber] = useState(40);
  return (
    <Slider
      label="Volume"
      min={0}
      max={100}
      step={5}
      value={number}
      valueText={`${number}%`}
      onValueChange={setNumber}
    />
  );
}
