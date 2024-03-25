import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const REPORT_REASONS = [
  '스팸',
  '나체 이미지 또는 성적 행위',
  '혐로 발언 또는 상징',
  '폭력 또는 위험한 단체',
  '불법 또는 규제 상품 판매',
  '따돌림 또는 괴롭힘',
  '지식재산권 침해',
  '자살 또는 자해',
  '섭식 장애',
  '사기 또는 거짓',
  '약물',
  '거짓 정보',
  '마음에 들지 않습니다.',
];

async function seed() {
  console.log('🌱 Seeding...');
  console.time(`🌱 Database has been seeded`);

  console.time(`💥 Created Report reason...`);
  for (const reason of REPORT_REASONS) {
    await prisma.reportReason.upsert({
      where: {
        name: reason,
      },
      create: {
        name: reason,
      },
      update: {
        name: reason,
      },
    });
  }
  console.timeEnd(`💥 Created Report reason...`);

  console.timeEnd(`🌱 Database has been seeded`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
