import { S3Client, ListBucketsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface Bucket {
  id: string;
  name: string;
}

export interface B2File {
  id: string;
  name: string;
  size: number; // in bytes
  lastModified: string;
}

interface B2Credentials {
    keyId: string;
    applicationKey: string;
    apiUrl: string;
    authorizationToken: string;
    s3ApiUrl: string;
    accountId: string;
}

function getCredentials(): B2Credentials {
  const cookieStore = cookies();
  const credsCookie = cookieStore.get('b2_credentials');
  if (!credsCookie) {
    redirect('/');
  }
  try {
    return JSON.parse(credsCookie.value);
  } catch (e) {
    console.error("Failed to parse credentials cookie", e);
    redirect('/');
  }
}

function getB2Client() {
  const credentials = getCredentials();
  const s3EndpointUrl = new URL(credentials.s3ApiUrl);
  // The region is part of the S3 endpoint hostname. e.g. s3.us-west-004.backblazeb2.com
  const region = s3EndpointUrl.hostname.split('.')[1];

  const s3Client = new S3Client({
    endpoint: credentials.s3ApiUrl,
    region: region,
    credentials: {
      accessKeyId: credentials.keyId,
      secretAccessKey: credentials.applicationKey,
    },
  });

  return s3Client;
}


export const getBuckets = async (): Promise<Bucket[]> => {
    const s3 = getB2Client();
    try {
        const command = new ListBucketsCommand({});
        const response = await s3.send(command);
        return response.Buckets?.map(bucket => ({
            id: bucket.Name!,
            name: bucket.Name!,
        })) || [];
    } catch (error) {
        console.error("Failed to get buckets:", error);
        // This error is likely due to invalid credentials.
        // Clear the cookie and redirect to login to allow re-authentication.
        cookies().delete('b2_credentials');
        redirect('/?error=auth_failed');
    }
};

export const getFiles = async (bucketName: string): Promise<B2File[]> => {
    const s3 = getB2Client();
    try {
        const command = new ListObjectsV2Command({ Bucket: bucketName });
        const response = await s3.send(command);

        return response.Contents?.map(file => ({
            id: file.Key!,
            name: file.Key!,
            size: file.Size || 0,
            // Format date to YYYY-MM-DD
            lastModified: file.LastModified?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        })) || [];
    } catch (error) {
        console.error(`Failed to get files for bucket ${bucketName}:`, error);
        // On file listing error, we don't redirect, just return an empty list
        // to show "Empty Bucket" or a similar message on the page.
        return [];
    }
};
