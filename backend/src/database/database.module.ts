import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [
    {
      provide: DataSource,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<DataSource> => {
        try {
          const dataSource = new DataSource({
            type: 'postgres',
            host: configService.get<string>('DB_HOST', 'localhost'),
            port: configService.get<number>('DB_PORT', 5432),
            username: configService.get<string>('DB_USERNAME', 'postgres'),
            password: configService.get<string>('DB_PASSWORD', 'postgres'),
            database: configService.get<string>('DB_NAME', 'security_project'),
            synchronize: false,
            entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
            migrations: [__dirname + '/migrations/*{.ts,.js}'],
          });

          await dataSource.initialize();
          console.log('Database connected successfully');
          return dataSource;
        } catch (error) {
          console.error('Error connecting to database', error);
          throw error;
        }
      },
    },
  ],
  exports: [DataSource],
})
export class DatabaseModule {}
