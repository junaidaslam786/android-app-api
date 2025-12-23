import {
  BadRequestException,
  Injectable,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Injectable()
export class GlobalValidationPipe extends ValidationPipe {
  constructor() {
    super({
      // Your existing configuration is good, keep it
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
      validateCustomDecorators: true,

      // Override the exceptionFactory to return a cleaner response
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = this.formatErrors(errors);
        return new BadRequestException({
          message: 'Validation failed',
          errors: messages,
          statusCode: 400
        });
      },
    });
  }

  // You can keep this helper method, but we'll use a simpler version
  // that just extracts the top-level messages for the main response.
  private formatErrors(errors: ValidationError[]): string[] {
    const errorMessages: string[] = [];

    const extractErrors = (
      validationErrors: ValidationError[],
      parentPath = '',
    ) => {
      validationErrors.forEach((error) => {
        const propertyPath = parentPath
          ? `${parentPath}.${error.property}`
          : error.property;

        if (error.constraints) {
          Object.values(error.constraints).forEach((message) => {
            errorMessages.push(`${propertyPath}: ${message}`);
          });
        }

        if (error.children && error.children.length > 0) {
          extractErrors(error.children, propertyPath);
        }
      });
    };

    extractErrors(errors);
    return errorMessages;
  }
}
