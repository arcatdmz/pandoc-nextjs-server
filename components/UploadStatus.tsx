import { FC, useCallback } from "react";
import { useStyletron } from "baseui";
import { Button } from "baseui/button";
import { ListItem, ListItemLabel } from "baseui/list";

import appConfig from "../pages/api/_config";

export interface IStatus {
  name: string;
  format: string;
  date: string;
  success?: boolean;
  error?: string;
  result?: string;
}

interface IProps {
  status: IStatus;
  onDownload(name: string): void;
}

export const UploadStatus: FC<IProps> = ({
  status: { name, format, date, success },
  onDownload,
}) => {
  const [css] = useStyletron();
  const handleClick = useCallback(() => {
    onDownload(name);
  }, [status]);
  return (
    <ul
      className={css({
        paddingLeft: 0,
      })}
    >
      <ListItem>
        <ListItemLabel description="Status">
          {typeof success === "boolean"
            ? success
              ? "Succeeded"
              : "Failed"
            : "Processing"}
        </ListItemLabel>
      </ListItem>
      <ListItem>
        <ListItemLabel description="Date updated">
          {new Date().toLocaleString()}
        </ListItemLabel>
      </ListItem>
      <ListItem>
        <ListItemLabel description="Date created">
          {new Date(date).toLocaleString()}
        </ListItemLabel>
      </ListItem>
      <ListItem>
        <ListItemLabel description="Destination format">
          {appConfig.formats.find((f) => f.value === format).id}
        </ListItemLabel>
      </ListItem>
      <ListItem>
        <ListItemLabel>
          <Button onClick={handleClick} disabled={!success}>
            Proceed to download
          </Button>
        </ListItemLabel>
      </ListItem>
    </ul>
  );
};
