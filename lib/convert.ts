import { unlink } from "fs";

import { pandoc } from "./pandoc";
import { writeMetaFile, IStatus } from "./writeMetaFile";
import { parseScrapbox } from "./scrapbox";

export async function convert(
  src: string,
  dest: string,
  format: string,
  status: IStatus
): Promise<void> {
  // check if source is a JSON file exported from Scrapbox
  const sb = await parseScrapbox(src);
  if (sb) {
    status.scrapbox = true;
    writeMetaFile(status);
    return;
  }

  // convert with pandoc
  return pandoc(src, dest, format, []).then((res) => {
    status.success = res.success;
    status.error = res.error;
    status.result = res.result;

    // update meta file
    writeMetaFile(status);

    // clean up source file
    unlink(src, (_err) => {
      // do nothing on clean up error
    });
  });
}
