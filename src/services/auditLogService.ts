import { supabase } from "@/lib/supabaseClient";

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface AuditLogCreateParams {
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

// Get all audit logs
export const getAuditLogs = async (
  limit: number = 100,
  offset: number = 0,
): Promise<{ data: AuditLog[] | null; error: any }> => {
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  return { data, error };
};

// Get audit logs for a specific user
export const getUserAuditLogs = async (
  userId: string,
  limit: number = 100,
  offset: number = 0,
): Promise<{ data: AuditLog[] | null; error: any }> => {
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  return { data, error };
};

// Get audit logs for a specific entity
export const getEntityAuditLogs = async (
  entityType: string,
  entityId: string,
  limit: number = 100,
  offset: number = 0,
): Promise<{ data: AuditLog[] | null; error: any }> => {
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  return { data, error };
};

// Get audit logs for a specific action
export const getActionAuditLogs = async (
  action: string,
  limit: number = 100,
  offset: number = 0,
): Promise<{ data: AuditLog[] | null; error: any }> => {
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .eq("action", action)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  return { data, error };
};

// Create a new audit log entry
export const createAuditLog = async (
  params: AuditLogCreateParams,
): Promise<{ success: boolean; error: any }> => {
  const { error } = await supabase.from("audit_logs").insert(params);

  return { success: !error, error };
};

// Log user authentication
export const logUserAuthentication = async (
  userId: string,
  success: boolean,
  ipAddress?: string,
  userAgent?: string,
): Promise<{ success: boolean; error: any }> => {
  return createAuditLog({
    user_id: userId,
    action: success ? "authentication.success" : "authentication.failure",
    entity_type: "user",
    entity_id: userId,
    details: { success },
    ip_address: ipAddress,
    user_agent: userAgent,
  });
};

// Log user creation
export const logUserCreation = async (
  userId: string,
  createdBy?: string,
  details?: Record<string, any>,
  ipAddress?: string,
  userAgent?: string,
): Promise<{ success: boolean; error: any }> => {
  return createAuditLog({
    user_id: createdBy,
    action: "user.create",
    entity_type: "user",
    entity_id: userId,
    details,
    ip_address: ipAddress,
    user_agent: userAgent,
  });
};

// Log user update
export const logUserUpdate = async (
  userId: string,
  updatedBy: string,
  details?: Record<string, any>,
  ipAddress?: string,
  userAgent?: string,
): Promise<{ success: boolean; error: any }> => {
  return createAuditLog({
    user_id: updatedBy,
    action: "user.update",
    entity_type: "user",
    entity_id: userId,
    details,
    ip_address: ipAddress,
    user_agent: userAgent,
  });
};

// Log user deletion
export const logUserDeletion = async (
  userId: string,
  deletedBy: string,
  details?: Record<string, any>,
  ipAddress?: string,
  userAgent?: string,
): Promise<{ success: boolean; error: any }> => {
  return createAuditLog({
    user_id: deletedBy,
    action: "user.delete",
    entity_type: "user",
    entity_id: userId,
    details,
    ip_address: ipAddress,
    user_agent: userAgent,
  });
};

// Log entity creation
export const logEntityCreation = async (
  entityType: string,
  entityId: string,
  userId?: string,
  details?: Record<string, any>,
  ipAddress?: string,
  userAgent?: string,
): Promise<{ success: boolean; error: any }> => {
  return createAuditLog({
    user_id: userId,
    action: `${entityType}.create`,
    entity_type: entityType,
    entity_id: entityId,
    details,
    ip_address: ipAddress,
    user_agent: userAgent,
  });
};

// Log entity update
export const logEntityUpdate = async (
  entityType: string,
  entityId: string,
  userId?: string,
  details?: Record<string, any>,
  ipAddress?: string,
  userAgent?: string,
): Promise<{ success: boolean; error: any }> => {
  return createAuditLog({
    user_id: userId,
    action: `${entityType}.update`,
    entity_type: entityType,
    entity_id: entityId,
    details,
    ip_address: ipAddress,
    user_agent: userAgent,
  });
};

// Log entity deletion
export const logEntityDeletion = async (
  entityType: string,
  entityId: string,
  userId?: string,
  details?: Record<string, any>,
  ipAddress?: string,
  userAgent?: string,
): Promise<{ success: boolean; error: any }> => {
  return createAuditLog({
    user_id: userId,
    action: `${entityType}.delete`,
    entity_type: entityType,
    entity_id: entityId,
    details,
    ip_address: ipAddress,
    user_agent: userAgent,
  });
};

// Log status change
export const logStatusChange = async (
  entityType: string,
  entityId: string,
  oldStatus: string,
  newStatus: string,
  userId?: string,
  ipAddress?: string,
  userAgent?: string,
): Promise<{ success: boolean; error: any }> => {
  return createAuditLog({
    user_id: userId,
    action: `${entityType}.status_change`,
    entity_type: entityType,
    entity_id: entityId,
    details: { old_status: oldStatus, new_status: newStatus },
    ip_address: ipAddress,
    user_agent: userAgent,
  });
};

// Log system event
export const logSystemEvent = async (
  action: string,
  details?: Record<string, any>,
  ipAddress?: string,
  userAgent?: string,
): Promise<{ success: boolean; error: any }> => {
  return createAuditLog({
    action: `system.${action}`,
    entity_type: "system",
    details,
    ip_address: ipAddress,
    user_agent: userAgent,
  });
};
