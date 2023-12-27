const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");
const prisma = new PrismaClient();

async function main() {
  await prisma.Post.deleteMany({}); // <- Borra nada mas ejecutarse
  const numberOfPosts = 18;

  const posts = [];

  for (i = 0; i < numberOfPosts; i++) {
    const authorsId = [
      "844bf92e-a0c6-4e8d-96c1-ade38f976d29",
      "4d7a94d0-c7b5-4ea2-aa3c-9ff96376c3b9",
      "4aaf0f3e-b688-4f74-acd2-2598ffd16b61",
      "a49c3136-2982-4467-9365-cde8ca1b6882",
    ];
    const randomId = Math.floor(Math.random() * authorsId.length);
    const post = {
      title: faker.hacker.noun(),
      content: faker.hacker.phrase(),
      published: faker.datatype.boolean(),
      authorId: authorsId[randomId],
    };
    posts.push(post);
  }

  const addPosts = async () =>
    await prisma.Post.createMany({
      data: posts,
      skipDuplicates: true,
    });

  addPosts();
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
