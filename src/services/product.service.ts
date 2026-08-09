import { Prisma, Status } from "@prisma/client";
import prisma from "../lib/prisma";

const createProduct = async (data: Prisma.ProductUncheckedCreateInput) => {
  const { title, price, description, imageUrl, categoryId, userId, status } = data as any;

  return await prisma.product.create({
    data: {
      title,
      price: Number(price),
      description: description || null,
      imageUrl: imageUrl || null,
      categoryId,
      userId,
      status: status || "ACTIVE",
    },
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
      reviews: true,
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

  const isAdminRole = Boolean(reqUserRole && reqUserRole.toUpperCase() === "ADMIN");

  // Creator or Admin check
  if (product.userId !== reqUserId && !isAdminRole) {
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

  const isAdminRole = Boolean(reqUserRole && reqUserRole.toUpperCase() === "ADMIN");

  // Creator or Admin check
  if (product.userId !== reqUserId && !isAdminRole) {
    throw new Error("You do not have permission to delete this product");
  }

  // Soft delete product
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
  deleteProduct: softDeleteProduct,
};

export default ProductService;
