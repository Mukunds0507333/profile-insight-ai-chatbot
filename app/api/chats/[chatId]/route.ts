
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Message from '@/models/Message';

export async function GET(req: NextRequest, { params }: { params: { chatId: string } }) {
  const { chatId } = params;
  try {
    await connectToDatabase();
    const messages = await Message.findOne({ demo_id: Number(chatId) });
    if (!messages) {
      return NextResponse.json({ message: 'Messages not found' }, { status: 404 });
    }
    return NextResponse.json(messages);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
