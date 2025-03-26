import React from "react";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import "./productCard.scss";
import LinesEllipsis from "react-lines-ellipsis";
const ProductCard = ({ product }) => {
  const options = {
    edit: false,
    color: "rgba(20, 20, 20, 0.1)",
    activeColor: "tomato",
    size: window.innerWidth < 600 ? 15 : 20,
    value: product.ratings,
    isHalf: true,
  };
  const maxLine = 1;
  return (
    // <Link className="productCard" to={`/product/${product._id}`}>
    //   <img src={product.images[0].url} alt={product.name} />
    //   <p>
    //     <LinesEllipsis
    //       text={product.name}
    //       maxLine={maxLine}
    //       ellipsis="..."
    //       trimRight
    //       basedOn="letters"
    //     />
    //   </p>
    //   <div>
    //     <ReactStars classNames="stars" {...options} />{" "}
    //     <span>({product.numOfReview} reviews)</span>
    //   </div>
    //   <span>₹{product.price}</span>
    // </Link>
    <Link className="productCard" to={`/product/${product?._id}`}>
  <img
    src={product?.images?.[0]?.url || "/images/placeholder.jpg"}
    alt={product?.name || "Product"}
  />
  <p>
    <LinesEllipsis
      text={product?.name || "Product Name"}
      maxLine={maxLine}
      ellipsis="..."
      trimRight
      basedOn="letters"
    />
  </p>
  <div>
    <ReactStars classNames="stars" {...options} />{" "}
    <span>({product?.numOfReview || 0} reviews)</span>
  </div>
  <span>₹{product?.price || 0}</span>
</Link>

  );
};

export default ProductCard;
