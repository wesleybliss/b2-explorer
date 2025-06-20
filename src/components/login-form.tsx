"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  keyId: z.string().min(1, { message: "B2 Key ID is required." }),
  applicationKey: z.string().min(1, { message: "B2 Application Key is required." }),
});

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keyId: "",
      applicationKey: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    // In a real app, you would validate credentials and handle errors.
    // For this demo, we'll just redirect to the dashboard.
    router.push("/dashboard");
  }

  return (
    <Card className="w-full max-w-sm mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Connect to B2</CardTitle>
        <CardDescription>
          Enter your Backblaze B2 credentials to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="keyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>B2 Key ID</FormLabel>
                  <FormControl>
                    <Input placeholder="00123abc..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="applicationKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>B2 Application Key</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="K001...xyz" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Connect
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
