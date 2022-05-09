module.exports = (app) => {
  const tips = require("../controllers/tips-controller");
  const router = require("express").Router();

  router.get("/", tips.findAll);
  router.post("/", tips.create);
  router.get("/:id", tips.findOne);
  router.put("/:id", tips.update);
  router.delete("/:id", tips.delete);
  router.get("/category/:category", tips.findCategory);

  app.use("/api/tips", router);
};
