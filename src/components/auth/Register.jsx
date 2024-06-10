import React, { useState } from 'react'
import { signInWithPhoneNumber, signInWithPopup,RecaptchaVerifier } from 'firebase/auth'
import './register.css'
import {auth,provider} from "../../firebase/firebase"
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { selectUser } from '../../Feature/Userslice'

function Register() {
  const [isStudent,setStudent]=useState(true)
  const [isDivVisible, setDivVisible]=useState(false)
  const [fname,setFname]=useState("")
  const [lname,setLname]=useState("")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const countryCode = "+91";
  const [phoneNumber, setPhoneNumber] = useState(countryCode);
  const [expandForm, setExpandForm] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const user = useSelector(selectUser);
  let navigate=useNavigate()
  const handleSingin=()=>{
    signInWithPopup(auth,provider).then((res)=>{
      console.log(res)
     
      navigate("/")
    
  }).catch((err)=>{
      console.log(err)
  })
  toast("Login Success")
  }
  const setTrueForStudent=()=>{
    setStudent(false)
}
const setFalseForStudent=()=>{
    setStudent(true)
}
  const showLogin=()=>{
    setDivVisible(true)
}
const closeLogin=()=>{
    setDivVisible(false)
}

const requestOTP = async (e) => {
  e.preventDefault();
  console.log(phoneNumber);
  try{
    const response = await generateRecaptcha(phoneNumber);
    console.log(response);
    setConfirmationResult(response);
    setExpandForm(true);
  }catch(error){
    console.log(error);
  }
};


const generateRecaptcha = (phoneNumber) => {
  const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {});
  recaptchaVerifier.render();
  return signInWithPhoneNumber(auth,phoneNumber,recaptchaVerifier);
};


const verifyCode = async (e) => {
e.preventDefault();

if (!verificationCode) {
  alert("Please enter the verification code.");
  return;
}

if (!confirmationResult) {
  alert("No OTP request found. Please request OTP first.");
  return;
}

try {
  const result = await confirmationResult.confirm(verificationCode);
  // User signed in successfully
  const user = result.user;
  console.log(user);
  setExpandForm(false);
  navigate("/");
} catch (error) {
  console.error("Error during verifying code:", error);
  alert("Invalid verification code. Please try again.");
}
};



  return (
    <div>
      <div className="form">
        <h1>Sign-up and Apply For Free</h1>
        <p className='para3'>1,50,000+ companies hiring on Internshala</p>
      <div className="regi">
        <div className="py-6">
          <div className="flex bg-white rounded-lg justify-center shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
<div className="w-full p-8 lg:w-1/2">
<a onClick={handleSingin} class="flex items-center h-9 justify-center mt-4 text-white rounded-lg shadow-md hover:bg-gray-100">
                   <div class="px-4 py-3 cursor-pointer">
                       <svg class="h-6 w-6" viewBox="0 0 40 40">
                           <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#FFC107"/>
                           <path d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z" fill="#FF3D00"/>
                           <path d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z" fill="#4CAF50"/>
                           <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#1976D2"/>
                       </svg>
                   </div>
                   <h1 class="cursor-pointer px-4 py-3 w-5/6 text-center text-xl text-gray-600 font-bold">Sign in with Google</h1>
      
               </a>
               <div className="mt-4 flex items-center justify-between">
<span className='border-b w-1/5 lg:w1/4'></span>
<a href="/" className='text-xs text-center text-gray-500 uppercase'>or</a>
<span className='border-b w-1/5 lg:w1/4'></span>
               </div>

               <h2 className='text-center'>Sign in with phone</h2>

               {expandForm === true ? (
                          <>
                            <form onSubmit={verifyCode}>
                            <div className="mt-4">
                              <label className="block text-gray-700 text-sm font-bold mb-2">
                                OTP{" "}
                              </label>
                              <input
                                className=" text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                type="number"
                                placeholder="Enter One time OTP"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                              />
                              <button
                                type="submit"
                                className="btn3  bg-blue-500 h-9 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600 "
                              >
                                Verify OTP
                              </button>      
                            </div>
                            </form>
                          </>
                        ) : 
                        <>
                      <form onSubmit={requestOTP}>
                        
                        <div className="mt-4">
                          <label
                            htmlFor="phoneNumberInput"
                            className="block text-gray-700 text-sm font-bold mb-2"
                          >
                            Phone no{" "}
                          </label>
                          <input
                            className="text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                            type="tel"
                            id="phoneNumberInput"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                          />
                          <div id="phoneNumberHelp">Enter Phone number</div>
                        </div>

                        <div className="mt-8">
                          <button
                            type="submit"
                            className="btn3  bg-blue-500 h-9 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600 "
                          >
                            Request OTP
                          </button>
                        </div>

                        <div id="recaptcha-container"></div>
                        </form>
                      </>
                        
                        }

              <small>By signing up, you agree to our <span className='text-blue-400'>Term and Conditions.
                </span></small>
                
</div>
          </div>
        </div>
      </div>
      </div>
      <div className="login">
    {
        isDivVisible &&(
            <>
            <button id='cross' onClick={closeLogin}><i class="bi bi-x"></i></button>
            <h5 id='state' className='mb-4 justify-center text-center'>
                <span id='Sign-in' style={{cursor:"pointer"}} className={`auth-tab ${isStudent? 'active':""}`} onClick={setFalseForStudent}>
                    Student
                </span>
                &nbsp;     &nbsp; &nbsp;    &nbsp;    &nbsp;    &nbsp;    &nbsp;
                <span id='join-in' style={{cursor:"pointer"}} className={`auth-tab ${isStudent? 'active':""}`} onClick={setTrueForStudent}>
                    Employee andT&P
                </span>
            </h5>
            {isStudent ?(
                <>
                <div className="py-6">


                    <div className="flex bg-white rounded-lg justify-center overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
<div className="w-full p-8 lg:w-1/2">
<p onClick={handleSingin} className='flex
 items-center h-9 justify-center mt-4 text-white bg-slate-100 rounded-lg hover:bg-gray-100' >
    <div className="px-4 py-3">
    <svg class="h-6 w-6" viewBox="0 0 40 40">
                         <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#FFC107"/>
                         <path d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z" fill="#FF3D00"/>
                         <path d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z" fill="#4CAF50"/>
                         <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#1976D2"/>
                     </svg>
    </div>
    <h1 className='text-gray-500'>Login With Google 
    </h1>
 </p>
 <div className="mt-4 flex items-center justify-between">
<span className='border-b- w-1/5 lg:w-1/4'></span>
<p className='text-gray-500 text sm font-bold mb-2'> or</p>
<span className='border-b- w-1/5 lg:w-1/4'></span>

 </div>
 <div class="mt-4">
                 <label class="block text-gray-700 text-sm font-bold mb-2">Email </label>
                 <input class=" text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none" type="email"  placeholder='john@example.com'/>
             </div>
             <div class="mt-4">
                 <div class="flex justify-between">
                     <label class="block text-gray-700 text-sm font-bold mb-2">Password</label>
                     <a href="/" class="text-xs text-blue-500">Forget Password?</a>
                 </div>
                 <input class=" text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"   placeholder='Must be atleast 6 characters'   type="password"/>
             </div>
             <div className="mt-8">
             <button className='btn3  bg-blue-500 h-9 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600 '>Login</button>
             </div>

             <div className="mt-4 flex items-center justify-between">
<p className='text-sm'>new to internarea? Register(<span className='text-blue-500 cursor-pointer' onClick={closeLogin}>Student</span>/<span className='text-blue-500 cursor-pointer' onClick={closeLogin}>company</span>) </p>
             </div>
</div>
                    </div>
                </div>
                
                </>
            ):(
                <>
                                   <div className="flex bg-white rounded-lg justify-center overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
<div className="w-full p-8 lg:w-1/2">
                 <div class="mt-4">
                 <label class="block text-gray-700 text-sm font-bold mb-2">Email </label>
                 <input class=" text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none" type="email"  placeholder='john@example.com'/>
             </div>
             <div class="mt-4">
                 <div class="flex justify-between">
                     <label class="block text-gray-700 text-sm font-bold mb-2">Password</label>
                     <a href="/" class="text-xs text-blue-500">Forget Password?</a>
                 </div>
                 <input class=" text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"   placeholder='Must be atleast 6 characters'   type="password"/>
             </div>
             <div className="mt-8">
             <button className='btn3  bg-blue-500 h-9 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600 '>Login</button>
             </div>

             <div className="mt-4 flex items-center justify-between">
<p className='text-sm'>new to internarea? Register(<span className='text-blue-500 cursor-pointer' onClick={closeLogin}>Student</span>/<span className='text-blue-500 cursor-pointer' onClick={closeLogin}>company</span>) </p>
             </div></div>
             </div>
                </>
            )
            }
            </>
        )
    }
</div>
    </div>
  )
}

export default Register
