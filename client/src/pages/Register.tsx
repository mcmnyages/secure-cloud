import RegisterForm from "../components/auth/RegisterForm";
import { useRegister } from "../hooks/auth/useRegister";

const Register = () => {
  const { mutate, isPending } = useRegister();

  return (
    <div className="">
      <RegisterForm
        loading={isPending}
        onSubmit={(data) => mutate(data)}
      />
    </div>
  );
};

export default Register;
