import { app } from "electron";
import path from "path";

export default function getCurrentDirectory() {
  let currentDirectory;

  const directoryOption = process.argv.filter((arg) => {
    return arg.startsWith("--directory=");
  });

  if (directoryOption.length > 0) {
    currentDirectory = directoryOption.shift().split("=")[1];
    if (currentDirectory.startsWith("~")) {
      currentDirectory = currentDirectory.replace("~", process.env.HOME);
    }
    currentDirectory = path.resolve(currentDirectory);
  } else if (process.env.PORTABLE_EXECUTABLE_DIR) {
    currentDirectory = process.env.PORTABLE_EXECUTABLE_DIR;
  } else if (process.env.INIT_CWD) {
    currentDirectory = process.env.INIT_CWD;
  } else if (app.getPath("exe")) {
    currentDirectory = path.dirname(app.getPath("exe"));
  } else if (process.execPath) {
    currentDirectory = process.execPath;
  }
  if (path.basename(currentDirectory) === "MacOS") {
    currentDirectory = path.resolve(currentDirectory, "..", "..", "..");
  }

  return currentDirectory;
}
