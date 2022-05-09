const tipsRespond = (category, data) => {
  return {
    category: category,
    data: {
      name: data.name,
      desc: data.desc,
    },
  };
};

module.exports = tipsRespond;
