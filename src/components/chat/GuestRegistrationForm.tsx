import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters." }),
  phoneNumber: z
    .string()
    .min(10, { message: "Please enter a valid phone number." }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .optional()
    .or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

interface GuestRegistrationFormProps {
  onSubmit?: (data: FormValues) => void;
  isLoading?: boolean;
  className?: string;
}

const GuestRegistrationForm = ({
  onSubmit = () => {},
  isLoading = false,
  className = "",
}: GuestRegistrationFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
    },
  });

  const handleSubmit = (data: FormValues) => {
    onSubmit(data);
  };

  return (
    <Card className={`w-full max-w-md mx-auto bg-white ${className}`}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center text-brand-secondary">
          Welcome to Chat
        </CardTitle>
        <CardDescription className="text-center text-brand-muted">
          Please provide your information to start chatting
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number*</FormLabel>
                  <FormControl>
                    <Input placeholder="(123) 456-7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <motion.div
              className="pt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                type="submit"
                className="w-full bg-brand-primary text-white hover:bg-brand-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Start Chatting"}
              </Button>
            </motion.div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center text-xs text-brand-muted">
        <p>
          By registering, you agree to our Terms of Service and Privacy Policy
        </p>
      </CardFooter>
    </Card>
  );
};

export default GuestRegistrationForm;
