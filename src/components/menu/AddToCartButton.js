import FlyingButton from "react-flying-item";

const AddToCartButton = ({ hasSizesOrExtras, onClick, basePrice, image }) => {
  if (!hasSizesOrExtras) {
    return (
      <div className="flying-button-parent mt-4">
        <FlyingButton stargetTop={"5%"} targetLeft={"95%"} src={image}>
          <div onClick={onClick}>Add to cart ${basePrice.toFixed(2)}</div>
        </FlyingButton>
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 bg-primary text-white rounded-full px-8 py-2"
    >
      <span>Add to cart (from ${basePrice})</span>
    </button>
  );
};
export default AddToCartButton;
