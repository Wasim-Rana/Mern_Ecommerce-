import React, { useEffect, useRef } from "react";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layouts/MetaDate";
import { Typography } from "@mui/material";
import { useAlert } from "react-alert";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import axios from "axios";
import "./styles/payment.css";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import EventIcon from "@mui/icons-material/Event";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { createOrder, clearErrors } from "../../actions/orderAction";
import { useNavigate } from "react-router-dom";
const Payment = () => {
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();
  const element = useElements();
  const payBtn = useRef(null);
  const stripe = useStripe();
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.newOrder);
  const token = localStorage.getItem("token"); 

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100),
  };
  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo.subtotal,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
  };
  // const submitHandler = async (e) => {
  //   e.preventDefault();
  //   payBtn.current.disabled = true;
  //   try {
  //     const config = {
  //       withCredentials: true,
  //       Headers: {
  //         "Content-Type": "application/json",
  //       },
  //     };

  //     const { data } = await axios.post(
  //       "http://localhost:5000/api/v1/payment/process",
  //       paymentData,
  //       config
  //     );

  //     console.log("Payment API response:", data); // Debug API response

  //   if (!response.data || !response.data.client_secret) {
  //     throw new Error("Failed to get client_secret from backend.");
  //   }
  //     const client_secret = data.client_secret;

  //     if (!stripe || !element) return;

  //     const result = await stripe.confirmCardPayment(client_secret, {
  //       payment_method: {
  //         card: element.getElement(CardNumberElement),
  //         billing_details: {
  //           name: user.name,
  //           email: user.email,
  //           address: {
  //             line1: shippingInfo.address,
  //             city: shippingInfo.city,
  //             state: shippingInfo.state,
  //             postal_code: shippingInfo.pinCode,
  //             country: shippingInfo.country,
  //           },
  //         },
  //       },
  //     });

  //     if (result.error) {
  //       payBtn.current.disable = false;
  //       alert.error(result.error.message);
        
  //     } else {
  //       if (result.paymentIntent.status === "succeeded") {
  //         order.paymentInfo = {
  //           id: result.paymentIntent.id,
  //           status: result.paymentIntent.status,
  //         };
  //         dispatch(createOrder(order));
  //         alert.success("Payment successfull");

  //         navigate("/success");
  //       } else {
  //         alert.error("There's some issue while processing payment ");
  //       }
  //     }
  //   } catch (error) {
  //     payBtn.current.disable = false;
  //     alert.error(error.response.data.message);
  //   }
  // };
  const submitHandler = async (e) => {
    e.preventDefault();
    payBtn.current.disabled = true;
    try {
      const config = {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      };
      console.log("Token being sent:", token);

      const { data } = await axios.post(
        "http://localhost:5000/api/v1/payment/process",
        paymentData,
        config
      );
  
      console.log("Payment API response:", data);
  
      if (!data || !data.client_secret) {
        throw new Error("Failed to get client_secret from backend.");
      }
      const client_secret = data.client_secret;
  
      if (!stripe || !element) return;
  
      const cardElement = element.getElement(CardNumberElement);
      if (!cardElement) {
        alert.error("Please fill in the card details correctly.");
        payBtn.current.disabled = false;
        return;
      }
  
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user.name,
            email: user.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              postal_code: shippingInfo.pinCode,
              country: shippingInfo.country,
            },
          },
        },
      });
  
      if (result.error) {
        payBtn.current.disabled = false;
        alert.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };
          dispatch(createOrder(order));
          alert.success("Payment successful");
  
          navigate("/success");
        } else {
          alert.error("There's some issue while processing payment.");
        }
      }
    } catch (error) {
      payBtn.current.disabled = false;
      alert.error(
        error.response && error.response.data
          ? error.response.data.message
          : "Payment failed. Please try again."
      );
    }
  };
  
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, alert]);

  return (
    <div>
      <MetaData title="Payment" />
      <CheckoutSteps activeStep={2} />
      <div className="paymentContainer">
        <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
          <Typography>Card Info</Typography>
          <div>
            <CreditCardIcon />
            <CardNumberElement className="paymentInput" />
          </div>
          <div>
            <EventIcon />
            <CardExpiryElement className="paymentInput" />
          </div>
          <div>
            <VpnKeyIcon />
            <CardCvcElement className="paymentInput" />
          </div>

          <input
            type="submit"
            value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
            ref={payBtn}
            className="paymentFormBtn"
          />
        </form>
        <div className="sampleData">
          <box>
            <h7>Sample Data for testing perpose</h7>
            <p>
              <span>NUMBER</span> - 4242424242424242
            </p>
            <p>
              <span>CVC</span> - Any 3 digit
            </p>
            <p>
              <span>DATE</span> - Any future date
            </p>
          </box>
        </div>
      </div>
    </div>
  );
};

export default Payment;
