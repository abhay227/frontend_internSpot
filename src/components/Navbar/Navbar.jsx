import React, { useState, useRef, useEffect } from "react";
import logo from "../../Assets/logo.png";
import { Link } from "react-router-dom";
import "./navbar.css";
import Sidebar from "./Sidebar";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../../firebase/firebase";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../Feature/Userslice";
import { selectUser } from "../../Feature/Userslice";
import { useNavigate } from "react-router-dom";
import { fetchResume } from "../../Feature/resumeSlice";
import axios from "axios";
function Navbar() {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [isDivVisibleForintern, setDivVisibleForintern] = useState(false);
  const [isDivVisibleForJob, setDivVisibleFroJob] = useState(false);
  const [isDivVisibleForlogin, setDivVisibleFrologin] = useState(false);
  const [isDivVisibleForProfile, setDivVisibleProfile] = useState(false);
  const [isStudent, setStudent] = useState(true);
  const [activeSubscriptions, setActiveSubscriptions] = useState("");
  const popupRef = useRef(null);
  const photoRef = useRef(null);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [order, setOrder] = useState(null);
  const { resume, loading, error } = useSelector((state) => state.resume);
  const dispatch = useDispatch();

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

  const loginFunction = () => {
    signInWithPopup(auth, provider)
      .then(async (res) => {
        const user = res.user;
        console.log(user);
        const { uid, displayName, email, photoURL } = user;

        try {
          const response = await axios.post("https://backendinternspot.onrender.com/api/users", {
            uid,
            name: displayName,
            email,
            photo: photoURL,
            subscription: {
              id: "",
              status: "inactive", // default status
              plan: "Free", // default plan
            },
          });

          //   //Update Redux state with user data
          //  dispatch(login(response.data));
          //  navigate('/profile'); // redirect after login
          //  console.log(user);

          // Fetch resume after login
          // Fetch resume after login
          dispatch(fetchResume(uid));
        } catch (error) {
          console.error("Error saving user to backend:", error);
        }

        setDivVisibleFrologin(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleMouseLeave = (event) => {
    if (
      !popupRef.current.contains(event.relatedTarget) &&
      !photoRef.current.contains(event.relatedTarget)
    ) {
      hidetheProfile();
    }
  };

  const showLogin = () => {
    setDivVisibleFrologin(true);
  };
  const closeLogin = () => {
    setDivVisibleFrologin(false);
  };
  const setTrueForStudent = () => {
    setStudent(false);
  };
  const setFalseForStudent = () => {
    setStudent(true);
  };
  //  for showing profile dropdown
  const showtheProfile = () => {
    setDivVisibleProfile(true);
    document.getElementById("ico3").className = "bi bi-caret-up-fill";
  };
  const hidetheProfile = () => {
    document.getElementById("ico3").className = "bi bi-caret-down-fill";
    setDivVisibleProfile(false);
  };

  const showInternShips = () => {
    document.getElementById("ico").className = "bi bi-caret-up-fill";
    setDivVisibleForintern(true);
  };
  const hideInternShips = () => {
    document.getElementById("ico").className = "bi bi-caret-down-fill";
    setDivVisibleForintern(false);
  };
  const showJobs = () => {
    document.getElementById("ico2").className = "bi bi-caret-up-fill";
    setDivVisibleFroJob(true);
  };
  const hideJobs = () => {
    document.getElementById("ico2").className = "bi bi-caret-down-fill";
    setDivVisibleFroJob(false);
  };

  const logoutFunction = () => {
    signOut(auth);
    navigate("/");
  };

  return (
    <div>
      <nav className="nav1">
        <ul>
          <div className="img">
            <Link to={"/"}>
              <img src={logo} alt="" srcset="" />
            </Link>
          </div>
          <div className="elem">
            <Link to={"/Internship"}>
              {" "}
              <p
                id="int"
                className=""
                onMouseEnter={showInternShips}
                onMouseLeave={hideInternShips}
              >
                {" "}
                Internships{" "}
              </p>
            </Link>
            <i
              onClick={hideInternShips}
              id="ico"
              class="bi bi-caret-down-fill"
            ></i>
            <Link to={"/Jobs"}>
              {" "}
              <p onMouseEnter={showJobs} onMouseLeave={hideJobs}>
                Jobs{" "}
              </p>
            </Link>
            <i class="bi bi-caret-down-fill" id="ico2" onClick={hideJobs}></i>
          </div>
          <div className="search">
            <i class="bi bi-search"></i>
            <input type="text" placeholder="Search" />
          </div>
          {user ? (
            <>
              <div className="Profile">
                <Link to={"/profile"}>
                  <img
                    src={user?.photo}
                    alt=""
                    onMouseEnter={showtheProfile}
                    ref={photoRef}
                    className="rounded-full w-12"
                    id="picpro"
                  />
                </Link>
                <i
                  className="bi bi-caret-up-fill"
                  id="ico3"
                  onClick={hidetheProfile}
                ></i>
              </div>
            </>
          ) : (
            <>
              <div className="auth">
                <button className="btn1" onClick={showLogin}>
                  Login
                </button>

                <button className="btn2">
                  <Link to="/register">Register</Link>
                </button>
              </div>
            </>
          )}
          {user ? (
            <>
              <button className="bt-log ml-2" id="bt" onClick={logoutFunction}>
                Logout <i class="bi bi-box-arrow-right"></i>
              </button>
            </>
          ) : (
            <>
              <div className="flex justify-center items-center mt-7 hire">
                Hire Talent
                <div className="admin">
                  <Link to={"/adminLogin"}>
                    <button>Admin</button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </ul>
      </nav>

      {isDivVisibleForintern && (
        <div className="profile-dropdown-2">
          <div className="left-section">
            <p>Top Locations</p>
            <p>Profile</p>
            <p>Top Category</p>
            <p>Explore More Internships</p>
          </div>
          <div className="line flex bg-slate-400"></div>
          <div className="right-section">
            <p>Intern at India</p>
            <p>Intern at India</p>
            <p>Intern at India</p>
            <p>Intern at India</p>
            <p>Intern at India</p>
          </div>
        </div>
      )}
      {isDivVisibleForJob && (
        <div className="profile-dropdown-1">
          <div className="left-section">
            <p>Top Locations</p>
            <p>Profile</p>
            <p>Top Category</p>
            <p>Explore More Internships</p>
          </div>
          <div className="line flex bg-slate-400"></div>
          <div className="right-section">
            <p>Intern at India</p>
            <p>Intern at India</p>
            <p>Intern at India</p>
            <p>Intern at India</p>
            <p>Intern at India</p>
          </div>
        </div>
      )}
      <div className="login">
        {isDivVisibleForlogin && (
          <>
            <button id="cross" onClick={closeLogin}>
              <i class="bi bi-x"></i>
            </button>
            <h5 id="state" className="mb-4 justify-center text-center">
              <span
                id="Sign-in"
                style={{ cursor: "pointer" }}
                className={`auth-tab ${isStudent ? "active" : ""}`}
                onClick={setFalseForStudent}
              >
                Student
              </span>
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              <span
                id="join-in"
                style={{ cursor: "pointer" }}
                className={`auth-tab ${isStudent ? "active" : ""}`}
                onClick={setTrueForStudent}
              >
                Employee andT&P
              </span>
            </h5>
            {isStudent ? (
              <>
                <div className="py-6">
                  <div className="flex bg-white rounded-lg justify-center overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
                    <div className="w-full p-8 lg:w-1/2">
                      <p
                        onClick={loginFunction}
                        className="flex
 items-center h-9 justify-center mt-4 text-white bg-slate-100 rounded-lg hover:bg-gray-100"
                      >
                        <div className="px-4 py-3">
                          <svg className="h-6 w-6" viewBox="0 0 40 40">
                            <path
                              d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                              fill="#FFC107"
                            />
                            <path
                              d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z"
                              fill="#FF3D00"
                            />
                            <path
                              d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z"
                              fill="#4CAF50"
                            />
                            <path
                              d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                              fill="#1976D2"
                            />
                          </svg>
                        </div>
                        <h4 className="text-gray-500 cursor-pointer">
                          Login With Google
                        </h4>
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="border-b- w-1/5 lg:w-1/4"></span>
                        <p className="text-gray-500 text sm font-bold mb-2">
                          {" "}
                          or
                        </p>
                        <span className="border-b- w-1/5 lg:w-1/4"></span>
                      </div>
                      <div className="mt-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Email{" "}
                        </label>
                        <input
                          className=" text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                          type="email"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between">
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                          </label>
                          <a href="/" className="text-xs text-blue-500">
                            Forget Password?
                          </a>
                        </div>
                        <input
                          className=" text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                          placeholder="Must be atleast 6 characters"
                          type="password"
                        />
                      </div>
                      <div className="mt-8">
                        <button className="btn3  bg-blue-500 h-9 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600 ">
                          Login
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm">
                          new to internarea? Register(
                          <span
                            className="text-blue-500 cursor-pointer"
                            onClick={closeLogin}
                          >
                            Student
                          </span>
                          /
                          <span
                            className="text-blue-500 cursor-pointer"
                            onClick={closeLogin}
                          >
                            company
                          </span>
                          ){" "}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex bg-white rounded-lg justify-center overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
                  <div className="w-full p-8 lg:w-1/2">
                    <div className="mt-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Email{" "}
                      </label>
                      <input
                        className=" text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                        type="email"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Password
                        </label>
                        <a href="/" className="text-xs text-blue-500">
                          Forget Password?
                        </a>
                      </div>
                      <input
                        className=" text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                        placeholder="Must be atleast 6 characters"
                        type="password"
                      />
                    </div>
                    <div className="mt-8">
                      <button className="btn3  bg-blue-500 h-9 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600 ">
                        Login
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-sm">
                        new to internarea? Register(
                        <span
                          className="text-blue-500 cursor-pointer"
                          onClick={closeLogin}
                        >
                          Student
                        </span>
                        /
                        <span
                          className="text-blue-500 cursor-pointer"
                          onClick={closeLogin}
                        >
                          company
                        </span>
                        ){" "}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
        {isDivVisibleForProfile && (
          <div className="profile-dropdown h-16 rounded-sm shadow-sm">
            <p className="font-bold">{user?.name}</p>
            <p className="font-medium mt-3">{user?.email}</p>

            <Link to={"/userapplication"}>
              {" "}
              <p id="int" className="mt-5">
                {" "}
                View Applications{" "}
              </p>
            </Link>
            <Link to={"/manage-subscription"}>
              {" "}
              <p id="int" className="mt-3">
                {" "}
                My Subscriptions{" "}
              </p>
            </Link>

            {activeSubscriptions &&
            activeSubscriptions.subscription.plan === "gold" ? (
              <div>
                {!otpSent ? (
                  <button className="mt-4 ml-16" onClick={() => sendOtp()}>
                    Send OTP to Email
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
                  <button onClick={()=>handlePayment()}>
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

            {activeSubscriptions &&
            activeSubscriptions.subscription.plan === "gold" &&
            resume ? (
              <div className="goldenref">
                <Link to="/your-resume">
                  <p id="int" className="mt-2">
                    <i class="bi bi-star-fill"></i>Your Resume
                  </p>
                </Link>
              </div>
            ) : (
              <p></p>
            )}

            <Link to={"/"}>
              {" "}
              <p id="int" className="mt-3">
                {" "}
                Home{" "}
              </p>
            </Link>
          </div>
        )}
      </div>
      <Sidebar />
    </div>
  );
}

export default Navbar;
