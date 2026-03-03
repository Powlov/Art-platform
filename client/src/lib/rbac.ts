/**
 * Role-Based Access Control (RBAC) System
 * Defines user roles, permissions, and access control for the platform
 */

export enum UserRole {
  // Platform Administration
  ADMIN = 'admin',                    // Full platform access
  PLATFORM_MANAGER = 'platform_manager', // Platform operations & monitoring
  
  // Bank Partners
  BANK_ADMIN = 'bank_admin',          // Bank administrator (full bank access)
  BANK_MANAGER = 'bank_manager',      // Bank loan manager
  BANK_ANALYST = 'bank_analyst',      // Bank data analyst (read-only)
  BANK_API = 'bank_api',              // Bank API integration (programmatic access)
  
  // Art Platform Users
  GALLERY_OWNER = 'gallery_owner',    // Gallery owner
  ARTIST = 'artist',                  // Artist
  COLLECTOR = 'collector',            // Art collector
  APPRAISER = 'appraiser',            // Art appraiser
  
  // Default
  USER = 'user',                      // Regular user
  GUEST = 'guest',                    // Guest (non-authenticated)
}

export enum Permission {
  // General Platform
  VIEW_DASHBOARD = 'view_dashboard',
  VIEW_ANALYTICS = 'view_analytics',
  EXPORT_DATA = 'export_data',
  
  // Banking Operations
  VIEW_LOANS = 'view_loans',
  CREATE_LOAN = 'create_loan',
  APPROVE_LOAN = 'approve_loan',
  MODIFY_LOAN = 'modify_loan',
  CLOSE_LOAN = 'close_loan',
  VIEW_LTV = 'view_ltv',
  UPDATE_LTV = 'update_ltv',
  VIEW_COLLATERAL = 'view_collateral',
  
  // Risk Management
  VIEW_RISK_METRICS = 'view_risk_metrics',
  MANAGE_RISK_THRESHOLDS = 'manage_risk_thresholds',
  VIEW_FRAUD_ALERTS = 'view_fraud_alerts',
  MANAGE_FRAUD_ALERTS = 'manage_fraud_alerts',
  
  // API Integration
  VIEW_API_SETTINGS = 'view_api_settings',
  MANAGE_API_SETTINGS = 'manage_api_settings',
  VIEW_WEBHOOKS = 'view_webhooks',
  MANAGE_WEBHOOKS = 'manage_webhooks',
  
  // ML Valuation
  VIEW_VALUATIONS = 'view_valuations',
  REQUEST_VALUATION = 'request_valuation',
  APPROVE_VALUATION = 'approve_valuation',
  
  // Graph Trust
  VIEW_GRAPH = 'view_graph',
  VIEW_PROVENANCE = 'view_provenance',
  VERIFY_NODE = 'verify_node',
  
  // Reports
  VIEW_REPORTS = 'view_reports',
  GENERATE_REPORTS = 'generate_reports',
  EXPORT_REPORTS = 'export_reports',
  
  // User Management
  VIEW_USERS = 'view_users',
  MANAGE_USERS = 'manage_users',
  VIEW_BANK_TEAM = 'view_bank_team',
  MANAGE_BANK_TEAM = 'manage_bank_team',
  
  // System
  VIEW_SYSTEM_LOGS = 'view_system_logs',
  MANAGE_SYSTEM_SETTINGS = 'manage_system_settings',
}

/**
 * Role-Permission mapping
 * Defines which permissions each role has
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  // Platform Administration
  [UserRole.ADMIN]: Object.values(Permission), // All permissions
  
  [UserRole.PLATFORM_MANAGER]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_ANALYTICS,
    Permission.EXPORT_DATA,
    Permission.VIEW_LOANS,
    Permission.VIEW_LTV,
    Permission.VIEW_COLLATERAL,
    Permission.VIEW_RISK_METRICS,
    Permission.VIEW_FRAUD_ALERTS,
    Permission.MANAGE_FRAUD_ALERTS,
    Permission.VIEW_VALUATIONS,
    Permission.VIEW_GRAPH,
    Permission.VIEW_PROVENANCE,
    Permission.VIEW_REPORTS,
    Permission.GENERATE_REPORTS,
    Permission.EXPORT_REPORTS,
    Permission.VIEW_USERS,
    Permission.VIEW_SYSTEM_LOGS,
  ],
  
  // Bank Roles
  [UserRole.BANK_ADMIN]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_ANALYTICS,
    Permission.EXPORT_DATA,
    Permission.VIEW_LOANS,
    Permission.CREATE_LOAN,
    Permission.APPROVE_LOAN,
    Permission.MODIFY_LOAN,
    Permission.CLOSE_LOAN,
    Permission.VIEW_LTV,
    Permission.UPDATE_LTV,
    Permission.VIEW_COLLATERAL,
    Permission.VIEW_RISK_METRICS,
    Permission.MANAGE_RISK_THRESHOLDS,
    Permission.VIEW_FRAUD_ALERTS,
    Permission.VIEW_API_SETTINGS,
    Permission.MANAGE_API_SETTINGS,
    Permission.VIEW_WEBHOOKS,
    Permission.MANAGE_WEBHOOKS,
    Permission.VIEW_VALUATIONS,
    Permission.REQUEST_VALUATION,
    Permission.VIEW_GRAPH,
    Permission.VIEW_PROVENANCE,
    Permission.VIEW_REPORTS,
    Permission.GENERATE_REPORTS,
    Permission.EXPORT_REPORTS,
    Permission.VIEW_BANK_TEAM,
    Permission.MANAGE_BANK_TEAM,
  ],
  
  [UserRole.BANK_MANAGER]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_ANALYTICS,
    Permission.EXPORT_DATA,
    Permission.VIEW_LOANS,
    Permission.CREATE_LOAN,
    Permission.MODIFY_LOAN,
    Permission.VIEW_LTV,
    Permission.VIEW_COLLATERAL,
    Permission.VIEW_RISK_METRICS,
    Permission.VIEW_FRAUD_ALERTS,
    Permission.VIEW_VALUATIONS,
    Permission.REQUEST_VALUATION,
    Permission.VIEW_GRAPH,
    Permission.VIEW_PROVENANCE,
    Permission.VIEW_REPORTS,
    Permission.GENERATE_REPORTS,
    Permission.EXPORT_REPORTS,
    Permission.VIEW_BANK_TEAM,
  ],
  
  [UserRole.BANK_ANALYST]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_ANALYTICS,
    Permission.EXPORT_DATA,
    Permission.VIEW_LOANS,
    Permission.VIEW_LTV,
    Permission.VIEW_COLLATERAL,
    Permission.VIEW_RISK_METRICS,
    Permission.VIEW_VALUATIONS,
    Permission.VIEW_GRAPH,
    Permission.VIEW_PROVENANCE,
    Permission.VIEW_REPORTS,
    Permission.EXPORT_REPORTS,
  ],
  
  [UserRole.BANK_API]: [
    Permission.VIEW_LOANS,
    Permission.CREATE_LOAN,
    Permission.MODIFY_LOAN,
    Permission.VIEW_LTV,
    Permission.VIEW_COLLATERAL,
    Permission.VIEW_VALUATIONS,
    Permission.REQUEST_VALUATION,
  ],
  
  // Art Platform Roles
  [UserRole.GALLERY_OWNER]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_VALUATIONS,
    Permission.REQUEST_VALUATION,
    Permission.VIEW_GRAPH,
    Permission.VIEW_PROVENANCE,
  ],
  
  [UserRole.ARTIST]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_VALUATIONS,
    Permission.VIEW_GRAPH,
    Permission.VIEW_PROVENANCE,
  ],
  
  [UserRole.COLLECTOR]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_VALUATIONS,
    Permission.REQUEST_VALUATION,
    Permission.VIEW_GRAPH,
    Permission.VIEW_PROVENANCE,
    Permission.VIEW_LOANS,
    Permission.CREATE_LOAN,
  ],
  
  [UserRole.APPRAISER]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_VALUATIONS,
    Permission.REQUEST_VALUATION,
    Permission.APPROVE_VALUATION,
    Permission.VIEW_GRAPH,
    Permission.VIEW_PROVENANCE,
    Permission.VERIFY_NODE,
  ],
  
  // Default Roles
  [UserRole.USER]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_VALUATIONS,
    Permission.VIEW_GRAPH,
  ],
  
  [UserRole.GUEST]: [],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

/**
 * Check if a role has any of the specified permissions
 */
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission));
}

/**
 * Check if a role has all of the specified permissions
 */
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission));
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Check if role is a bank role
 */
export function isBankRole(role: UserRole): boolean {
  return [
    UserRole.BANK_ADMIN,
    UserRole.BANK_MANAGER,
    UserRole.BANK_ANALYST,
    UserRole.BANK_API,
  ].includes(role);
}

/**
 * Get display name for role
 */
export function getRoleDisplayName(role: UserRole): string {
  const displayNames: Record<UserRole, string> = {
    [UserRole.ADMIN]: 'Administrator',
    [UserRole.PLATFORM_MANAGER]: 'Platform Manager',
    [UserRole.BANK_ADMIN]: 'Bank Administrator',
    [UserRole.BANK_MANAGER]: 'Bank Manager',
    [UserRole.BANK_ANALYST]: 'Bank Analyst',
    [UserRole.BANK_API]: 'Bank API',
    [UserRole.GALLERY_OWNER]: 'Gallery Owner',
    [UserRole.ARTIST]: 'Artist',
    [UserRole.COLLECTOR]: 'Collector',
    [UserRole.APPRAISER]: 'Appraiser',
    [UserRole.USER]: 'User',
    [UserRole.GUEST]: 'Guest',
  };
  
  return displayNames[role] || role;
}

/**
 * Route access control mapping
 * Defines which roles can access which routes
 */
export const ROUTE_ACCESS: Record<string, UserRole[]> = {
  '/': [UserRole.USER, UserRole.GUEST], // Public
  '/dashboard': [UserRole.USER],
  '/admin': [UserRole.ADMIN, UserRole.PLATFORM_MANAGER],
  '/bank-portal': [UserRole.BANK_ADMIN, UserRole.BANK_MANAGER, UserRole.BANK_ANALYST],
  '/bank-portal/loans': [UserRole.BANK_ADMIN, UserRole.BANK_MANAGER],
  '/bank-portal/settings': [UserRole.BANK_ADMIN],
  '/bank-portal/team': [UserRole.BANK_ADMIN],
  '/transaction-led-core': [UserRole.ADMIN, UserRole.PLATFORM_MANAGER],
  '/artworks': [UserRole.USER],
  '/auctions': [UserRole.USER],
};

/**
 * Check if role can access route
 */
export function canAccessRoute(role: UserRole, route: string): boolean {
  const allowedRoles = ROUTE_ACCESS[route];
  
  if (!allowedRoles) {
    // If route not defined, check for parent route
    const parentRoute = route.split('/').slice(0, -1).join('/') || '/';
    return canAccessRoute(role, parentRoute);
  }
  
  return allowedRoles.includes(role) || role === UserRole.ADMIN;
}
