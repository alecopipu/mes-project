import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QualityCheck } from './quality-check.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QualityCheck])],
})
export class QualityModule {} 