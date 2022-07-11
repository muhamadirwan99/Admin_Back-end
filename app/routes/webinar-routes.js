module.exports = (app) => {
  const webinars = require("../controllers/webinar-controller");
  const router = require("express").Router();

  router.get("/", webinars.findAll);
  router.post("/", webinars.create);
  router.get("/:id", webinars.findOne);
  router.put("/:id", webinars.update);
  router.delete("/:id", webinars.delete);
  router.get("/search/webinar", webinars.findByName);
  router.get("/update/recent", webinars.findRecent);

  app.use("/api/webinars", router);
};
