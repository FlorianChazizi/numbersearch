import clientPromise from '@/lib/database';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { number } = await req.json();

    if (!number) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('numbers');

    const existing = await collection.findOne({ number });

    if (existing) {
      await collection.updateOne(
        { number },
        {
          $inc: { views: 1 },
          $set: { last_time_viewed: new Date() },
        }
      );

      const updated = await collection.findOne({ number });
      return NextResponse.json(updated, { status: 200 });
    } else {
      const newEntry = {
        number,
        views: 1,
        last_time_viewed: new Date(),
        created_at: new Date()
      };

      await collection.insertOne(newEntry);
      return NextResponse.json(newEntry, { status: 201 });
    }
  } catch (error) {
    console.error('MongoDB Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
