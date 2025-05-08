import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import Orders from "@/pages/Orders";
import NotFound from "@/pages/not-found";
import { FirebaseAuthProvider } from "./firebase/FirebaseAuthProvider";
import { CartProvider } from "@/hooks/useCart.tsx";

// Define the routes for the application
function Router() {
  const [location] = useLocation();
  
  return (
    <Switch location={location}>
      <Route path="/" component={Home} />
      <Route path="/admin" component={Admin} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/profile" component={Profile} />
      <Route path="/orders" component={Orders} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Main App component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FirebaseAuthProvider>
        <CartProvider>
          <Router />
          <Toaster />
        </CartProvider>
      </FirebaseAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
