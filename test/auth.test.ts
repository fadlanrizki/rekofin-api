import { prismaClient } from "../src/application/database"

describe('test', () => {
  // it("should test prisma", async() => {
  //   const res = await prismaClient.user.findMany();
  //   console.log(res);
    
  // })


  it("unitest buat test prisma client", async() => {
    const user = await prismaClient.user.findFirst({
      where: {
        OR: [
          {
            username: "fadlanrizky19@gmail.com"
          },
          {
            email: "fadlanrizky19@gmail.com"
          }
        ]
      }
    })

    console.log(user);
    
  })

})