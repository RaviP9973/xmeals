import { FiArrowLeft } from "react-icons/fi";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => window.history.back()}
      className="inline-flex cursor-pointer items-center justify-center w-8.5 h-8 lg:w-10.5 lg:h-10 text-orange rounded-full text-2xl lg:text-3xl font-bold shadow-md hover:shadow-xl hover:scale-102 active:scale-98 transition-all duration-200 bg-white border border-gray-200"
    >
     <FiArrowLeft />
    </button>
  );
};

export default BackButton;
