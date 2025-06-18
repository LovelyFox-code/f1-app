import { Request, Response } from 'express';
import { param } from 'express-validator';
import { validate } from '../../middleware/validation.ts';

describe('Validation Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      params: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
  });

  it('should call next() when validation passes', async () => {
    // Setup validation rule
    const validateTest = [
      param('id').isString(),
    ];
    
    // Setup mock request with valid data
    mockRequest.params = { id: 'valid-id' };
    
    // Call the middleware
    const middleware = validate(validateTest);
    await middleware(mockRequest as Request, mockResponse as Response, nextFunction);
    
    // Assert next was called
    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should return 400 status when validation fails', async () => {
    // Setup validation rule that requires a number
    const validateTest = [
      param('id').isInt().withMessage('ID must be an integer'),
    ];
    
    // Setup mock request with invalid data
    mockRequest.params = { id: 'not-a-number' };
    
    // Call the middleware
    const middleware = validate(validateTest);
    await middleware(mockRequest as Request, mockResponse as Response, nextFunction);
    
    // Assert response was sent with error
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        message: 'Validation error',
        errors: expect.any(Array)
      })
    );
  });
}); 