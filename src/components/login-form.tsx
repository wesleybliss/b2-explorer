"use client";

import { useSearchParams } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import { login, type FormState } from "@/app/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Connect
    </Button>
  );
}

export function LoginForm() {
  const searchParams = useSearchParams();
  const authError =
    searchParams.get("error") === "auth_failed"
      ? "Authentication failed. Please check your credentials and try again."
      : null;
  
  const initialState: FormState = { message: authError || "", success: !authError };
  const [state, formAction] = useFormState(login, initialState);

  return (
    <Card className="w-full max-w-sm mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Connect to B2</CardTitle>
        <CardDescription>
          Enter your Backblaze B2 credentials to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="keyId">B2 Key ID</Label>
            <Input id="keyId" name="keyId" placeholder="00123abc..." required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="applicationKey">B2 Application Key</Label>
            <Input id="applicationKey" name="applicationKey" type="password" placeholder="K001...xyz" required />
          </div>

          {state?.message && !state.success && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
