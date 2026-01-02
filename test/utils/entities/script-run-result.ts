import { OmitType } from "@nestjs/swagger";
import { ScriptRunResultEntity } from "src/scripts/entities/script-run-result.entity";
import { FakeScriptVersion } from "./script-version";

export class FakeScriptRunResult extends OmitType(ScriptRunResultEntity, ['scriptVersion', 'scriptRunId']) {
  scriptVersion?: FakeScriptVersion;
  scriptRunId?: string;
}