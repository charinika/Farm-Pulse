import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  Heart,
  Shield,
  Users,
  BarChart3,
  Loader2,
} from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<"login" | "register">("login");

  useEffect(() => {
    if (user) setLocation("/");
  }, [user, setLocation]);

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleLogin = (data: LoginData) => loginMutation.mutate(data);

  const handleRegister = (data: RegisterData) => {
    // ✅ Fix: remove confirmPassword before sending to backend
    const { confirmPassword, ...rest } = data;
    registerMutation.mutate(rest);
  };

  if (user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Hero Section */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900">
              Welcome to{" "}
              <span className="text-green-600">FarmCare Pro</span>
            </h1>
            <p className="text-xl text-gray-600">
              Complete livestock health management system designed for modern farmers
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Feature icon={<Heart className="text-green-600" />} title="Health Tracking" desc="Monitor livestock health with detailed records and reminders" bg="green" />
            <Feature icon={<BarChart3 className="text-blue-600" />} title="Analytics" desc="Get insights into your farm’s performance and metrics" bg="blue" />
            <Feature icon={<Shield className="text-purple-600" />} title="Disease Prevention" desc="Access disease database and emergency protocols" bg="purple" />
            <Feature icon={<Users className="text-orange-600" />} title="Community" desc="Connect with other farmers and share knowledge" bg="orange" />
          </div>
        </div>

        {/* Auth Form Section */}
        <div className="w-full max-w-md mx-auto">
          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Get Started</CardTitle>
              <CardDescription className="text-center">
                Sign in or create a new account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "register")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="register">Sign Up</TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                    <InputField
                      id="login-username"
                      label="Username"
                      placeholder="yourname"
                      form={loginForm}
                      name="username"
                    />
                    <InputField
                      id="login-password"
                      label="Password"
                      type="password"
                      placeholder="Enter password"
                      form={loginForm}
                      name="password"
                    />
                    <Button className="w-full" disabled={loginMutation.isPending}>
                      {loginMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                </TabsContent>

                {/* Register Tab */}
                <TabsContent value="register" className="space-y-4">
                  <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                    <InputField
                      id="register-username"
                      label="Username"
                      placeholder="Choose a username"
                      form={registerForm}
                      name="username"
                    />
                    <InputField
                      id="register-password"
                      label="Password"
                      type="password"
                      placeholder="Create a password"
                      form={registerForm}
                      name="password"
                    />
                    <InputField
                      id="register-confirmPassword"
                      label="Confirm Password"
                      type="password"
                      placeholder="Repeat password"
                      form={registerForm}
                      name="confirmPassword"
                    />
                    <Button className="w-full" disabled={registerMutation.isPending}>
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// InputField component
function InputField({ id, label, type = "text", placeholder, form, name }: any) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        {...form.register(name)}
      />
      {form.formState.errors[name] && (
        <p className="text-sm text-red-600">
          {form.formState.errors[name].message}
        </p>
      )}
    </div>
  );
}

// Feature component
function Feature({ icon, title, desc, bg }: { icon: React.ReactNode, title: string, desc: string, bg: string }) {
  return (
    <div className="flex items-start space-x-3">
      <div className={`p-2 bg-${bg}-100 rounded-lg`}>{icon}</div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{desc}</p>
      </div>
    </div>
  );
}
