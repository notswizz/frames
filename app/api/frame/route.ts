// api/frame/route.tsx

import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = '';
  let text: string | undefined = '';

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  // Validate the frame message
  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
  }

  // Check if the message has been liked before allowing text input
  if (message?.liked) {
    // Extract text input from the frame message
    if (message?.input) {
      text = message.input;
    }

    // Return a new frame response with the text input in the button label if liked
    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          {
            label: `🌲☀️ ${text || 'Story time!'} 🌲🌲`,
          },
          {
            action: 'link',
            label: 'Link to Google',
            target: 'https://www.google.com',
          },
          {
            label: 'Redirect to pictures',
            action: 'post_redirect',
          },
        ],
        image: {
          src: `${NEXT_PUBLIC_URL}/park-1.png`,
        },
        input: {
          text: 'Tell me a boat story',
        },
        postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
      }),
    );
  } else {
    // If the post hasn't been liked, do not show the text input
    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          {
            label: 'Story time!',
          },
          {
            action: 'link',
            label: 'Link to Google',
            target: 'https://www.google.com',
          },
          {
            label: 'Like to unlock stories',
            action: 'post_redirect',
          },
        ],
        image: {
          src: `${NEXT_PUBLIC_URL}/park-3.png`,
          aspectRatio: '1:1',
        },
        // Notice how we're not including the `input` property here
        postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
      }),
    );
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
