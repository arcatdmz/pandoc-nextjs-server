import { spawn } from "child_process";
import { stat, Stats } from "fs";

interface IPandocResult {
  success: boolean;
  error?: string;
  result?: string;
}

export async function pandoc(
  src: string,
  dest: string,
  format: string,
  args: string[] = []
): Promise<IPandocResult> {
  return new Promise<IPandocResult>((r) => {
    let stdOut = "",
      stdErr = "";

    const onStdOutData = function (data: Buffer) {
      stdOut += data.toString();
    };
    const onStdErrData = function (data: Buffer) {
      stdErr += data.toString();
    };

    const onStatCheck = function (err: Error, stats: Stats) {
      if (err || !stats.isFile()) {
        r({
          success: false,
          error: err.message,
        });
        return;
      }
      args.unshift(src);

      // set special parameters for PDF output
      if (format === "pdf") {
        args.push(
          "-V",
          "documentclass=ltjarticle",
          "-V",
          "classoption=a4j",
          "-V",
          "geometry:margin=1in",
          "--pdf-engine=lualatex"
        );
      } else {
        args.push("-t", format);
      }

      args.push("-o", dest);

      const pdSpawn = spawn("pandoc", args);
      pdSpawn.stdout.on("data", onStdOutData);
      pdSpawn.stderr.on("data", onStdErrData);
      pdSpawn.on("exit", (code) => {
        const success = code === 0;
        r({
          success,
          result: stdOut,
          error: stdErr,
        });
      });
      pdSpawn.on("error", (err) =>
        r({
          success: false,
          error: err.message,
        })
      );
    };

    stat(src, onStatCheck);
  });
}
