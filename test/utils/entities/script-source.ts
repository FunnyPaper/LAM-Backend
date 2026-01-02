import { OmitType } from "@nestjs/swagger";
import { ScriptSourceEntity } from "src/scripts/entities/script-source.entity";
import { FakeScriptVersion } from "./script-version";

export class FakeScriptSource extends OmitType(ScriptSourceEntity, ['scriptVersion', 'scriptVersionId']) {
  scriptVersion?: FakeScriptVersion;
  scriptVersionId?: string;
}