import { NextRequest, NextResponse } from 'next/server'
import { ClubzilaIntegration } from '@/lib/clubzila-integration'

export async function POST(request: NextRequest) {
  try {
    const { creatorId, phoneNumber } = await request.json()

    if (!creatorId || !phoneNumber) {
      return NextResponse.json(
        { success: false, message: 'Missing creatorId or phoneNumber' },
        { status: 400 }
      )
    }

    const clubzila = new ClubzilaIntegration()

    // First, authenticate the user
    const authResult = await clubzila.authenticateUser(phoneNumber)
    
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 400 }
      )
    }

    const userId = authResult.data?.user_id
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Failed to get user ID' },
        { status: 400 }
      )
    }

    // Check if user already has an active subscription
    const subscriptionCheck = await clubzila.checkSubscription(userId, creatorId)
    
    if (subscriptionCheck.success && subscriptionCheck.data?.has_active_subscription) {
      return NextResponse.json({
        success: true,
        message: 'User already has an active subscription',
        data: {
          has_subscription: true,
          subscription_details: subscriptionCheck.data.subscription_details
        }
      })
    }

    // Process payment for subscription
    const paymentResult = await clubzila.processPayment(userId, creatorId, phoneNumber)
    
    if (!paymentResult.success) {
      return NextResponse.json(
        { success: false, message: paymentResult.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription payment initiated successfully',
      data: {
        has_subscription: false,
        payment_initiated: true,
        payment_data: paymentResult.data
      }
    })

  } catch (error) {
    console.error('Subscription API error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

