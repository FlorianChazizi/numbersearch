import clientPromise from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const numbersCollection = db.collection('numbers');

    const results = await numbersCollection.aggregate([
      // Sort by highest views
      { $sort: { views: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'number_id',
          as: 'comments'
        }
      },
      {
        $project: {
          _id: 0,
          number: 1,
          views: 1,
          comments: { $size: '$comments' }
        }
      }
    ]).toArray();

    return NextResponse.json({ numbers: results });
  } catch (e) {
    console.error('Database Error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
