import React, { useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveResume } from '../Feature/resumeSlice';
import { useNavigate,useLocation} from 'react-router-dom';
import axios from 'axios';

const ResumeForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    fullName: '',
    qualification: '',
    experience: '',
    personalDetails: '',
    por:'',
    courses:'',
    projects:'',
    skills:'',
    photo: null,
  });
  const { user } = useSelector((state) => state.user);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const reference = query.get('reference');

    if (reference) {
      axios.get(`https://backendinternspot.onrender.com/api/payment/verify-payment?reference=${reference}`)
        .then(response => {
          if (response.data.success) {
            setIsAuthorized(true);
          } else {
            navigate('/payment-failed');
          }
        })
        .catch(error => {
          console.error('Error verifying payment:', error);
          navigate('/payment-failed');
        });
    } else {
      navigate('/payment-failed');
    }
  }, [location, navigate]);


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const resumeData = { ...formData, userId: user.uid };
    const form = new FormData();
    Object.keys(resumeData).forEach(key => {
      form.append(key, resumeData[key]);
    });
  
    dispatch(saveResume(form))
      .then(() => {
        // Redirect to home page after successful save
        navigate('/');
      })
      .catch(error => {
        console.error('Error saving resume:', error);
      });
  };
  
  if (!isAuthorized) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Your Resume</h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="fullName">Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="qualification">Qualification</label>
          <input
            type="text"
            name="qualification"
            placeholder="Qualification"
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="experience">Experience</label>
          <textarea
            name="experience"
            placeholder="Experience"
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="por">Position Of Responsibility</label>
          <textarea
            name="por"
            placeholder="POR"
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="courses">Trainings/Courses</label>
          <textarea
            name="courses"
            placeholder="Courses Taken"
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="projects">Projects</label>
          <textarea
            name="projects"
            placeholder="Projects"
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="skills">Skills</label>
          <textarea
            name="skills"
            placeholder="Skills"
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="personalDetails">Personal Details</label>
          <textarea
            name="personalDetails"
            placeholder="Personal Details"
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="photo">Photo</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
        >
          Save Resume
        </button>
      </form>
    </div>
  );
};

export default ResumeForm;
