import chevrotain from "https://esm.sh/chevrotain@10.4.1";
import { parser } from "./parser/index.ts";

const htmlText = chevrotain.createSyntaxDiagramsCode(
  parser.getSerializedGastProductions()
);

Deno.writeTextFileSync("syntax.html", htmlText);
