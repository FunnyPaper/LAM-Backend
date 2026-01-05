import { PaginatedDto } from "src/shared/dto/paginated.dto";
import { ScriptRunDto } from "./script-run.dto";

export class PaginatedScriptRunDto extends PaginatedDto(ScriptRunDto) {}