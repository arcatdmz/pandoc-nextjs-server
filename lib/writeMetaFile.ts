import { resolve } from "path";
import { writeFile } from "fs";

import appConfig from "./config";

export interface IStatus {
  name: string;
  originalName: string;
  format: string;
  date: string;
  success?: boolean;
  error?: string;
  result?: string;
}

export async function writeMetaFile(status: IStatus): Promise<Error> {
  const { name } = status;
  return new Promise((r) => {
    writeFile(
      resolve(appConfig.uploadDir, `${name}.meta.json`),
      JSON.stringify(status),
      { encoding: "utf8" },
      r
    );
  });
}
