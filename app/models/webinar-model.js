module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      desc: {
        type: String,
        required: true,
      },
      link: {
        type: String,
        required: true,
      },
      date: {
        type: String,
        required: true,
      },
      thumbnail: {
        type: String,
        required: true,
      },
      status: {
        type: Boolean,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Webinar = mongoose.model("webinars", schema);
  return Webinar;
};
