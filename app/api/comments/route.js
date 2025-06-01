import clientPromise from '@/lib/database';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { number, comment, rank } = await req.json();
    console.log(`Number: ${number}, Comment: ${comment}, Rating Type: ${rank}`);

    if (!number || !comment || !rank) {
      return NextResponse.json(
        { error: 'Missing number, comment, or rating type.' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const numbersCollection = db.collection('numbers');
    const commentsCollection = db.collection('comments');

    const numberDoc = await numbersCollection.findOne({ number });

    if (!numberDoc) {
      return NextResponse.json({ error: 'Number not found.' }, { status: 404 });
    }

    const allowedRatings = ['useful', 'safe', 'neutral', 'annoying', 'dangerous'];
    if (!allowedRatings.includes(rank)) {
      return NextResponse.json({ error: 'Invalid rating type.' }, { status: 400 });
    }

    // Insert comment
    await commentsCollection.insertOne({
      number_id: numberDoc._id, // Store the ID of the number document
      number, 
      comment,
      rank,
      created_at: new Date()
    });

    // Update last review time in numbers collection
    await numbersCollection.updateOne(
      { number },
      { $set: { last_review: new Date() } }
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error saving comment and rating:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}