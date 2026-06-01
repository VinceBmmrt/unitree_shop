import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import compression from '@fastify/compress';
import helmet from '@fastify/helmet';
import cookie from '@fastify/cookie';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: process.env.NODE_ENV !== 'production' }),
  );

  const config = app.get(ConfigService);

  // Security
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  });
  await app.register(compression);
  await app.register(cookie);

  // CORS — tightly scoped; expand per environment
  app.enableCors({
    origin: config.get<string[]>('ALLOWED_ORIGINS', ['http://localhost:3000']),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor(), new TransformInterceptor());

  // OpenAPI — only exposed in non-production (gate behind VPN in prod)
  if (config.get('NODE_ENV') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Unitree Shop API')
      .setDescription('Enterprise robotics e-commerce platform API')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth')
      .addTag('products')
      .addTag('orders')
      .addTag('payments')
      .addTag('quotes')
      .addTag('support')
      .addTag('admin')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  app.getHttpAdapter().get('/api/health', (_req: any, reply: any) => {
    reply.send({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const port = config.get<number>('PORT', 3001);
  await app.listen(port, '0.0.0.0');
  console.log(`API running on http://0.0.0.0:${port}`);
}

bootstrap().catch((err) => {
  console.error('Fatal bootstrap error:', err);
  process.exit(1);
});
