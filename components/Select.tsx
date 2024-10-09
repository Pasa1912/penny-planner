"use client";

import { useCallback, useMemo } from "react";
import { SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";

export type Option = { label: string; value: string };

type Props = {
  onChange: (value?: string) => void;
  onCreate?: (value: string) => void;
  value?: string | null | undefined;
  options: Array<Option>;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
};

export const Select = ({
  options,
  value,
  onChange,
  onCreate,
  disabled,
  required,
  placeholder,
}: Props): JSX.Element => {
  const onSelect = useCallback(
    (option: SingleValue<Option>) => onChange(option?.value),
    [onChange]
  );

  const formattedValue = useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  );

  return (
    <CreatableSelect
      placeholder={placeholder}
      className="text-sm h-10"
      value={formattedValue}
      options={options}
      onChange={onSelect}
      onCreateOption={onCreate}
      isDisabled={disabled}
      required={required}
    />
  );
};
