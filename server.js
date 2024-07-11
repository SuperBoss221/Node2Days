const i = 10;
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const control = require("./controllers/control");
const memberControllers = require("./controllers/memberControllers");
const key = "boss";
const cors = require("cors");
const fileUpload = require("express-fileupload");

// Mongo DB
const mongo = require("./connectMongo");
const { ObjectId } = require("mongodb");
const client = mongo.client;
const db = mongo.db;

app.use(cors());
app.use(fileUpload({ limits: { fileSize: 1 * 1024 * 1024 } })); // 50mb
app.use("/image", express.static("uploads"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

////// check next
function isSignIn(req, res, next) {
  try {
    const auth = req.headers["authorization"];
    const token = auth.replace("Bearer ", "");
    const jwt = require("jsonwebtoken");
    const payload = jwt.verify(token, key);
    //payload.id && { return next(); }
    if (payload.id !== null) {
      next();
    } else {
      return res.status(401).send("error");
    }
  } catch (error) {
    res.status(401).send(error.message);
  }
}

//////// uploadfile
app.post("/upload", (req, res) => {
  try {
    if (req.files != undefined) {
      const img = req.files.img;
      const ext = img.name.split("."); // แยกคำค้นหา2222 (.)
      const currentExt = ext[ext.length - 1]; // นามสกุล (นับสุดท้าย)
      const NewName = `${img.md5}.${currentExt}`; // ชื่อไฟล์ใหม่
      //console.log(img);
      img.mv("uploads/" + NewName, (err) => {
        if (img.truncated)
          return res.status(401).send({ upload: "error size" });
        if (err) throw err;
        res.send({ upload: "success" });
      });
    } else {
      res.send({ error: "your file ?" });
    }
  } catch (e) {
    res.status(401).send(e.message);
  }
});

//////// MongoDB GET
app.get("/mdb", async (req, res) => {
  try {
    await client.connect();
    const obj = client.db(db);
    /*  Search Name = admin
    const rows = await obj
      .collection("member")
      .find({ name: "admin" })
      .toArray();
    */
    /*
    Search 2 Part
    const rows = await obj
      .collection("member")
      .find({ "data.name": "admin" })
      .toArray();
    */
    const rows = await obj.collection("member").find().limit(1).toArray();
    return res.send(rows);
  } catch (err) {
    res.status(501).send("err:" + err.message);
  }
});

//////// MongoDB POST
app.post("/mdb", async (req, res) => {
  try {
    await client.connect();
    const obj = client.db(db);
    const rows = await obj.collection("member").insertOne(req.body);
    return res.send(rows);
  } catch (err) {
    res.status(501).send("err:" + err.message);
  }
});
//////// MongoDB UPDATE
app.put("/mdb/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await client.connect();
    const obj = client.db(db);
    const rows = await obj
      .collection("member")
      .updateOne({ _id: new ObjectId(id) }, { $set: req.body });

    return res.send({ update: rows.modifiedCount });
  } catch (err) {
    res.status(501).send("err:" + err.message);
  }
});

app.post("/signin", (req, res) => {
  memberControllers.signIn(req, res);
});
app.post("/verify", (req, res) => {
  memberControllers.verify(req, res);
});
app.get("/member/:id", (req, res) => {
  memberControllers.list(req, res);
});
app.post("/member", (req, res) => {
  memberControllers.create(req, res);
});

app.put("/member/:id", (req, res) => {
  memberControllers.update(req, res);
});

app.get("/check", isSignIn, (req, res, next) => {
  memberControllers.checklogin(req, res);
});

app.get("/", (req, res) => {
  control.list(req, res);
});

app.post("/", (req, res) => {
  control.create(req, res);
});
app.put("/", (req, res) => {
  control.update(req, res);
});
app.delete("/", (req, res) => {
  control.delete(req, res);
});

/* 
app.get("/hello/:name", (req, res) => {
  const name = req.params.name;
  return res.send("name:" + name);
});

app.get("/hi/:name/:phone", (req, res) => {
  const [name, phone] = [req.params.name, req.params.phone];
  return res.send(`name:${name}\nphone:${phone}`);
});

app.post("/post", (req, res) => {
  const name = req.body.name ?? "";
  return res.send("name:" + name);
});

app.put("/update", (req, res) => {
  const name = req.body.name ?? "";
  return res.send("name:" + name);
}); */

app.listen(3000, () => {
  console.log("server running on location:3000");
});
