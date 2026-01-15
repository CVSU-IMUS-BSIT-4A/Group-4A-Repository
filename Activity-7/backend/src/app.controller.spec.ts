import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return API information', () => {
      const result = appController.getApiInfo();
      expect(result).toHaveProperty('message', 'Task Management API');
      expect(result).toHaveProperty('version', '1.0');
      expect(result).toHaveProperty('documentation', '/api');
      expect(result).toHaveProperty('endpoints');
    });
  });
});
