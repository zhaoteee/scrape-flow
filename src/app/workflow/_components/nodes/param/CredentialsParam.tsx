"use client";

import getCredentialsForUser from "@/actions/credentials/getCredentialsForUser";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OptionItem, ParamProps } from "@/types/appNode";
import { useQuery } from "@tanstack/react-query";
import { useId } from "react";

export default function CredentialsParam({
  param,
  updateNodeParamValue,
  value,
}: ParamProps) {
  const id = useId();
  const query = useQuery({
    queryKey: ["credentials-for-users"],
    queryFn: () => getCredentialsForUser(),
    refetchInterval: 10000,
  });
  return (
    <div className="flex flex-col gap-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <p className="text-red-400 px-2">*</p>}
      </Label>
      <Select
        onValueChange={(value) => updateNodeParamValue(value)}
        defaultValue={value}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {query.data?.map((credential) => {
              return (
                <SelectItem key={credential.id} value={credential.id}>
                  {credential.name}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
