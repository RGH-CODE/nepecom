import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "../api/auth";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { User, LogOut, Mail } from "lucide-react";

export default function Profile() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  if (isLoading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );

  if (isError) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <h2 className="text-xl font-semibold text-destructive">Unauthorized or Error Loading Profile</h2>
      <Button onClick={() => window.location.href = "/login"}>Go to Login</Button>
    </div>
  );

  return (
    <div className="container max-w-lg py-12 px-4">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto bg-secondary p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
            <User className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome, {data.username}!</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 border rounded-md">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Email Address</p>
              <p className="text-sm text-muted-foreground">{data.email}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="destructive" className="w-full gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
