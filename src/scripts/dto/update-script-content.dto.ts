import { PartialType } from "@nestjs/swagger"
import { CreateScriptContentDto } from "./create-script-content.dto"

export class UpdateScriptContentDto extends PartialType(CreateScriptContentDto) {} 