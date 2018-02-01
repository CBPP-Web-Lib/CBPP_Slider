var fs = require("fs");
function fixFile(path, $) {
  var file = fs.readFileSync(path);
  fs.writeFileSync(path.replace(".js","") + "_commonJS.js", "module.exports=function(" + $ + ") {" + file + "};");
}
fixFile("./node_modules/jquery-ui-dist/jquery-ui.js", "jQuery");
fixFile("./node_modules/jquery-ui-touch-punch/jquery.ui.touch-punch.js", "jQuery");
