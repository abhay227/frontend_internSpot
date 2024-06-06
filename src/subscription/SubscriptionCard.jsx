import React, { useState,useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUser } from "../Feature/Userslice";

import "./subs.css"; // Ensure the custom CSS is imported

function SubscriptionCard() {

  const user = useSelector(selectUser);
  const [activeSubscriptions, setActiveSubscriptions] = useState('');

  useEffect(() => {
    const fetchActiveSubscriptions = async () => {
      try {
        const response = await axios.get(`https://backendinternspot.onrender.com/api/users/${user?.uid}`, {
        
        });
        setActiveSubscriptions(response.data);
        console.log("active subscriptions",activeSubscriptions);
      } catch (error) {
        console.error("Error fetching active subscriptions:", error);
      }
    };

    fetchActiveSubscriptions();
  }, [user]);


  const checkoutHandler = async (plan) => {
    try {
      console.log(user);
      const { data: { key } } = await axios.get("https://backendinternspot.onrender.com/api/getkey");

      const { data: { subscriptionId } } = await axios.post("https://backendinternspot.onrender.com/api/payment/subscribe", {
      user,
      plan
      });

      const options = {
        key,
        name: "abhay pandey",
        description: "Transaction",
        image: "https://w1.pngwing.com/pngs/310/1001/png-transparent-interview-job-hunting-job-interview-career-employment-line-area-logo-thumbnail.png",
        subscription_id: subscriptionId,
        callback_url: "https://backendinternspot.onrender.com/api/payment/verification",
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: "9000090000",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#121212",
        },
      };
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  const checkoutfree = async () => {
    try{
      const {  } = await axios.post("https://backendinternspot.onrender.com/api/payment/freeplan", {
      user,
      });
    }catch(error){
      console.error("Error during checkout:", error);
    }
  };
  
  return (
    <div className="subscription-card">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Subscriptions</h1>
        <p className="mt-2 text-gray-600">Manage your subscriptions</p>
      </div>
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          {activeSubscriptions ? (
            <div className="subscription-item">
              <h2 className="text-center">Active Subscriptions</h2>
              <p className="text-gray-800 font-bold">Plan: {activeSubscriptions.subscription.plan}</p>
              <p className="text-gray-800 font-bold">Subscription ID: {activeSubscriptions.subscription.id}</p>
              <p className="text-gray-800 font-bold">Status: {activeSubscriptions.subscription.status}</p>
            </div>
          ) : (
            <p className="text-gray-600">You don't have any active subscriptions</p>
          )}
        </div>
        <h1 className="text-center"> All Subscriptions Available</h1>
      <div class="wrapper">
        <div class="table basic">
          <div class="price-section">
            <div class="price-area">
              <div class="inner-area">
                <span class="text"><i class="bi bi-currency-rupee"></i></span>
                <span class="price">0</span>
              </div>
            </div>
          </div>
          <div class="package-name"></div>
          <ul class="features flex flex-col">
            <li className='flex'>
              <span class="list-name">1 internship per month</span>
              <span class="icon check">
              <i class="bi bi-check2"></i>
              </span>
            </li>
            <li className="flex">
              <span class="list-name">Resume Creation</span>
              <span class="icon check">
              <i class="bi bi-x"></i>
              </span>
            </li>
          </ul>
          <div class="btn">
            <button onClick={()=>checkoutfree()}>Purchase</button>
          </div>
        </div>
        <div class="table bronze">
          <div class="price-section">
            <div class="price-area">
              <div class="inner-area">
                <span class="text"><i class="bi bi-currency-rupee"></i></span>
                <span class="price">100</span>
              </div>
            </div>
          </div>
          <div class="package-name"></div>
          <ul class="features flex flex-col">
            <li className="flex">
              <span class="list-name">3 internships per month</span>
              <span class="icon check">
              <i class="bi bi-check2"></i>
              </span>
            </li>
            <li className="flex">
              <span class="list-name">Resume Creation</span>
              <span class="icon check">
              <i class="bi bi-x"></i>
              </span>
            </li>
          </ul>
          <div class="btn">
            <button onClick={()=>checkoutHandler("bronze")}>Purchase</button>
          </div>
        </div>
        <div class="table premium">
          <div class="ribbon">
            <span>Recommend</span>
          </div>
          <div class="price-section">
            <div class="price-area">
              <div class="inner-area">
                <span class="text"><i class="bi bi-currency-rupee"></i></span>
                <span class="price">300</span>
              </div>
            </div>
          </div>
          <div class="package-name"></div>
          <ul class="features flex flex-col">
            <li className="flex">
              <span class="list-name">5 internships per month</span>
              <span class="icon check">
              <i class="bi bi-check2"></i>
              </span>
            </li>
            <li className="flex"> 
              <span class="list-name">Resume Creation</span>
              <span class="icon check">
              <i class="bi bi-x"></i>
              </span>
            </li>
          </ul>
          <div class="btn">
            <button onClick={()=>checkoutHandler("silver")}>Purchase</button>
          </div>
        </div>
        <div class="table ultimate mt-8">
          <div class="price-section">
            <div class="price-area">
              <div class="inner-area">
                <span class="text"><i class="bi bi-currency-rupee"></i></span>
                <span class="price">1000</span>
              </div>
            </div>
          </div>
          <div class="package-name"></div>
          <ul class="features flex flex-col">
            <li className="flex">
              <span class="list-name">Unlimited internships per month</span>
              <span class="icon check">
              <i class="bi bi-check2"></i>
              </span>
            </li>
            <li className="flex">
              <span class="list-name">Resume Creation</span>
              <span class="icon check">
              <i class="bi bi-check2"></i>
              </span>
            </li>
          </ul>
          <div class="btn">
            <button onClick={()=>checkoutHandler("gold")}>Purchase</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionCard;
