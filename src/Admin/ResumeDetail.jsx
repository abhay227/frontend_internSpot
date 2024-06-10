import React,{useState,useEffect} from 'react'
import axios from 'axios';
import '../subscription/resum.css';

function ResumeDetail() {
    let search=window.location.search;
    const params=new URLSearchParams(search);
    const id=params.get("a")    
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [photoBlob, setPhotoBlob] = useState(null);
    const [user,setUser] = useState("");

    useEffect(() => {
        
        const fetchResume = async () => {
            try {
                const response = await axios.get(`https://backendinternspot.onrender.com/api/users/resum/${id}`);
                setResume(response.data);
                console.log(response.data);
                setLoading(false);
            } catch (err) {
                setError("Error fetching resume");
                setLoading(false);
            }
        };

        fetchResume();
    }, [id]);

    useEffect(() => {
      const fetchUser = async () => {
          if (resume?.userId) {
              try {
                  const response = await axios.get(`https://backendinternspot.onrender.com/api/users/${resume.userId}`);
                  setUser(response.data);
              } catch (err) {
                  console.error("Error fetching user data:", err);
              }
          }
      };

      fetchUser();
  }, [resume]);

    useEffect(() => {
        const fetchPhoto = async () => {
          if (resume?.photo) {
            try {
              const response = await axios.get(`https://backendinternspot.onrender.com/${resume.photo}`, {
                responseType: 'blob'
              });
              setPhotoBlob(response.data);
            } catch (err) {
              console.error("Error fetching photo:", err);
            }
          }
        };
    
        fetchPhoto();
      }, [resume]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1></h1>
            {resume ? (
                <div className="resume-container">
      <h1>Resume</h1>
      <header className="resume-header">
        <div className="header-text">
          <h1>{resume.fullName}</h1>
          <p>{user.email}</p>
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
      ) : (
        <p>No resume found</p>
      )}
        </div>
    );
}

export default ResumeDetail;