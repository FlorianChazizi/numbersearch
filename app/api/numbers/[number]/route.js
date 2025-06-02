import clientPromise from '@/lib/database';
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    
  const { number } =  await params;

  console.log(`This is in the backend the id: ${number}`); // Debugging

  try {
    const client = await clientPromise;
    const db = client.db();
    const numbersCollection = db.collection('numbers');

    const numberDoc = await numbersCollection.findOne({ number });

    if (!numberDoc) {
      return NextResponse.json({ error: "Number not found" }, { status: 404 });
    }

    return NextResponse.json(numberDoc, { status: 200 });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
