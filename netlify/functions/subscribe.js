/**
 * Netlify Function for Subscribe API
 * Handles subscription requests and integrates with Clubzila API
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Clubzila Get User API Integration
 */
async function getUserByPhone(phoneNumber) {
  try {
    console.log('🔍 Attempting to get existing user with phone:', phoneNumber);
    
    const getUserResponse = await fetch('https://clubzila.com/api/funnel/get-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phoneNumber
      })
    });

    if (!getUserResponse.ok) {
      throw new Error(`HTTP error! status: ${getUserResponse.status}`);
    }

    const getUserData = await getUserResponse.json();
    console.log('📱 Get user response:', getUserData);

    if (getUserData.success && getUserData.user) {
      return {
        success: true,
        userId: getUserData.user.id.toString()
      };
    } else {
      return {
        success: false,
        error: getUserData.message || 'User not found'
      };
    }
  } catch (error) {
    console.error('❌ Error getting user:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Clubzila Signup API Integration
 */
async function signupUser(phoneNumber, userName = '') {
  try {
    console.log('🔍 Attempting to signup user with phone:', phoneNumber);
    
    const signupResponse = await fetch('https://clubzila.com/api/funnel/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phoneNumber,
        name: userName || 'User'
      })
    });

    if (!signupResponse.ok) {
      throw new Error(`HTTP error! status: ${signupResponse.status}`);
    }

    const signupData = await signupResponse.json();
    console.log('📱 Signup response:', signupData);

    if (signupData.success && signupData.user) {
      return {
        success: true,
        userId: signupData.user.id.toString()
      };
    } else {
      return {
        success: false,
        error: signupData.message || 'Signup failed'
      };
    }
  } catch (error) {
    console.error('❌ Error signing up user:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Clubzila Payment API Integration
 */
async function initiatePayment(userId, creatorId, amount = 500, currency = 'TZS') {
  try {
    console.log('🔍 Attempting to initiate payment for user:', userId, 'creator:', creatorId);
    
    const paymentResponse = await fetch('https://clubzila.com/api/funnel/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        creator_id: creatorId,
        amount: amount,
        currency: currency
      })
    });

    if (!paymentResponse.ok) {
      throw new Error(`HTTP error! status: ${paymentResponse.status}`);
    }

    const paymentData = await paymentResponse.json();
    console.log('💳 Payment response:', paymentData);

    if (paymentData.success) {
      return {
        success: true,
        transactionId: paymentData.transaction_id,
        ussdCode: paymentData.ussd_code || '*150*00#',
        message: paymentData.message || 'Payment initiated successfully'
      };
    } else {
      return {
        success: false,
        error: paymentData.message || 'Payment initiation failed'
      };
    }
  } catch (error) {
    console.error('❌ Error initiating payment:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { pageId, phoneNumber, templateType, userId, creatorId, userName } = body;

    console.log('📋 Subscription request:', {
      pageId,
      phoneNumber,
      templateType,
      userId,
      creatorId,
      userName
    });

    let finalUserId = userId;
    let finalCreatorId = creatorId;

    if (templateType === 'minimal') {
      // Step 1: Smart user handling for minimal template
      console.log('📝 Step 1: Smart user handling for minimal template...');
      
      // First, try to signup the user
      console.log('🔄 Attempting to signup new user...');
      const signupResult = await signupUser(phoneNumber, userName);
      
      if (signupResult.success) {
        // Signup successful - new user created
        finalUserId = parseInt(signupResult.userId);
        console.log('✅ New user signup successful, User ID:', finalUserId);
      } else {
        // Signup failed - check if user already exists
        console.log('⚠️ Signup failed, checking if user already exists...');
        console.log('🔍 Signup error:', signupResult.error);
        
        // Check if the error indicates user already exists
        if (signupResult.error && signupResult.error.includes('already been taken')) {
          console.log('🔄 User already exists, getting existing user ID...');
          const getUserResult = await getUserByPhone(phoneNumber);
          
          if (getUserResult.success) {
            finalUserId = parseInt(getUserResult.userId);
            console.log('✅ Found existing user, User ID:', finalUserId);
          } else {
            console.error('❌ Failed to get existing user:', getUserResult.error);
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({
                success: false,
                message: 'Failed to get existing user information',
                error: getUserResult.error
              }),
            };
          }
        } else {
          // Some other signup error
          console.error('❌ User signup failed with unexpected error:', signupResult.error);
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              success: false,
              message: 'User registration failed',
              error: signupResult.error
            }),
          };
        }
      }
      
      // Extract creator ID from pageId for minimal template (format: creatorId-template-timestamp)
      const pageIdParts = pageId.split('-');
      const creatorIdString = pageIdParts[0];
      finalCreatorId = parseInt(creatorIdString);
      
    } else if (templateType === 'modern') {
      // Business template: extract userId and creatorId from pageId (format: userId-creatorId-template-timestamp)
      console.log('📝 Step 1: Extracting User ID and Creator ID from pageId for business template...');
      const pageIdParts = pageId.split('-');
      const userIdString = pageIdParts[0];
      const creatorIdString = pageIdParts[1];
      finalUserId = parseInt(userIdString);
      finalCreatorId = parseInt(creatorIdString);
      console.log('✅ Extracted IDs from pageId - User ID:', finalUserId, 'Creator ID:', finalCreatorId, 'Phone:', phoneNumber);
    }

    // Step 2: Validate creator ID
    if (finalCreatorId === undefined || isNaN(finalCreatorId)) {
      console.error('❌ Invalid creator ID:', finalCreatorId);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: `Invalid creator ID: ${finalCreatorId}. Creator ID must be a number.`,
          error: 'Creator ID must be a valid integer'
        }),
      };
    }
      
    console.log('📋 Using dynamic data:', {
      pageId: pageId,
      userId: finalUserId,
      creatorId: finalCreatorId,
      phoneNumber: phoneNumber,
      templateType: templateType
    });

    // Step 3: Initiate payment with Clubzila
    console.log('💳 Step 3: Initiating payment with Clubzila...');
    const paymentResult = await initiatePayment(finalUserId, finalCreatorId, 500, 'TZS');
    
    if (!paymentResult.success) {
      console.error('❌ Payment initiation failed:', paymentResult.error);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Payment initiation failed',
          error: paymentResult.error
        }),
      };
    }

    console.log('✅ Payment initiated successfully:', paymentResult);

    // Step 4: Save subscription to database
    try {
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .insert({
          page_id: pageId,
          user_id: finalUserId.toString(),
          creator_id: finalCreatorId.toString(),
          phone_number: phoneNumber,
          amount: 500,
          currency: 'TZS',
          status: 'pending',
          clubzila_transaction_id: paymentResult.transactionId,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Database error:', error);
        // Don't fail the request if database save fails
      } else {
        console.log('✅ Subscription saved to database:', subscription);
      }
    } catch (dbError) {
      console.error('❌ Database save failed:', dbError);
      // Don't fail the request if database save fails
    }

    // Return success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Subscription initiated successfully! Check your phone for USSD prompt.',
        transactionId: paymentResult.transactionId,
        ussdCode: paymentResult.ussdCode,
        userId: finalUserId,
        creatorId: finalCreatorId
      }),
    };

  } catch (error) {
    console.error('❌ Subscription error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Internal server error',
        error: error.message
      }),
    };
  }
};
