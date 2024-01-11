const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");
const prisma = new PrismaClient();

async function main() {
  await prisma.adoptionRequest.deleteMany({});
  await prisma.Dog.deleteMany({}); // <- Borra nada mas ejecutarse
  const numberOfDogs = 16;

  const dogs = [];

  for (i = 0; i < numberOfDogs; i++) {
    //const authorsId = [
    //"844bf92e-a0c6-4e8d-96c1-ade38f976d29",
    //];
    //const randomId = Math.floor(Math.random() * authorsId.length);
    const dog = {
      dogName: faker.person.firstName(),
      dogAge: faker.number.int({ min: 0, max: 20, precision: 0.1 }),
      dogWeight: faker.number.float({ min: 0, precision: 0.1 }),
      dogSex: faker.person.sex(),
      dogBreed: faker.animal.dog(),
      dogAdopted: false,
    };
    dogs.push(dog);
  }

  const addPosts = async () =>
    await prisma.Dog.createMany({
      data: dogs,
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
