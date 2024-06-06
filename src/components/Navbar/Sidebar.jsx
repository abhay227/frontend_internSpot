import React, { useEffect, useState } from "react";
import logo from "../../Assets/logo.png";
import "./sidebar.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../Feature/Userslice";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import axios from "axios";

function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useSelector(selectUser);
  const [activeSubscriptions, setActiveSubscriptions] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        sidebarOpen &&
        !e.target.closest(".sidebar") &&
        !e.target.closest(".open-btn")
      ) {
        closeSidebar();
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [sidebarOpen]);

  useEffect(() => {
    const fetchActiveSubscriptions = async () => {
      try {
        const response = await axios.get(
          `https://backendinternspot.onrender.com/api/users/${user?.uid}`,
          {}
        );
        setActiveSubscriptions(response.data);
        console.log("active subscriptions", activeSubscriptions);
      } catch (error) {
        console.error("Error fetching active subscriptions:", error);
      }
    };

    fetchActiveSubscriptions();
  }, [user]);
  const logoutFunction = () => {
    signOut(auth);
    navigate("/");
  };

  const sendOtp = async () => {
    try {
      await axios.post("https://backendinternspot.onrender.com/api/payment/send-otp", {
        email: user.email,
      });
      setOtpSent(true);
      alert("OTP has been sent to your email.");
    } catch (error) {
      console.error("Error sending OTP:", error.message);
      alert("Failed to send OTP. Please try again.");
    }
  };

  const verifyOtp = async (amount) => {
    try {
      const response = await axios.post(
        "https://backendinternspot.onrender.com/api/payment/verify-otp",
        {
          email: user.email,
          otp,
        }
      );

      if (response.data.success) {
        // OTP is verified, now create Razorpay order
        const {
          data: { order },
        } = await axios.post("https://backendinternspot.onrender.com/api/payment/checkout", {
          amount,
        });
        setOrder(order);
        setOtpSent(false);
        alert("OTP verified. Proceeding to payment.");
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error.message);
      setOtpSent(false);
      alert("Failed to verify OTP. Please try again.");
    }
  };

  const handlePayment = async () => {
    if (!order) {
      return alert("Order not created.");
    }

    const {
      data: { key },
    } = await axios.get("https://backendinternspot.onrender.com/api/getkey");

    const options = {
      key,
      amount: order.amount,
      currency: "INR",
      name: "Your Company Name",
      description: "Test Transaction",
      order_id: order.id,
      handler: async (response) => {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
          response;

        try {
          const verifyResponse = await axios.post(
            "https://backendinternspot.onrender.com/api/payment/verify",
            {
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
            }
          );

          if (verifyResponse.data.success) {
            alert("Payment verified and completed successfully");
            window.location.href = `http://localhost:3000/create-resume?reference=${razorpay_payment_id}`;
          } else {
            alert("Payment capture failed. Please try again.");
          }
        } catch (error) {
          console.error(
            "Error during payment verification and capture:",
            error.message
          );
          alert("Failed to verify payment. Please try again.");
        }
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.contact,
      },
      theme: {
        color: "#F37254",
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <>
      <div className="App2 -mt-2 overflow-hidden">
        <Link to="/">
          <img src={logo} alt="" id="nav2-img" />{" "}
        </Link>
        <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <span className="cursor-pointer close-btn" onClick={closeSidebar}>
            &times;
          </span>
          {user ? (
            <>
              <div className="profile">
                <Link to={"/profile"}>
                  <img
                    className="rounded-full justify-center"
                    src={user.photo}
                    alt=""
                    srcset=""
                  />
                </Link>
                <p className=" text-center">
                  Profile name{" "}
                  <span className="font-bold text-blue-500">{user?.name}</span>
                </p>
              </div>
            </>
          ) : (
            <div className="auth"></div>
          )}
          <Link to="/internship">internships </Link>
          <Link to="/Jobs">Jobs </Link>

          <Link to={"/"} className="small">
            contact Us
          </Link>
          <hr />
          {user ? (
            <>
              <div className="addmore">
                {user ? (
                  <Link to={"/userapplication"}>
                    <p>My Applications</p>
                  </Link>
                ) : (
                  <Link to={"/register"}>
                    <p>My Applications</p>
                  </Link>
                )}

                {user ? (
                  <Link to={"/manage-subscription"}>
                    <p>My Subscriptions</p>
                  </Link>
                ) : (
                  <Link to={"/register"}>
                    <p>My Applications</p>
                  </Link>
                )}

                {activeSubscriptions &&
                activeSubscriptions.subscription.plan === "gold" ? (
                  // <button className="btn3" onClick={() => checkoutHandler(50)}>
                  //   <p className="mt-2"><i class="bi bi-star-fill"></i>Create Resume </p>
                  // </button>
                  <div className="addmore ">
                    {!otpSent ? (
                      <button onClick={() => sendOtp()}>
                        <Link >
                  <p>Send OTP to email</p>
                </Link>
                      </button>
                    ) : (
                      <div className="flex flex-col items-center mt-2 space-y-4">
                        <input
                          className="w-3/4 px-4 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="Enter OTP"
                        />
                        <button
                          onClick={() => verifyOtp(50)}
                          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          Verify OTP
                        </button>
                      </div>
                    )}
                    {order && (
                      <div className="goldenref">
                        <button onClick={() => handlePayment()}>
                          <p id="int" className="mt-2">
                            <i class="bi bi-star-fill"></i>Create Resume
                          </p>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p></p>
                )}

                <Link to="/your-resume">
                  <p>View Resume</p>
                </Link>
                <Link>
                  <p>More</p>
                </Link>

                <button className="bt-log" id="bt" onClick={logoutFunction}>
                  Logout <i class="bi bi-box-arrow-right"></i>
                </button>
                <br />
                <br />

                <button
                  onClick={logoutFunction}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
                >
                  Log Out <i class="bi bi-box-arrow-right"></i>
                </button>
              </div>
            </>
          ) : (
            <div className="addmore">
              <p>Register- As a Student</p>
              <p>Register- As a Employer</p>
              <br />
              <br />
            </div>
          )}
        </div>

        <div className="main">
          <span
            style={{ fontSize: "22px" }}
            className="open-btn"
            onClick={openSidebar}
          >
            &#9776;
          </span>
        </div>

        <div className="search2">
          <i class="bi bi-search"></i>
          <input type="search" placeholder="Search" />
        </div>

        {user ? (
          <></>
        ) : (
          <>
            <div className="reg">
              <Link to="/register">
                {" "}
                <button className="btn4">Register</button>
              </Link>
            </div>
            <div className="admin">
              <Link to={"/adminLog"}>
                <button id="admin"> Admin Login</button>
              </Link>
            </div>
          </>
        )}

        <p className="text-red-300">Hire Talent</p>
      </div>
    </>
  );
}

export default Sidebar;
