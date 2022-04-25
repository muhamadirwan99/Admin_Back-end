const db = require("../models");
const Video = db.videos;
const getStandardRespond = require("../../utils/standard-respond");

exports.findAll = (req, res) => {
  Video.find()
    .then((result) => {
      res.send(getStandardRespond(true, "List videos", result));
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error while retrieving videos.",
      });
    });
};

exports.create = (req, res) => {
  if (!req.file) {
    const err = new Error("Image must be uploaded!");
    err.errorStatus = 422;
    throw err;
  }

  const video = new Video({
    name: req.body.name,
    idYt: req.body.idYt,
    desc: req.body.desc,
    thumbnail: req.file.path.replace("\\", "/"),
  });

  video
    .save(video)
    .then((result) => {
      res.send(getStandardRespond(true, "Video was uploaded", result));
    })
    .catch((err) => {
      res.status(409).send({
        message: err.message || "Some error while create videos.",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Video.findById(id)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(409).send({
        message: err.message || "Some error while show videos.",
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Video.findByIdAndUpdate(id, req.body)
    .then((result) => {
      if (!result) {
        res.status(404).send({
          message: "Video not found",
        });
      }

      res.send({
        message: "Video was updated",
      });
    })
    .catch((err) => {
      res.status(409).send({
        message: err.message || "Some error while update videos.",
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Video.findByIdAndRemove(id)
    .then((result) => {
      if (!result) {
        res.status(404).send({
          message: "Video not found",
        });
      }

      res.send({
        message: "Video was deleted",
      });
    })
    .catch((err) => {
      res.status(409).send({
        message: err.message || "Some error while delete videos.",
      });
    });
};
