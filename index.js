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

app.post("/code", (req, res) => {
  const { msg } = req.body;

  if (!msg) {
    //erro something is wrong
  }

  if (msg.toLowerCase().includes("code")) {
    console.log("o codigo e:", msg.split(",")[1]);
  }
});
