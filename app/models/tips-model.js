module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      category: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      desc: {
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

  const Tips = mongoose.model("tips", schema);
  return Tips;
};
