import { generateOpenApiSpec } from "@/lib/swagger";
import ReactSwagger from "./react-swagger";

export default async function IndexPage() {
  const spec = generateOpenApiSpec();
  return (
    <section className="min-h-dvh bg-foreground flex flex-col">
      <ReactSwagger spec={spec} />
    </section>
  );
}
