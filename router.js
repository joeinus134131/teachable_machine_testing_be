const express = require("express");
const app = express();
const router = express.Router();
const upload = require("./uploadMiddlewire");
const TeachableMachine = require("@sashido/teachablemachine-node");

router.get("/", async function (req, res) {
  await res.render("index");
});

const model = new TeachableMachine({
  modelUrl: "https://teachablemachine.withgoogle.com/models/eQ4S7z1go/",
});

router.post("/post", upload.single("image"), async function (req, res) {
  if (!req.file) {
    res.status(401).json({ error: "Please provide an image" });
  }

  const mimetype = req.file.originalname.split(".").pop();
  const base64Img = Buffer.from(req.file.buffer).toString("base64");
  const imagDataUrl = `data:image/${mimetype};base64,` + base64Img;

  console.log("Got the file");
  return model
    .classify({
      imageUrl: imagDataUrl,
    })
    .then((predictions) => {
      res.json(predictions);
    })
    .catch((e) => {
      res.status(500).send("Something went wrong!");
    });
});

module.exports = router;
