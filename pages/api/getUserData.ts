import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function getUserData(req: NextApiRequest, res: NextApiResponse) {
  const { id, userID, address, ipAddress } = req.query

  if (req.method === 'GET') {
    try {
      const userData = await prisma.userData.findFirst({
        where: {
          OR: [
            { id: id ? Number(id) : undefined },
            { userID: userID ? Number(userID) : undefined },
            { address: address ? String(address) : undefined },
            { ipAddress: ipAddress ? String(ipAddress) : undefined },
          ],
        },
      })
      if (userData) {
        res.status(200).json(userData)
      } else {
        res.status(404).json({ error: 'User not found' })
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
