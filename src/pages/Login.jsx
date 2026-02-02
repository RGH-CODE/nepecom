import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/auth";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("access", data.access);
      localStorage.setItem("username", form.username); // Storing username for Navbar
      localStorage.setItem("refresh", data.refresh);
      window.location.href = "/profile";
    },
  });

  const submit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <Button className="w-full" type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>

            {mutation.isSuccess && (
              <p className="text-sm text-green-600 text-center">Login successful!</p>
            )}
            {mutation.isError && (
              <p className="text-sm text-destructive text-center">Invalid credentials</p>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <div className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}