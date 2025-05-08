import React, { Fragment, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlineMail } from "react-icons/hi";
import { AiFillUnlock } from "react-icons/ai";
import { BiUser } from "react-icons/bi";
import "./LoginSignUp.scss";
import Profile from "../images/profilePng.png";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, login, registerUser } from "../../actions/userAction";
import { useAlert } from "react-alert";
import Loader from "../layouts/Loader/Loader";
import { useNavigate, useLocation } from "react-router-dom";

const LoginSignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const alert = useAlert();
  const { error, loading, isAuthenticated, user: reduxUser } = useSelector(
    (state) => state.user
  );

  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = user;

  const [avatar, setAvatar] = useState();
  const [avatarPreview, setAvatarPreview] = useState(Profile);
  

  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(login(loginEmail, loginPassword));
    // console.log("login form submitted");
  };

  const registerSubmit = (e) => {
    e.preventDefault(); // Ensure event is being prevented
  
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("password", password);
  
    if (avatar) {
      myForm.append("avatar", avatar); // Append file correctly
    }
  
    console.log("FormData Entries:");
    for (let [key, value] of myForm.entries()) {
      console.log(`${key}:`, value); // Debugging: Check if avatar is included
    }
  
    dispatch(registerUser(myForm)); // Ensure this function is correctly defined and imported
  };
  

  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: [e.target.value] });
    }
  };

  const redirect = location.search ? location.search.split("=")[1] : "/account";
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  
    if (isAuthenticated) {
      if (reduxUser.role === "admin") {
        navigate("/admin/dashboard"); // ✅ Admin dashboard
      } else {
        navigate("/account"); // ✅ User profile
      }
    }
  }, [dispatch, error, alert, isAuthenticated, reduxUser, navigate]);

  const switchTabs = (e, tab) => {
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    } else {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="LoginSignUpContainer">
            <div className="LoginSignUpBox">
              <div>
                <div className="login_signUp_toggle">
                  <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                  <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
                </div>
                <button ref={switcherTab}></button>
              </div>
              <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                <div className="loginEmail">
                  <HiOutlineMail />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                    }}
                  />
                </div>
                <div className="loginPassword">
                  <AiFillUnlock />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                    }}
                  />
                </div>
                <Link to="/password/forgot">Forget Password ?</Link>
                <input type="submit" value="Login" className="loginBtn" />
              </form>
              <form
                className="SignUpForm"
                ref={registerTab}
                encType="multipart/form-data"
                onSubmit={registerSubmit}>
                <div className="SignUpName">
                  <BiUser />
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="SignUpEmail">
                  <HiOutlineMail />

                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="SignUpPassword">
                  <AiFillUnlock />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    name="password"
                    value={password}
                    onChange={registerDataChange}
                  />
                </div>
                <div id="registerImage">
                  <img src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={registerDataChange}
                  />
                </div>
                <input
                  type="submit"
                  value="Register"
                  className="signUpBtn"
                  disabled={false}
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default LoginSignUp;
