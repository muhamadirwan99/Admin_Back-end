const db = require("../models");
const Kisah = db.kisah;
const getStandardRespond = require("../../utils/standard-respond");
const fs = require("fs");

exports.findAll = (req, res) => {
  Kisah.find()
    .then((result) => {
      res.send(getStandardRespond(true, "List kisah", result));
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error while retrieving kisah.",
      });
    });
};

exports.create = (req, res) => {
  if (req.files.thumbnail === undefined) {
    const err = "Thumbnail must be uploaded!";

    res.status(422).send({
      file: err,
      message: err.message || "Some error while uploaded thumbnail.",
    });
  }

  const kisah = new Kisah({
    name: req.body.name,
    sumber: req.body.sumber,
    link: req.body.link,
    thumbnail: req.files.thumbnail[0].path.replace("\\", "/"),
  });

  kisah
    .save(kisah)
    .then((result) => {
      res.send(getStandardRespond(true, "Kisah was uploaded", result));
    })
    .catch((err) => {
      console.log(err.errors);
      let sumberError = "";
      let linkError = "";
      if (err.errors.name) {
        nameError = err.errors.name.kind;
      }
      if (err.errors.sumber) {
        sumberError = err.errors.sumber.kind;
      }
      if (err.errors.link) {
        linkError = err.errors.link.kind;
      }
      res.status(422).send({
        name: nameError,
        sumber: sumberError,
        link: linkError,
        message: err.message || "Some error while create kisah.",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Kisah.findById(id)
    .then((result) => {
      res.send(getStandardRespond(true, "Kisah", result));
    })
    .catch((err) => {
      res.status(409).send({
        message: err.message || "Some error while show kisah.",
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  let thumbnail = null;

  if (req.files.thumbnail === undefined) {
    thumbnail = req.body.thumbnail;
  } else {
    thumbnail = req.files.thumbnail[0].path.replace("\\", "/");
  }

  const kisah = {
    name: req.body.name,
    sumber: req.body.sumber,
    link: req.body.link,
    thumbnail: thumbnail,
  };

  Kisah.findByIdAndUpdate(id, kisah)
    .then((result) => {
      if (!result) {
        res.status(404).send({
          message: "Kisah not found",
        });
      }

      res.send({
        message: "Kisah was updated",
      });
    })
    .catch((err) => {
      res.status(409).send({
        message: err.message || "Some error while update kisah.",
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Kisah.findByIdAndRemove(id)
    .then((result) => {
      if (!result) {
        res.status(404).send({
          message: "Kisah not found",
        });
      }
      try {
        fs.unlinkSync(result.thumbnail);
      } catch (err) {
        console.log(err.message);
      }
      res.send({
        message: "Kisah was deleted",
      });
    })
    .catch((err) => {
      res.status(409).send({
        message: err.message || "Some error while delete kisah.",
      });
    });
};

exports.findRecent = (req, res) => {
  Kisah.find()
    .sort({ createdAt: -1 })
    .limit(3)
    .then((result) => {
      res.send(getStandardRespond(true, "List recent kisah", result));
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error while retrieving kisah.",
      });
    });
};
