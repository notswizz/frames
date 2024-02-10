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

  // Extract text input from the frame message
  if (message?.input) {
    text = message.input;
  }

  // Handle redirect based on button clicked and conditions like 'liked'
  if (message?.button === 3) {
    // If 'Redirect to pictures' button is clicked and user has liked the post
    if (message?.liked) {
      return NextResponse.redirect(
        'https://www.google.com/search?q=cute+dog+pictures&tbm=isch&source=lnms',
        { status: 302 },
      );
    } else {
      // User has clicked the button but hasn't liked the post, prompt them to like
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
              label: 'Like to unlock pictures',
              action: 'post_redirect',
            },
          ],
          image: {
            src: `${NEXT_PUBLIC_URL}/park-3.png`,
            aspectRatio: '1:1',
          },
          input: {
            text: 'Tell me a boat story',
          },
          postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
        }),
      );
    }
  }

  // Return a new frame response with the preserved text input in the button label
  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: `🌲☀️ ${text} 🌲🌲`,
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
      postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
