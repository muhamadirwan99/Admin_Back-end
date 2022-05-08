const db = require("../models");
const Video = db.videos;
const getStandardRespond = require("../../utils/standard-respond");
const fs = require("fs");

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
  if (req.files.thumbnail === undefined || req.files.modul === undefined) {
    const err = new Error("Image and modul must be uploaded!");
    err.errorStatus = 422;
    throw err;
  }

  const video = new Video({
    name: req.body.name,
    idYt: req.body.idYt,
    desc: req.body.desc,
    thumbnail: req.files.thumbnail[0].path.replace("\\", "/"),
    modul: req.files.modul[0].path.replace("\\", "/"),
  });

  video
    .save(video)
    .then((result) => {
      res.send(getStandardRespond(true, "Video was uploaded", result));
    })
    .catch((err) => {
      let nameError = "";
      let idYtError = "";
      let descError = "";
      if (err.errors.name) {
        nameError = err.errors.name.kind;
      }
      if (err.errors.idYt) {
        idYtError = err.errors.idYt.kind;
      }
      if (err.errors.desc) {
        descError = err.errors.desc.kind;
      }
      res.status(422).send({
        name: nameError,
        idYt: idYtError,
        desc: descError,
        message: err.message || "Some error while create videos.",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Video.findById(id)
    .then((result) => {
      res.send(getStandardRespond(true, "Video", result));
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
      try {
        fs.unlinkSync(result.thumbnail);
        fs.unlinkSync(result.modul);
      } catch (err) {
        console.log(err.message);
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
