import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useLocation, useNavigate } from "react-router-dom";
import s from "./auth.module.scss";
import { useLoginMutation, useSignupMutation } from "@/redux/apis/authApiSlice";
import { errorToast, successToast } from "@/components/ui/toast";
import { FormInput } from "@/components/ui/form-input";
import { Button, LinkButton } from "@/components/ui/button";
import { parseError } from "@/utils/helpers";
import { useEffect } from "react";
import { authFormSchema, type AuthFormInputs } from "@/types/user";

interface AuthFormProps {
  mode: "login" | "signup";
}

const AuthForm = ({ mode }: AuthFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [signup, { isLoading: isSignupLoading }] = useSignupMutation();

  const isLogin = mode === "login";
  const mutation = isLogin ? login : signup;
  const isLoading = isLogin ? isLoginLoading : isSignupLoading;

  const form = useForm<AuthFormInputs>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    form.reset();
  }, [location]);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: AuthFormInputs) => {
    try {
      const res = await mutation(data).unwrap();
      if (res.success) {
        successToast(res.message);
        if (!isLogin) {
          navigate("/login");
        }
      }
    } catch (error) {
      errorToast(parseError(error as FetchBaseQueryError));
    }
  };

  return (
    <div className={s.container}>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <h2>{isLogin ? "Login" : "Register"}</h2>

        <FormInput
          id="username"
          label="Username"
          placeholder="Enter username"
          form={form}
        />

        <FormInput
          id="password"
          label="Password"
          placeholder="Enter password"
          type="password"
          autoComplete={isLogin ? "current-password" : "new-password"}
          form={form}
        />

        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting || isLoading
            ? isLogin
              ? "Logging in..."
              : "Registering..."
            : isLogin
            ? "Login"
            : "Sign Up"}
        </Button>

        <LinkButton to={isLogin ? "/signup" : "/login"} variant="secondary">
          {isLogin ? "Register" : "Login"}
        </LinkButton>
      </form>
    </div>
  );
};

export default AuthForm;
