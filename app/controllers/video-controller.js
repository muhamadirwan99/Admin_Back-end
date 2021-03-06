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

exports.findPagination = (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  Video.find()
    .then((result) => {
      const videoSlice = result.slice(startIndex, endIndex);

      res.send(getStandardRespond(true, "List videos", videoSlice));
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error while retrieving videos.",
      });
    });
};

exports.create = (req, res) => {
  if (req.files.modul === undefined) {
    const err = "Modul must be uploaded!";

    res.status(422).send({
      file: err,
      message: err.message || "Some error while uploaded modul.",
    });
  }

  const video = new Video({
    name: req.body.name,
    idYt: req.body.idYt,
    desc: req.body.desc,
    thumbnail: `https://img.youtube.com/vi/${req.body.idYt}/mqdefault.jpg`,
    modul: req.files.modul[0].path.replace("\\", "/"),
    search: req.body.name.toLowerCase(),
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

exports.findByName = (req, res) => {
  const name = req.query.name;

  Video.find({ search: { $regex: ".*" + name.toLowerCase() + ".*" } })
    .then((result) => {
      res.send(getStandardRespond(true, "List Search Video Results", result));
    })
    .catch((err) => {
      res.status(409).send({
        message: err.message || "Some error while retrieving videos.",
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  let thumbnail = null;
  let modul = null;

  if (req.files.thumbnail === undefined) {
    thumbnail = req.body.thumbnail;
  } else {
    thumbnail = req.files.thumbnail[0].path.replace("\\", "/");
  }
  if (req.files.modul === undefined) {
    modul = req.body.modul;
  } else {
    modul = req.files.modul[0].path.replace("\\", "/");
  }

  const video = {
    name: req.body.name,
    idYt: req.body.idYt,
    desc: req.body.desc,
    thumbnail,
    modul,
  };

  Video.findByIdAndUpdate(id, video)
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

exports.findRecent = (req, res) => {
  Video.find()
    .sort({ createdAt: -1 })
    .limit(3)
    .then((result) => {
      res.send(getStandardRespond(true, "List recent videos", result));
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error while retrieving videos.",
      });
    });
};
