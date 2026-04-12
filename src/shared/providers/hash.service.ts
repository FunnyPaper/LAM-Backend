import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import bcrypt from 'bcryptjs';
import { ConfigurationType, HashConfiguration } from "src/configuration/types/configuration.type";

@Injectable()
export class HashService {
    public constructor(private readonly configService: ConfigService<ConfigurationType>) { }

    public async hash(data: string) {
        const hash: HashConfiguration = this.configService.get('hash')!;
        return bcrypt.hash(data, hash.rounds);
    }

    public async compare(data: string, hash: string) {
        return bcrypt.compare(data, hash);
    }
}