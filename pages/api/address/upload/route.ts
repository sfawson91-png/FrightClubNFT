import { put } from '@vercel/blob';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method !== 'POST') {
    response.status(405).send('Method Not Allowed');
    return;
  }

  let body;
  try {
    body = request.body;
  } catch (error: unknown) {
    if (error instanceof Error) {  // type guard
        console.error('Error uploading data:', error.message);
        response.status(500).send(`Internal Server Error: ${error.message}`);
    } else {
        // handle non-Error objects or re-throw
        response.status(500).send('Internal Server Error');
    }
}
  const { filename, ...userData } = body;

  if (!filename) {
    response.status(400).send('Filename is required');
    return;
  }

  try {
    const blob = await put(filename, JSON.stringify(userData), {
      access: 'public',
      contentType: 'application/json',
      token: process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN,  // <-- Add this line
    });
    response.status(200).json(blob);
} catch (error: unknown) {
    if (error instanceof Error) {
        console.error('Error uploading data:', error.message);
        response.status(500).send(`Internal Server Error: ${error.message}`);
    } else {
        response.status(500).send('Internal Server Error');
    }
}
};

export default handler;