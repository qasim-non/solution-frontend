/**
 * Tamkkun API Type Definitions
 * Framework: Laravel 12 (Sanctum Auth)
 *
 * Shapes in this file mirror the backend implementation contract in
 * API_DOCUMENTATION.md. Do not add fields that the API does not return.
 */

// ==========================================
// 1. COMMON / BASE API RESPONSE SHAPES
// ==========================================

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  data: null;
  errors?: Record<string, string[]>;
}

export interface ApiValidationErrorResponse extends ApiErrorResponse {
  errors: Record<string, string[]>;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginatedResponse<T> extends ApiSuccessResponse<T[]> {
  meta: PaginationMeta;
}

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

// ==========================================
// 2. AUTHENTICATION AND ADMIN ACCOUNT
// ==========================================

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthTokenPair {
  token: string;
  refresh_token: string;
  token_type: 'Bearer' | string;
  expires_in: number;
}

export type LoginResponse = ApiSuccessResponse<AuthTokenPair>;

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
}

export interface AdminAccount {
  id: number;
  username: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateAdminAccountRequest {
  username?: string;
  password?: string;
}

export type UpdateAdminAccountResponse = ApiSuccessResponse<AdminAccount>;

// ==========================================
// 3. PUBLIC LOOKUPS
// ==========================================

export interface SystemType {
  id: number;
  name: string;
}

export type GetSystemTypesResponse = ApiSuccessResponse<SystemType[]>;

export interface City {
  id: number;
  name: string;
}

export type GetCitiesResponse = ApiSuccessResponse<City[]>;

export interface DeveloperSpecialization {
  id: number;
  name: string;
  slug: string;
}

export type GetDeveloperSpecializationsResponse = ApiSuccessResponse<
  DeveloperSpecialization[]
>;

export interface ContactInfoItem {
  id: number;
  type: string;
  value: string;
}

export type GetContactInfoResponse = ApiSuccessResponse<ContactInfoItem[]>;

export interface PublicStatistics {
  completed_projects: number;
  approved_developers: number;
  do_show: boolean;
}

export type GetPublicStatisticsResponse = ApiSuccessResponse<PublicStatistics>;

// ==========================================
// 4. PUBLIC FORMS
// ==========================================

export interface CreateProjectRequestPayload {
  project_name: string;
  mobile: string;
  description?: string | null;
  system_types: number[];
  /** Map keyed by numeric social-media platform ID. */
  social_media?: Record<string, string>;
}

export type CreateProjectRequestResponse = ApiSuccessResponse<null>;

export interface SendContactMessageRequest {
  full_name: string;
  email: string;
  text_message: string;
}

export type SendContactMessageResponse = ApiSuccessResponse<null>;

// ==========================================
// 5. PROJECT REQUESTS (ADMIN)
// ==========================================

export type RequestStatus = 'pending' | 'reviewed' | 'completed';

export interface SocialMediaPlatform {
  id: number;
  name: string;
}

export interface SocialMediaAccountItem {
  platform_id: number;
  url: string;
  platform: SocialMediaPlatform;
}

export interface ProjectRequestSystemTypePivot {
  requests_id?: number;
  type_id?: number;
}

/**
 * The API documentation describes `{id, name}` items. The current backend
 * resource returns `{name, ignore:{requests_id,type_id,...}}`. Both are
 * accepted so the UI keeps working while the documentation inconsistency is
 * reported separately.
 */
export interface ProjectRequestSystemType {
  id?: number;
  name: string;
  ignore?: ProjectRequestSystemTypePivot;
}

export interface ProjectRequest {
  id: number;
  project_name: string;
  mobile?: string;
  description?: string | null;
  status: RequestStatus | string;
  created_at: string;
  system_types?: ProjectRequestSystemType[];
  social_media_accounts?: SocialMediaAccountItem[];
}

export interface GetRequestsQueryParams {
  search?: string;
  system_type?: number;
  status?: RequestStatus | string;
  start_date?: string;
  end_date?: string;
  page?: number;
  per_page?: number;
}

export type GetRequestsResponse = PaginatedResponse<ProjectRequest>;
export type AdminCreateProjectRequestResponse = ApiSuccessResponse<ProjectRequest>;
export type UpdateProjectRequestResponse = ApiSuccessResponse<ProjectRequest>;
export type UpdateRequestStatusResponse = ApiSuccessResponse<null>;
export type DeleteRequestResponse = ApiSuccessResponse<null>;

export interface RequestPageOptions {
  statuses: RequestStatus[];
  system_types: SystemType[];
}

export type GetRequestPageOptionsResponse = ApiSuccessResponse<RequestPageOptions>;

export interface UpdateProjectRequestPayload {
  project_name?: string;
  mobile?: string;
  description?: string | null;
  system_types?: number[];
  social_media?: Record<string, string> | null;
}

// ==========================================
// 6. DASHBOARD
// ==========================================

export interface OldestRequestSummary {
  id: number;
  project_name: string;
  description: string;
  status: RequestStatus | string;
  created_at: string;
}

export interface DashboardData {
  total_requests: number;
  recent_requests: number;
  pending_requests: number;
  reviewed_requests: number;
  completed_requests: number;
  oldest_requests: OldestRequestSummary[];
}

export type GetDashboardResponse = ApiSuccessResponse<DashboardData>;

// ==========================================
// 7. DEVELOPER REGISTRATION (PUBLIC)
// ==========================================

export type DeveloperExperienceYears =
  | 'أقل من سنة'
  | '1 - 2 سنوات'
  | '3 - 5 سنوات'
  | 'أكثر من 5 سنوات';

export type DeveloperContractType = 'full_time' | 'freelance' | 'both';

export type DeveloperWeeklyHours = '10_20' | '20_30' | 'full_time_40';

export interface DeveloperBooleanOptions {
  is_ready: boolean[];
  has_institutional_experience: boolean[];
  is_remote_ready: boolean[];
}

export interface DeveloperRegistrationOptions {
  cities: City[];
  specializations: DeveloperSpecialization[];
  experience_years: DeveloperExperienceYears[];
  contract_types: DeveloperContractType[];
  weekly_hours: DeveloperWeeklyHours[];
  boolean_options: DeveloperBooleanOptions;
}

export type GetDeveloperRegistrationOptionsResponse =
  ApiSuccessResponse<DeveloperRegistrationOptions>;

export interface DeveloperRegistrationPayload {
  full_name: string;
  mobile: string;
  city_id: number;
  is_ready: boolean;
  experience_years: DeveloperExperienceYears;
  has_institutional_experience: boolean;
  completed_projects_count?: number;
  contract_type: DeveloperContractType;
  weekly_hours: DeveloperWeeklyHours;
  is_remote_ready: boolean;
  bio?: string;
  specialization_ids?: number[];
  technologies?: string[];
  cv?: File | null;
  portfolio?: File | null;
}

export interface DeveloperRegistrationResult {
  id: number;
  reference_number: string;
  mobile: string;
  specializations: string[];
  status: string;
}

export type DeveloperRegistrationResponse =
  ApiSuccessResponse<DeveloperRegistrationResult>;

// ==========================================
// 8. DEVELOPER MANAGEMENT (ADMIN)
// ==========================================

export type DeveloperStatus =
  | 'pending'
  | 'under_review'
  | 'shortlisted'
  | 'approved'
  | 'rejected'
  | 'suspended';

export interface DeveloperPageStatistics {
  total: number;
  pending: number;
  ready: number;
  approved: number;
  registered_this_month: number;
  approval_rate: number;
}

export interface DeveloperPageFilters {
  statuses: DeveloperStatus[];
  cities: City[];
  specializations: DeveloperSpecialization[];
  experience_years: DeveloperExperienceYears[];
  readiness: boolean[];
  per_page: number[];
}

export interface DeveloperPageOptions {
  statistics: DeveloperPageStatistics;
  filters: DeveloperPageFilters;
}

export type GetDeveloperPageOptionsResponse =
  ApiSuccessResponse<DeveloperPageOptions>;

export interface DeveloperListItem {
  id: number;
  reference_number: string;
  full_name: string;
  city: string;
  specializations: string[];
  technologies: string[];
  experience_years: string;
  is_ready: boolean;
  status: DeveloperStatus | string;
  created_at: string;
}

export interface GetDevelopersQueryParams {
  search?: string;
  status?: DeveloperStatus | string;
  city_id?: number;
  specialization_id?: number;
  experience_years?: DeveloperExperienceYears | string;
  is_ready?: boolean;
  technology?: string;
  page?: number;
  per_page?: number;
}

export type GetDevelopersResponse = PaginatedResponse<DeveloperListItem>;

export interface DeveloperDocument {
  id: number;
  file_name: string;
  file_type: 'cv' | 'portfolio' | string;
  mime_type: string;
  file_size: number;
  download_url: string;
  created_at: string;
}

export interface DeveloperNoteAdmin {
  id: number;
  username: string;
}

export interface DeveloperNote {
  id: number;
  text: string;
  admin: DeveloperNoteAdmin;
  created_at: string;
}

export interface DeveloperDetails {
  id: number;
  reference_number: string;
  full_name: string;
  mobile: string;
  city: City | null;
  specializations: Array<{ id: number; name: string }>;
  technologies: Array<{ id: number; name: string }>;
  experience_years: string;
  has_institutional_experience: boolean;
  completed_projects_count: number | null;
  contract_type: DeveloperContractType | string;
  weekly_hours: DeveloperWeeklyHours | string;
  is_ready: boolean;
  is_remote_ready: boolean;
  bio: string | null;
  status: DeveloperStatus | string;
  documents: DeveloperDocument[];
  notes: DeveloperNote[];
  created_at: string;
  updated_at: string;
}

export type GetDeveloperDetailsResponse = ApiSuccessResponse<DeveloperDetails>;

export interface UpdateDeveloperStatusRequest {
  status: DeveloperStatus;
}

export type UpdateDeveloperStatusResponse = ApiSuccessResponse<{
  id: number;
  status: DeveloperStatus;
}>;

export interface UpdateDeveloperReadinessRequest {
  is_ready: boolean;
}

export type UpdateDeveloperReadinessResponse = ApiSuccessResponse<{
  id: number;
  is_ready: boolean;
}>;

export interface CreateDeveloperNoteRequest {
  text: string;
}

export type CreateDeveloperNoteResponse = ApiSuccessResponse<DeveloperNote>;
export type DeleteDeveloperResponse = ApiSuccessResponse<null>;

// ==========================================
// 9. MESSAGES
// ==========================================

export interface ContactMessage {
  id?: number;
  full_name: string;
  email: string;
  text_message: string;
  created_at: string;
}

export interface GetMessagesQueryParams {
  page?: number;
  per_page?: number;
}

export type GetMessagesResponse = PaginatedResponse<ContactMessage>;
export type DeleteMessageResponse = ApiSuccessResponse<null>;

// ==========================================
// 10. NOTIFICATIONS
// ==========================================

export interface AppNotification {
  id: string;
  type: string;
  data: Record<string, unknown>;
  read_at: string | null;
  read_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface GetNotificationsResponse extends ApiSuccessResponse<AppNotification[]> {
  meta: PaginationMeta;
  /** Shared system-wide count; it is a top-level field, not part of meta. */
  unread_count: number;
}

export interface GetUnreadCountResponse {
  success: true;
  message: string;
  data: { unread_count: number };
}

export type MarkNotificationReadResponse = ApiSuccessResponse<null>;
export type MarkAllNotificationsReadResponse = ApiSuccessResponse<null>;

// ==========================================
// 11. AUDIT LOGS
// ==========================================

export interface AuditAdmin {
  id: number;
  username: string;
}

export interface AuditLog {
  id: number;
  admin: AuditAdmin | null;
  action: string;
  auditable: {
    type: string;
    id: number;
  } | null;
  old_values: Record<string, JsonValue> | null;
  new_values: Record<string, JsonValue> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface GetAuditLogsQueryParams {
  start_date?: string;
  end_date?: string;
  admin_id?: number;
  page?: number;
  per_page?: number;
}

export type GetAuditLogsResponse = PaginatedResponse<AuditLog>;
export type GetAuditAdminsResponse = ApiSuccessResponse<AuditAdmin[]>;

// ==========================================
// 12. DEVICE TOKENS
// ==========================================

export type DevicePlatform = 'web' | 'android' | 'ios';

export interface RegisterDeviceTokenRequest {
  token: string;
  platform?: DevicePlatform;
}

export type RegisterDeviceTokenResponse = ApiSuccessResponse<{ id: number }>;

export interface RemoveDeviceTokenRequest {
  token: string;
}

export type RemoveDeviceTokenResponse = ApiSuccessResponse<null>;
