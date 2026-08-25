export default {
  classNameSlug:
    process.env.NODE_ENV === "production" ? "nlb-[hash]" : "nlb-[hash]-[title]",
  eval: {
    // Resolve the "~/*" tsconfig path alias during static evaluation.
    resolver: "hybrid",
  },
  importOverrides: {
    "~/presentations/atoms/FormControl": { unknown: "allow" },
  },
};
