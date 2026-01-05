import { PaginatedDto } from "src/shared/dto/paginated.dto";
import { ScriptVersionDto } from "./script-version.dto";

export class PaginatedScriptVersionDto extends PaginatedDto(ScriptVersionDto) {}