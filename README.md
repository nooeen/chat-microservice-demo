# Chat Microservices App Demo

## Overview

![Architecture Diagram](https://i.ibb.co/ynKx4kss/untitled.png)


Ứng dụng chat xây dựng theo kiến trúc microservices. Hoạt động như sau:
- Frontend build sử dụng React/Vite & shadcn 
- Frontend giao tiếp với hệ thống thông qua API Gateway. 
- API Gateway giao tiếp với 2 module Chat & Auth qua RabbitMQ
- Module Chat & Auth tương tác trực tiếp với hệ cơ sở dữ liệu MongoDB & Redis

## Công nghệ sử dụng

- React/Vite - shadcn
- NestJS
- MongoDB
- Redis
- RabbitMQ
- Docker

## Các bước chạy ứng dụng

1. Clone repository

```bash
git clone https://github.com/nooeen/chat-microservice-demo.git
```

1. Cài đặt các ứng dụng cần thiết:
- Docker
- Node.js & PNPM

1. Cài đặt các module:

```bash
pnpm install
```

4. Cài các dịch vụ của ứng dụng qua Docker
```bash
pnpm run services
```

5. Tạo file `.env` cho API Gateway & Chỉnh sửa nếu cần thiết (Hiện example hỗ trợ chạy localhost)

```bash
cp /apps/api/.env.example /apps/api/.env
```

6. Tạo file `.env` cho Frontend Web & Chỉnh sửa nếu cần thiết (Hiện example hỗ trợ chạy localhost)

```bash
cp /apps/web/.env.example /apps/web/.env
```

3. Chạy các module của ứng dụng

- Tại /apps/api
```bash
pnpm run start:api
pnpm run start:auth
pnpm run start:chat
```

- Tại /apps/web
```bash
pnpm run build
pnpm run start
```
