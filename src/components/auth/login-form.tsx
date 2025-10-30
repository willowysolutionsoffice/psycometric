"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ImageCarousel } from "@/components/ui/image-carousel";

import { ArrowRight, Mail, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { loginSchema, type LoginValues } from "@/schemas/user-schema";
import { toast } from 'sonner';

const LoginPage = () => {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (data: LoginValues) => {
    setFormError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const data = await response.json();
        try {
          localStorage.setItem('authUser', JSON.stringify(data.user));
        } catch {}
        toast.success('Login successful!');
        router.push('/');
      } else {
        const errorData = await response.json();
        setFormError(errorData.error || 'Invalid email or password');
        toast.error(errorData.error || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setFormError('Login failed. Please try again.');
      toast.error('Login failed. Please try again.');
    }
  };

  // Carousel images data
  const carouselImages = [
    {
      src: "/images/carousel/psyco1.jpg",
      alt: "Psychometric Assessment",
    },
    {
      src: "/images/carousel/brain2.jpg",
      alt: "Assessment Tools", 
    },
    {
      src: "/images/carousel/psyco1.jpg",
      alt: "Data Analytics",
    }
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Image Carousel (60% width on desktop, hidden on mobile) */}
      <div className="hidden lg:block lg:w-3/5 relative">
        <ImageCarousel images={carouselImages} autoChangeInterval={4000} />
        
        {/* Logo overlay */}
        <div className="absolute top-8 left-8 z-10">
          <Image
            src="/images/psycologo.png"
            alt="Psycho Logo"
            width={60}
            height={60}
            className="rounded-full bg-white/20 backdrop-blur-sm p-2"
            priority
          />
        </div>
      </div>

      {/* Right Panel - Login Form (40% width on desktop, full width on mobile) */}
          <div className="w-full lg:w-2/5 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-12 py-6 bg-white grow">
        <div className="max-w-md mx-auto w-full">
          {/* Branding Section */}
          <div className="mb-6 sm:mb-8 lg:mb-10 text-center flex flex-col items-center justify-center">
            {/* Logo */}
            <Image
            src="/images/psycologo.png"
            alt="Psycho Logo"
            width={130}
            height={130}
            className="rounded-full bg-white/20 backdrop-blur-sm p-4"
            priority
          />
            
            {/* Get Started Heading */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              Get Started
            </h2>
            
            {/* Login specific content */}
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
              Sign In To Your Account
            </h3>
          </div>

          {/* ✅ Form using shadcn + react-hook-form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              {formError && (
                <p className="text-red-500 text-sm">{formError}</p>
              )}

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-subtle w-4 h-4" />
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          autoComplete="email"
                          disabled={isSubmitting}
                          className="pl-10 py-2 sm:py-3 bg-input-bg border-social-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-sm sm:text-base"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-subtle w-4 h-4" />
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          disabled={isSubmitting}
                          className="pl-10 py-2 sm:py-3 bg-input-bg border-social-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-sm sm:text-base"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sign In Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 sm:py-3 bg-primary hover:bg-primary-glow text-primary-foreground rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 text-sm sm:text-base"
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </Form>

          {/* Footer Links */}
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-center sm:justify-between items-center text-xs sm:text-sm space-y-2 sm:space-y-0">
            <span className="text-text-subtle text-center sm:text-left">
              Dont have an account?{" "}
              <Link href="/sign-up" className="text-primary hover:underline font-medium">
                Sign Up
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
