import { Test, TestingModule } from '@nestjs/testing';
import { DefaultController } from './default.controller';

describe('AppController', () => {
    let app: TestingModule;

    beforeAll(async () => {
        app = await Test.createTestingModule({
            controllers: [DefaultController],
        }).compile();
    });

    describe("ping", () => {
        it("should return 'pong'", () => {
            const defaultController = app.get<DefaultController>(DefaultController);
            expect(defaultController.ping()).toBe("pong");
        });
    });
});
