import React, { Fragment, useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  getProductDetails,
  newReview,
} from "../../actions/productAction";
import { useParams } from "react-router-dom";
import "./ProductDetails.scss";
import ReviewCard from "./ReviewCard";
import Loader from "../layouts/Loader/Loader";
import { useAlert } from "react-alert";
import MetaDate from "../layouts/MetaDate";
import { addToCartItems } from "../../actions/cartAction";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { NEW_REVIEW_RESET } from "../../constants/productConstant";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { id } = useParams();

  // ✅ Check API response in console for debugging
  console.log("Product ID from URL:", id);

  // ✅ Use productDetails from Redux state
  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );
  const { success, error: reviewError } = useSelector(
    (state) => state.newReview
  );

  // ✅ Define necessary states
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // ✅ Increment Quantity
  const incrementQuantity = () => {
    if (product?.stock <= quantity) return;
    setQuantity((prevQty) => prevQty + 1);
  };

  // ✅ Decrement Quantity
  const decrementQuantity = () => {
    if (quantity === 1) return;
    setQuantity((prevQty) => prevQty - 1);
  };

  // ✅ Add Product to Cart
  const addToCart = () => {
    dispatch(addToCartItems(id, quantity));
    alert.success("Successfully added item to cart");
  };

  // ✅ Toggle Review Modal
  const submitReviewToggle = () => {
    setOpen(!open);
  };

  // ✅ Submit Review Handler
  const reviewSubmitHandler = () => {
    if (!rating || !comment) {
      alert.error("Please fill out all fields before submitting.");
      return;
    }
    const myForm = new FormData();
    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("productId", id);

    dispatch(newReview(myForm));
    setOpen(false);
  };

  // ✅ Rating Options
  const options = {
    size: "large",
    value: product?.ratings || 0, // ✅ Safely handle undefined product
    readOnly: true,
    precision: 0.5,
  };

  // ✅ Fetch Product Data on Component Mount
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (reviewError) {
      alert.error(reviewError);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Review Submitted Successfully");
      dispatch({ type: NEW_REVIEW_RESET });
    }

    dispatch(getProductDetails(id));
  }, [dispatch, id, alert, error, reviewError, success]);

  // ✅ Return Loading State
  if (loading) {
    return <Loader />;
  }

  // ✅ Handle Product Not Found
  if (!product || !product.name) {
    return <p>Product not found!</p>;
  }

  return (
    <Fragment>
      <MetaDate title={`${product.name} -- ShopNest`} />
      <div className="ProductDetailsPage">
        <div className="ProductDetails">
          {/* ✅ Product Image Carousel */}
          <div className="carouselBox">
            <Carousel className="CarouselImage">
              {product.images && product.images.length > 0 ? (
                product.images.map((item, i) => (
                  <img key={i} src={item.url} alt={`${i} Slide`} />
                ))
              ) : (
                <img
                  src="/images/placeholder.jpg"
                  alt="No product images available"
                />
              )}
            </Carousel>
          </div>

          {/* ✅ Product Info */}
          <div>
            <div className="detailsBlocks-1">
              <h2>{product.name}</h2>
              <p>Product # {product._id}</p>
            </div>

            {/* ✅ Product Rating */}
            <div className="detailsBlocks-2">
              <Rating {...options} />
              <span>({product.numOfReviews || 0} reviews)</span>
            </div>

            {/* ✅ Product Price and Cart */}
            <div className="detailsBlocks-3">
              <h1>{`₹${product.price}`}</h1>
              <p>Inclusive of all taxes</p>
              <div className="detailsBlocks-3-1">
                <div className="detailsBlocks-3-1-1">
                  <button onClick={decrementQuantity}>-</button>
                  <input readOnly value={quantity} type="number" />
                  <button onClick={incrementQuantity}>+</button>
                </div>
                <button
                  disabled={product.stock < 1}
                  onClick={addToCart}
                >
                  Add to Cart
                </button>
                <p>
                  Status:
                  <b
                    className={product.stock < 1 ? "redColor" : "greenColor"}
                  >
                    {product.stock < 1 ? "Out of Stock" : "In Stock"}
                  </b>
                </p>
              </div>
            </div>

            {/* ✅ Product Description */}
            <div className="detailsBlocks-4">
              Description: <p>{product.description}</p>
            </div>

            {/* ✅ Submit Review Button */}
            <button onClick={submitReviewToggle} className="submitReview">
              Write a Review
            </button>
          </div>
        </div>

        {/* ✅ Reviews Section */}
        <h3 className="reviewHeading">REVIEWS</h3>
        <Dialog
          aria-labelledby="simple-dialog-title"
          open={open}
          onClose={submitReviewToggle}
        >
          <DialogTitle>Submit Review</DialogTitle>
          <DialogContent className="submitDialog">
            <Rating
              onChange={(e) => setRating(Number(e.target.value))}
              value={rating}
              size="large"
            />
            <textarea
              className="submitDialogTextArea"
              cols="30"
              rows="5"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={submitReviewToggle} color="secondary">
              Cancel
            </Button>
            <Button onClick={reviewSubmitHandler} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        {/* ✅ Show Reviews */}
        {product.reviews && product.reviews.length > 0 ? (
          <div className="reviews">
            {product.reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        ) : (
          <p className="noReviews">No Reviews Yet</p>
        )}
      </div>
    </Fragment>
  );
};

export default ProductDetails;