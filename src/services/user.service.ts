import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";

const createUser = async (data: Prisma.UserCreateInput) => {
  return await prisma.user.create({
    data,
  });
};

const getAllUsers = async () => {
  return await prisma.user.findMany({
    where: {
      isDeleted: false,
    },
  });
};

const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  
  if (!user || user.isDeleted) {
    return null;
  }
  
  return user;
};

const updateUser = async (id: string, data: Prisma.UserUpdateInput) => {
  const user = await getUserById(id);
  if (!user) {
    throw new Error("User not found");
  }

  return await prisma.user.update({
    where: { id },
    data,
  });
};

const deleteUser = async (id: string) => {
  const user = await getUserById(id);
  if (!user) {
    throw new Error("User not found");
  }

  return await prisma.user.update({
    where: { id },
    data: {
      isDeleted: true,
    },
  });
};

export const UserService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
