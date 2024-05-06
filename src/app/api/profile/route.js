import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { User } from "@/models/User";
import { UserInfo } from "@/models/UserInfo";

export async function PUT(req) {
  mongoose.connect(process.env.MONGO_URL);
  const data = await req.json();
  const { name, image, phone, street, postalCode, city, country } = data;
  const session = await getServerSession(authOptions);
  console.log({ session, data });
  const email = session?.user?.email;

  // update user profile in the database
  await User.updateOne({ email }, { name, image });

  const otherUserInfo = { phone, street, postalCode, city, country };

  await UserInfo.findOneAndUpdate({ email }, otherUserInfo, { upsert: true });

  // Retrieve updated user profile from the database
  const updatedUser = await User.findOne({ email });
  const updatedUserInfo = await UserInfo.findOne({ email });

  return new Response(
    JSON.stringify({ user: updatedUser, userInfo: updatedUserInfo }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function GET() {
  mongoose.connect(process.env.MONGO_URL);
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return new Response(
      {},
      {
        status: 401,
        statusText: "Unauthorized",
      }
    );
  }
  // return Response.findOne(await User.findOne({ email }));
  const user = await User.findOne({
    email,
  }).lean();
  const userInfo = await UserInfo.findOne({ email }).lean();

  const userData = { ...user, ...userInfo };

  return new Response(JSON.stringify(userData), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
