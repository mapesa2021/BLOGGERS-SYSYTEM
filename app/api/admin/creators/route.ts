/**
 * Admin API Route for Creator Management
 * Handles creator registration, listing, and management
 */

import { NextRequest, NextResponse } from 'next/server';
import { CreatorManagementService } from '../../../../lib/services/creator-management';

const creatorService = new CreatorManagementService();

// GET: List all creators with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // In real app, this would query the database with filters
    const mockCreators = [
      {
        id: '1',
        email: 'creator1@example.com',
        phone_number: '+1234567890',
        name: 'John Doe',
        business_name: 'Tech Solutions Inc',
        status: 'active',
        clubzila_creator_id: '110',
        clubzila_auth_id: '110',
        subscription_amount: 500,
        currency: 'USD',
        created_at: new Date('2024-01-15'),
        last_login_at: new Date('2024-01-20')
      },
      {
        id: '2',
        email: 'creator2@example.com',
        phone_number: '+0987654321',
        name: 'Jane Smith',
        business_name: 'Digital Marketing Pro',
        status: 'pending',
        clubzila_creator_id: '107',
        clubzila_auth_id: '107',
        subscription_amount: 750,
        currency: 'USD',
        created_at: new Date('2024-01-18'),
        last_login_at: null
      }
    ];

    // Apply filters
    let filteredCreators = mockCreators;
    
    if (status) {
      filteredCreators = filteredCreators.filter(c => c.status === status);
    }
    
    if (search) {
      filteredCreators = filteredCreators.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.business_name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCreators = filteredCreators.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        creators: paginatedCreators,
        pagination: {
          page,
          limit,
          total: filteredCreators.length,
          totalPages: Math.ceil(filteredCreators.length / limit)
        }
      }
    });

  } catch (error) {
    console.error('Admin creators list failed:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch creators' },
      { status: 500 }
    );
  }
}

// POST: Register new creator
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['email', 'phone_number', 'name', 'clubzila_creator_id', 'clubzila_auth_id', 'subscription_amount'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Register creator
    const result = await creatorService.registerCreator({
      email: body.email,
      phone_number: body.phone_number,
      name: body.name,
      business_name: body.business_name,
      clubzila_creator_id: body.clubzila_creator_id,
      clubzila_auth_id: body.clubzila_auth_id,
      subscription_amount: parseFloat(body.subscription_amount),
      currency: body.currency || 'USD'
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        creator: result.creator
      }, { status: 201 });
    } else {
      return NextResponse.json({
        success: false,
        message: result.message,
        error: result.error
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Creator registration failed:', error);
    return NextResponse.json(
      { success: false, message: 'Creator registration failed' },
      { status: 500 }
    );
  }
}
