import { Global, Module } from "@nestjs/common";
import { HashService } from "./providers/hash.service";

@Global()
@Module({
  providers: [HashService],
  exports: [HashService]
})
export class SharedModule {}