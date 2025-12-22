import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/db/client';
import type { Review } from '@/types/recipe';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/recipes/[id]/reviews
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id: recipeId } = await params;
  const searchParams = request.nextUrl.searchParams;
  const sort = searchParams.get('sort') || 'recent';
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);

  const supabase = createServerClient();

  // Build query based on sort option
  let query = supabase
    .from('reviews')
    .select('*')
    .eq('recipe_id', recipeId)
    .eq('is_approved', true);

  switch (sort) {
    case 'rating':
      query = query.order('rating', { ascending: false }).order('created_at', { ascending: false });
      break;
    case 'helpful':
      query = query.order('helpful_count', { ascending: false }).order('created_at', { ascending: false });
      break;
    case 'recent':
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  // Get total count
  const { count } = await supabase
    .from('reviews')
    .select('id', { count: 'exact', head: true })
    .eq('recipe_id', recipeId)
    .eq('is_approved', true);

  // Get paginated results
  const { data, error } = await query.range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }

  const reviews: Review[] = (data || []).map((row) => ({
    id: row.id,
    recipeId: row.recipe_id,
    authorName: row.author_name,
    rating: row.rating,
    title: row.title,
    comment: row.comment,
    helpfulCount: row.helpful_count,
    createdAt: row.created_at,
  }));

  return NextResponse.json({ reviews, totalCount: count || 0 });
}

// POST /api/recipes/[id]/reviews
export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id: recipeId } = await params;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { authorName, rating, title, comment } = body;

  // Validation
  if (!authorName || typeof authorName !== 'string' || authorName.trim().length === 0) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }
  if (authorName.trim().length > 100) {
    return NextResponse.json({ error: 'Name is too long' }, { status: 400 });
  }
  if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
  }
  if (!comment || typeof comment !== 'string' || comment.trim().length < 10) {
    return NextResponse.json({ error: 'Review must be at least 10 characters' }, { status: 400 });
  }
  if (comment.trim().length > 5000) {
    return NextResponse.json({ error: 'Review is too long' }, { status: 400 });
  }
  if (title && (typeof title !== 'string' || title.trim().length > 200)) {
    return NextResponse.json({ error: 'Title is too long' }, { status: 400 });
  }

  const supabase = createServerClient();

  // Verify recipe exists
  const { data: recipe } = await supabase
    .from('recipes')
    .select('id')
    .eq('id', recipeId)
    .eq('is_deleted', false)
    .single();

  if (!recipe) {
    return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
  }

  // Insert review
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      recipe_id: recipeId,
      author_name: authorName.trim(),
      rating,
      title: title?.trim() || null,
      comment: comment.trim(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error inserting review:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }

  const review: Review = {
    id: data.id,
    recipeId: data.recipe_id,
    authorName: data.author_name,
    rating: data.rating,
    title: data.title,
    comment: data.comment,
    helpfulCount: data.helpful_count,
    createdAt: data.created_at,
  };

  return NextResponse.json({ review }, { status: 201 });
}
