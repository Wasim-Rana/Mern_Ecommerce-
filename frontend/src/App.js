import { useEffect, useState } from "react";
import "./App.css";
import webloader from "webfontloader";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "./component/layouts/Header/Header";
import Footer from "./component/layouts/Footer/Footer";
import Home from "./component/Home/Home.jsx";
import About from "./component/Home/About.jsx";

import ProductDetails from "./component/Product/ProductDetails";
import Products from "./component/Product/Products.jsx";
import Search from "./component/Product/Search";
import LoginSignUp from "./component/User/LoginSignUp";
import store from "./store.js";
import { loadUser } from "./actions/userAction.js";
import Profile from "./component/User/Profile.jsx";
import UpdateProfile from "./component/User/UpdateProfile.jsx";
import UpdatePassword from "./component/User/UpdatePassword.jsx";
import ForgotPassword from "./component/User/ForgotPassword.jsx";
import ResetPassword from "./component/User/ResetPassword";
import Cart from "./component/Cart/Cart.jsx";
import Shipping from "./component/Cart/Shipping.jsx";
import ConfirmOrder from "./component/Cart/ConfirmOrder.jsx";
import Payment from "./component/Cart/Payment.jsx";
import { useSelector } from "react-redux";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./component/Cart/OrderSuccess.jsx";
import MyOrders from "./component/Order/myOrders.jsx";
import OrderDetails from "./component/Order/OrderDetails.jsx";
import ProductList from "./component/admin/ProductList.jsx";
import Dashboard from "./component/admin/Dashboard.jsx";
import NewProduct from "./component/admin/NewProduct.jsx";
import UpdateProduct from "./component/admin/UpdateProduct.jsx";
import OrderList from "./component/admin/OrderList.jsx";
import ProcessOrder from "./component/admin/ProcessOrder.jsx";
import UsersList from "./component/admin/UsersList.jsx";
import UpdateUser from "./component/admin/UpdateUser.jsx";
import ProductReviews from "./component/admin/ProductReviews.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./component/other/theme.js";
function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [stripeApiKey, setStripeApiKey] = useState("");
  // const cors = require("cors");

  // app.use(cors({
  //   origin: "http://localhost:3000", // Adjust for frontend URL
  //   credentials: true
  // }));

  async function getStripeApiKey() {
    try {
      const { data } = await axios.get("/api/v1/stripeapikey", { withCredentials: true });
      setStripeApiKey(data.stripeApiKey);
    } catch (error) {
      console.error("Error fetching Stripe API key:", error);
    }
  }

  useEffect(() => {
    getStripeApiKey();

    webloader.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
    store.dispatch(loadUser());
  }, []);

  return (
    // <ChakraProvider theme={theme}>
    <Router>
      <Header />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/about" element={<About />} />

        <Route exact path="/product/:id" element={<ProductDetails />} />
        <Route exact path="/products" element={<Products />} />
        <Route exact path="/Search" element={<Search />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route exact path="/login" element={<LoginSignUp />} />
        {isAuthenticated && (
          <Route exact path="/account" element={<Profile />} />
        )}
        {isAuthenticated && (
          <Route exact path="/me/update" element={<UpdateProfile />} />
        )}
        {isAuthenticated && (
          <Route exact path="/password/update" element={<UpdatePassword />} />
        )}
        <Route exact path="/password/forgot" element={<ForgotPassword />} />
        <Route
          exact
          path="/password/reset/:token"
          element={<ResetPassword />}
        />
        <Route exact path="/cart" element={<Cart />} />

        {isAuthenticated && (
          <Route exact path="/login/shipping" element={<Shipping />} />
        )}
        {isAuthenticated && (
          <Route exact path="/order/confirm" element={<ConfirmOrder />} />
        )}

        {isAuthenticated && stripeApiKey && (
          <Route
            exact
            path="/process/payment"
            element={
              <Elements stripe={loadStripe(`${stripeApiKey}`)}>
                <Payment/>
                {/* {" "} */}
              </Elements>
            }
          />
        )}

        {isAuthenticated && (
          <Route exact path="/success" element={<OrderSuccess />} />
        )}
        {isAuthenticated && (
          <Route exact path="/orders" element={<MyOrders />} />
        )}
        {isAuthenticated && (
          <Route exact path="/order/:id" element={<OrderDetails />} />
        )}
        {isAuthenticated && user.role === "admin" && (
          <Route exact path="/admin/dashboard" element={<Dashboard />} />
        )}
        {isAuthenticated && user.role === "admin" && (
          <Route exact path="/admin/products" element={<ProductList />} />
        )}
        {isAuthenticated && user.role === "admin" && (
          <Route exact path="/admin/product" element={<NewProduct />} />
        )}
        {isAuthenticated && user.role === "admin" && (
          <Route exact path="/admin/product/:id" element={<UpdateProduct />} />
        )}
        {isAuthenticated && user.role === "admin" && (
          <Route exact path="/admin/orders" element={<OrderList />} />
        )}
        {isAuthenticated && user.role === "admin" && (
          <Route exact path="/admin/order/:id" element={<ProcessOrder />} />
        )}
        {isAuthenticated && user.role === "admin" && (
          <Route exact path="/admin/users" element={<UsersList />} />
        )}
        {isAuthenticated && user.role === "admin" && (
          <Route exact path="/admin/user/:id" element={<UpdateUser />} />
        )}
        {isAuthenticated && user.role === "admin" && (
          <Route exact path="/admin/reviews" element={<ProductReviews />} />
        )}
      </Routes>
      <Footer />
    </Router>
    // </ChakraProvider>
  );
}

export default App;