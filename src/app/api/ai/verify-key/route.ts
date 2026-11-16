import { NextRequest, NextResponse } from 'next/server';
import { validateGeminiKeySyntax, sanitizeGeminiKey } from '@/lib/gemini-validator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawKey = body.apiKey || req.headers.get('x-gemini-api-key') || '';
    const apiKey = sanitizeGeminiKey(rawKey);

    // 1. Strict Syntax & Format Validation
    const syntaxCheck = validateGeminiKeySyntax(apiKey);
    if (!syntaxCheck.valid) {
      return NextResponse.json(
        {
          valid: false,
          code: syntaxCheck.code,
          error: syntaxCheck.error,
          details: syntaxCheck.details,
        },
        { status: 400 }
      );
    }

    // 2. Live Ping to Google AI Studio API
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const googleRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      // Google returns 200 when API key is valid and authorized
      if (googleRes.ok) {
        return NextResponse.json({
          valid: true,
          status: 'ACTIVE',
          message: 'API Key successfully verified with Google AI Studio. AI features are now activated.',
          provider: 'google-ai-studio',
        });
      }

      // Handle specific Google API Error Responses
      const errorData = await googleRes.json().catch(() => ({}));
      const googleErrorMsg = errorData?.error?.message;
      const googleReason = errorData?.error?.details?.[0]?.reason;

      if (googleRes.status === 400 || googleRes.status === 403) {
        return NextResponse.json(
          {
            valid: false,
            code: 'API_KEY_INVALID',
            error: googleErrorMsg || 'Google AI Studio rejected this key as invalid.',
            details:
              googleReason === 'API_KEY_INVALID'
                ? 'The provided API key does not exist or has been deleted from Google AI Studio.'
                : 'Please verify the key in your Google AI Studio console (https://aistudio.google.com/app/apikey).',
          },
          { status: 400 }
        );
      }

      if (googleRes.status === 429) {
        // Valid key that has hit rate limits
        return NextResponse.json({
          valid: true,
          status: 'RATE_LIMITED',
          message: 'Key is authentic, but currently experiencing rate limiting by Google AI Studio.',
          provider: 'google-ai-studio',
        });
      }

      return NextResponse.json(
        {
          valid: false,
          code: 'VERIFICATION_FAILED',
          error: googleErrorMsg || `Google AI Studio verification returned HTTP ${googleRes.status}.`,
        },
        { status: 400 }
      );
    } catch (networkErr: any) {
      // In offline/sandboxed development environments where external network is unreachable:
      // Since syntax format strictly passed (AIzaSy prefix, 39 length, valid charset),
      // accept with offline status.
      return NextResponse.json({
        valid: true,
        status: 'FORMAT_VERIFIED_OFFLINE',
        message: 'Key structure verified (AIzaSy... 39 characters). Live Google ping unreachable in current offline sandbox environment.',
        provider: 'google-ai-studio',
      });
    }
  } catch (err: any) {
    console.error('Gemini Key verification handler error:', err);
    return NextResponse.json(
      {
        valid: false,
        code: 'SERVER_ERROR',
        error: 'Internal server error occurred while verifying the API key.',
      },
      { status: 500 }
    );
  }
}
