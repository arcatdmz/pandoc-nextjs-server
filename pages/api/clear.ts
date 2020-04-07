import { NextApiRequest, NextApiResponse } from "next";
import { resolve } from "path";
import { unlink } from "fs";
import sanitize from "sanitize-filename";

import appConfig from "./_config";

export const config = {
  api: {
    bodyParser: true,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // get file name
  const { file } = req.body;
  if (typeof file !== "string") {
    res.json({
      success: false,
      error: "File not specified",
    });
    return;
  }

  // sanitize file name
  const sanitized = sanitize(file);
  if (sanitized !== file || file.endsWith(".meta.json")) {
    res.json({
      success: false,
      error: "Unsafe file name specified",
    });
    return;
  }

  // remove the specified file
  const sanitizedPath = resolve(appConfig.uploadDir, sanitized);
  unlink(sanitizedPath, (err) => {
    if (err) {
      res.json({
        success: false,
        error: err.message,
      });
      return;
    }
    res.json({
      success: true,
    });
  });
};

export default handler;
