'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const B2_AUTH_URL = 'https://api.backblazeb2.com/b2api/v2/b2_authorize_account';

export type FormState = {
  message: string;
  success: boolean;
};

export async function login(prevState: FormState, formData: FormData): Promise<FormState> {
  const keyId = formData.get('keyId') as string;
  const applicationKey = formData.get('applicationKey') as string;

  if (!keyId || !applicationKey) {
    return { success: false, message: 'Please provide both Key ID and Application Key.' };
  }

  const basicAuth = Buffer.from(`${keyId}:${applicationKey}`).toString('base64');

  try {
    const response = await fetch(B2_AUTH_URL, {
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.message || 'Invalid B2 credentials.' };
    }

    const data = await response.json();
    const cookieStore = cookies();

    cookieStore.set('b2_credentials', JSON.stringify({
      keyId,
      applicationKey,
      apiUrl: data.apiUrl,
      authorizationToken: data.authorizationToken,
      s3ApiUrl: data.s3ApiUrl,
      accountId: data.accountId,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

  } catch (error) {
    console.error(error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
  
  redirect('/dashboard');
}
