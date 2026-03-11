import { PaginatedDto } from "src/shared/dto/paginated.dto"
import { EnvDto } from "./env.dto";

export class PaginatedEnvDto extends PaginatedDto(EnvDto) {}