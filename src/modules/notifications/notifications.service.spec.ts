import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService, resolveEmailMessage } from './notifications.service';

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationsService],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

describe('resolveEmailMessage', () => {
  it('uses html when provided', () => {
    expect(resolveEmailMessage({ to: 'a@b.c', subject: 'Hi', html: '<p>ok</p>' })).toEqual({
      to: 'a@b.c',
      subject: 'Hi',
      text: '<p>ok</p>',
    });
  });

  it('renders payment and reminder templates instead of crashing', () => {
    const receipt = resolveEmailMessage({
      to: 'a@b.c',
      template: 'kingsschoolPaymentReceipt',
      receipt_number: 'R-1',
      amount: 5000,
      learner: { first_name: 'Ada', last_name: 'Lovelace' },
    });
    expect(receipt.text).toContain('R-1');
    expect(resolveEmailMessage({
      to: 'a@b.c',
      template: 'feeReminder',
      context: { student_name: 'Ada', outstanding_amount: 2000, custom_message: 'Pay soon' },
    }).text).toContain('2000');
  });

  it('throws a clear error for unknown templates', () => {
    expect(() => resolveEmailMessage({ to: 'a@b.c', template: 'missing' })).toThrow(
      'unknown email template: missing',
    );
  });
});

