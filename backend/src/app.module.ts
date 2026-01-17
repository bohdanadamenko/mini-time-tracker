import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EntriesModule } from './entries/entries.module';

@Module({
  imports: [EntriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
