const db = require("../models");
const Webinar = db.webinars;
const getStandardRespond = require("../../utils/standard-respond");
const fs = require("fs");

exports.findAll = (req, res) => {
  Webinar.find()
    .then((result) => {
      res.send(getStandardRespond(true, "List webinars", result));
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error while retrieving webinars.",
      });
    });
};

exports.create = (req, res) => {
  if (req.files.thumbnail === undefined) {
    const err = "Image must be uploaded!";

    res.status(422).send({
      thumbnail: err,
      message: err.message || "Some error while uploaded image.",
    });
  }

  const webinar = new Webinar({
    name: req.body.name,
    desc: req.body.desc,
    link: req.body.link,
    date: req.body.date,
    thumbnail: req.files.thumbnail[0].path.replace("\\", "/"),
    status: req.body.status,
  });

  webinar
    .save(webinar)
    .then((result) => {
      res.send(getStandardRespond(true, "Webinar was uploaded", result));
    })
    .catch((err) => {
      let nameError = "";
      let descError = "";
      let linkError = "";
      let dateError = "";
      let statusError = "";

      if (err.errors.name) {
        nameError = err.errors.name.kind;
      }
      if (err.errors.desc) {
        descError = err.errors.desc.kind;
      }
      if (err.errors.link) {
        linkError = err.errors.link.kind;
      }
      if (err.errors.date) {
        dateError = err.errors.date.kind;
      }
      if (err.errors.status) {
        statusError = err.errors.status.kind;
      }
      res.status(422).send({
        name: nameError,
        desc: descError,
        link: linkError,
        date: dateError,
        status: statusError,
        message: err.message || "Some error while create webinars.",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Webinar.findById(id)
    .then((result) => {
      res.send(getStandardRespond(true, "Webinar", result));
    })
    .catch((err) => {
      res.status(409).send({
        message: err.message || "Some error while show webinars.",
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  let thumb = null;

  if (req.files.thumbnail === undefined) {
    thumb = req.body.thumbnail;
  } else {
    try {
      fs.unlinkSync(req.body.thumbnail);
    } catch (err) {
      console.log(err.message);
    }
    thumb = req.files.thumbnail[0].path.replace("\\", "/");
  }

  const webinar = {
    name: req.body.name,
    desc: req.body.desc,
    link: req.body.link,
    date: req.body.date,
    thumbnail: thumb,
    status: req.body.status,
  };

  console.log(webinar.thumbnail);

  Webinar.findByIdAndUpdate(id, webinar)
    .then((result) => {
      if (!result) {
        res.status(404).send({
          message: "Webinar not found",
        });
      }

      res.send({
        message: "Webinar was updated",
      });
    })
    .catch((err) => {
      res.status(409).send({
        message: err.message || "Some error while update webinars.",
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Webinar.findByIdAndRemove(id)
    .then((result) => {
      if (!result) {
        res.status(404).send({
          message: "Webinar not found",
        });
      }
      try {
        fs.unlinkSync(result.thumbnail);
      } catch (err) {
        console.log(err.message);
      }
      res.send({
        message: "Webinar was deleted",
      });
    })
    .catch((err) => {
      res.status(409).send({
        message: err.message || "Some error while delete webinars.",
      });
    });
};
