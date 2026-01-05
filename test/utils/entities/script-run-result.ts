import { OmitType } from "@nestjs/swagger";
import { ScriptRunResultEntity } from "src/scripts/entities/script-run-result.entity";
import { FakeScriptRun } from "./script-run";

export class FakeScriptRunResult extends OmitType(ScriptRunResultEntity, ['scriptRun', 'scriptRunId']) {
  scriptRun?: FakeScriptRun;
  scriptRunId?: string;
}