export async function writeAuditLog(db: any, actorId: string, action: string, targetType: string, targetId: string, beforeState: any, afterState: any, ipAddress: string, userAgent: string) {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await db.prepare(`INSERT INTO audit_log (actor_id, action, target_type, target_id, before_state, after_state, ip_address, user_agent, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(actorId, action, targetType, targetId, beforeState ? JSON.stringify(beforeState) : null, afterState ? JSON.stringify(afterState) : null, ipAddress, userAgent, now).run();
}
