import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ParamProps } from "@/types/appNode";
import React, { useEffect, useId, useState } from "react";

function StringParam({
  param,
  value,
  updateNodeParamValue,
  disabled,
}: ParamProps) {
  const id = useId();
  const [internalValue, setInternalValue] = useState(value || "");
  useEffect(() => {
    setInternalValue(value || "");
  }, [value]);
  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <p className="text-red-400 px-2">*</p>}
      </Label>
      {param.variant ? (
        <Textarea
          id={id}
          disabled={disabled}
          value={internalValue}
          onChange={(e) => setInternalValue(e.target.value)}
          onBlur={() => updateNodeParamValue(internalValue)}
        />
      ) : (
        <Input
          disabled={disabled}
          id={id}
          value={internalValue}
          onChange={(e) => setInternalValue(e.target.value)}
          onBlur={() => updateNodeParamValue(internalValue)}
        />
      )}
      {param.helperText && (
        <p className="text-muted-foreground px-2">{param.helperText}</p>
      )}
    </div>
  );
}

export default StringParam;
