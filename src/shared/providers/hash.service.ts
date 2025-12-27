import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  public async hash(data: string) {
    return bcrypt.hash(data, Number(process.env.HASH_SALT_ROUNDS));
  }

  public async compare(data: string, hash: string) {
    return bcrypt.compare(data, hash);
  }
}