import { resolve } from "path";
import { readFile } from "fs";
import sanitize from "sanitize-filename";

import appConfig from "./config";

export async function readMetaFile(file: string): Promise<any> {
  // get file name
  if (typeof file !== "string") {
    throw new Error("File not specified");
  }

  // sanitize file name
  const sanitized = sanitize(file);
  if (sanitized !== file) {
    throw new Error("Unsafe file name specified");
  }

  // return file status
  const sanitizedPath = resolve(appConfig.uploadDir, `${sanitized}.meta.json`);
  return new Promise((r) =>
    readFile(sanitizedPath, (err, data) => {
      if (err) {
        throw new Error("File not found");
      }
      const status = JSON.parse(data.toString());
      r(status);
    })
  );
}
