import { OmitType } from "@nestjs/swagger";
import { EnvEntity } from "src/env/entities/env.entity";
import { FakeUser } from "./user";
import { FakeScriptRun } from "./script-run";

export class FakeEnv extends OmitType(EnvEntity, ['owner', 'runs']) {
  owner?: FakeUser;
  runs?: FakeScriptRun[];
}