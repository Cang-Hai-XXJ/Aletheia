module.exports = {
  "api/project/list": {
    get: {
      query: {
        type: "object",
        properties: {
          pageSize: {
            type: "string",
          },
        },
        required: ["pageSize"],
      },
    },
  },
};
