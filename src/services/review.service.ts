import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";

const createReview = async (data: Prisma.ReviewUncheckedCreateInput) => {
  // Check if product exists and is not soft deleted
  const product = await prisma.product.findUnique({
    where: { id: data.productId },
  });

  if (!product || product.isDeleted) {
    throw new Error("Product not found");
  }

  return await prisma.review.create({
    data,
  });
};

const getAllReviews = async () => {
  return await prisma.review.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      product: true,
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

const getReviewsByProduct = async (productId: string) => {
  // Check if product exists and is not soft deleted
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product || product.isDeleted) {
    throw new Error("Product not found");
  }

  return await prisma.review.findMany({
    where: {
      productId,
      isDeleted: false,
    },
    include: {
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

const updateReview = async (
  id: string,
  data: Prisma.ReviewUpdateInput,
  reqUserId: string,
  reqUserRole: string
) => {
  const review = await prisma.review.findUnique({
    where: { id },
  });

  if (!review || review.isDeleted) {
    throw new Error("Review not found");
  }

  // Ownership or Admin check
  if (review.userId !== reqUserId && reqUserRole !== "ADMIN") {
    throw new Error("You do not have permission to update this review");
  }

  return await prisma.review.update({
    where: { id },
    data: {
      rating: data.rating,
      comment: data.comment,
    },
  });
};

const softDeleteReview = async (id: string, reqUserId: string, reqUserRole: string) => {
  const review = await prisma.review.findUnique({
    where: { id },
  });

  if (!review || review.isDeleted) {
    throw new Error("Review not found");
  }

  // Ownership or Admin check
  if (review.userId !== reqUserId && reqUserRole !== "ADMIN") {
    throw new Error("You do not have permission to delete this review");
  }

  return await prisma.review.update({
    where: { id },
    data: {
      isDeleted: true,
    },
  });
};

export const ReviewService = {
  createReview,
  getAllReviews,
  getReviewsByProduct,
  updateReview,
  softDeleteReview,
};

export default ReviewService;
