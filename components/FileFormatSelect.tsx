import { FC, useCallback, useState } from "react";
import { Select, Value, OnChangeParams } from "baseui/select";

interface IProps {
  onSelect(value: IFileFormat): void;
}

export interface IFileFormat {
  id: string;
  value: string;
}

export const formats: IFileFormat[] = [
  { id: "Adobe PDF (.pdf)", value: "pdf" },
  { id: "HTML (.html)", value: "html" },
  { id: "GitHub-Flavored Markdown (.md)", value: "gfm" },
  { id: "Pandoc's Markdown (.md)", value: "markdown" },
  { id: "reStructuredText (.rst)", value: "rst" },
  { id: "Rich Text Format (.rtf)", value: "rtf" },
  { id: "Microsoft Word (.docx)", value: "docx" },
];

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
