import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { ConfigModule } from "@nestjs/config";
import { SharedModule } from "./shared/shared.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApiConfigService } from "./shared/config.service";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ".env",
            isGlobal: true,
        }),

        SharedModule,
        UsersModule,

        TypeOrmModule.forRootAsync({
            useFactory: (configService: ApiConfigService) => ({
                type: "postgres",
                host: configService.app.repository.host,
                port: configService.app.repository.port,
                username: configService.app.repository.username,
                password: configService.app.repository.password,
                database: configService.app.repository.database,
				ssl: true,
                entities: [`${__dirname}/**/*.entity{.ts,.js}`],
				migrations: [`${__dirname}/migrations/*{.ts,.js}`],
            }),
            inject: [ApiConfigService],
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
