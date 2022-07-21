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

exports.findPagination = (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  Webinar.find()
    .then((result) => {
      const webinarSlice = result.slice(startIndex, endIndex);

      res.send(getStandardRespond(true, "List webinars", webinarSlice));
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
    search: req.body.name.toLowerCase(),
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

exports.findRecent = (req, res) => {
  Webinar.find()
    .sort({ createdAt: -1 })
    .limit(3)
    .then((result) => {
      res.send(getStandardRespond(true, "List recent webinars", result));
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error while retrieving webinar.",
      });
    });
};

exports.findByName = (req, res) => {
  const name = req.query.name;

  Webinar.find({ search: { $regex: ".*" + name.toLowerCase() + ".*" } })
    .then((result) => {
      res.send(getStandardRespond(true, "List Search Webinar Results", result));
    })
    .catch((err) => {
      res.status(409).send({
        message: err.message || "Some error while retrieving webinars.",
      });
    });
};
