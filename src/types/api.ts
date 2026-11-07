/**
 * Tamkkun API Type Definitions
 * Framework: Laravel 12 (Sanctum Auth)
 * Base URL: http://127.0.0.1:8000/api
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

// ==========================================
// 2. AUTHENTICATION MODULE
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

// ==========================================
// 3. SYSTEM TYPES MODULE
// ==========================================

export interface SystemType {
  id: number;
  name: string; // e.g. "Website", "Mobile Application", "Desktop Application", "Web", "Mobile App"
}

export type GetSystemTypesResponse = ApiSuccessResponse<SystemType[]>;

// ==========================================
// 4. CONTACT INFO & PUBLIC MESSAGES MODULE
// ==========================================

export interface ContactInfoItem {
  id: number;
  type: 'email' | 'mobile' | string;
  value: string;
}

export type GetContactInfoResponse = ApiSuccessResponse<ContactInfoItem[]>;

export interface SendContactMessageRequest {
  full_name: string;
  email: string;
  text_message: string;
}

export type SendContactMessageResponse = ApiSuccessResponse<null>;

export interface ContactMessage {
  id?: number;
  full_name: string;
  email: string;
  text_message: string;
  created_at: string;
}

export type GetMessagesResponse = ApiSuccessResponse<ContactMessage[]>;

// ==========================================
// 5. PROJECT REQUESTS MODULE
// ==========================================

export interface CreateProjectRequestPayload {
  project_name: string;
  mobile: string;
  description?: string | null;
  system_types: number[]; // Array of SystemType IDs
  social_media?: Record<string, string>; // Optional map of platform ID ("1", "2") to URL/handle
}

export type CreateProjectRequestResponse = ApiSuccessResponse<null>;

export interface ProjectRequestSystemTypePivot {
  requests_id: number;
  type_id: number;
}

export interface ProjectRequestSystemType {
  name: string;
  ignore?: ProjectRequestSystemTypePivot;
}

export interface ProjectRequest {
  id: number;
  project_name: string;
  mobile?: string;
  description?: string | null;
  status: 'pending' | 'completed' | 'in_progress' | string;
  created_at: string;
  system_types?: ProjectRequestSystemType[];
}

export interface GetRequestsQueryParams {
  search?: string;
  system_type?: number;
  status?: 'pending' | 'completed' | 'in_progress' | 'all' | string;
  start_date?: string; // YYYY-MM-DD
  end_date?: string;   // YYYY-MM-DD
}

export type GetRequestsResponse = ApiSuccessResponse<ProjectRequest[]>;

// ==========================================
// 6. SOCIAL MEDIA ACCOUNTS MODULE
// ==========================================

export interface SocialMediaPlatform {
  id: number;
  name: string; // e.g. "Instagram", "Facebook", "TikTok", "Youtube"
}

export interface SocialMediaAccountItem {
  platform_id: number;
  url: string;
  platform: SocialMediaPlatform;
}

export type GetSocialMediaAccountsResponse = ApiSuccessResponse<SocialMediaAccountItem[]>;

// ==========================================
// 7. DASHBOARD MODULE
// ==========================================

export interface OldestRequestSummary {
  id: number;
  project_name: string;
  description: string;
  status: 'pending' | 'completed' | string;
  created_at: string;
}

export interface DashboardData {
  total_requests: number;
  recent_requests: number;
  pending_requests: number;
  completed_requests: number;
  oldest_requests: OldestRequestSummary[];
}

export type GetDashboardResponse = ApiSuccessResponse<DashboardData>;

// ==========================================
// 8. ADMIN ACTIONS (STATUS UPDATES)
// ==========================================

export type UpdateRequestStatusResponse = ApiSuccessResponse<null>;
