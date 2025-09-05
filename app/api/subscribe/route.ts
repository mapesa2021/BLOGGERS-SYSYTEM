/**
 * Subscription API Route
 * Integrates with Clubzila API to trigger USSD payments
 */

import { NextRequest, NextResponse } from 'next/server';

// GET: Test endpoint
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Subscription API is running',
    endpoints: {
      POST: '/api/subscribe - Process subscription with dynamic creator data'
    },
    features: [
      'Dynamic creator ID validation',
      'User phone number from form input',
      'Success/failure redirect URLs',
      'Analytics tracking',
      'Multi-tenant support'
    ]
  });
}

// POST: Process subscription with dynamic creator data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.pageId || !body.phoneNumber) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: pageId, phoneNumber'
      }, { status: 400 });
    }

    console.log('🔄 Processing subscription with built-in creator data:', {
      pageId: body.pageId,
      phoneNumber: body.phoneNumber,
      userName: body.userName
    });

      // Extract the user ID and creator ID from the pageId (format: userId-creatorId-template-timestamp)
      const pageIdParts = body.pageId.split('-');
      const userIdString = pageIdParts[0]; // First part is the user ID (who is subscribing)
      const creatorIdString = pageIdParts[1]; // Second part is the creator ID (who they're subscribing to)
      
      // Validate that user ID is a valid integer
      const userId = parseInt(userIdString);
      if (isNaN(userId)) {
        console.error('❌ Invalid user ID:', userIdString);
        return NextResponse.json({
          success: false,
          message: `Invalid user ID: ${userIdString}. User ID must be a number.`,
          error: 'User ID must be a valid integer'
        }, { status: 400 });
      }
      
      // Validate that creator ID is a valid integer
      const creatorId = parseInt(creatorIdString);
      if (isNaN(creatorId)) {
        console.error('❌ Invalid creator ID:', creatorIdString);
        return NextResponse.json({
          success: false,
          message: `Invalid creator ID: ${creatorIdString}. Creator ID must be a number.`,
          error: 'Creator ID must be a valid integer'
        }, { status: 400 });
      }
      
      console.log('📋 Using page data:', {
        pageId: body.pageId,
        userId: userId,
        userIdString: userIdString,
        creatorId: creatorId,
        creatorIdString: creatorIdString,
        phoneNumber: body.phoneNumber
      });
      
      // Call Clubzila API to trigger USSD payment
      const clubzilaResponse = await fetch('https://clubzila.com/api/funnel/pay-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth_id: userId, // Use the user ID (first part) - who is subscribing
          creator_id: creatorId, // Use the creator ID (second part) - who they're subscribing to
          phone_number: body.phoneNumber,
          amount: 500.00
        })
      });

      if (!clubzilaResponse.ok) {
        const errorData = await clubzilaResponse.text();
        console.error('❌ Clubzila API error:', clubzilaResponse.status, errorData);
        
        return NextResponse.json({
          success: false,
          message: `Payment failed: ${clubzilaResponse.status} ${clubzilaResponse.statusText}`,
          error: errorData
        }, { status: 400 });
      }

      const clubzilaData = await clubzilaResponse.json();
      console.log('✅ Clubzila payment initiated successfully:', clubzilaData);
      
      return NextResponse.json({
        success: true,
        message: 'Payment initiated! Check your phone for USSD prompt.',
        data: {
          subscription_id: clubzilaData.transaction_id || `sub_${Date.now()}`,
          status: 'pending',
          amount: 500,
          currency: 'TZS',
          clubzila_response: clubzilaData
        }
      });

  } catch (error) {
    console.error('❌ Subscription API error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Subscription processing failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

