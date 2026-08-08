import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";

const createCategory = async (data: Prisma.CategoryCreateInput) => {
  return await prisma.category.create({
    data,
  });
};

const getAllCategories = async () => {
  return await prisma.category.findMany({
    where: {
      isDeleted: false,
    },
  });
};

const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });
  
  if (!category || category.isDeleted) {
    return null;
  }
  
  return category;
};

const updateCategory = async (id: string, data: Prisma.CategoryUpdateInput) => {
  // Ensure the category exists and is not soft deleted before updating
  const category = await getCategoryById(id);
  if (!category) {
    throw new Error("Category not found");
  }

  return await prisma.category.update({
    where: {
      id,
    },
    data,
  });
};

const softDeleteCategory = async (id: string) => {
  // Ensure the category exists and is not soft deleted before deleting
  const category = await getCategoryById(id);
  if (!category) {
    throw new Error("Category not found");
  }

  return await prisma.category.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  softDeleteCategory,
};

export default CategoryService;
