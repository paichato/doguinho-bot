// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const venom = require("venom-bot");
var express = require("express");
var cors = require("cors");
var useragent = require("express-useragent");

const app = express();
app.use(cors());
app.use(express.json());
app.use(useragent.express());

app.listen(3334, () => {
  console.log("🚀SERVER STARTED ON PORT 3333..");
});

venom
  .create({
    session: "session-name", //name of session
    multidevice: true, // for version not multidevice use false.(default: true)
  })
  .then((client) => {
    start(client);

    app.post("/code", async (req, res) => {
      const { msg, phonenumber } = req.body;

      if (!msg) {
        //erro something is wrong
        return res.send("Erro: parametros em falta");
        console.log("erro: sem parametros");
      }

      if (msg.toLowerCase().includes("code")) {
        console.log("o codigo e:", msg.split(",")[1]);
        client
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
        client.getAllChatsContacts().then((result) => {
          return res.send(result);
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
          console.log("Result: ", result); //return object success
        })
        .catch((erro) => {
          console.error("Error when sending: ", erro); //return object error
        });
    }

    if (message.body.toLowerCase() === "menu" && message.isGroupMsg === false) {
      const buttons = [
        {
          buttonText: {
            displayText: "Text of Button 1",
          },
        },
        {
          buttonText: {
            displayText: "Text of Button 2",
          },
        },
      ];

      client
        .sendButtons(message.from, "Title", buttons, "Description")
        .then((result) => {
          console.log("Result: ", result); //return object success
        })
        .catch((erro) => {
          console.error("Error when sending: ", erro); //return object error
        });
    }
  });
}
