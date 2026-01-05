import { PaginatedDto } from "src/shared/dto/paginated.dto"
import { ScriptDto } from "./script.dto";

export class PaginatedScriptDto extends PaginatedDto(ScriptDto) {}