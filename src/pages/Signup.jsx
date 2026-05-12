import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { signUp } from "../api/auth";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../components/ui/card";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function SignUp() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const signUpMutation = useMutation({
    mutationFn: signUp,

    onSuccess: () => {
      // save temporarily for auto login after activation
      localStorage.setItem("pending_email", form.email);
      localStorage.setItem("pending_password", form.password);

      alert("Signup successful! Please check your email to activate your account.");
    },

    onError: (error) => {
      console.log(error);

      if (error?.response?.data) {
        alert(JSON.stringify(error.response.data));
      } else {
        alert(error.message || "Something went wrong");
      }
    },
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    signUpMutation.mutate({
      username: form.username || form.email.split("@")[0],
      email: form.email,
      password: form.password,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create an account
          </CardTitle>

          <CardDescription className="text-center">
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Input
                name="email"
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button
              className="w-full"
              type="submit"
              disabled={signUpMutation.isPending}
            >
              {signUpMutation.isPending ? "Signing up..." : "Sign Up"}
            </Button>

            {signUpMutation.isSuccess && (
              <p className="text-sm text-green-600 text-center">
                Signup successful! Please check your email to activate your account.
              </p>
            )}

            {signUpMutation.isError && (
              <p className="text-sm text-destructive text-center">
                Signup failed.
              </p>
            )}
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}