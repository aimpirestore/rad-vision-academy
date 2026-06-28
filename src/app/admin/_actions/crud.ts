"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/supabase/auth";

/**
 * Log an admin action to the activity_log table.
 */
async function logActivity(action: string, details?: Record<string, unknown>) {
  const admin = await getAdminUser();
  const supabase = await createServerSupabaseClient();
  await supabase.from("activity_log").insert({
    user_id: admin?.id,
    entity_type: action.includes(".") ? action.split(".")[0] : "general",
    entity_id: details?.id ?? null,
    action,
    details: details ?? {},
  });
}

/**
 * Generic upsert for a single record into a table.
 * If `id` is provided, updates; otherwise inserts.
 */
export async function saveRecord(
  table: string,
  data: Record<string, unknown>,
  options?: {
    revalidatePaths?: string[];
    logLabel?: string;
  },
) {
  const supabase = await createServerSupabaseClient();
  const id = data.id as string | undefined;

  let result;
  if (id) {
    result = await supabase.from(table).update(data).eq("id", id).select().single();
  } else {
    delete data.id;
    result = await supabase.from(table).insert(data).select().single();
  }

  if (result.error) {
    return { error: result.error.message };
  }

  await logActivity(options?.logLabel ?? (id ? `${table}.updated` : `${table}.created`), {
    id: result.data?.id,
    title: result.data?.title ?? result.data?.name ?? result.data?.slug,
  });

  if (options?.revalidatePaths) {
    for (const path of options.revalidatePaths) {
      revalidatePath(path);
    }
  }

  return { success: true, data: result.data };
}

/**
 * Delete a record by id.
 */
export async function deleteRecord(
  table: string,
  id: string,
  options?: { revalidatePaths?: string[] },
) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from(table).delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  await logActivity(`${table}.deleted`, { id });

  if (options?.revalidatePaths) {
    for (const path of options.revalidatePaths) {
      revalidatePath(path);
    }
  }

  return { success: true };
}

/**
 * Toggle the published/draft status of a record.
 */
export async function toggleRecordStatus(
  table: string,
  id: string,
  status: "published" | "draft" | "archived",
  options?: { revalidatePaths?: string[] },
) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from(table).update({ status }).eq("id", id);

  if (error) {
    return { error: error.message };
  }

  await logActivity(`${table}.status_changed`, { id, status });

  if (options?.revalidatePaths) {
    for (const path of options.revalidatePaths) {
      revalidatePath(path);
    }
  }

  return { success: true };
}

/**
 * Reorder records by updating sort_order.
 */
export async function reorderRecords(
  table: string,
  orderedIds: string[],
  options?: { revalidatePaths?: string[] },
) {
  const supabase = await createServerSupabaseClient();

  // Batch update — do them individually since PostgREST doesn't have a bulk update
  for (let i = 0; i < orderedIds.length; i++) {
    await supabase.from(table).update({ sort_order: i }).eq("id", orderedIds[i]);
  }

  if (options?.revalidatePaths) {
    for (const path of options.revalidatePaths) {
      revalidatePath(path);
    }
  }

  return { success: true };
}
