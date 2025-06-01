// pages/api/test-db.js
import clientPromise from '@/lib/database'; 

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const result = await db.command({ ping: 1 });

    return Response.json({ message: 'Connected to MongoDB!', result });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Connection failed', error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
