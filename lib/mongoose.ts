import mongoose from 'mongoose';

const MONGODB_URI = process.env.NEXT_PUBLIC_MONGO_URI;

const connection: { connectionState?: number} = {};

async function connectToDatabase() {
  if (connection.connectionState) {
    return true;
  }

  try{
    console.log("URI ", MONGODB_URI);
    const db = await mongoose.connect(MONGODB_URI);
    
    connection.connectionState = db.connections[0].readyState;
    return true;
  }
  catch(err)
  {
    console.error(err);
  }
}

export default connectToDatabase;
