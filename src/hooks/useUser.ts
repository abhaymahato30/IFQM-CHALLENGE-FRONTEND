import { useState, useCallback, useEffect } from 'react';
import { userService, User } from '@/services/userService';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let fetchedUser: User | null = null;

      // 1️⃣ Try absolute URL override (full backend URL)
      const absUrl = userService.getUserAbsoluteUrl();
      if (absUrl) {
        console.log('🌍 Fetching via absolute URL:', absUrl);
        fetchedUser = await userService.getUserByAbsoluteUrl(absUrl);
      }

      // 2️⃣ Try fixed user ID from env/localStorage
      if (!fetchedUser) {
        const fixedUserId = userService.getFixedUserId();
        if (fixedUserId) {
          console.log('🆔 Fetching via fixed MongoDB _id:', fixedUserId);
          fetchedUser = await userService.getUserById(fixedUserId);
        }
      }

      // 3️⃣ Try Firebase UID
      if (!fetchedUser) {
        const firebaseUid = userService.getCurrentUserFirebaseUid();
        if (firebaseUid) {
          console.log('🔥 Fetching via Firebase UID:', firebaseUid);
          fetchedUser = await userService.getUserByFirebaseUid(firebaseUid);
        }
      }

      if (!fetchedUser) {
        throw new Error('No valid user identifier found.');
      }

      setUser(fetchedUser);
    } catch (err: any) {
      console.error('❌ Failed to fetch user:', err);
      setError(err.message || 'Failed to fetch user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, error, fetchUser };
}
