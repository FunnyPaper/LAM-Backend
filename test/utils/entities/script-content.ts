import { OmitType } from "@nestjs/swagger";
import { ScriptContentEntity } from "src/scripts/entities/script-content.entity";
import { FakeScriptVersion } from "./script-version";

export class FakeScriptContent extends OmitType(ScriptContentEntity, ['scriptVersion', 'scriptVersionId']) {
  scriptVersion?: FakeScriptVersion;
  scriptVersionId?: string;
}