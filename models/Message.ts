import mongoose, { Schema, Document } from 'mongoose';

interface IMessage extends Document {
  _id: string;
  demo_id: number;
  messages: { role: string; content: string }[];
  createdAt: Date;
}

const MessageSchema: Schema = new Schema({
  demo_id: { type: Number },
  messages: [
    {
      role: { type: String },
      content: { type: String },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.chat_demonstrations || mongoose.model<IMessage>('chat_demonstrations', MessageSchema);
