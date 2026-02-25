import RegisterForm from "../components/ui/auth/RegisterForm";
import { useRegister } from "../hooks/auth/useRegister";
import AppHeader from "../components/ui/navigation/AppHeader";

const Register = () => {
  const { mutate, isPending } = useRegister();


  return (
    <div className="">
      <AppHeader collapsed={false} onToggleDesktop={() => { }} onOpenMobile={() => { }} />

      <RegisterForm
        loading={isPending}
        onSubmit={(data) => mutate(data)}
      />
    </div>
  );
};

export default Register;
