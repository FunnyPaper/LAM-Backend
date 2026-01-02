import { OmitType } from "@nestjs/swagger";
import { ScriptEntity } from "src/scripts/entities/script.entity";
import { FakeUser } from "./user";
import { FakeScriptVersion } from "./script-version";

export class FakeScript extends OmitType(ScriptEntity, ['owner', 'versions']) {
  owner?: FakeUser;
  versions?: FakeScriptVersion[];
}