import { prismaClient } from "../src/application/database"

describe('test', () => {
  it("should test prisma", async() => {
    const res = await prismaClient.user.findMany();
    console.log(res);
    
  })
})