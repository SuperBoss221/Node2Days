const pool = require("../connect");
const jwt = require("jsonwebtoken");
const key = "boss";

module.exports = {
  checklogin: async (req, res) => {
    return res.send({ status: "success ok" });
  },
  signIn: async (req, res) => {
    try {
      const [rows] = await pool.query(
        "SELECT id,name FROM `tb_member` WHERE user = ? AND pass = ?",
        [req.body.user, req.body.pass]
      );
      pool.releaseConnection();
      if (rows.length > 0) {
        const row = rows[0];
        const token = jwt.sign(row, key, { expiresIn: "1d" });
        pool.query("UPDATE `tb_member` SET token = ? WHERE id = ?", [
          token,
          row.id,
        ]);
        return res.send({ token: token });
      }
      res.status(401).send({ token: "error" });
    } catch (e) {
      res.send(e);
    }
  },
  verify: async (req, res) => {
    try {
      const payload = jwt.verify(req.body.token, key);
      return res.send({ payload });
    } catch (e) {
      res.send(e);
    }
  },
  list: async (req, res) => {
    try {
      const id = req.params.id;
      const [rows] = await pool.query(
        "SELECT * FROM `tb_member` WHERE id = ?",
        [id]
      );
      //if (error) throw e;
      pool.releaseConnection();

      return res.send(rows);
    } catch (e) {
      return res.status(500).send(e);
    }
  },
  create: async (req, res) => {
    try {
      for (let i = 0; i < 100; i++) {
        await pool.query(
          "INSERT INTO tb_member(name,point,level) VALUES (?,?,?)",
          ["admins", i, "gold"]
        );
      }
      pool.releaseConnection();

      return res.send({ status: "ok" });
    } catch (e) {
      return res.status(500).send(e);
    }
  },

  update: async (req, res) => {
    try {
      const id = req.params.id;
      const name = req.body.name;
      const [rows] = await pool.query(
        "UPDATE `tb_member` SET name = ? WHERE id = ?",
        [name, id]
      );
      //if (error) throw e;
      pool.releaseConnection();

      return res.send({ status: rows.changedRows == 1 ? "Success" : "Error" });
    } catch (e) {
      return res.status(500).send(e);
    }
  },
};
