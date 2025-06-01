import clientPromise from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { number } =  await params;

  try {
    const client = await clientPromise;
    const db = client.db();

    const numbersCollection = db.collection('numbers');
    const commentsCollection = db.collection('comments');

    const numberDoc = await numbersCollection.findOne({ number });

    if (!numberDoc) {
      return NextResponse.json({ error: 'Number not found.' }, { status: 404 });
    }

    const numberId = numberDoc._id;

    const totalReviews = await commentsCollection.countDocuments({ number_id: numberId });

    const latestReview = await commentsCollection
      .find({ number_id: numberId })
      .sort({ created_at: -1 })
      .limit(1)
      .toArray();

    const lastReviewedAt = latestReview.length > 0 ? latestReview[0].created_at : null;

    console.log(`this is last review at ${lastReviewedAt}`);

    return NextResponse.json({
      totalReviews,
      lastReviewedAt,
    });
  } catch (error) {
    console.error('Error fetching review stats:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
