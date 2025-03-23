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
console.log("Product ID from URL:", id);

  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );


  const { success, error: reviewError } = useSelector(
    (state) => state.newReview
  );

  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const incrementOuantity = () => {
    if (product.stock <= quantity) return;
    const qty = quantity + 1;
    setQuantity(qty);
  };
  const decrementOuantity = () => {
    if (quantity === 1) return;
    const qty = quantity - 1;
    setQuantity(qty);
  };
  const addToCart = () => {
    dispatch(addToCartItems(id, quantity));
    alert.success("Successfully item added to cart");
  };

  const submitReviewToggle = () => {
    open ? setOpen(false) : setOpen(true);
  };

  const reviewSubmitHandler = () => {
    const myForm = new FormData();

    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("productId", id);

    dispatch(newReview(myForm));

    setOpen(false);
  };

  // options for react stars
  const options = {
    size: "large",
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  };

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

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="ProductDetailsPage">
          <MetaDate title={`${product.name} --ShopNest`} />
          <div className="ProductDetails">
            <div className="carouselBox">
              <Carousel className="CarouselImage">
                {product.images &&
                  product.images.map((item, i) => (
                    <img key={i} src={item.url} alt={`${i} Slide`} />
                  ))}
              </Carousel>
            </div>

            <div>
              <div className="detailsBlocks-1">
                <h2>{product.name}</h2>
                <p>Product # {product._id}</p>
              </div>
              <div className="detailsBlocks-2">
                <Rating classNames="stars" {...options} />{" "}
                <span>({product.numOfReview} reviews)</span>
              </div>
              <div className="detailsBlocks-3">
                <h1>{`₹${product.price}`}</h1>
                <p>Inclusive of all taxes</p>
                <div className="detailsBlocks-3-1">
                  <div className="detailsBlocks-3-1-1">
                    <button onClick={decrementOuantity}>-</button>
                    <input readOnly value={quantity} type="number" />
                    <button onClick={incrementOuantity}>+</button>
                    <button
                      disabled={product.stock < 1 ? true : false}
                      onClick={addToCart}>
                      Add to Cart
                    </button>
                  </div>
                  <p>
                    Status:
                    <b
                      className={product.stock < 1 ? "redColor" : "greenColor"}>
                      {product.stock < 1 ? "OutOfStock" : "InStock"}
                    </b>
                  </p>
                </div>
              </div>
              <div className="detailsBlocks-4">
                Description <p>{product.description}</p>
              </div>
              <button onClick={submitReviewToggle} className="submitReview">
                {" "}
                Write a Review
              </button>
            </div>
          </div>
          <h3 className="reviewHeading"> REVIEWS</h3>

          <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle}>
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
                onChange={(e) => setRating(e.target.value)}
                value={rating}
                size="large"
              />

              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}></textarea>
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

          {product.reviews && product.reviews[0] ? (
            <div className="reviews">
              {product.reviews &&
                product.reviews.map((review) => <ReviewCard review={review} />)}
            </div>
          ) : (
            <p className="noReviews">No Reviews Yet</p>
          )}
        </div>
      )}
    </Fragment>
  );
};

export default ProductDetails;
