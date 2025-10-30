"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowRight, Mail, Lock, User, Phone, GraduationCap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ImageCarousel } from "@/components/ui/image-carousel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from "react";
import { toast } from 'sonner';

import { signupSchema, type SignupValues } from "@/schemas/user-schema";

const SignUpPage = () => {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [streams, setStreams] = useState<Array<{ id: string; name: string }>>([]);
  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      stream: "",
      password: "",
      confirmPassword: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  // Fetch streams on component mount
  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const response = await fetch('/api/streams');
        if (response.ok) {
          const data = await response.json();
          setStreams(data);
        }
      } catch (error) {
        console.error('Failed to fetch streams:', error);
      }
    };
    fetchStreams();
  }, []);

  const submit = async (values: SignupValues) => {
    setFormError(null);
    try {
      const response = await fetch('/api/auth/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.fullName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          stream: values.stream,
          password: values.password,
        }),
      });
      if (response.ok) {
        toast.success('Account created successfully!');
        router.push('/login');
      } else {
        const errorData = await response.json();
        setFormError(errorData.error || 'Failed to create account. Please try again.');
        toast.error(errorData.error || 'Failed to create account. Please try again.');
      }
    } catch (err) {
      console.error('Sign up error:', err);
      setFormError('Something went wrong. Please try again.');
      toast.error('Something went wrong. Please try again.');
    }
  };

  // Carousel images data
  const carouselImages = [
    {
      src: "/images/carousel/st3.jpg",
      alt: "Join Psychometrics",
    },
    {
      src: "/images/carousel/st1.jpg",
      alt: "Professional Tools",
    },
    {
      src: "/images/carousel/st2.jpg",
      alt: "Secure Platform",
    }
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden">
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

      {/* Right Panel - Sign Up Form (40% width on desktop, full width on mobile) */}
      <div className="w-full lg:w-2/5 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-12 py-4 sm:py-5 bg-white overflow-y-auto">
        <div className="max-w-md mx-auto w-full">
          {/* Branding Section */}
          <div className="mb-4 sm:mb-6 text-center flex flex-col items-center justify-center">
            {/* Logo */}
            <Image
            src="/images/psycologo.png"
            alt="Psycho Logo"
            width={130}
            height={130}
            className="rounded-full bg-white/20 backdrop-blur-sm p-2"
            priority
          />
            
            {/* Get Started Heading */}
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
              Get Started
            </h2>
            
            {/* Sign-up specific content */}
            <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1">
              Create Your Account
            </h3>
            <p className="text-text-subtle text-xs sm:text-sm">
              Join our platform and start your psychological assessment journey.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)} className="space-y-3 sm:space-y-4">
              {formError && (
                <p className="text-red-500 text-sm text-center">{formError}</p>
              )}

              {/* Full Name */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-subtle w-4 h-4" />
                        <Input
                          placeholder="Enter your full name"
                          autoComplete="name"
                          disabled={isSubmitting}
                          className="pl-10 py-2 bg-input-bg border-social-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
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
                          placeholder="Enter your email"
                          type="email"
                          autoComplete="email"
                          disabled={isSubmitting}
                          className="pl-10 py-2 bg-input-bg border-social-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-subtle w-4 h-4" />
                        <Input
                          placeholder="Enter your phone number"
                          type="tel"
                          autoComplete="tel"
                          disabled={isSubmitting}
                          className="pl-10 py-2 bg-input-bg border-social-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stream"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stream</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-subtle w-4 h-4 z-10" />
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="w-full pl-10 py-2 bg-input-bg border-social-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-sm">
                            <SelectValue placeholder="Select your stream" />
                          </SelectTrigger>
                              <SelectContent>
                                {streams.map((stream: { id: string; name: string }) => (
                                  <SelectItem key={stream.id} value={stream.name}>
                                    {stream.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
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
                          placeholder="Create a password"
                          type="password"
                          autoComplete="new-password"
                          disabled={isSubmitting}
                          className="pl-10 py-2 bg-input-bg border-social-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-subtle w-4 h-4" />
                        <Input
                          placeholder="Confirm your password"
                          type="password"
                          autoComplete="new-password"
                          disabled={isSubmitting}
                          className="pl-10 py-2 bg-input-bg border-social-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-xs sm:text-sm text-text-subtle">
                By signing up, you agree to our{" "}
                <a href="#" className="text-primary hover:underline font-medium">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline font-medium">
                  Privacy Policy
                </a>
                .
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 bg-primary hover:bg-primary-glow text-primary-foreground rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 text-sm"
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </Form>

          <div className="mt-3 text-center text-xs">
            <span className="text-text-subtle">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign In
              </Link>
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
