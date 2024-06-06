import './App.css';
import Footer from './components/Footer/Footer';
import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';
import { Routes,Route } from 'react-router-dom';
import Register from './components/auth/Register';
import Intern from "./components/Internships/Intern"
import JobAvl from "./components/Job/JobAvl"
import JobDetail from './components/Job/JobDetail';
import InternDeatil from "./components/Internships/InternDetail"
import { useDispatch, useSelector } from 'react-redux';
import { login,logout,selectUser } from "./Feature/Userslice"
import { useEffect } from 'react';
import { auth } from './firebase/firebase';
import Profile from './profile/Profile';
import AdminLogin from './Admin/AdminLogin';
import Adminpanel from './Admin/Adminpanel';
import ViewAllApplication from "./Admin/ViewAllApplication"
import Postinternships from './Admin/Postinternships';
import DeatilApplication from './Applications/DeatilApplication';
import UserApplication from './profile/UserApplication';
import UserapplicationDetail from "./Applications/DeatilApplicationUser"
import PostJob from './Admin/PostJob';
import SubscriptionCard from './subscription/SubscriptionCard';
import Resume from './subscription/Resume';
import UserResume from './subscription/UserResume';
import ResumeDetail from './Admin/ResumeDetail';
import { clearResume, fetchResume } from './Feature/resumeSlice';
// import ResumeDetail from './Admin/ResumeDetail';
function App() {
  const user=useSelector(selectUser);
  const dispatch=useDispatch();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(login({
          uid: authUser.uid,
          photo: authUser.photoURL,
          name: authUser.displayName,
          email: authUser.email,
          phoneNumber: authUser.phoneNumber,
        }));
        dispatch(fetchResume(authUser.uid)); // Fetch resume when user logs in
      } else {
        dispatch(logout());
        dispatch(clearResume()); // Clear resume when user logs out
      }
    });

    return () => unsubscribe();
  }, [dispatch]);


    const handleSaveResume = (resumeData) => {
      console.log('Resume Data:', resumeData);
      // Add logic to save the resume data to the student's profile
      // For example, make an API call to save the data to your backend
    };
  return (
    <div className="App">
<Navbar/>
<Routes>
  <Route path='/' element={<Home/>}/>
<Route path='/register' element={<Register/>}/>
<Route path='/internship' element={<Intern/>}/>
<Route path='/Jobs' element={<JobAvl/>}/>
<Route path='/profile' element={<Profile/>}/>
<Route path='/detailjob' element={<JobDetail/>}/>
<Route path='/detailInternship' element={<InternDeatil/>}/>
<Route path='/detailApplication' element={<DeatilApplication/>}/>
<Route path='/adminLogin' element={<AdminLogin/>}/>
<Route path='/adminepanel' element={<Adminpanel/>}/>
<Route path='/postInternship' element={<Postinternships/>}/>
<Route path='/postJob' element={<PostJob />}/>
<Route path='/applications' element={<ViewAllApplication/>}/>
<Route path='/UserapplicationDetail' element={< UserapplicationDetail/>}/>
<Route path='/userapplication' element={<UserApplication/>}/>
<Route path='/manage-subscription' element={<SubscriptionCard/>}/>
<Route path='/create-resume' element={<Resume onSave={handleSaveResume}/>}/>
<Route path='/your-resume' element={<UserResume/>}/>
<Route path='/resume' element={<ResumeDetail />} />

</Routes>
<Footer/>
    </div>
  );
}

export default App;
