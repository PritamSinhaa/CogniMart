const calculateDiscountedPrice = (price, discount = 0) => {
  return Number(
    (
      price -
      (price * discount) / 100
    ).toFixed(2)
  );
};

export default calculateDiscountedPrice;