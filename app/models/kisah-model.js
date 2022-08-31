module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      sumber: {
        type: String,
        required: true,
      },
      link: {
        type: String,
        required: true,
      },
      thumbnail: {
        type: String,
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

  const Kisah = mongoose.model("kisah", schema);
  return Kisah;
};
