import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === 'POST') {
    try {
      const { userID, address, ipAddress } = request.body;
      if (!userID || !address) {
        return response.status(400).json({ error: 'UserID and address are required' });
      }

      // Insert user data into the UserData table
      await sql`
        INSERT INTO UserData (userID, address, ipAddress) 
        VALUES (${userID}, ${address}, ${ipAddress});
      `;
      
      // Retrieve all user data from the UserData table
      const userData = await sql`SELECT * FROM UserData;`;
      
      return response.status(200).json({ userData });
    } catch (error) {
      return response.status(500).json({ error });
    }
  } else {
    return response.status(405).json({ error: 'Method not allowed' });
  }
}
