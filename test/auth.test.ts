import { prismaClient } from "../src/application/database";
import bcrypt from "bcryptjs";

describe("test", () => {
  it("should add seed ", async () => {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = await prismaClient.admin.create({
      data: {
        name: "admin",
        email: "admin@gmail.com",
        password: hashedPassword,
      },
    });

    console.log(admin);
  });
});
