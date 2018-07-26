var fs = require("fs");
function fixFile(path, $) {
  var file = fs.readFileSync(path);
  fs.writeFileSync(path.replace(".js","") + "_commonJS.js", "module.exports=function(" + $ + ") {" + file + "};");
}
fixFile("./node_modules/jquery-ui-dist/jquery-ui.js", "jQuery");
fixFile("./node_modules/jquery-ui-touch-punch/jquery.ui.touch-punch.js", "jQuery");

/*TO DO: figure out how to do a post request in node

version: 1.12.1
widget: on
keycode: on
widgets/mouse: on
widgets/slider: on
theme: none
theme-folder-name: no-theme
scope: 

https://download.jqueryui.com/download

*/