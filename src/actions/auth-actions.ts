"use server";

import type { BuiltInProviderType } from "@auth/core/providers";

import { signIn, signOut } from "@/lib/auth";

export async function signOutAction(redirectTo?: string) {
  await signOut({ redirectTo });
}

export async function signInAction(provider: BuiltInProviderType) {
  await signIn(provider);
}
