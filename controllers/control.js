module.exports = {
  list: (req, res) => {
    return res.send("List");
  },
  search: (req, res) => {
    return res.send("search");
  },
  info: (req, res) => {
    return res.send("info");
  },
  create: (req, res) => {
    return res.send("create");
  },
  update: (req, res) => {
    return res.send("Update");
  },
  delete: (req, res) => {
    return res.send("delete");
  },
};
