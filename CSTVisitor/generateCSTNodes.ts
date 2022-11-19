import { generateCstDts } from "https://esm.sh/chevrotain@10.4.1";
import { productions } from "../parser/index.ts";

const dtsString = generateCstDts(productions);
Deno.writeTextFileSync("CSTVisitor/compilang_cst.d.ts", dtsString);
