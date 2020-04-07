import { NextApiRequest, NextApiResponse } from "next";
import { resolve } from "path";
import { lstat } from "fs";
import sanitize from "sanitize-filename";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // get file name
  const { file } = req.query;
  if (typeof file !== "string") {
    res.json({
      success: false,
      error: "File not specified",
    });
    return;
  }

  // sanitize file name
  const sanitized = sanitize(file);
  if (sanitized.length <= 0) {
    res.json({
      success: false,
      error: "Unsafe file name specified",
    });
    return;
  }

  // check file status
  const sanitizedPath = resolve("uploads", sanitized);
  lstat(sanitizedPath, (err) => {
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
