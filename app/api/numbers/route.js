import clientPromise from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const comments = await db.collection('comments').aggregate([
      {
        $lookup: {
          from: 'numbers',
          localField: 'number_id',
          foreignField: '_id',
          as: 'number_info'
        }
      },
      { $unwind: '$number_info' },
      { $sort: { created_at: -1 } },
      { $limit: 10 },
      {
        $project: {
          comment_id: '$_id',
          number: '$number_info.number',
          comment: 1,
          rank: 1,
          created_at: 1
        }
      }
    ]).toArray();

    return NextResponse.json({ numbers: comments });
  } catch (e) {
    console.error('MongoDB Error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
