import { prismaClient } from "../src/application/database";
import bcrypt from "bcryptjs";
import { Role } from "../src/generated/prisma";

describe("test", () => {
  it("should add seed ", async () => {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = await prismaClient.user.create({
      data: {
        username: "admin",
        fullname: "admin",
        role: Role.ADMIN,
        email: "admin@gmail.com",
        password: hashedPassword,
      },
    });

    console.log(admin);
  });
});
