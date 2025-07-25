import { createSwaggerPage } from "nextjs-swagger-autogen";
import "swagger-ui-react/swagger-ui.css";

export default createSwaggerPage({
  config: {
    info: {
      title: "My API Documentation",
      version: "2.0.0",
      description: "API documentation for my awesome app",
    },
    servers: [
      { url: "http://localhost:3000/api", description: "Development" },
      { url: "https://myapp.com/api", description: "Production" },
    ],
  },
  includeMethods: ["GET", "POST", "PUT", "DELETE"],
  excludePaths: ["/internal", "/admin"],
});
