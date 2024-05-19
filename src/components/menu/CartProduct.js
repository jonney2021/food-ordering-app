import Image from "next/image";
import Trash from "../icons/Trash";
import { cartProductPrice } from "../../AppContext";

const CartProduct = ({ product, onRemove }) => {
  return (
    <div className="flex gap-4 border-b py-4 items-center" key={product.index}>
      <div className="w-24">
        <Image
          src={product.image}
          alt={product.name}
          width={240}
          height={240}
        />
      </div>
      <div className="grow">
        <h3 className="font-semibold">{product.name}</h3>
        {product.size && (
          <div className="text-sm ">
            Size: <span>{product.size.name}</span>
          </div>
        )}
        {product.extras?.length > 0 && (
          <div className="text-sm text-gray-500 flex">
            Extras:&nbsp;
            {product.extras.map((extra) => (
              <div key={extra.name}>
                {extra.name} ${extra.price}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="text-lg font-semibold">{cartProductPrice(product)}</div>
      {!!onRemove && (
        <div className="ml-2">
          <button type="button" onClick={() => onRemove(index)} className="p-2">
            <Trash />
          </button>
        </div>
      )}
    </div>
  );
};
export default CartProduct;
