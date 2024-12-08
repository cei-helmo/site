// app/api/users/[id]/route.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const userId = parseInt(params.id)
  const { role } = await req.json()

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
    })
    return new Response(JSON.stringify(user), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update user role' }), { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
