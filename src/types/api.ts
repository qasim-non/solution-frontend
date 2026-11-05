/**
 * Tamkkun API Type Definitions
 * Framework: Laravel 12 (Sanctum Auth)
 * Base URL: http://127.0.0.1:8000/api
 */

// ==========================================
// 1. COMMON / BASE API RESPONSE SHAPES
// ==========================================

export interface ApiSuccessResponse<T = unknown> {
  message: string;
  data?: T;
}

export interface ApiErrorResponse {
  status: 'error';
  message: string;
}

export interface ApiValidationErrorResponse {
  message: string;
  errors: Record<string, string[]>;
}

// ==========================================
// 2. AUTHENTICATION MODULE
// ==========================================

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
}

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

export interface GetSystemTypesResponse {
  message: string;
  types: SystemType[];
}

// ==========================================
// 4. CONTACT INFO & PUBLIC MESSAGES MODULE
// ==========================================

export interface ContactInfoItem {
  id: number;
  type: 'email' | 'mobile' | string;
  value: string;
}

export interface GetContactInfoResponse {
  message: string;
  data: ContactInfoItem[];
}

export interface SendContactMessageRequest {
  full_name: string;
  email: string;
  text_message: string;
}

export interface SendContactMessageResponse {
  message: string;
}

export interface ContactMessage {
  id?: number;
  full_name: string;
  email: string;
  text_message: string;
  created_at: string;
}

export interface GetMessagesResponse {
  message: string;
  messages: ContactMessage[];
}

// ==========================================
// 5. PROJECT REQUESTS MODULE
// ==========================================

export interface CreateProjectRequestPayload {
  project_name: string;
  mobile: string;
  description?: string | null;
  device_id?: string; // Stable browser id used for "request completed" push notifications
  system_types: number[]; // Array of SystemType IDs
  social_media?: Record<string, string>; // Optional map of platform ID ("1", "2") to URL/handle
}

export interface CreateProjectRequestResponse {
  message: string;
}

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

export interface GetRequestsResponse {
  message: string;
  data: ProjectRequest[];
}

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

export interface GetSocialMediaAccountsResponse {
  message: string;
  messages: SocialMediaAccountItem[];
}

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

export interface GetDashboardResponse {
  message: string;
  data: DashboardData;
}

// ==========================================
// 8. ADMIN ACTIONS (STATUS UPDATES)
// ==========================================

export interface UpdateRequestStatusResponse {
  message: string;
}
