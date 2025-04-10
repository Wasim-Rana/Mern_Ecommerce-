import React, { Fragment } from "react";
import "./styles/cart.scss";
import CartItemCard from "./CartItemCard.jsx";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCartItems,
  removeItemsFromCart,
} from "../../actions/cartAction.js";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
const Cart = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const increaseQuantity = (id, quantity, stock) => {
    const qty = quantity + 1;
    if (stock <= quantity) {
      return;
    }
    dispatch(addToCartItems(id, qty));
  };
  const decreaseQuantity = (id, quantity, stock) => {
    const qty = quantity - 1;
    if (1 >= quantity) {
      return;
    }
    dispatch(addToCartItems(id, qty));
  };
  const checkOutHandler = () => {
    navigate(`/login?redirect=shipping`);
  };
  return (
    <Fragment>
      {cartItems.length === 0 ? (
        <div className="emptyCart">
          <RemoveShoppingCartIcon />
          <Typography>No Product in Your Cart</Typography>
          <Link to="/products">View Products</Link>
        </div>
      ) : (
        <Fragment>
          <div className="cartPage">
            <div className="cartHeader">
              <p>Product</p>
              <p>Quantity</p>
              <p>SubTotal</p>
            </div>

            {cartItems &&
              cartItems.map((item) => (
                <div className="cartContainer" key={item.product}>
                  <CartItemCard
                    item={item}
                    deleteCartItem={removeItemsFromCart}
                  />

                  <div className="cartInput">
                    <button
                      onClick={() =>
                        decreaseQuantity(
                          item.product,
                          item.quantity,
                          item.stock
                        )
                      }>
                      -
                    </button>

                    <input type="number" value={item.quantity} readOnly />
                    <button
                      onClick={() =>
                        increaseQuantity(
                          item.product,
                          item.quantity,
                          item.stock
                        )
                      }>
                      +
                    </button>
                  </div>
                  <p className="cartSubtotal">{`₹${
                    item.price * item.quantity
                  }`}</p>
                </div>
              ))}

            <div className="cartGrossTotal">
              <div></div>
              <div className="cartGrossTotalBox">
                <p>Total</p>
                <p>{`₹${cartItems.reduce(
                  (acc, item) => acc + item.quantity * item.price,
                  0
                )}`}</p>
              </div>
              <div></div>
              <div className="checkOutBtn">
                <button onClick={checkOutHandler}>Check Out</button>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Cart;
