import prisma from "../database/prisma.js";

export const findValidToken = async (token) => {
  return await prisma.passwordResetToken.findFirst({
    where: {
      token,
      used: false,
      expiresAt: {
        gt: new Date(),
      },
    },
  });
};

export const createToken = async (usuarioId, token, expiresAt) => {
  return await prisma.passwordResetToken.create({
    data: {
      usuarioId,
      token,
      expiresAt,
    },
  });
};

export const invalidateToken = async (token) => {
  return await prisma.passwordResetToken.updateMany({
    where: { token },
    data: { used: true },
  });
};
