'use server';

import { neon } from '@neondatabase/serverless';
import type { UserRole } from '@prisma/client';

export type UserDetails = {
  raw_json: {
    id: string;
    display_name: string;
    has_password: boolean;
    is_anonymous: boolean;
    primary_email: string;
    selected_team: null | string;
    auth_with_email: boolean;
    client_metadata: null | Record<string, unknown>;
    oauth_providers: string[];
    server_metadata: null | Record<string, unknown>;
    otp_auth_enabled: boolean;
    selected_team_id: null | string;
    profile_image_url: string;
    requires_totp_mfa: boolean;
    signed_up_at_millis: number;
    passkey_auth_enabled: boolean;
    last_active_at_millis: number;
    primary_email_verified: boolean;
    client_read_only_metadata: null | Record<string, unknown>;
    primary_email_auth_enabled: boolean;
  };
  id: string;
  name: string;
  email: string;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
  role: UserRole;
};

export const getUserDetails = async (userId: string | undefined) => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }

  if (!userId) {
    return null;
  }

  const sql = neon(process.env.DATABASE_URL!);
  const [user] =
    await sql`SELECT * FROM neon_auth.users_sync WHERE id = ${userId};`;
  return user as UserDetails;
};
