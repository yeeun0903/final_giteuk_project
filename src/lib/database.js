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

export async function createCommunityPost({ userId, title, content }) {
  if (!supabaseWritesEnabled) return null;

  const { data, error } = await supabase
    .from("community_posts")
    .insert({ user_id: userId, title, content })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createComment({ userId, postId, content }) {
  if (!supabaseWritesEnabled) return null;

  const { data, error } = await supabase
    .from("comments")
    .insert({ user_id: userId, post_id: postId, content })
    .select()
    .single();

  if (error) throw error;
  return data;
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
