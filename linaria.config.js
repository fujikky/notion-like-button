module.exports = {
  classNameSlug:
    process.env.NODE_ENV === "production" ? "nlb-[hash]" : "nlb-[hash]-[title]",
};
