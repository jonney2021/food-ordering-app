import { v2 as cloudinary } from "cloudinary";
import uniqid from "uniqid";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("file");

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const ext = file.name.split(".").slice(-1)[0];
    const newFileName = uniqid() + "." + ext;

    console.log(newFileName);

    // Read the file as a buffer
    const fileBuffer = await file.arrayBuffer();

    // Convert ArrayBuffer to Buffer
    const buffer = Buffer.from(fileBuffer);

    // Create a readable stream from the buffer
    const stream = Readable.from(buffer);

    // Upload the stream to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "food-ordering",
          // public_id: newFileName,
          public_id: newFileName.split(".")[0], // Exclude file extension from public_id
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      stream.pipe(uploadStream);
    });

    return new Response(JSON.stringify({ link: result.secure_url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
