import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Footprints } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    toast.success(isLogin ? "Welcome back!" : "Account created successfully!");
    navigate("/");
  };

  return (
    <div className="min-h-screen gradient-medical flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Animation */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 bg-white/30 rounded-full blur-xl pulse-gentle"></div>
            <div className="relative bg-white rounded-full p-6 shadow-2xl">
              <Footprints className="w-16 h-16 text-primary" />
            </div>
          </div>
        </div>

        {/* App Title */}
        <div className="text-center mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">StepWise</h1>
          <p className="text-white/90 text-sm">Smart Insole for Diabetic Foot Monitoring</p>
        </div>

        {/* Form Card */}
        <div className="glass-effect rounded-2xl p-6 shadow-2xl animate-slide-up">
          <div className="flex gap-2 mb-6">
            <Button
              type="button"
              variant={isLogin ? "default" : "outline"}
              className="flex-1"
              onClick={() => setIsLogin(true)}
            >
              Login
            </Button>
            <Button
              type="button"
              variant={!isLogin ? "default" : "outline"}
              className="flex-1"
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/50"
              />
            </div>

            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  onClick={() => toast.info("Password reset link sent to your email")}
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <Button type="submit" className="w-full" size="lg">
              {isLogin ? "Login" : "Create Account"}
            </Button>
          </form>
        </div>

        <p className="text-center text-white/70 text-xs mt-6">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Login;
