import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { User } from "@/models/User";
import { UserInfo } from "@/models/UserInfo";

export async function PUT(req) {
  mongoose.connect(process.env.MONGO_URL);
  const data = await req.json();
  const { _id, name, image, phone, street, postalCode, city, country, admin } =
    data;

  // const session = await getServerSession(authOptions);
  // const email = session?.user?.email;

  let filter = {};
  if (_id) {
    filter = { _id };
  } else {
    const session = await getServerSession(authOptions);
    // console.log({ session, data });
    const email = session?.user?.email;
    filter = { email };
  }
  // update user profile in the database
  const user = await User.findOne(filter);
  await User.updateOne(filter, { name, image });
  const otherUserInfo = {
    phone,
    street,
    postalCode,
    city,
    country,
    admin,
  };
  await UserInfo.findOneAndUpdate({ email: user.email }, otherUserInfo, {
    upsert: true,
  });

  return Response.json(true);

  // // Retrieve updated user profile from the database
  // const updatedUser = await User.findOne({ email });
  // const updatedUserInfo = await UserInfo.findOne({ email: user.email });

  // return new Response(
  //   JSON.stringify({ user: updatedUser, userInfo: updatedUserInfo }),
  //   {
  //     status: 200,
  //     headers: { "Content-Type": "application/json" },
  //   }
  // );
}

export async function GET(req) {
  mongoose.connect(process.env.MONGO_URL);
  const url = new URL(req.url);
  const _id = url.searchParams.get("_id");
  let filterUser = {};
  if (_id) {
    filterUser = { _id };
  } else {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      return Response.json({});
    }
    filterUser = { email };
  }
  const user = await User.findOne(filterUser).lean();
  const userInfo = await UserInfo.findOne({ email: user.email }).lean();
  // const userData = { ...user, ...userInfo };
  // return new Response(JSON.stringify(userData), {
  //   status: 200,
  //   headers: { "Content-Type": "application/json" },
  // });
  return Response.json({ ...user, ...userInfo });
}
