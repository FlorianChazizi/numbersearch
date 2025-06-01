import clientPromise from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET(_req, { params }) {
  const { number } = params;

  try {
    const client = await clientPromise;
    const db = client.db();

    const numbersCollection = db.collection('numbers');
    const commentsCollection = db.collection('comments');

    // Find the number document
    const numberDoc = await numbersCollection.findOne({ number });

    if (!numberDoc) {
      return NextResponse.json({ error: 'Number not found.' }, { status: 404 });
    }

    // Fetch comments for this number
    const comments = await commentsCollection
      .find({ number_id: numberDoc._id }) // Referenced by ObjectId
      .sort({ created_at: -1 })
      .project({ comment: 1, rank: 1, created_at: 1, _id: 0 })
      .toArray();

    // Calculate danger score
    const weights = {
      safe: 0,
      useful: 0,
      neutral: 1,
      annoying: 2,
      dangerous: 3,
    };

    let totalScore = 0;
    let maxScore = comments.length * 3;

    comments.forEach(comment => {
      totalScore += weights[comment.rank] ?? 0;
    });

    const dangerRate = maxScore === 0 ? 0 : Math.round((totalScore / maxScore) * 100);

    return NextResponse.json({
      comments,
      dangerRate,
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
