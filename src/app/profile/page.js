"use client";

import InfoBox from "@/components/layout/InfoBox";
import SuccessBox from "@/components/layout/SuccessBox";
import { set } from "mongoose";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const session = useSession();
  const [userName, setUserName] = useState("");
  const [image, setImage] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  // const [saved, setSaved] = useState(false);
  // const [isSaving, setIsSaving] = useState(false);
  // const [isUploading, setIsUploading] = useState(false);
  const { status } = session;
  //   console.log(session);

  useEffect(() => {
    if (status === "authenticated") {
      setUserName(session.data.user.name);
      setImage(session.data.user.image);
      fetch("/api/profile").then((response) => {
        response.json().then((data) => {
          setPhone(data.phone);
          setStreet(data.street);
          setPostalCode(data.postalCode);
          setCity(data.city);
          setCountry(data.country);
        });
      });
    }
  }, [session, status]);

  const handleProfileInfoUpdate = async (e) => {
    e.preventDefault();
    // setSaved(false);
    // setIsSaving(true);

    const savingPromise = new Promise(async (resolve, reject) => {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userName,
          image,
          street,
          phone,
          postalCode,
          city,
          country,
        }),
      });
      if (response.ok) resolve();
      else reject();
    });

    await toast.promise(savingPromise, {
      loading: "Saving...",
      success: "Saved!",
      error: "Error saving profile",
    });

    // setIsSaving(false);
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (files?.length === 1) {
      const data = new FormData();
      data.set("file", files[0]);
      // setIsUploading(true);

      // console.log("File to be uploaded:", files[0]);

      // const uploadPromise = new Promise(async (resolve, reject) => {
      //   const response = await fetch("/api/upload", {
      //     method: "POST",
      //     body: data,
      //     // headers: { "Content-Type": "multipart/form-data" },
      //   });

      //   if (response.ok) {
      //     const linkData = await response.json();
      //     // console.log("Link:", link);
      //     setImage(linkData.link);
      //     // setIsUploading(false);
      //     resolve();
      //   } else {
      //     reject();
      //   }
      // });

      const uploadPromise = fetch("/api/upload", {
        method: "POST",
        body: data,
      }).then((response) => {
        if (response.ok) {
          return response.json().then((link) => {
            setImage(link.link);
          });
        }
        throw new Error("Error uploading file");
      });

      await toast.promise(uploadPromise, {
        loading: "Uploading...",
        success: "Uploaded!",
        error: "Error uploading file",
      });
    }
  };

  if (status === "loading") {
    return "Loading...";
  }

  if (status === "unauthenticated") {
    redirect("/login");
  }

  return (
    <section className="mt-8">
      <h1 className="text-center text-primary text-4xl mb-4">Profile</h1>

      <div className="max-w-md mx-auto">
        {/* {saved && <SuccessBox>Profile saved!</SuccessBox>}

        {isSaving && <InfoBox>Saving</InfoBox>} */}

        {/* {isUploading && <InfoBox>Uploading...</InfoBox>} */}

        <div className="flex gap-4">
          <div>
            <div className="p-2 rounded-lg relative max-w-[120px]">
              {image && (
                <Image
                  className="rounded-lg w-full h-full mb-1"
                  src={image}
                  width={250}
                  height={250}
                  alt={"avatar"}
                />
              )}

              <label>
                <input
                  type="file"
                  name="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <span className="block border border-gray-300 rounded-lg cursor-pointer p-2 text-center">
                  Edit
                </span>
              </label>
            </div>
          </div>
          <form className="grow" onSubmit={handleProfileInfoUpdate}>
            <label>First and last name</label>
            <input
              type="text"
              placeholder="First and last name"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
            <label>Email</label>
            <input
              type="email"
              disabled={true}
              value={session.data.user.email}
            />
            <label>Phone</label>
            <input
              type="tel"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <label>Street</label>
            <input
              type="text"
              placeholder="Street address"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />

            <div className="flex gap-4">
              <div>
                <label>Postal Code</label>
                <input
                  type="text"
                  placeholder="Postal code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>

              <div>
                <label>City</label>
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>

            <label>Country</label>
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <button type="submit">Save</button>
          </form>
        </div>
      </div>
    </section>
  );
};
export default ProfilePage;
