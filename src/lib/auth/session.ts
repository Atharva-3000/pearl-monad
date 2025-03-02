import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getPrivateKeyForUser(did: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: did },
    select: { privateKey: true }
  });

  if (!user?.privateKey) throw new Error("No private key found");
  return user.privateKey;
}