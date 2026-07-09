import { Module } from '@nestjs/common';
import { QueueService } from '../queue/queue.service';
import { WhatsappController } from './whatsapp.controller';
import { WhatsappService } from './whatsapp.service';

@Module({
  controllers: [WhatsappController],
  providers: [WhatsappService, QueueService],
  exports: [WhatsappService],
})
export class WhatsappModule {}
