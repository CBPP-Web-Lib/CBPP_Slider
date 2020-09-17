try {

  var fs = require("fs");
  function fixFile(path, $) {
    var file = fs.readFileSync(path);
    fs.writeFileSync(path.replace(".js","") + "_commonJS.js", "module.exports=function(" + $ + ") {" + file + "};");
  }

  /*get jquery ui*/

  const https = require("https");
  const querystring = require("querystring");
  const unzip = require("extract-zip");
  var jquery_ui_write_stream = fs.createWriteStream(__dirname + "/jquery-ui.zip");
  var postData = querystring.stringify({
    "version": "1.12.1",
    "widget": "on",
    "keycode": "on",
    "widgets/mouse": "on",
    "widgets/slider": "on",
    "theme": "none",
    "theme-folder-name": "no-theme"
  });
  var jquery_ui_req = https.request({
    host: 'download.jqueryui.com',
    port: 443,
    method: 'POST',
    path: '/download',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length
    }
  }, (res) => {
    res.on("data", (d) => {
      jquery_ui_write_stream.write(d);
    });
    res.on("end", () => {
      unzip(__dirname + "/jquery-ui.zip", {dir: __dirname}, (err) => {
        fixFile(__dirname + "/jquery-ui-1.12.1.custom/jquery-ui.min.js","jQuery");
      });
    });
  });
  jquery_ui_req.write(postData);
  jquery_ui_req.end();

  /*get touch punch*/
  var touch_punch_stream = fs.createWriteStream(__dirname + "/jquery-ui.touch_punch.min.js"); 
  var touch_punch_req = https.get("https://raw.githubusercontent.com/furf/jquery-ui-touch-punch/master/jquery.ui.touch-punch.min.js", (res) => {
    res.on("data", (d) => {
      touch_punch_stream.write(d);
    });
    res.on("end", () => {
      fixFile(__dirname + "/jquery-ui.touch_punch.min.js", "jQuery");
    });
  });

} catch (ex) {
  console.error(ex);
}

