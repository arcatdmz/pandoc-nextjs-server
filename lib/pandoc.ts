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
    let result = "";

    const onStdOutData = function (data: string) {
      result += data;
    };

    const onStdOutEnd = function () {
      r({
        success: true,
        result,
      });
    };

    const onStdErrData = function (error: string) {
      r({
        success: false,
        error,
      });
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
      args.push(...["-t", format, "-o", dest]);

      const pdSpawn = spawn("pandoc", args);
      pdSpawn.stdout.on("data", onStdOutData);
      pdSpawn.stdout.on("end", onStdOutEnd);
      pdSpawn.stderr.on("data", onStdErrData);
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
