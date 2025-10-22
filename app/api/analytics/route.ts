/**
 * API Routes for Analytics
 * Handles analytics operations for landing pages and creators
 */

import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '../../../lib/database-service'

// GET /api/analytics?pageId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pageId = searchParams.get('pageId')
    const creatorId = searchParams.get('creatorId')

    if (pageId) {
      // Get landing page analytics
      const analytics = await DatabaseService.getLandingPageAnalytics(pageId)
      
      if (!analytics) {
        return NextResponse.json(
          { error: 'Landing page not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: analytics
      })

    } else if (creatorId) {
      // Get creator analytics
      const analytics = await DatabaseService.getCreatorAnalytics(creatorId)

      return NextResponse.json({
        success: true,
        data: analytics
      })

    } else {
      return NextResponse.json(
        { error: 'Either pageId or creatorId is required' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/analytics/track-view
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pageId } = body

    if (!pageId) {
      return NextResponse.json(
        { error: 'Page ID is required' },
        { status: 400 }
      )
    }

    await DatabaseService.incrementLandingPageViews(pageId)

    return NextResponse.json({
      success: true,
      message: 'View tracked successfully'
    })

  } catch (error) {
    console.error('Error tracking view:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
