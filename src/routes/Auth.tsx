import s from "./Auth.module.scss";
import React, { FormEvent, useState, useTransition } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as auth from "../api/auth";
import {
  Link,
  Outlet,
  Route,
  useLoaderData,
  useLocation,
} from "react-router-dom";

interface Inputs {
  email: string;
  password: string;
}

export function Auth() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export function Login() {
  const { register, handleSubmit } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    auth.login(data.email, data.password).then((logged) => {
      if (logged) {
        location.href = "/";
      }
    });
  };
  return (
    <div className={`${s["auth-route"]}`}>
      <form className={s["auth-form"]} onSubmit={handleSubmit(onSubmit)}>
        <h2>Sign in</h2>
        <InputField
          type="text"
          label="Email"
          {...register("email", { required: true })}
        />
        <InputField
          type="password"
          label="Password"
          {...register("password", { required: true })}
        />
        <div style={{position:"relative"}}>
          <Link to="../register" style={{ position:"absolute", top: -12, right: 0, fontSize:13 }}>
            Or register
          </Link>
        </div>
        <input className={s["auth-form__submit"]} type="submit" value="Login" />
      </form>
    </div>
  );
}
export function Register() {
  const [isLoading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setLoading(true);
    auth.register(data.email, data.password).then((logged) => {
      if (logged) {
        location.href = "/";
      }
    });
  };
  return (
    <div className={`${s["auth-route"]}`}>
      <form
        className={s["auth-form"]}
        onSubmit={handleSubmit(onSubmit)}
        style={{ opacity: isLoading ? 0.5 : 1 }}
      >
        <h2>Sing up</h2>
        <InputField
          type="text"
          label="Email"
          {...register("email", { required: true })}
        />
        <InputField
          type="password"
          label="Password"
          {...register("password", { required: true })}
        />
        <input
          className={s["auth-form__submit"]}
          type="submit"
          value="Register"
        />
      </form>
    </div>
  );
}

interface InputFieldProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label?: string;
}
const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, ...props }, ref) => {
    return (
      <label className={s["input-field"]}>
        <input
          className={s["input-field__input"]}
          placeholder="."
          {...props}
          ref={ref}
        />
        {label && <span className={s["input-field__label"]}>{label}</span>}
      </label>
    );
  }
);
