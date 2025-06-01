import clientPromise from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const numbersCollection = db.collection('numbers');

    const results = await numbersCollection.aggregate([
      // Sort by most recently viewed
      { $sort: { last_time_viewed: -1 } },
      // Limit to 10 results
      { $limit: 10 },
      // Join with comments to count them
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'number_id',
          as: 'comments'
        }
      },
      // Project only the fields we need
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
