import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  {
    name: "Tecnología",
    slug: "tecnologia",
    description: "Dispositivos y accesorios para el día a día.",
    position: 1,
  },
  {
    name: "Hogar",
    slug: "hogar",
    description: "Objetos funcionales para espacios con intención.",
    position: 2,
  },
  {
    name: "Oficina",
    slug: "oficina",
    description: "Herramientas para trabajar con claridad.",
    position: 3,
  },
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  console.log(`Seed completado: ${categories.length} categorías.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
