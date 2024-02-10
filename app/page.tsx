// page.tsx

import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from './config';

// Initial frame metadata setup without the input field
const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'Story time!',
      // Assuming 'Story time!' button now prompts users to like the post to unlock features
    },
    {
      action: 'link',
      label: 'Link to Google',
      target: 'https://www.google.com',
    },
    {
      label: 'Like to unlock story input',
      action: 'post_redirect', // This action needs to be handled in your backend to check for likes
    },
  ],
  image: {
    src: `${NEXT_PUBLIC_URL}/park-3.png`,
    aspectRatio: '1:1',
  },
  // The 'input' field is now removed from the initial setup
  postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
});

export const metadata: Metadata = {
  title: 'zizzamia.xyz',
  description: 'LFG',
  openGraph: {
    title: 'zizzamia.xyz',
    description: 'LFG',
    images: [`${NEXT_PUBLIC_URL}/park-1.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <h1>zizzamia.xyz</h1>
      {/* You might want to include additional UI elements here to prompt users to like the post */}
    </>
  );
}
