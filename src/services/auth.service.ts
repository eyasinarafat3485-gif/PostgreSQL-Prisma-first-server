import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;

const registerUser = async (data: Prisma.UserCreateInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });
  
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, saltRounds);

  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

const loginUser = async (data: any) => {
  const { email, password } = data;
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.isDeleted) {
    throw new Error("Invalid email or password");
  }

  if (user.status === "INACTIVE") {
    throw new Error("User account is inactive");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error("Invalid email or password");
  }

  const jwtSecret = process.env.JWT_SECRET || "default_jwt_secret";
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1d";

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    jwtSecret,
    { expiresIn: jwtExpiresIn as jwt.SignOptions["expiresIn"] }
  );

  const { password: _, ...userWithoutPassword } = user;

  return {
    accessToken: token,
    user: userWithoutPassword,
  };
};

const getMe = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user || user.isDeleted) {
    throw new Error("User not found");
  }

  return user;
};

export const AuthService = {
  registerUser,
  loginUser,
  getMe,
};

export default AuthService;
