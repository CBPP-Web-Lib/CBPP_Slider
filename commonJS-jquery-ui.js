var fs = require("fs");
function fixFile(path, $) {
  var file = fs.readFileSync(path);
  fs.writeFileSync(path.replace(".js","") + "_commonJS.js", "module.exports=function(" + $ + ") {" + file + "};");
}
fixFile(require.resolve('jquery-ui'), "jQuery");
fixFile(require.resolve("jquery-ui-touch-punch"), "jQuery");
