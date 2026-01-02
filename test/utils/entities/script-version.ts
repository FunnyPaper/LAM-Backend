import { OmitType } from "@nestjs/swagger";
import { ScriptVersionEntity } from "src/scripts/entities/script-version.entity";
import { FakeScriptRun } from "./script-run";
import { FakeScriptContent } from "./script-content";
import { FakeScript } from "./script";
import { FakeScriptSource } from "./script-source";

export class FakeScriptVersion extends OmitType(ScriptVersionEntity, ['content', 'runs', 'script', 'source']) {
  content?: FakeScriptContent;
  runs?: FakeScriptRun[];
  script?: FakeScript;
  source?: FakeScriptSource;
}