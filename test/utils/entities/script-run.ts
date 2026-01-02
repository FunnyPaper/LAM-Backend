import { OmitType } from "@nestjs/swagger";
import { ScriptRunEntity } from "src/scripts/entities/script-run.entity";
import { FakeEnv } from "./env";
import { FakeScriptRunResult } from "./script-run-result";
import { FakeScriptVersion } from "./script-version";

export class FakeScriptRun extends OmitType(ScriptRunEntity, ['env', 'result', 'scriptVersion']) {
  env?: FakeEnv;
  result?: FakeScriptRunResult;
  scriptVersion?: FakeScriptVersion;
}