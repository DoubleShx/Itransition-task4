import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function start() {
  const PORT = Number(process.env.PORT) || 3000
  const app = await NestFactory.create(AppModule)
  app.enableCors();
  console.log('current PORT', PORT)

  const config = new DocumentBuilder()
  .setTitle("Задача #4")
  .setDescription("Документация Rest Api")
  .setVersion("1.0.0")
  .addTag("Task 4")
  .build()

  const document = SwaggerModule.createDocument(app, config)
  
  SwaggerModule.setup('/api/docs', app, document)

  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`))
}

start()