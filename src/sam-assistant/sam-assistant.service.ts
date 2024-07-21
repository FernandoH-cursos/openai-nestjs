import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

import { QuestionDto } from './dtos/question.dto';
import {
  checkCompleteStatusUseCase,
  createMessageUseCase,
  createRunUseCase,
  createThreadUseCase,
  getMessageListUseCase,
} from './use-cases';

@Injectable()
export class SamAssistantService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async createThread() {
    return await createThreadUseCase(this.openai);
  }

  async userQuestion(questionDto: QuestionDto) {
    const { threadId, question } = questionDto;

    await createMessageUseCase(this.openai, {
      threadId,
      question,
    });

    const run = await createRunUseCase(this.openai, { threadId });

    await checkCompleteStatusUseCase(this.openai, {
      threadId,
      runId: run.id,
    });

    const messages = await getMessageListUseCase(this.openai, { threadId });

    return messages;
  }
}
