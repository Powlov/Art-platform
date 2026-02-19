import bcryptjs from 'bcryptjs';
import { getDb, getUserByEmail, createUser, getUserById } from './db';
import { users } from '../drizzle/schema-sqlite';
import { eq } from 'drizzle-orm';

const SALT_ROUNDS = 10;

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, SALT_ROUNDS);
}

/**
 * Compare password with hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

/**
 * Generate unique username
 */
function generateUniqueUsername(baseName: string): string {
  const db = getDb();
  if (!db) throw new Error('Database not available');

  // Create base username from name
  let username = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 12);

  // Ensure minimum length
  if (username.length < 5) {
    username = username + Math.random().toString(36).substring(2, 7);
  }

  // Check if username exists
  const existing = db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1)
    .all();

  if (existing.length > 0) {
    // Add random suffix if username exists
    username = username.substring(0, 10) + Math.random().toString(36).substring(2, 4);
  }

  return username;
}

/**
 * Register new user with email and password
 */
export async function registerUser(email: string, password: string, name: string, role: string = 'user') {
  const db = getDb();
  if (!db) {
    throw new Error('Database not available');
  }

  // Check if user already exists
  const existingUser = getUserByEmail(email);

  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Generate unique username
  const username = generateUniqueUsername(name);

  // Create new user
  const userId = createUser({
    email,
    password: hashedPassword,
    name,
    username,
    loginMethod: 'email',
    role: role as any,
  });

  return { id: userId, email, name, username, role };
}

/**
 * Login user with email and password
 */
export async function loginUser(email: string, password: string) {
  const db = getDb();
  if (!db) {
    throw new Error('Database not available');
  }

  // Find user by email
  const user = getUserByEmail(email);

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Check if user has password (email login method)
  if (!user.password) {
    throw new Error('This account uses OAuth login. Please use OAuth to sign in.');
  }

  // Verify password
  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Update last signed in
  db
    .update(users)
    .set({ lastSignedIn: new Date() })
    .where(eq(users.id, user.id))
    .run();

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    username: user.username,
    role: user.role,
  };
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: number, data: { name?: string; role?: string }) {
  const db = getDb();
  if (!db) {
    throw new Error('Database not available');
  }

  const updateData: any = {};
  if (data.name) updateData.name = data.name;
  if (data.role) updateData.role = data.role;

  if (Object.keys(updateData).length === 0) {
    throw new Error('No data to update');
  }

  db
    .update(users)
    .set(updateData)
    .where(eq(users.id, userId))
    .run();

  return getUserById(userId);
}

/**
 * Create test accounts for all roles
 */
export async function createTestAccounts() {
  const db = getDb();
  if (!db) {
    throw new Error('Database not available');
  }

  const testAccounts = [
    { email: 'admin@artbank.com', password: 'admin123', name: 'Admin User', role: 'admin' },
    { email: 'artist@artbank.com', password: 'artist123', name: 'Test Artist', role: 'artist' },
    { email: 'collector@artbank.com', password: 'collector123', name: 'Test Collector', role: 'collector' },
    { email: 'gallery@artbank.com', password: 'gallery123', name: 'Test Gallery', role: 'gallery' },
    { email: 'curator@artbank.com', password: 'curator123', name: 'Test Curator', role: 'curator' },
    { email: 'partner@artbank.com', password: 'partner123', name: 'Test Partner', role: 'partner' },
    { email: 'consultant@artbank.com', password: 'consultant123', name: 'Test Consultant', role: 'consultant' },
    { email: 'user@artbank.com', password: 'user123', name: 'Test User', role: 'user' },
  ];

  const results = [];

  for (const account of testAccounts) {
    try {
      // Check if account already exists
      const existing = getUserByEmail(account.email);

      if (!existing) {
        const hashedPassword = await hashPassword(account.password);
        const username = generateUniqueUsername(account.name);

        createUser({
          email: account.email,
          password: hashedPassword,
          name: account.name,
          username,
          loginMethod: 'email',
          role: account.role as any,
        });

        results.push({ email: account.email, password: account.password, role: account.role });
        console.log(`[Auth] Created test account: ${account.email} (${account.role})`);
      } else {
        console.log(`[Auth] Test account already exists: ${account.email}`);
      }
    } catch (error) {
      console.error(`Error creating test account ${account.email}:`, error);
    }
  }

  return results;
}
