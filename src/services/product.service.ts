import { Prisma, Status } from "@prisma/client";
import prisma from "../lib/prisma";

const createProduct = async (data: Prisma.ProductUncheckedCreateInput) => {
  return await prisma.product.create({
    data,
  });
};

const getAllProducts = async (filters: { categoryId?: string; status?: Status }) => {
  const where: Prisma.ProductWhereInput = {
    isDeleted: false,
  };

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  return await prisma.product.findMany({
    where,
    include: {
      category: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

const getProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      reviews: {
        where: {
          isDeleted: false,
        },
      },
    },
  });

  if (!product || product.isDeleted) {
    return null;
  }

  return product;
};

const updateProduct = async (
  id: string,
  data: Prisma.ProductUpdateInput,
  reqUserId: string,
  reqUserRole: string
) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product || product.isDeleted) {
    throw new Error("Product not found");
  }

  // Creator or Admin check
  if (product.userId !== reqUserId && reqUserRole !== "ADMIN") {
    throw new Error("You do not have permission to update this product");
  }

  return await prisma.product.update({
    where: { id },
    data,
  });
};

const softDeleteProduct = async (id: string, reqUserId: string, reqUserRole: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product || product.isDeleted) {
    throw new Error("Product not found");
  }

  // Creator or Admin check
  if (product.userId !== reqUserId && reqUserRole !== "ADMIN") {
    throw new Error("You do not have permission to delete this product");
  }

  return await prisma.product.update({
    where: { id },
    data: {
      isDeleted: true,
    },
  });
};

export const ProductService = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  softDeleteProduct,
};

export default ProductService;
