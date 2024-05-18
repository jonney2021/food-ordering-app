"use client";

import { useState } from "react";
import EditableImage from "./EditableImage";
import useProfile from "../UseProfile";
import AddressInputs from "./AddressInputs";

const Userform = ({ user, onSave }) => {
  console.log("user:", user);
  const [userName, setUserName] = useState(user?.name || "");
  const [image, setImage] = useState(user?.image || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [street, setStreet] = useState(user?.street || "");
  const [postalCode, setPostalCode] = useState(user?.postalCode || "");
  const [city, setCity] = useState(user?.city || "");
  const [country, setCountry] = useState(user?.country || "");
  const [admin, setAdmin] = useState(user?.admin || false);

  const { data: loggedInUserData } = useProfile();

  const handleAddressChange = (propName, val) => {
    if (propName === "phone") setPhone(val);
    if (propName === "street") setStreet(val);
    if (propName === "postalCode") setPostalCode(val);
    if (propName === "city") setCity(val);
    if (propName === "country") setCountry(val);
  };
  return (
    <div className="md:flex gap-4">
      <div>
        <div className="p-2 rounded-lg relative max-w-[120px]">
          <EditableImage link={image} setLink={setImage} />
        </div>
      </div>
      <form
        className="grow"
        onSubmit={(e) =>
          onSave(e, {
            name: userName,
            image,
            phone,
            street,
            city,
            country,
            postalCode,
            admin,
          })
        }
      >
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
        <input type="email" disabled={true} value={user?.email} />
        <AddressInputs
          addressProps={{ phone, street, postalCode, city, country }}
          setAddressProps={handleAddressChange}
        />
        {loggedInUserData.admin && (
          <div>
            <label
              className="p-2 inline-flex items-center mb-2"
              htmlFor="adminCb"
            >
              <input
                id="adminCb"
                type="checkbox"
                // value={"1"}
                checked={admin}
                onChange={(e) => setAdmin(e.target.checked)}
              />
              <span>Admin</span>
            </label>
          </div>
        )}

        <button type="submit">Save</button>
      </form>
    </div>
  );
};
export default Userform;
