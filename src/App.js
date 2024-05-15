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
function App() {
  const user=useSelector(selectUser);
  const dispatch=useDispatch();
  useEffect(() => {
    auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        dispatch(login({
  
          uid:authUser.uid,
          photo:authUser.photoURL,
          name:authUser.displayName,
          email:authUser.email,
          phoneNumber:authUser.phoneNumber
        }))
      }
        else{
          dispatch(logout())
        }
    })
    },[dispatch] );
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
</Routes>
<Footer/>
    </div>
  );
}

export default App;
