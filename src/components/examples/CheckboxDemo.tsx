import { useState } from "react";
import { Checkbox, CheckboxWithLabel } from "@/components/ui/checkbox";
import { CheckboxGroup } from "@/components/ui/checkbox-group";

export function CheckboxDemo() {
  const [groupValues, setGroupValues] = useState<string[]>([]);

  return (
    <div className="space-y-8">
      {/* Basic Checkboxes */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Basic Checkboxes</h3>
        <div className="flex space-x-4">
          <Checkbox />
          <Checkbox checked />
          <Checkbox indeterminate />
          <Checkbox disabled />
          <Checkbox checked disabled />
        </div>
      </div>

      {/* Labeled Checkboxes */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Labeled Checkboxes</h3>
        <div className="space-y-2">
          <CheckboxWithLabel label="Right Label" id="right-label" />
          <CheckboxWithLabel
            label="Left Label"
            labelPosition="left"
            id="left-label"
          />
        </div>
      </div>

      {/* Checkbox Group */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Checkbox Group</h3>
        <CheckboxGroup
          label="Pizza Toppings"
          options={[
            { id: "pepperoni", label: "Pepperoni" },
            { id: "mushrooms", label: "Mushrooms" },
            { id: "onions", label: "Onions" },
            { id: "sausage", label: "Sausage" },
            { id: "bacon", label: "Bacon" },
          ]}
          values={groupValues}
          onChange={setGroupValues}
        />
      </div>
    </div>
  );
}