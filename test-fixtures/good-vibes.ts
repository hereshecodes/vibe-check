// This file demonstrates clean code patterns

interface UserProfile {
  id: string;
  email: string;
  displayName: string;
}

async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  const apiResponse = await fetch(`/api/users/${userId}`);

  if (!apiResponse.ok) {
    return null;
  }

  const userProfile: UserProfile = await apiResponse.json();
  return userProfile;
}

function formatDisplayName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}

export { fetchUserProfile, formatDisplayName };
export type { UserProfile };
