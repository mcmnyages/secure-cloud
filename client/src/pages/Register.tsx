import RegisterForm from "../components/auth/RegisterForm";
import { useRegister } from "../hooks/auth/useRegister";
import {  FaHome } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { mutate, isPending } = useRegister();
  const navigate = useNavigate();

  return (
    <div className="">
      <button onClick={() => navigate('/')} className="absolute top-4 left-4 text-gray-600 hover:text-gray-800">
              <FaHome size={24} />
            </button>
      <RegisterForm
        loading={isPending}
        onSubmit={(data) => mutate(data)}
      />
    </div>
  );
};

export default Register;
