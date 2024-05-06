import { useState } from "react";
import Plus from "../icons/Plus";
import Trash from "../icons/Trash";
import ChevronDown from "../icons/ChevronDown";
import ChevronUp from "../icons/ChevronUp";

const MenuItemPriceProps = ({ name, addLabel, props, setProps }) => {
  const [isOpen, setIsOpen] = useState(false);
  const addProp = () => {
    setProps((oldProps) => {
      return [...oldProps, { name: "", price: 0 }];
    });
  };

  const editProp = (e, index, prop) => {
    const newValue = e.target.value;
    setProps((prevProps) => {
      const newProps = [...prevProps];
      newProps[index][prop] = newValue;
      return newProps;
    });
  };

  const removeProp = (indexToRemove) => {
    setProps((prev) => prev?.filter((v, index) => index !== indexToRemove));
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-gray-200 p-2 rounded-md mb-2">
      <button
        className="inline-flex p-1 border-0 justify-start"
        type="button"
        onClick={handleToggle}
      >
        {isOpen && <ChevronUp />}
        {!isOpen && <ChevronDown />}

        <span>{name}</span>
        <span>({props?.length})</span>
      </button>

      <div className={isOpen ? "block" : "hidden"}>
        {props?.length > 0 &&
          props.map((size, index) => (
            <div key={index} className="flex items-end gap-2">
              <div>
                <label>Name</label>
                <input
                  type="text"
                  value={size.name}
                  placeholder="Size name"
                  onChange={(e) => editProp(e, index, "name")}
                />
              </div>
              <div>
                <label>Extra price</label>
                <input
                  type="text"
                  value={size.price}
                  placeholder="Size price"
                  onChange={(e) => editProp(e, index, "price")}
                />
              </div>
              <div>
                <button
                  className="bg-white mb-2 px-2"
                  type="button"
                  onClick={() => removeProp(index)}
                >
                  <Trash />
                </button>
              </div>
            </div>
          ))}
        <button
          className="bg-white items-center"
          type="button"
          onClick={addProp}
        >
          <Plus className="w-4 h-4" />
          <span>{addLabel}</span>
        </button>
      </div>
    </div>
  );
};
export default MenuItemPriceProps;
