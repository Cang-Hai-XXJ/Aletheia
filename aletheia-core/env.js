module.exports = (app) => {
  return {
    isLocal() {
      return process.env.NODE_ENV === "local";
    },
    isBeta() {
      return process.env.NODE_ENV === "beta";
    },
    isProduction() {
      return process.env.NODE_ENV === "production";
    },
    get() {
      return process.env.NODE_ENV ?? "local";
    },
  };
};
