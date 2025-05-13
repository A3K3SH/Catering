import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Head from "@/components/Head";
import { useFirebaseAuth } from "../firebase/FirebaseAuthProvider";
import { Separator } from "@/components/ui/separator";

export default function Profile() {
  const [_, navigate] = useLocation();
  const { currentUser, logout } = useFirebaseAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // If not logged in, redirect to login page
  if (!currentUser) {
    navigate("/login");
    return null;
  }

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred while logging out",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head 
        title="My Profile - Taste of India"
        description="Manage your Taste of India profile"
      />
      <div className="min-h-screen bg-gradient-to-r from-orange-100 to-amber-50 p-4">
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6 text-center">My Profile</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Profile Card */}
            <Card className="col-span-1 shadow-md">
              <CardHeader>
                <CardTitle>User Information</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center mb-4">
                  {currentUser.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt="Profile" 
                      className="rounded-full w-24 h-24 object-cover border-2 border-orange-500"
                    />
                  ) : (
                    <div className="rounded-full w-24 h-24 bg-orange-200 flex items-center justify-center text-2xl font-bold text-orange-600">
                      {currentUser.email?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-lg">{currentUser.email}</p>
                </div>
                
                {currentUser.displayName && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="text-lg">{currentUser.displayName}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Account Created</p>
                  <p className="text-lg">
                    {currentUser.metadata.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="destructive" 
                  className="w-full" 
                  onClick={handleLogout}
                  disabled={isLoading}
                >
                  {isLoading ? "Logging out..." : "Log Out"}
                </Button>
              </CardFooter>
            </Card>
            
            {/* Order History */}
            <Card className="col-span-1 md:col-span-2 shadow-md">
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>View your past orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border p-4 text-center">
                  <p className="text-gray-500">No orders yet</p>
                  <Button 
                    className="mt-4 bg-orange-600 hover:bg-orange-700" 
                    onClick={() => navigate("/")}
                  >
                    Browse Menu
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6">
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
              className="border-orange-600 text-orange-600 hover:bg-orange-50"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}