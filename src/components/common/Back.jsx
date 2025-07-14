import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const BackBtn = ({ className = "" }) => {
  const navigate = useNavigate();
  return (
    <button
      className={`flex items-center gap-2 px-3 py-1  bg-orange-100 text-orange-700 hover:bg-orange-200 font-semibold shadow border border-orange-200 mb-4 rounded-full aspect-square ${className}`}
      onClick={() => navigate('/')}
      type="button"
    >
      <FaArrowLeft /> 
    </button>
  );
};

export default BackBtn;