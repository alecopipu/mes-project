import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PermissionsModule } from './permissions/permissions.module';
import { WorkOrdersModule } from './work-orders/work-orders.module';
import { ProductionTrackingModule } from './production-tracking/production-tracking.module';
import { EquipmentModule } from './equipment/equipment.module';
import { MaterialsModule } from './materials/materials.module';
import { QualityModule } from './quality/quality.module';
import { DataAcquisitionModule } from './data-acquisition/data-acquisition.module';
import { ReportsModule } from './reports/reports.module';
import { SystemSettingsModule } from './system-settings/system-settings.module';
import { LoggingModule } from './logging/logging.module';
import { EventsModule } from './events/events.module';
import { LoggingMiddleware } from './logging/logging.middleware';
import { DatabaseModule } from './database/database.module';
import { ResourcesModule } from './resources/resources.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { PermissionsGuard } from './auth/guards/permissions.guard';
import { RateLimiterModule, RateLimiterGuard } from 'nestjs-rate-limiter';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule available globally
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [], // Entities will be managed in their respective modules
        autoLoadEntities: true, // Automatically load entities from modules
        synchronize: true, // Auto-create database schema. Disable in production.
      }),
    }),
    UsersModule,
    AuthModule,
    PermissionsModule,
    WorkOrdersModule,
    ProductionTrackingModule,
    EquipmentModule,
    MaterialsModule,
    QualityModule,
    DataAcquisitionModule,
    ReportsModule,
    SystemSettingsModule,
    LoggingModule,
    EventsModule,
    DatabaseModule,
    ResourcesModule,
    RateLimiterModule.register({
      for: 'Express',
      type: 'Memory',
      duration: 60,
      points: 60,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RateLimiterGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
