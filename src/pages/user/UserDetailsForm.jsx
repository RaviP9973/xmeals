import { FaArrowRight, FaIceCream } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useNavigationType } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import Terms from "../../components/terms&conditions/Terms";
import { GiChickenOven, GiFrenchFries, GiFullPizza } from "react-icons/gi";
import { MdOutlineFastfood } from "react-icons/md";
import { PiBowlFood } from "react-icons/pi";
import { useAuth } from "../../context/authContext";
import { useEffect, useState } from "react";

import { handleSignup } from "../../utils/auth";
import Loader from "../../components/Loader";
import { useToast } from "../../components/customtoast/CustomToast";
const UserDetailsForm = () => {
  // const navigate = useNavigate();
  const location = useLocation();
  const navigate = useNavigate();
  const { setCameFromUserDetailsPage } = useAuth();
  const [name,setName ] = useState('');
  const [phone,setPhone] = useState('');
  const {showToast} = useToast();

  const navType = useNavigationType(); // "PUSH" | "REPLACE" | "POP"

  useEffect(() => {
    // On POP (refresh, back/forward, direct URL), clear any state:
    // console.log("Nav Type", navType);
    if (navType === "POP" || !location?.state) {
      navigate("/login", { replace: true });
    }else{
      setPhone(location?.state?.phone);
      setName(location?.state?.name);
    }
  }, [navType, location?.pathname, location?.state, navigate]);


  // const {phone,name} = location.state;

  

  useEffect(() => {
    // Mark that we're on the details page
    setCameFromUserDetailsPage(true);

    return () => {
      // Jab ye page leave ho, check karein ki user back gaya ya next
      if (location.pathname === "/otp") {
        // User back gaya → redirect to login
        navigate("/login", { replace: true });
      }
    };
  }, []);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    if(loading) return;
    const isValid = await trigger(); // this will show all validation errors
    if (!isValid) return;
    // console.log("yaha pe  aa rha hu ");

    console.log(data);

    setLoading(true);
    const res = await handleSignup(
      {
        name: name,
        mobile_number: phone,
        profession: data?.profession,
        income_range: data?.income,
      },
      true
    );

    if (res) {
      navigate("/");
      showToast("Account Created Successfully" , "success", "short")
    } else {
      setLoading(false);
      showToast("Failed Creating Account" , "error", "short")
    }
  };


  const auth = useAuth();
  const {setSession} = auth;

  if(loading) {
    <Loader />
  }
  return (
    <div className="min-h-screen bg-white ">
      {/* Header Section */}
      {/* <button onClick={() => logout (setSession)}>logout</button> */}
      <div className="relative text-white py-4 lg:py-8 bg-gradient-to-br from-orange via-yellow to-orange overflow-hidden rounded-b-3xl shadow-lg ">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-20"></div>
        <div>
          <GiFullPizza className="absolute text-red opacity-30 text-2xl lg:text-4xl top-28 lg:top-2 right-32 lg:right-8 animate-bounce-slow pointer-events-none" />
          <GiFrenchFries className="absolute text-red opacity-30 text-2xl lg:text-4xl bottom-10 left-8 animate-float pointer-events-none" />
          <GiChickenOven className="absolute text-red opacity-30 text-2xl lg:text-4xl top-4 lg:top-1/3 right-44 animate-float pointer-events-none" />
          <FaIceCream className="absolute text-pink opacity-15 text-2xl lg:text-4xl bottom-6 right-12 animate-bounce-slow pointer-events-none" />
          <MdOutlineFastfood className="absolute text-pink opacity-30 text-2xl lg:text-4xl bottom-0 lg:bottom-12 left-40 animate-bounce-slow pointer-events-none" />
          <GiFullPizza className="absolute text-red opacity-30 text-2xl lg:text-4xl top-6 left-80 animate-float pointer-events-none" />
          <PiBowlFood className="absolute text-red opacity-30 text-2xl lg:text-4xl top-8 right-80 animate-bounce-slow pointer-events-none" />
          <GiChickenOven className="absolute text-red opacity-30 text-2xl lg:text-4xl top-12 lg:top-28 right-[470px] animate-float pointer-events-none" />
          <FaIceCream className="absolute text-pink opacity-15 text-2xl lg:text-4xl top-10 lg:top-36 left-60 lg:left-1/2 animate-bounce-slow pointer-events-none" />
          <GiFrenchFries className="absolute text-pink opacity-30 text-2xl lg:text-4xl top-16 left-1/3 animate-bounce-slow pointer-events-none" />
          <MdOutlineFastfood className="absolute text-red opacity-30 text-2xl lg:text-4xl top-2 left-20 lg:left-[600px] animate-float pointer-events-none" />
          <FaIceCream className="absolute text-pink opacity-15 text-2xl lg:text-4xl top-1 lg:top-4 right-[550px] animate-bounce-slow pointer-events-none" />
        </div>
        <div className="max-w-6xl mx-auto px-4 lg:px-6 flex flex-col gap-4">
          {/* Back Button */}
          <Link
            to="/otp"
            className="absolute text-orange-500 bg-white shadow-lg rounded-full p-3 text-2xl top-3 lg:top-9 left-3 lg:left-9 z-20 hover:scale-110 transition"
          >
            <FiArrowLeft />
          </Link>

          {/* Welcome Text */}
          <h1 className="text-3xl lg:text-6xl font-extrabold tracking-tight drop-shadow-lg  ml-14 lg:ml-0">
            Welcome,{" "}
            <span className="text-white">
              {name}
            </span>
          </h1>

          {/* Sub Text */}
          <p className="text-lg lg:text-2xl font-medium text-white/90 drop-shadow shadow-white">
            Complete your profile & get{" "}
            <span className="font-bold text-orange">₹50</span> instant
            reward 🎁
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-5 lg:py-10 ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column - Information */}
          <div className="space-y-8 hidden lg:block">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Why We Need This Information
              </h2>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>
                  Your professional background helps us tailor our services
                  specifically to your needs. We understand that every
                  individual has unique financial requirements based on their
                  career path and income level.
                </p>
                <p>
                  This information enables us to provide personalized
                  recommendations, exclusive offers, and relevant financial
                  products that align with your professional status and earning
                  capacity.
                </p>
              </div>
            </div>

            <div className="bg-orange/10 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Instant Benefits
              </h3>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  ₹50 instant cash reward
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Personalized financial recommendations
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Exclusive access to premium features
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="space-y-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="bg-orange/10 p-4 rounded-lg block lg:hidden">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Instant Benefits
                </h3>
                <ul className="space-y-2 text-slate-700 text-sm">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    ₹50 instant cash reward
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Personalized financial recommendations
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Exclusive access to premium features
                  </li>
                </ul>
              </div>
              {/* Profession Section */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-slate-900 mb-4">
                  Professional Background
                </label>
                <div className="relative">
                  <select
                    {...register("profession", {
                      required: "Please select your profession",
                    })}
                    className="w-full px-4 py-4 text-lg border-2 border-slate-300 rounded-lg focus:border-orange outline-none transition-colors bg-white text-slate-700 appearance-none pr-10"
                  >
                    <option value="">Select your current profession</option>
                    <option value="student">Student</option>
                    <option value="professional">Working Professional</option>
                    <option value="business">
                      Business Owner / Entrepreneur
                    </option>
                    <option value="other">Other</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                    <svg className="h-4 md:h-6 w-5 md:w-6 text-gray" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                {errors?.profession && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors?.profession?.message}
                  </p>
                )}
              </div>
              {/* Income Section */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-slate-900 mb-6">
                  Annual Income Range
                </label>
                <div className="space-y-4">
                  <div className="border-2 border-slate-200 rounded-lg p-4 hover:border-orange transition-colors cursor-pointer">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value="0-300000"
                        {...register("income", {
                          required: "Please select your income range",
                        })}
                        className="w-5 h-5 text-slate-900 border-2 border-slate-300 focus:ring-orange mr-4"
                      />
                      <div>
                        <span className="text-lg font-medium text-slate-900">
                          ₹0 - ₹3 Lacs
                        </span>
                        <p className="text-sm text-slate-600">
                          Entry level / Students
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="border-2 border-slate-200 rounded-lg p-4 hover:border-orange transition-colors cursor-pointer">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value="300000-500000"
                        {...register("income", {
                          required: "Please select your income range",
                        })}
                        className="w-5 h-5 text-slate-900 border-2 border-slate-300 focus:ring-orange mr-4"
                      />
                      <div>
                        <span className="text-lg font-medium text-slate-900">
                          ₹3 - ₹5 Lacs
                        </span>
                        <p className="text-sm text-slate-600">
                          Mid-level professionals
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="border-2 border-slate-200 rounded-lg p-4 hover:border-orange transition-colors cursor-pointer">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value="500000-700000"
                        {...register("income", {
                          required: "Please select your income range",
                        })}
                        className="w-5 h-5 text-slate-900 border-2 border-slate-300 focus:ring-orange mr-4"
                      />
                      <div>
                        <span className="text-lg font-medium text-slate-900">
                          ₹5 - ₹7 Lacs
                        </span>
                        <p className="text-sm text-slate-600">
                          Senior professionals
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="border-2 border-slate-200 rounded-lg p-4 hover:border-orange transition-colors cursor-pointer">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value="1000000"
                        {...register("income", {
                          required: "Please select your income range",
                        })}
                        className="w-5 h-5 text-slate-900 border-2 border-slate-300 focus:ring-orange mr-4"
                      />
                      <div>
                        <span className="text-lg font-medium text-slate-900">
                          ₹7+ Lacs
                        </span>
                        <p className="text-sm text-slate-600">
                          Leadership / Executive level
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
                {errors?.income && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors?.income?.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                // className="w-full flex items-center justify-center gap-3 button-primary hover:buttonHover-primary text-white py-4 lg:py-5 px-2 lg:px-8 rounded-lg text-lg lg:text-xl font-semibold transition-colors"

                className={`cursor-pointer w-full flex items-center justify-center gap-3 bg-orange hover:bg-orange/90 text-white py-2 lg:py-5 px-2 lg:px-8 rounded-lg text-lg lg:text-xl font-semibold transition-colors disabled:bg-orange/50 disabled:cursor-not-allowed disabled:opacity-70 ${
                  !isValid && "bg-orange/50 cursor-not-allowed opacity-70"
                } `}
                disabled={loading}
              >
                Complete Profile & Claim ₹50
                <FaArrowRight className="w-6 h-6" />
              </button>

              <Terms />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsForm;
