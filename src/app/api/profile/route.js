import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { User } from "@/models/User";

export async function PUT(req) {
  mongoose.connect(process.env.MONGO_URL);
  const data = await req.json();
  const session = await getServerSession(authOptions);
  console.log({ session, data });
  const email = session?.user?.email;

  const update = {};

  // update user profile in the database
  await User.updateOne({ email }, data);

  // return Response.json(true);

  // Retrieve updated user profile from the database
  const updatedUser = await User.findOne({ email });

  return new Response(JSON.stringify(updatedUser), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET() {
  mongoose.connect(process.env.MONGO_URL);
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  // return Response.findOne(await User.findOne({ email }));
  const user = await User.findOne({
    email,
  });

  return new Response(JSON.stringify(user), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
