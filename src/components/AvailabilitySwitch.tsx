"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function AvailabilitySwitch({
  defaultValue = true,
}: {
  defaultValue?: boolean;
}) {
  const [checked, setChecked] = useState(defaultValue);

  return (
    <div className="grid gap-2">
      <Label className="text-sm font-semibold">Status Menu</Label>

      <div className="flex items-center gap-2">
        <Switch
          id="isAvailable"
          checked={checked}
          onCheckedChange={setChecked}
        />
        <label htmlFor="isAvailable" className="text-sm">
          {checked ? "Tersedia" : "Tidak tersedia"}
        </label>
      </div>

      <input
        type="hidden"
        name="isAvailable"
        value={checked ? "true" : "false"}
      />
    </div>
  );
}
