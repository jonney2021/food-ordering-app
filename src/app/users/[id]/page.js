"use client";

import useProfile from "@/components/UseProfile";
import UserTabs from "@/components/layout/UserTabs";
import Userform from "@/components/layout/Userform";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const EditUserPage = () => {
  const { loading, data } = useProfile();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetch("/api/profile?_id=" + id)
        .then((response) => response.json())
        .then((userData) => {
          setUser(userData);
          setLoadingUser(false);
        })
        .catch((err) => {
          setError("Error loading user information.");
          setLoadingUser(false);
        });
    }

    // fetch("/api/profile?_id=" + id).then((response) => {
    //   response.json().then((user) => {
    //     setUser(user);
    //   });
    // });
  }, []);

  const handleSaveButtonClick = async (e, data) => {
    e.preventDefault();
    const promise = new Promise(async (resolve, reject) => {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, _id: id }),
      });
      if (response.ok) {
        resolve();
      } else {
        reject();
      }
    });

    await toast.promise(promise, {
      loading: "Saving user...",
      success: "User saved!",
      error: "Error saving user",
    });
  };

  if (loading || loadingUser) {
    return "Loading user info...";
  }

  if (!data.admin) {
    return "Not an admin.";
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <section className="mt-8 mx-auto max-w-2xl">
      <UserTabs isAdmin={true} />
      <div className="mt-8">
        <Userform user={user} onSave={handleSaveButtonClick} />
      </div>
    </section>
  );
};
export default EditUserPage;
