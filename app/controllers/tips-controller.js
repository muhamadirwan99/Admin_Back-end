const db = require("../models");
const Tips = db.tips;
const getStandardRespond = require("../../utils/standard-respond");

exports.findAll = (req, res) => {
  Tips.find()
    .then((result) => {
      res.send(getStandardRespond(true, "List tips", result));
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error while retrieving tips.",
      });
    });
};

exports.create = (req, res) => {
  const tips = new Tips({
    category: req.body.category,
    name: req.body.name,
    desc: req.body.desc,
  });

  tips
    .save(tips)
    .then((result) => {
      res.send(getStandardRespond(true, "Tips was uploaded", result));
    })
    .catch((err) => {
      let categoryError = "";
      let nameError = "";
      let descError = "";

      if (err.errors.categoryError) {
        idYtError = err.errors.categoryError.kind;
      }
      if (err.errors.name) {
        nameError = err.errors.name.kind;
      }
      if (err.errors.desc) {
        descError = err.errors.desc.kind;
      }

      res.status(422).send({
        name: nameError,
        idYt: idYtError,
        desc: descError,
        message: err.message || "Some error while create tips.",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Tips.findById(id)
    .then((result) => {
      res.send(getStandardRespond(true, "Tips", result));
    })
    .catch((err) => {
      res.status(409).send({
        message: err.message || "Some error while show tips.",
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Tips.findByIdAndUpdate(id, req.body)
    .then((result) => {
      if (!result) {
        res.status(404).send({
          message: "Tips not found",
        });
      }

      res.send({
        message: "Tips was updated",
      });
    })
    .catch((err) => {
      res.status(409).send({
        message: err.message || "Some error while update tips.",
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Tips.findByIdAndRemove(id)
    .then((result) => {
      if (!result) {
        res.status(404).send({
          message: "Tips not found",
        });
      }
      res.send({
        message: "Tips was deleted",
      });
    })
    .catch((err) => {
      res.status(409).send({
        message: err.message || "Some error while delete tips.",
      });
    });
};

exports.findCategory = (req, res) => {
  const category = req.params.category;

  Tips.find({ category })
    .then((result) => {
      res.send(getStandardRespond(true, category, result));
    })
    .catch((err) => {
      res.status(409).send({
        message: err.message || "Some error while show tips.",
      });
    });
};
