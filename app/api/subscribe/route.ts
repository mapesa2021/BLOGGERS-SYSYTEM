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

    // Use the complete subscription flow method
    const result = await clubzila.processSubscription(phoneNumber, creatorId)
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: {
        ...result.data,
        phone_number: phoneNumber,
        creator_id: creatorId
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

export async function GET(request: NextRequest) {
  try {
    // Test the Clubzila integration
    const clubzila = new ClubzilaIntegration();
    const testResult = await clubzila.testIntegration();
    
    return NextResponse.json({
      success: true,
      message: 'Clubzila integration test completed',
      data: testResult
    });
    
  } catch (error) {
    console.error('Integration test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Integration test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Test the real API endpoints
    const testPhone = '+255123456789';
    const testCreator = 'test-creator';
    
    const clubzila = new ClubzilaIntegration();
    
    // Test user check
    const userCheck = await clubzila.getUser(testPhone);
    
    // Test subscription process
    const subscriptionResult = await clubzila.processSubscription(testPhone, testCreator);
    
    return NextResponse.json({
      success: true,
      message: 'Real API test completed',
      data: {
        userCheck,
        subscriptionResult
      }
    });
    
  } catch (error) {
    console.error('Real API test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Real API test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

