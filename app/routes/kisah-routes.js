module.exports = (app) => {
  const kisah = require("../controllers/kisah-controller");
  const router = require("express").Router();

  router.get("/", kisah.findAll);
  router.post("/", kisah.create);
  router.get("/:id", kisah.findOne);
  router.put("/:id", kisah.update);
  router.delete("/:id", kisah.delete);
  router.get("/update/recent", kisah.findRecent);

  app.use("/api/kisah", router);
};
