import React, { useEffect,useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../Feature/Userslice";
import { Link } from "react-router-dom";
import axios from "axios";

function Profile() {
  const user = useSelector(selectUser);
  const [activeSubscriptions, setActiveSubscriptions] = useState('');
  const { resume, loading, error } = useSelector((state) => state.resume);
  
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


  return (
    <div>
      <div className="flex items-center mt-9 mb-4 justify-center">
        <div className="max-w-xs">
          <div className="bg-white shadow-lg rounded-lg py-3">
            <div className="photo-wrapper p-2">
              <img
                src={user.photo}
                alt=""
                className="w-32 h-32 rounded-full mx-auto"
              />
            </div>
            <div className="p-2">
              <h3 className="text-center text-xl text-gray-900">{user.name}</h3>
            </div>
            <div className="text-xs my-3">
              <h3 className="text-xl font-bold">UID</h3>
              <h3 className="text-center text-lg text-gray-900">{user.uid}</h3>
            </div>
            <div>
              <h3 className="text-xl font-bold">Email</h3>
              <h3 className="text-center text-xl text-gray-900">
                {user.email}
              </h3>
            </div>
            <div className="flex justify-center mt-3">
              <Link
                to="/userapplication"
                class="relative  items-center justify-start inline-block px-5 py-3 overflow-hidden font-medium transition-all bg-blue-600 rounded-full hover:bg-white group"
              >
                <span class="absolute inset-0 border-0 group-hover:border-[25px] ease-linear duration-100 transition-all border-white rounded-full"></span>
                <span class="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-blue-600">
                  My Applciations
                </span>
              </Link>
            </div>

            {activeSubscriptions && activeSubscriptions.subscription.plan === 'gold' && resume  ? (
          <div className="flex justify-center mt-3">
            <Link to="/your-resume">
              
              <p id="int" className="mt-2">
              <i class="bi bi-star-fill"></i>Your Resume</p>
            </Link>
          </div>
        ) : (
          <p></p>
        )}
           


          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
