import { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm } from "formidable";
import { v4 as uuidv4 } from "uuid";
import { extname, resolve } from "path";
import { unlink } from "fs";

import appConfig from "../../lib/config";
import { writeMetaFile, IStatus } from "../../lib/writeMetaFile";
import { convert } from "../../lib/convert";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // use formidable to parse form data
  const form = new IncomingForm();
  form.uploadDir = appConfig.uploadDir;
  form.keepExtensions = true;
  let originalName: string = "";
  form.on("fileBegin", (_name: string, file) => {
    // rename the uploaded file using UUID v4
    originalName = file.name;
    const ext = extname(file.name);
    const name = `${uuidv4()}${ext}`;
    file.name = name;
    file.path = resolve(form.uploadDir, name);
  });

  form.parse(req, (err, fields, filesMap) => {
    if (err) {
      res.json({
        success: false,
        error: err,
      });
      return;
    }
    if (!fields || typeof fields.format !== "string") {
      res.json({
        success: false,
        error: "Destination file format not specified",
      });
      return;
    }
    const format = appConfig.formats.find((f) => f.value === fields.format);
    if (!format) {
      res.json({
        success: false,
        error: "Unknown destination file format specified",
      });
      return;
    }

    // check uploaded files
    const files = Object.values(filesMap);
    if (files.length > 1) {
      Promise.all(files.map((file) => new Promise((r) => unlink(file.path, r))))
        .catch((_err) => {
          // do nothing for file deletion errors
        })
        .finally(() =>
          res.json({
            success: false,
            error: "Multiple files were uploaded",
          })
        );
      return;
    }
    const { name, path } = files[0];

    // write meta file
    const status: IStatus = {
      name,
      originalName,
      format: format.value,
      date: new Date().toISOString(),
    };
    writeMetaFile(status).then((err) => {
      // clean up on error
      if (err) {
        res.json({
          success: false,
          error: "Writing a meta file failed",
        });
        unlink(path, (_err) => {
          // do nothing on clean up error
        });
        return;
      }

      // return the name of the uploaded file
      res.json({
        success: true,
        name,
      });

      // start conversion
      convert(
        path,
        `${path}.${format.ext || format.value}`,
        format.value,
        status
      );
    });
  });
};

export default handler;
