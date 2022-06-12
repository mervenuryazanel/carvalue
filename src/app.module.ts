import { Module, ValidationPipe, MiddlewareConsumer } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'; // to use dotenv for config
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/users.entity';
import { Report } from './reports/reports.entity';
import { config } from 'process';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal: true,
        envFilePath:`.env.${process.env.NODE_ENV}`,
      }
    ),
    TypeOrmModule.forRootAsync({ // a worse way of create seperate db's for test and dev modes (but this is the nestjs recomended way)
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          entities: [User, Report],
          synchronize: true,
        }
      }
      
    }),
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'db.sqlite',
    //   // database: process.env.NODE_ENV==='test' ? 'test.sqlite' : 'db.sqlite', //seperate db's for test and development modes
    //   entities: [User, Report],
    //   synchronize: true,
    // }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: ['asdfasfd'],
        }),
      )
      .forRoutes('*');
  }
}
