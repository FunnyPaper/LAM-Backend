import { PartialType } from "@nestjs/swagger"
import { CreateScriptSourceDto } from "./create-script-source.dto";

export class UpdateScriptSourceDto extends PartialType(CreateScriptSourceDto) {}