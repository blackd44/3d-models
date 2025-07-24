import fs from "fs";
import path from "path";
import { swaggerConfig } from "./config";

const apiPath = path.join(process.cwd(), "src/app/api");

export function generateOpenApiSpec() {
  const paths: Record<string, any> = {};

  function walk(dir: string, parentRoute: string = "") {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath, path.join(parentRoute, entry.name));
      } else if (entry.name === "route.ts") {
        let urlPath =
          parentRoute.replace(/\/route$/, "").replace(/\/$/, "") || "/";
        if (!urlPath.startsWith("/")) {
          urlPath = "/" + urlPath;
        }
        paths[urlPath] = {
          get: {
            summary: `GET ${urlPath}`,
            responses: {
              200: {
                description: "Success",
              },
            },
          },
        };
      }
    }
  }

  walk(apiPath);

  return {
    ...swaggerConfig,
    paths,
  };
}
