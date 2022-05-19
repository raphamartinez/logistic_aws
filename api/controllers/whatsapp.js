const fs = require("fs");

module.exports = app => {

    app.get('/checkauth', async (req, res, next) => {
        try {

            client
                .getState()
                .then((data) => {
                    console.log(data);
                    res.send(data);
                })
                .catch((err) => {
                    if (err) {
                        res.send("DISCONNECTED");
                    }
                })
        } catch (err) {
            next(err)
        }
    })

    app.get('/getqr', async (req, res, next) => {
        try {
            client
                .getState()
                .then((data) => {
                    if (data) {
                        res.write("<html><body><h2>Already Authenticated</h2></body></html>");
                        res.end();
                    } else sendQr(res);
                })
                .catch((err) => {
                    console.log(err);
                    sendQr(res)
                })
        } catch (err) {
            next(err)
        }
    })

    function sendQr(res) {
        fs.readFile("./last.qr", (err, last_qr) => {
            if (!err && last_qr) {
                const page = `
                          <html>
                              <body>
                                  <script type="module">
                                  </script>
                                  <div id="qrcode"></div>
                                  <script type="module">
                                      import QrCreator from "https://cdn.jsdelivr.net/npm/qr-creator/dist/qr-creator.es6.min.js";
                                      let container = document.getElementById("qrcode");
                                      QrCreator.render({
                                          text: "${last_qr}",
                                          radius: 0.5, // 0.0 to 0.5
                                          ecLevel: "H", // L, M, Q, H
                                          fill: "#536DFE", // foreground color
                                          background: null, // color or null for transparent
                                          size: 256, // in pixels
                                      }, container);
                                  </script>
                              </body>
                          </html>
                      `;
                res.write(page);
                res.end();
            }
        });
    }

}