import { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm } from "formidable";
import { v4 as uuidv4 } from "uuid";
import { extname, resolve } from "path";
import { unlink } from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // use formidable to parse form data
  const form = new IncomingForm();
  form.uploadDir = "./uploads";
  form.keepExtensions = true;
  form.on("fileBegin", (_name: string, file) => {
    // rename the uploaded file using UUID v4
    const ext = extname(file.name);
    const name = `${uuidv4()}${ext}`;
    file.name = name;
    file.path = resolve(form.uploadDir, name);
  });

  form.parse(req, (err, _fields, filesMap) => {
    if (err) {
      res.json({
        success: false,
        error: err,
      });
      return;
    }

    // check uploaded files
    const files = Object.values(filesMap);
    if (files.length > 1) {
      Promise.all(files.map((file) => new Promise((r) => unlink(file.path, r))))
        .catch((err) => {
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

    // return the name of the uploaded file
    const { name } = files[0];
    res.json({
      success: true,
      name,
    });
  });
};

export default handler;
