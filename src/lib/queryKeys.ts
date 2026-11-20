/**
 * Central React Query key registry.
 *
 * Keeping keys in one place makes cache invalidation predictable: a mutation
 * updates one logical resource, and every page using it refetches.
 */

export type QueryParamValue = string | number | boolean | undefined;

const normalizeParams = (
  params: Record<string, QueryParamValue>
): Record<string, QueryParamValue> =>
  Object.fromEntries(
    Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== '')
      .sort(([left], [right]) => left.localeCompare(right))
  );

export const queryKeys = {
  public: {
    statistics: ['public', 'statistics'] as const,
    systemTypes: ['public', 'system-types'] as const,
    cities: ['public', 'cities'] as const,
    developerSpecializations: ['public', 'developer-specializations'] as const,
    developerRegistrationOptions: ['public', 'developer-registration-options'] as const,
  },
  admin: {
    dashboard: ['admin', 'dashboard'] as const,
    requestsRoot: ['admin', 'requests'] as const,
    requestPageOptions: ['admin', 'requests', 'page-options'] as const,
    requestsList: ['admin', 'requests', 'list'] as const,
    requests: (params: Record<string, QueryParamValue> = {}) =>
      ['admin', 'requests', 'list', normalizeParams(params)] as const,
    developersRoot: ['admin', 'developers'] as const,
    developerPageOptions: ['admin', 'developers', 'page-options'] as const,
    developersList: ['admin', 'developers', 'list'] as const,
    developers: (params: Record<string, QueryParamValue> = {}) =>
      ['admin', 'developers', 'list', normalizeParams(params)] as const,
    developerDetails: (id: number) =>
      ['admin', 'developers', 'details', id] as const,
    messagesRoot: ['admin', 'messages'] as const,
    messagesList: ['admin', 'messages', 'list'] as const,
    messages: (params: Record<string, QueryParamValue> = {}) =>
      ['admin', 'messages', 'list', normalizeParams(params)] as const,
    notificationsRoot: ['admin', 'notifications'] as const,
    notifications: ['admin', 'notifications', 'list'] as const,
    unreadCount: ['admin', 'notifications', 'unread-count'] as const,
    auditLogsRoot: ['admin', 'audit-logs'] as const,
    auditLogsList: ['admin', 'audit-logs', 'list'] as const,
    auditLogs: (params: Record<string, QueryParamValue> = {}) =>
      ['admin', 'audit-logs', 'list', normalizeParams(params)] as const,
    auditAdmins: ['admin', 'audit-logs', 'admins'] as const,
  },
} as const;
