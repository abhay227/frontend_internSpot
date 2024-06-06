import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchResume, downloadResume } from "../Feature/resumeSlice";
import { selectUser } from "../Feature/Userslice";
import axios from "axios";
import "./resum.css";

const Resume = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { resume, loading, error } = useSelector((state) => state.resume);
  const [photoBlob, setPhotoBlob] = useState(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchResume(user.uid));
    }
  }, [dispatch, user]);

  useEffect(() => {
    const fetchPhoto = async () => {
      if (resume?.photo) {
        try {
          const response = await axios.get(
            `https://backendinternspot.onrender.com/${resume.photo}`,
            {
              responseType: "blob",
            }
          );
          setPhotoBlob(response.data);
        } catch (err) {
          console.error("Error fetching photo:", err);
        }
      }
    };

    fetchPhoto();
  }, [resume]);

  const handleDownload = () => {
    if (user) {
      dispatch(downloadResume(user.uid));
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="resume-container">
      <h1>Resume</h1>
      <button
            className="ml-0 bg-blue-500 text-white font-bold py-2 px-4 rounded "
            onClick={handleDownload}
          >
            <i class="bi bi-download"></i>
            Download 
          </button>
      <header className="resume-header">
        <div className="header-text">
          <h1>{user?.name}</h1>
          <p>{user?.email}</p>
        </div>
        <div className="user-photo ">
          {photoBlob && (
            <img
              className="mx-auto"
              src={URL.createObjectURL(photoBlob)}
              alt="Resume Photo"
              onLoad={() => URL.revokeObjectURL(photoBlob)} // Clean up object URL after the image loads
            />
          )}
        </div>
      </header>
      <section className="resume-section">
        <h2>Education</h2>
        <div className="resume-item">
          <p>{resume.qualification}</p>
        </div>
      </section>
      <section className="resume-section">
        <h2>Experience</h2>
        <div className="resume-item">
          <p>{resume.experience}</p>
        </div>
      </section>
      <section className="resume-section">
        <h2>Position Of Responsibility</h2>
        <div className="resume-item">
          <p>{resume.por}</p>
        </div>
      </section>

      <section className="resume-section">
        <h2>Trainings/Courses</h2>
        <div className="resume-item">
          <p>{resume.courses}</p>
        </div>
      </section>

      <section className="resume-section">
        <h2>Skills</h2>
        <div className="resume-item">
        <p>{resume.skills}</p>
        </div>
      </section>
      <section className="resume-section">
        <h2>Projects</h2>
        <div className="resume-item">
        <p>{resume.projects}</p>
        </div>
      </section>
      <section className="resume-section">
        <h2>Personal Details</h2>
        <div className="resume-item">
          <p>{resume.personalDetails}</p>
        </div>
      </section>
    </div>
  );
};

export default Resume;
