import { join } from 'path';
import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import {ApolloServerPluginLandingPageLocalDefault} from 'apollo-server-core';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo'
import { ItemsModule } from './items/items.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { CommonModule } from './common/common.module';
import { ListsModule } from './lists/lists.module';
import { ListItemModule } from './list-item/list-item.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [AuthModule /* Import module */],
      inject: [JwtService /* Inject Services */],
      useFactory: async( jwtService: JwtService ) => {
        return {
          playground: false,
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          plugins: [
            ApolloServerPluginLandingPageLocalDefault
          ],
          context({ req }){
            // const token = req.headers.authorization?.replace('Bearer ','');
            // if(!token){
            //   throw Error('Token needed');
            // }

            // const payload = jwtService.decode(token);
            // if(!payload){
            //   throw Error('Token not valid');
            // }
          }
        }
      }
    }),
    //TODO: Basic Configuration
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   playground: false,
    //   autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    //   plugins: [
    //     ApolloServerPluginLandingPageLocalDefault
    //   ]
    // }),

    TypeOrmModule.forRoot({
      // ssl: process.env.STAGE === 'prod' ? true : false,
      // extra: {
      //   ssl: process.env.STAGE === 'prod' ? { rejectUnauthorized: false } : null
      // },
      ssl: ( process.env.STATE === 'prod' ) ? {
        rejectUnauthorized: false,
        sslmode: 'required'
      } : false as any,
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true
    }),
    ItemsModule,
    UsersModule,
    AuthModule,
    SeedModule,
    CommonModule,
    ListsModule,
    ListItemModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
