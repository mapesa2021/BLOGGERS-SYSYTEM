/**
 * Subscription API Route
 * Integrates with Clubzila API to trigger USSD payments
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Clubzila Get User API Integration
 */
async function getUserByPhone(phoneNumber: string): Promise<{ success: boolean; userId?: string; error?: string }> {
  try {
    console.log('🔍 Attempting to get existing user with phone:', phoneNumber);
    
    const getUserResponse = await fetch('https://clubzila.com/api/funnel/get-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone_number: phoneNumber
      })
    });

    console.log('🔍 Get user response status:', getUserResponse.status);

    if (!getUserResponse.ok) {
      const errorText = await getUserResponse.text();
      console.error('❌ Get user failed:', errorText);
      return {
        success: false,
        error: `Get user failed: ${getUserResponse.status} ${errorText}`
      };
    }

    const getUserData = await getUserResponse.json();
    console.log('✅ Get user successful:', getUserData);

    if (getUserData.success && getUserData.user) {
      // Extract user ID from id field or username
      let userId;
      if (getUserData.user.id) {
        userId = getUserData.user.id.toString();
      } else if (getUserData.user.username) {
        userId = getUserData.user.username.replace('u', '');
      } else {
        console.error('❌ No user ID found in get-user response:', getUserData.user);
        return {
          success: false,
          error: 'No user ID found in get-user response'
        };
      }
      
      console.log('✅ Found existing User ID:', userId);
      
      return {
        success: true,
        userId: userId
      };
    } else {
      console.error('❌ Get user failed or invalid response structure:', getUserData);
      return {
        success: false,
        error: getUserData.errors ? JSON.stringify(getUserData.errors) : 'Invalid get-user response structure'
      };
    }
  } catch (error) {
    console.error('❌ Get user error:', error);
    return {
      success: false,
      error: `Get user error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Clubzila Signup API Integration
 */
async function signupUser(phoneNumber: string, name?: string): Promise<{ success: boolean; userId?: string; error?: string }> {
  try {
    console.log('🔍 Attempting to signup user with phone:', phoneNumber);
    
    const signupResponse = await fetch('https://clubzila.com/api/funnel/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name || `User ${phoneNumber}`,
        phone_number: phoneNumber,
        password: '12345678', // Default password
        countryCode: '255', // Tanzania
        agree_gdpr: true,
        'g-recaptcha-response': true,
        referred_by: 658767978 // Default referrer
      })
    });

    console.log('🔍 Signup response status:', signupResponse.status);

    if (!signupResponse.ok) {
      const errorText = await signupResponse.text();
      console.error('❌ Signup failed:', errorText);
      return {
        success: false,
        error: `Signup failed: ${signupResponse.status} ${errorText}`
      };
    }

    const signupData = await signupResponse.json();
    console.log('✅ Signup successful:', signupData);

    if (signupData.success && signupData.user) {
      // Extract user ID from username (e.g., "u19251" -> "19251") or use id field
      let userId;
      if (signupData.user.username) {
        userId = signupData.user.username.replace('u', '');
      } else if (signupData.user.id) {
        userId = signupData.user.id.toString();
      } else {
        console.error('❌ No user ID found in response:', signupData.user);
        return {
          success: false,
          error: 'No user ID found in signup response'
        };
      }
      
      console.log('✅ Extracted User ID:', userId);
      
      return {
        success: true,
        userId: userId
      };
    } else {
      console.error('❌ Signup failed or invalid response structure:', signupData);
      return {
        success: false,
        error: signupData.errors ? JSON.stringify(signupData.errors) : 'Invalid signup response structure'
      };
    }
  } catch (error) {
    console.error('❌ Signup error:', error);
    return {
      success: false,
      error: `Signup error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

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
    
    // Validate required fields based on template type
    const templateType = body.templateType || 'minimal'; // Default to minimal for backward compatibility
    
    if (templateType === 'minimal') {
      // Minimal template: requires phoneNumber
      if (!body.pageId || !body.phoneNumber) {
        return NextResponse.json({
          success: false,
          message: 'Missing required fields: pageId, phoneNumber'
        }, { status: 400 });
      }
    } else if (templateType === 'modern') {
      // Business template: requires pageId and phoneNumber (userId and creatorId extracted from pageId)
      if (!body.pageId || !body.phoneNumber) {
        return NextResponse.json({
          success: false,
          message: 'Missing required fields: pageId, phoneNumber'
        }, { status: 400 });
      }
    } else if (templateType === 'video-feed') {
      // Video feed template: requires pageId and phoneNumber (creatorId extracted from pageId)
      if (!body.pageId || !body.phoneNumber) {
        return NextResponse.json({
          success: false,
          message: 'Missing required fields: pageId, phoneNumber'
        }, { status: 400 });
      }
    } else if (templateType === 'jose') {
      // JOSE template: requires pageId and phoneNumber (creatorId extracted from pageId)
      if (!body.pageId || !body.phoneNumber) {
        return NextResponse.json({
          success: false,
          message: 'Missing required fields: pageId, phoneNumber'
        }, { status: 400 });
      }
    } else if (templateType === 'business-services') {
      // Business services template: requires pageId and phoneNumber (creatorId extracted from pageId)
      if (!body.pageId || !body.phoneNumber) {
        return NextResponse.json({
          success: false,
          message: 'Missing required fields: pageId, phoneNumber'
        }, { status: 400 });
      }
    } else if (templateType === 'betting') {
      // Betting template: requires pageId and phoneNumber (creatorId extracted from pageId)
      if (!body.pageId || !body.phoneNumber) {
        return NextResponse.json({
          success: false,
          message: 'Missing required fields: pageId, phoneNumber'
        }, { status: 400 });
      }
    }

    console.log('🔄 Processing subscription:', {
      templateType: templateType,
      pageId: body.pageId,
      phoneNumber: body.phoneNumber,
      userId: body.userId,
      creatorId: body.creatorId,
      userName: body.userName
    });

    let userId: number | undefined;
    let creatorId: number | undefined;

    if (templateType === 'minimal') {
      // Step 1: Smart user handling for minimal template - try signup first, then get existing user if needed
      console.log('📝 Step 1: Smart user handling for minimal template...');
      
      // First, try to signup the user
      console.log('🔄 Attempting to signup new user...');
      const signupResult = await signupUser(body.phoneNumber, body.userName);
      
      if (signupResult.success) {
        // Signup successful - new user created
        userId = parseInt(signupResult.userId!);
        console.log('✅ New user signup successful, User ID:', userId);
      } else {
        // Signup failed - check if user already exists
        console.log('⚠️ Signup failed, checking if user already exists...');
        console.log('🔍 Signup error:', signupResult.error);
        
        // Check if the error indicates user already exists
        if (signupResult.error && signupResult.error.includes('already been taken')) {
          console.log('🔄 User already exists, getting existing user ID...');
          const getUserResult = await getUserByPhone(body.phoneNumber);
          
          if (getUserResult.success) {
            userId = parseInt(getUserResult.userId!);
            console.log('✅ Found existing user, User ID:', userId);
          } else {
            console.error('❌ Failed to get existing user:', getUserResult.error);
            return NextResponse.json({
              success: false,
              message: 'Failed to get existing user information',
              error: getUserResult.error
            }, { status: 400 });
          }
        } else {
          // Some other signup error
          console.error('❌ User signup failed with unexpected error:', signupResult.error);
          return NextResponse.json({
            success: false,
            message: 'User registration failed',
            error: signupResult.error
          }, { status: 400 });
        }
      }
      
      // Extract creator ID from pageId for minimal template (format: creatorId-template-timestamp)
      const pageIdParts = body.pageId.split('-');
      const creatorIdString = pageIdParts[0];
      creatorId = parseInt(creatorIdString);
      
    } else if (templateType === 'modern') {
      // Business template: extract userId and creatorId from pageId (format: userId-creatorId-template-timestamp)
      console.log('📝 Step 1: Extracting User ID and Creator ID from pageId for business template...');
      const pageIdParts = body.pageId.split('-');
      const userIdString = pageIdParts[0];
      const creatorIdString = pageIdParts[1];
      userId = parseInt(userIdString);
      creatorId = parseInt(creatorIdString);
      console.log('✅ Extracted IDs from pageId - User ID:', userId, 'Creator ID:', creatorId, 'Phone:', body.phoneNumber);
    } else if (templateType === 'video-feed') {
      // Video feed template: same logic as minimal template - smart user handling and extract creatorId from pageId
      console.log('📝 Step 1: Smart user handling for video-feed template...');
      
      // First, try to signup the user
      console.log('🔄 Attempting to signup new user...');
      const signupResult = await signupUser(body.phoneNumber, body.userName);
      
      if (signupResult.success) {
        // Signup successful - new user created
        userId = parseInt(signupResult.userId!);
        console.log('✅ New user signup successful, User ID:', userId);
      } else {
        // Signup failed - check if user already exists
        console.log('⚠️ Signup failed, checking if user already exists...');
        console.log('🔍 Signup error:', signupResult.error);
        
        // Check if the error indicates user already exists
        if (signupResult.error && signupResult.error.includes('already been taken')) {
          console.log('🔄 User already exists, getting existing user ID...');
          const getUserResult = await getUserByPhone(body.phoneNumber);
          
          if (getUserResult.success) {
            userId = parseInt(getUserResult.userId!);
            console.log('✅ Found existing user, User ID:', userId);
          } else {
            console.error('❌ Failed to get existing user:', getUserResult.error);
            return NextResponse.json({
              success: false,
              message: 'Failed to get existing user information',
              error: getUserResult.error
            }, { status: 400 });
          }
        } else {
          // Some other signup error
          console.error('❌ User signup failed with unexpected error:', signupResult.error);
          return NextResponse.json({
            success: false,
            message: 'User registration failed',
            error: signupResult.error
          }, { status: 400 });
        }
      }
      
      // Extract creator ID from pageId for video-feed template (format: creatorId-template-timestamp)
      const pageIdParts = body.pageId.split('-');
      const creatorIdString = pageIdParts[0];
      creatorId = parseInt(creatorIdString);
      console.log('✅ Extracted Creator ID from pageId:', creatorId);
    } else if (templateType === 'jose') {
      // JOSE template: same logic as minimal template - smart user handling and extract creatorId from pageId
      console.log('📝 Step 1: Smart user handling for JOSE template...');
      
      // First, try to signup the user
      console.log('🔄 Attempting to signup new user...');
      const signupResult = await signupUser(body.phoneNumber, body.userName);
      
      if (signupResult.success) {
        // Signup successful - new user created
        userId = parseInt(signupResult.userId!);
        console.log('✅ New user signup successful, User ID:', userId);
      } else {
        // Signup failed - check if user already exists
        console.log('⚠️ Signup failed, checking if user already exists...');
        console.log('🔍 Signup error:', signupResult.error);
        
        // Check if the error indicates user already exists
        if (signupResult.error && signupResult.error.includes('already been taken')) {
          console.log('🔄 User already exists, getting existing user ID...');
          const getUserResult = await getUserByPhone(body.phoneNumber);
          
          if (getUserResult.success) {
            userId = parseInt(getUserResult.userId!);
            console.log('✅ Found existing user, User ID:', userId);
          } else {
            console.error('❌ Failed to get existing user:', getUserResult.error);
            return NextResponse.json({
              success: false,
              message: 'Failed to get existing user information',
              error: getUserResult.error
            }, { status: 400 });
          }
        } else {
          // Some other signup error
          console.error('❌ User signup failed with unexpected error:', signupResult.error);
          return NextResponse.json({
            success: false,
            message: 'User registration failed',
            error: signupResult.error
          }, { status: 400 });
        }
      }
      
      // Extract creator ID from pageId for JOSE template (format: creatorId-template-timestamp)
      const pageIdParts = body.pageId.split('-');
      const creatorIdString = pageIdParts[0];
      creatorId = parseInt(creatorIdString);
      console.log('✅ Extracted Creator ID from pageId:', creatorId);
    } else if (templateType === 'business-services') {
      // Business services template: same logic as minimal template - smart user handling and extract creatorId from pageId
      console.log('📝 Step 1: Smart user handling for business-services template...');
      
      // First, try to signup the user
      console.log('🔄 Attempting to signup new user...');
      const signupResult = await signupUser(body.phoneNumber, body.userName);
      
      if (signupResult.success) {
        // Signup successful - new user created
        userId = parseInt(signupResult.userId!);
        console.log('✅ New user signup successful, User ID:', userId);
      } else {
        // Signup failed - check if user already exists
        console.log('⚠️ Signup failed, checking if user already exists...');
        console.log('🔍 Signup error:', signupResult.error);
        
        // Check if the error indicates user already exists
        if (signupResult.error && signupResult.error.includes('already been taken')) {
          console.log('🔄 User already exists, getting existing user ID...');
          const getUserResult = await getUserByPhone(body.phoneNumber);
          
          if (getUserResult.success) {
            userId = parseInt(getUserResult.userId!);
            console.log('✅ Found existing user, User ID:', userId);
          } else {
            console.error('❌ Failed to get existing user:', getUserResult.error);
            return NextResponse.json({
              success: false,
              message: 'Failed to get existing user information',
              error: getUserResult.error
            }, { status: 400 });
          }
        } else {
          // Some other signup error
          console.error('❌ User signup failed with unexpected error:', signupResult.error);
          return NextResponse.json({
            success: false,
            message: 'User registration failed',
            error: signupResult.error
          }, { status: 400 });
        }
      }
      
      // Extract creator ID from pageId for business-services template (format: creatorId-template-timestamp)
      const pageIdParts = body.pageId.split('-');
      const creatorIdString = pageIdParts[0];
      creatorId = parseInt(creatorIdString);
      console.log('✅ Extracted Creator ID from pageId:', creatorId);
    } else if (templateType === 'betting') {
      // Betting template: same logic as minimal template - smart user handling and extract creatorId from pageId
      console.log('📝 Step 1: Smart user handling for betting template...');
      
      // First, try to signup the user
      console.log('🔄 Attempting to signup new user...');
      const signupResult = await signupUser(body.phoneNumber, body.userName);
      
      if (signupResult.success) {
        // Signup successful - new user created
        userId = parseInt(signupResult.userId!);
        console.log('✅ New user signup successful, User ID:', userId);
      } else {
        // Signup failed - check if user already exists
        console.log('⚠️ Signup failed, checking if user already exists...');
        console.log('🔍 Signup error:', signupResult.error);
        
        // Check if the error indicates user already exists
        if (signupResult.error && signupResult.error.includes('already been taken')) {
          console.log('🔄 User already exists, getting existing user ID...');
          const getUserResult = await getUserByPhone(body.phoneNumber);
          
          if (getUserResult.success) {
            userId = parseInt(getUserResult.userId!);
            console.log('✅ Found existing user, User ID:', userId);
          } else {
            console.error('❌ Failed to get existing user:', getUserResult.error);
            return NextResponse.json({
              success: false,
              message: 'Failed to get existing user information',
              error: getUserResult.error
            }, { status: 400 });
          }
        } else {
          // Some other signup error
          console.error('❌ User signup failed with unexpected error:', signupResult.error);
          return NextResponse.json({
            success: false,
            message: 'User registration failed',
            error: signupResult.error
          }, { status: 400 });
        }
      }
      
      // Extract creator ID from pageId for betting template (format: creatorId-template-timestamp)
      const pageIdParts = body.pageId.split('-');
      const creatorIdString = pageIdParts[0];
      creatorId = parseInt(creatorIdString);
      console.log('✅ Extracted Creator ID from pageId:', creatorId);
    }

    // Step 2: Validate creator ID
    if (creatorId === undefined || isNaN(creatorId)) {
      console.error('❌ Invalid creator ID:', creatorId);
      return NextResponse.json({
        success: false,
        message: `Invalid creator ID: ${creatorId}. Creator ID must be a number.`,
        error: 'Creator ID must be a valid integer'
      }, { status: 400 });
    }
      
    console.log('📋 Using dynamic data:', {
      pageId: body.pageId,
      userId: userId,
      creatorId: creatorId,
      phoneNumber: body.phoneNumber,
      templateType: templateType
    });
      
    // Step 3: Call Clubzila API to trigger USSD payment
    console.log('💳 Step 3: Initiating payment...');
    const clubzilaResponse = await fetch('https://clubzila.com/api/funnel/pay-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_id: userId, // Dynamic User ID from signup
        creator_id: creatorId, // Creator ID from pageId
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
    console.log('✅ Payment initiated successfully:', clubzilaData);

    return NextResponse.json({
      success: true,
      message: 'Payment initiated! Check your phone for USSD prompt.',
      data: {
        userId: userId,
        creatorId: creatorId,
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

