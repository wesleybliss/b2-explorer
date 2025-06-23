'use client'
import { useSearchParams } from 'next/navigation'
import { useFormStatus } from 'react-dom'
import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Loader2, AlertCircle } from 'lucide-react'
import { login, type FormState } from '@/app/actions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox' // Import Checkbox component
import { useState, useEffect, useRef, startTransition } from 'react' // Import useState, useEffect, useRef, and startTransition hooks

function SubmitButton() {
    const { pending } = useFormStatus()
    
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Connect
        </Button>
    )
}

export function LoginForm() {
    const searchParams = useSearchParams()
    const authError =
    searchParams.get('error') === 'auth_failed'
        ? 'Authentication failed. Please check your credentials and try again.'
        : null
    
    const initialState: FormState = { message: authError || '', success: !authError }
    const [state, formAction] = useActionState(login, initialState)

    // State for the "remember me" checkbox
    const [rememberMe, setRememberMe] = useState(false);
    // Refs to access the input elements directly for pre-filling
    const keyIdRef = useRef<HTMLInputElement>(null);
    const applicationKeyRef = useRef<HTMLInputElement>(null);

    // Effect to load credentials from localStorage on component mount
    useEffect(() => {
        // Ensure window (and thus localStorage) is available
        if (typeof window !== 'undefined') {
            const rememberedKeyId = localStorage.getItem('rememberedKeyId');
            const rememberedApplicationKey = localStorage.getItem('rememberedApplicationKey');

            let shouldRemember = false;

            // Pre-fill Key ID if found in localStorage
            if (rememberedKeyId && keyIdRef.current) {
                keyIdRef.current.value = rememberedKeyId;
                shouldRemember = true;
            }
            // Pre-fill Application Key if found in localStorage
            if (rememberedApplicationKey && applicationKeyRef.current) {
                applicationKeyRef.current.value = rememberedApplicationKey;
                shouldRemember = true;
            }
            // Set rememberMe state if any credentials were pre-filled
            setRememberMe(shouldRemember);
        }
    }, []); // Empty dependency array means this effect runs once on mount

    // Custom submit handler to manage localStorage before calling the server action
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission

        // Create FormData object from the form
        const formData = new FormData(event.currentTarget);
        const keyId = formData.get('keyId') as string;
        const applicationKey = formData.get('applicationKey') as string;

        // Save or remove credentials based on rememberMe state
        if (rememberMe) {
            if (keyId) localStorage.setItem('rememberedKeyId', keyId);
            if (applicationKey) localStorage.setItem('rememberedApplicationKey', applicationKey);
        } else {
            localStorage.removeItem('rememberedKeyId');
            localStorage.removeItem('rememberedApplicationKey');
        }

        // Call the original server action within a transition
        startTransition(() => {
            formAction(formData);
        });
    };
    
    return (
        <Card className="w-full max-w-sm mx-auto shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-headline">Connect to B2</CardTitle>
                <CardDescription>
                    Enter your Backblaze B2 credentials to continue.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Attach the custom handleSubmit to the form's onSubmit event */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="keyId">B2 Key ID</Label>
                        {/* Attach ref to the Input component */}
                        <Input id="keyId" name="keyId" placeholder="00123abc..." required ref={keyIdRef} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="applicationKey">B2 Application Key</Label>
                        {/* Attach ref to the Input component */}
                        <Input id="applicationKey" name="applicationKey" type="password" placeholder="K001...xyz" required ref={applicationKeyRef} />
                    </div>
                    
                    {/* New checkbox for "Remember credentials" */}
                    <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="remember" 
                            checked={rememberMe} 
                            onCheckedChange={(checked) => {
                                // Update the rememberMe state. `checked` can be boolean or 'indeterminate'
                                setRememberMe(!!checked); 
                            }} 
                        />
                        <Label htmlFor="remember">Remember credentials</Label>
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
    )
}
