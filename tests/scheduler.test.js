import { describe, expect, jest, test } from "@jest/globals";

import { scheduleTask } from "../src/core/scheduler.js";
import ValidationError from "../src/errors/ValidationError.js";

function createMockLogger() {
  const logger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  logger.child = jest.fn(() => logger);

  return logger;
}

describe("scheduleTask", () => {
  test("throws ValidationError when task is not a function", () => {
    expect(() => scheduleTask("invalid-task", 1000, "not-a-function")).toThrow(
      ValidationError
    );
  });

  test("runs task and passes request context", () => {
    jest.useFakeTimers();

    const logger = createMockLogger();
    const task = jest.fn();

    const timer = scheduleTask("test-task", 1000, task, { logger });

    jest.advanceTimersByTime(1000);

    expect(task).toHaveBeenCalledTimes(1);

    const [taskContext] = task.mock.calls[0];

    expect(taskContext).toEqual(
      expect.objectContaining({
        requestId: expect.stringMatching(/^req-/),
        logger,
      })
    );
    expect(logger.info).toHaveBeenCalledWith(
      'Task "test-task" scheduled with interval 1000ms'
    );
    expect(logger.child).toHaveBeenCalledWith({
      requestId: expect.stringMatching(/^req-/),
    });

    clearInterval(timer);
    jest.useRealTimers();
  });
});
