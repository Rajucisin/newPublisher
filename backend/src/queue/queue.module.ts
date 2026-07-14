import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { LinkedinModule } from '../linkedin/linkedin.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [LinkedinModule, AiModule],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
