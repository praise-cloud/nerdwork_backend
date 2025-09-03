import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Comic App API",
      version: "1.0.0",
      description: "API documentation for Comic App",
    },
<<<<<<< HEAD
    servers: [
      {
        url: "https://nerdworkbackend-production.up.railway.app/",
      },
    ],
=======
    servers: [{ url: "http://localhost:5000" }],
>>>>>>> 5271df71a6218432e6e15f9966176a2819a88527
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
