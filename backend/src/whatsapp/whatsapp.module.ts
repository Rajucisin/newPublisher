import { Module } from '@nestjs/common';
import { WhatsappController } from './whatsapp.controller';
import { WhatsappService } from './whatsapp.service';
import { LinkedinModule } from '../linkedin/linkedin.module';
import { QueueModule } from '../queue/queue.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [LinkedinModule, QueueModule, AiModule],
  controllers: [WhatsappController],
  providers: [WhatsappService],
  exports: [WhatsappService],
})
export class WhatsappModule {}
