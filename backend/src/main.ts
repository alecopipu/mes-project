import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WsAdapter } from '@nestjs/platform-ws';
import helmet from 'helmet';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // In production, HTTPS is usually handled by a reverse proxy (e.g., Nginx)
    // httpsOptions: {
    //   key: fs.readFileSync('path/to/your/private-key.pem'),
    //   cert: fs.readFileSync('path/to/your/certificate.pem'),
    // },
  });

  app.use(helmet());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useWebSocketAdapter(new WsAdapter(app));

  const config = new DocumentBuilder()
    .setTitle('MES API')
    .setDescription('The Manufacturing Execution System API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
