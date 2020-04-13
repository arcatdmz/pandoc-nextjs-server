import { FC, useCallback, useState } from "react";
import axios from "axios";
import { useStyletron } from "baseui";
import { Button } from "baseui/button";
import { ListItem, ListItemLabel } from "baseui/list";

import appConfig from "../lib/config";
import { IStatus } from "../lib/writeMetaFile";

interface IProps {
  status: IStatus;
  onSubmit(): void;
}

// FIXME add form elements to input filter, openings, and endings
export const ScrapboxForm: FC<IProps> = ({
  status: { name, format, date },
  onSubmit,
}) => {
  const [posting, setPosting] = useState<boolean>(false);
  const [css] = useStyletron();

  const handleClick = useCallback(async () => {
    setPosting(true);
    try {
      const res = await axios.post(
        "/api/scrapbox",
        {
          file: name,
        },
        {
          responseType: "json",
        }
      );
      if (res.data && res.data.success) {
        onSubmit();
      }
    } catch (e) {
      // something wrong happened
    }
    setPosting(false);
  }, [status]);

  return (
    <ul
      className={css({
        paddingLeft: 0,
      })}
    >
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
          <Button onClick={handleClick} disabled={posting}>
            Convert
          </Button>
        </ListItemLabel>
      </ListItem>
    </ul>
  );
};
