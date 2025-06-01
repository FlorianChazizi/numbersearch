import clientPromise from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const commentsCollection = db.collection('comments');

    // Aggregate to join comments with numbers
    const results = await commentsCollection.aggregate([
      { $match: { rank: 'dangerous' } },
      { $sort: { created_at: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'numbers',
          localField: 'number_id',
          foreignField: '_id',
          as: 'numberInfo',
        },
      },
      { $unwind: '$numberInfo' },
      {
        $project: {
          comment_id: '$_id',
          number: '$numberInfo.number',
          comment: 1,
          rank: 1,
          created_at: 1,
          _id: 0,
        },
      },
    ]).toArray();

    return NextResponse.json({ numbers: results });
  } catch (e) {
    console.error("Database Error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
