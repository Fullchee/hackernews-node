var exec = require("child_process").exec;

var os = require("os");
//control OS
//then run command depengin on the OS

if (os.type() === "Linux") {
  exec("yarn run linux-start", console.log);
} else if (os.type() === "Darwin") {
  exec("yarn run mac-start", console.log);
}
// else if (os.type() === "Windows_NT") exec("node start-windows.js", puts);
else {
  throw new Error("Unsupported OS found: " + os.type());
}
