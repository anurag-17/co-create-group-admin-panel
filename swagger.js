const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "My API",
    description: "API",
  },
  host: "localhost:4000",
};

const outputFile = "./swagger-output.json";
const routes = [
  "./routes/auth.js",
  "./routes/pages.js",
  "./routes//subPages.js",
];

swaggerAutogen(outputFile, routes, doc);
