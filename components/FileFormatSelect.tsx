import { FC, useCallback, useState } from "react";
import { Select, Value, OnChangeParams } from "baseui/select";

import appConfig from "../lib/config";

interface IProps {
  onSelect(value: IFileFormat): void;
}

export interface IFileFormat {
  id: string;
  value: string;
}

export const formats: IFileFormat[] = appConfig.formats;

export const FileFormatSelect: FC<IProps> = ({ onSelect }) => {
  const [value, setValue] = useState<Value>([formats[0]]);
  const handleChange = useCallback(
    ({ value: selected }: OnChangeParams) => {
      setValue(selected);
      onSelect((selected[0] as unknown) as IFileFormat);
    },
    [onSelect]
  );
  return (
    <Select
      options={formats}
      labelKey="id"
      valueKey="value"
      onChange={handleChange}
      value={value}
    />
  );
};
