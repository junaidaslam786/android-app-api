import './polyfills';

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { GlobalValidationPipe } from './common/pipes/global-validation.pipe';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as crypto from 'crypto';

// Ensure crypto is available globally
if (typeof global.crypto === 'undefined') {
  (global as any).crypto = crypto;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'img-src': ["'self'", 'data:', 'https:'],
          'script-src': ["'self'", "'unsafe-inline'"],
          'style-src': ["'self'", "'unsafe-inline'"],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  );

  // Rate limiting for API protection
  app.use(
    rateLimit({
      windowMs: 60 * 1000, // 1 minute
      limit: 100, // 100 requests per minute
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  // CORS configuration for Android app and web clients
  app.enableCors({
    origin: true, // Allow all origins for Phase 1 development
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, X-Requested-With',
    exposedHeaders: 'Authorization',
  });

  // Global validation and error handling
  app.useGlobalPipes(new GlobalValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  // API Documentation
  const config = new DocumentBuilder()
    .setTitle('LabVerse API - Phase 1')
    .setDescription('Authentication and User Management API for Android App')
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT-auth',
    )
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management endpoints (Admin only)')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3002;
  await app.listen(port, '0.0.0.0');

  console.log('🚀 LabVerse API Phase 1 Started');
  console.log(`📡 Server: http://localhost:${port}`);
  console.log(`📚 API Docs: http://localhost:${port}/api/docs`);
  console.log('✅ Ready for Android app integration');
}

bootstrap();
