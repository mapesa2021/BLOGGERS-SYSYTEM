/**
 * API Routes for Landing Pages
 * Handles CRUD operations for landing pages using Supabase
 */

import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '../../../lib/database-service'

// GET /api/landing-pages?pageId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pageId = searchParams.get('pageId')

    if (!pageId) {
      return NextResponse.json(
        { error: 'Page ID is required' },
        { status: 400 }
      )
    }

    const landingPage = await DatabaseService.getLandingPageByPageId(pageId)
    
    if (!landingPage) {
      return NextResponse.json(
        { error: 'Landing page not found' },
        { status: 404 }
      )
    }

    // Transform the data to match what DynamicPageClient expects
    const transformedData = {
      pageId: landingPage.page_id,
      template: landingPage.template,
      creatorName: landingPage.title,
      creatorIdDisplay: landingPage.creator_id_display,
      successRedirectUrl: landingPage.success_redirect_url,
      failureRedirectUrl: landingPage.failure_redirect_url,
      subscriptionAmount: 500, // Default amount
      currency: 'TZS' // Default currency
    };

    return NextResponse.json(transformedData)

  } catch (error) {
    console.error('Error fetching landing page:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/landing-pages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      pageId,
      creatorId,
      title,
      template,
      creatorIdDisplay,
      successRedirectUrl,
      failureRedirectUrl,
      description
    } = body

    // Validate required fields
    if (!pageId || !creatorId || !title || !template) {
      return NextResponse.json(
        { error: 'Missing required fields: pageId, creatorId, title, template' },
        { status: 400 }
      )
    }

    const landingPage = await DatabaseService.createLandingPage({
      page_id: pageId,
      creator_id: '00000000-0000-0000-0000-000000000000', // Default UUID for non-UUID creator IDs
      title: title,
      template: template,
      creator_id_display: creatorIdDisplay || creatorId,
      success_redirect_url: successRedirectUrl || '',
      failure_redirect_url: failureRedirectUrl || '',
      description: description || '',
      status: 'published'
    })

    return NextResponse.json({
      success: true,
      data: landingPage
    })

  } catch (error) {
    console.error('Error creating landing page:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/landing-pages?pageId=xxx
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pageId = searchParams.get('pageId')
    const body = await request.json()

    if (!pageId) {
      return NextResponse.json(
        { error: 'Page ID is required' },
        { status: 400 }
      )
    }

    const landingPage = await DatabaseService.updateLandingPage(pageId, body)

    return NextResponse.json({
      success: true,
      data: landingPage
    })

  } catch (error) {
    console.error('Error updating landing page:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
