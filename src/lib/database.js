import { supabase, supabaseWritesEnabled } from "./supabaseClient.js";

export async function createVisit({ userId, place, savingAmount }) {
  if (!supabaseWritesEnabled) return null;

  const { data, error } = await supabase
    .from("visits")
    .insert({
      user_id: userId,
      place_id: String(place.place_id || place.id),
      category: place.category || null,
      place_name: place.place_name || null,
      saving_amount: Math.max(0, Number(savingAmount) || 0)
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getSavingStats(userId) {
  if (!userId || !supabaseWritesEnabled) return { totalSaving: 0, monthlySaving: 0, monthlyVisitCount: 0 };

  const { data, error } = await supabase.rpc("get_my_saving_stats");

  if (error) throw error;

  const row = data?.[0] || {};

  return {
    totalSaving: Number(row.total_saving || 0),
    monthlySaving: Number(row.monthly_saving || 0),
    monthlyVisitCount: Number(row.monthly_visit_count || 0)
  };
}

export async function createPlaceRequest({ userId, category, placeName, address, menus, photoCount }) {
  if (!supabaseWritesEnabled) return null;

  const { data, error } = await supabase
    .from("place_requests")
    .insert({
      user_id: userId,
      category,
      place_name: placeName,
      address,
      menus,
      photo_count: photoCount,
      status: "pending"
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createCommunityPost({ userId, title, content, category, authorName, photoUrl }) {
  if (!supabaseWritesEnabled) return null;

  const payload = {
    user_id: userId,
    title,
    content,
    category: category || "이용후기",
    author_name: authorName || null,
    photo_url: photoUrl || null,
  };

  const { data, error } = await supabase
    .from("community_posts")
    .insert(payload)
    .select()
    .single();

  if (!error) return data;

  const { data: fallbackData, error: fallbackError } = await supabase
    .from("community_posts")
    .insert({ user_id: userId, title, content })
    .select()
    .single();

  if (fallbackError) throw error;
  return fallbackData;
}

export async function listCommunityPosts() {
  if (!supabaseWritesEnabled) return [];

  const { data, error } = await supabase
    .from("community_posts")
    .select("id,user_id,title,content,created_at,category,author_name,photo_url")
    .order("created_at", { ascending: false })
    .limit(100);

  if (!error) return data || [];

  const { data: fallbackData, error: fallbackError } = await supabase
    .from("community_posts")
    .select("id,user_id,title,content,created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (fallbackError) throw error;
  return fallbackData || [];
}

export async function listComments({ postKey, postId } = {}) {
  if (!supabaseWritesEnabled) return [];

  let query = supabase
    .from("comments")
    .select("id,post_id,post_key,user_id,content,created_at,author_name")
    .order("created_at", { ascending: false })
    .limit(100);

  if (postKey && postId) {
    query = query.or(`post_key.eq.${postKey},post_id.eq.${postId}`);
  } else if (postKey) {
    query = query.eq("post_key", postKey);
  } else if (postId) {
    query = query.eq("post_id", postId);
  } else {
    return [];
  }

  const { data, error } = await query;

  if (!error) return data || [];

  if (postId) {
    const { data: fallbackData, error: fallbackError } = await supabase
      .from("comments")
      .select("id,post_id,user_id,content,created_at")
      .eq("post_id", postId)
      .order("created_at", { ascending: false })
      .limit(100);

    if (!fallbackError) return fallbackData || [];
  }

  throw error;
}

export async function createComment({ userId, postId, postKey, content, authorName }) {
  if (!supabaseWritesEnabled) return null;

  const { data, error } = await supabase
    .from("comments")
    .insert({
      user_id: userId || null,
      post_id: postId || null,
      post_key: postKey || (postId ? String(postId) : null),
      content,
      author_name: authorName || "게스트",
    })
    .select()
    .single();

  if (!error) return data;

  if (userId && postId) {
    const { data: fallbackData, error: fallbackError } = await supabase
      .from("comments")
      .insert({ user_id: userId, post_id: postId, content })
      .select()
      .single();

    if (!fallbackError) return fallbackData;
  }

  throw error;
}

export async function updateComment({ userId, commentId, content }) {
  if (!supabaseWritesEnabled || !userId) return null;

  const { data, error } = await supabase
    .from("comments")
    .update({ content })
    .eq("id", commentId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteComment({ userId, commentId }) {
  if (!supabaseWritesEnabled || !userId) return false;

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", userId);

  if (error) throw error;
  return true;
}

export async function updateCommunityPost({ userId, postId, title, content }) {
  if (!supabaseWritesEnabled || !userId) return null;

  const { data, error } = await supabase
    .from("community_posts")
    .update({ title, content })
    .eq("id", postId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCommunityPost({ userId, postId }) {
  if (!supabaseWritesEnabled || !userId) return false;

  const { error } = await supabase
    .from("community_posts")
    .delete()
    .eq("id", postId)
    .eq("user_id", userId);

  if (error) throw error;
  return true;
}

export async function upsertPlaceFavorite({ userId, place }) {
  if (!supabaseWritesEnabled) return null;

  const { data, error } = await supabase
    .from("place_favorites")
    .upsert(
      {
        user_id: userId,
        place_id: String(place.place_id || place.id),
        place_name: place.place_name || null,
        category: place.category || null,
      },
      { onConflict: "user_id,place_id" }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removePlaceFavorite({ userId, place }) {
  if (!supabaseWritesEnabled) return null;

  const { error } = await supabase
    .from("place_favorites")
    .delete()
    .eq("user_id", userId)
    .eq("place_id", String(place.place_id || place.id));

  if (error) throw error;
  return true;
}

export async function upsertGroupbuyFavorite({ userId, product }) {
  if (!supabaseWritesEnabled) return null;

  const { data, error } = await supabase
    .from("groupbuy_favorites")
    .upsert(
      {
        user_id: userId,
        product_id: product.id,
        product_title: product.title,
      },
      { onConflict: "user_id,product_id" }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeGroupbuyFavorite({ userId, productId }) {
  if (!supabaseWritesEnabled) return null;

  const { error } = await supabase
    .from("groupbuy_favorites")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (error) throw error;
  return true;
}

export async function createGroupbuyEvent({ userId, product, eventType }) {
  if (!supabaseWritesEnabled) return null;

  const { data, error } = await supabase
    .from("groupbuy_events")
    .insert({
      user_id: userId,
      product_id: product?.id || null,
      product_title: product?.title || null,
      event_type: eventType,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createAuthEvent({ userId, eventType, entrySource, returnPage }) {
  if (!supabaseWritesEnabled) return null;

  const { data, error } = await supabase
    .from("auth_events")
    .insert({
      user_id: userId || null,
      event_type: eventType,
      entry_source: entrySource || null,
      return_page: returnPage || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
