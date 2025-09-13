/**
 * Admin API Route for Landing Page Management
 * Handles landing page creation, customization, and publishing
 */

import { NextRequest, NextResponse } from 'next/server';
import { CreatorManagementService } from '../../../../lib/services/creator-management';

const creatorService = new CreatorManagementService();

// GET: List all landing pages with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get('creator_id');
    const status = searchParams.get('status');
    const template = searchParams.get('template');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // In real app, this would query the database
    const mockLandingPages = [
      {
        id: '1',
        creator_id: '1',
        page_id: 'tech-solutions-landing',
        title: 'Tech Solutions Landing Page',
        description: 'Professional tech solutions for businesses',
        template: 'modern',
        status: 'published',
        creator_id_display: 'TECH001',
        success_redirect_url: 'https://techsolutions.com/success',
        failure_redirect_url: 'https://techsolutions.com/failure',
        views: 1250,
        subscriptions: 45,
        conversion_rate: 3.6,
        created_at: new Date('2024-01-15'),
        published_at: new Date('2024-01-16')
      },
      {
        id: '2',
        creator_id: '2',
        page_id: 'digital-marketing-pro',
        title: 'Digital Marketing Pro',
        description: 'Boost your online presence',
        template: 'minimal',
        status: 'draft',
        creator_id_display: 'DIGI002',
        success_redirect_url: 'https://digitalmarketingpro.com/thank-you',
        failure_redirect_url: 'https://digitalmarketingpro.com/error',
        views: 0,
        subscriptions: 0,
        conversion_rate: 0,
        created_at: new Date('2024-01-18')
      }
    ];

    // Apply filters
    let filteredPages = mockLandingPages;
    
    if (creatorId) {
      filteredPages = filteredPages.filter(p => p.creator_id === creatorId);
    }
    
    if (status) {
      filteredPages = filteredPages.filter(p => p.status === status);
    }
    
    if (template) {
      filteredPages = filteredPages.filter(p => p.template === template);
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPages = filteredPages.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        landingPages: paginatedPages,
        pagination: {
          page,
          limit,
          total: filteredPages.length,
          totalPages: Math.ceil(filteredPages.length / limit)
        }
      }
    });

  } catch (error) {
    console.error('Landing pages list failed:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch landing pages' },
      { status: 500 }
    );
  }
}

// POST: Create new landing page
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['creator_id', 'title', 'template', 'creator_id_display', 'success_redirect_url'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create landing page
    const result = await creatorService.createLandingPage(body.creator_id, {
      title: body.title,
      description: body.description,
      template: body.template,
      creator_id_display: body.creator_id_display,
      success_redirect_url: body.success_redirect_url,
      failure_redirect_url: body.failure_redirect_url,
      custom_domain: body.custom_domain
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        landingPage: result.landingPage
      }, { status: 201 });
    } else {
      return NextResponse.json({
        success: false,
        message: result.message,
        error: result.error
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Landing page creation failed:', error);
    return NextResponse.json(
      { success: false, message: 'Landing page creation failed' },
      { status: 500 }
    );
  }
}
