import Image from "next/image";
import toast from "react-hot-toast";

const EditableImage = ({ link, setLink }) => {
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
            setLink(link.link);
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

  return (
    <>
      {link && (
        <Image
          className="rounded-lg w-full h-full mb-1"
          src={link}
          width={250}
          height={250}
          alt={"avatar"}
        />
      )}

      {!link && (
        <div className="text-center bg-gray-200 p-4 text-gray-500 rounded-lg">
          No Image
        </div>
      )}

      <label>
        <input
          type="file"
          name="file"
          className="hidden"
          onChange={handleFileChange}
        />
        <span className="block border border-gray-300 rounded-lg cursor-pointer p-2 text-center">
          Change image
        </span>
      </label>
    </>
  );
};
export default EditableImage;
