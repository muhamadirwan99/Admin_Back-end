module.exports = (app) => {
  const videos = require("../controllers/video-controller");
  const router = require("express").Router();

  router.get("/", videos.findAll);
  router.post("/", videos.create);
  router.get("/:id", videos.findOne);
  router.put("/:id", videos.update);
  router.delete("/:id", videos.delete);
  router.get("/search/video", videos.findByName);
  router.get("/update/recent", videos.findRecent);

  app.use("/api/videos", router);
};
