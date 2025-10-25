import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

type ApiResponse<T> = {
  data?: T;
  error?: string;
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    // Create a table for UserData model
    const result = await sql`
      CREATE TABLE UserData (
        id SERIAL PRIMARY KEY,
        userID TEXT NOT NULL,
        address TEXT NOT NULL,
        ipAddress TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    
    return response.status(200).json({ data: 'UserData table created' });
  } catch (error) {
    const apiResponse: ApiResponse<null> = {
      error: error as string,
    };
    return response.status(500).json(apiResponse);
  }
}