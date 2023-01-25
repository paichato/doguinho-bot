// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const venom = require("venom-bot");
const fs = require("fs");
var express = require("express");
var cors = require("cors");
var useragent = require("express-useragent");
const port = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());
app.use(useragent.express());

app.listen(port, () => {
  console.log("🚀SERVER STARTED ON PORT 3333..");
});

venom
  .create("session-name", (base64Qr, asciiQR) => {
    console.log(asciiQR);
    exportQR(base64Qr, "qr.png");
  })
  .then((client) => {
    start(client);

    app.post("/code", async (req, res) => {
      const { msg, phonenumber } = req.body;

      if (!msg) {
        return res.send("Erro: parametros em falta");
      }

      if (msg.toLowerCase().includes("code")) {
        console.log("o codigo e:", msg.split(",")[1]);
        return client
          .sendText(
            `${phonenumber + "@c.us"}`,
            `O seu codigo OTP e:" ${msg.split(",")[1]}`
          )
          .then((result) => {
            console.log(result);
            if (result.status !== 200) {
              return res.send(result.text);
            }
            res.send("code sent");
          })
          .catch((error) => {
            console.log(error);
            res.send(error);
          });
      }
      if (msg.toLowerCase().startsWith("/contacts")) {
        return client
          .getAllChatsContacts()
          .then((result) => {
            return res.send(result);
          })
          .catch((err) => {
            res.send(err);
          });
      }
    });
  })
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {
  client.onMessage((message) => {
    if (message.body === "Ola" && message.isGroupMsg === false) {
      client
        .sendText(
          message.from,
          "Ola, seja bem vindo a Doguinho. Eu serei o seu assistente pessoal."
        )
        .then((result) => {
          console.log("Result: ", result);
        })
        .catch((erro) => {
          console.error("Error when sending: ", erro);
        });
    }

    if (message.body.toLowerCase() === "code" && message.isGroupMsg === false) {
      client
        .sendText(message.from, "Boa tentativa 😂")
        .then((result) => {
          console.log("Result: ", result);
        })
        .catch((erro) => {
          console.error("Error when sending: ", erro);
        });
    }
  });
}

function exportQR(qrCode, path) {
  qrCode = qrCode.replace("data:image/png;base64,", "");
  const imageBuffer = Buffer.from(qrCode, "base64");
  fs.writeFileSync(path, imageBuffer);
}
