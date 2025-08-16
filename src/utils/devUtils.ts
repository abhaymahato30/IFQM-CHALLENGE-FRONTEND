import { userService } from '@/services/userService';

const DEFAULT_TEST_USER_URL = 'http://localhost:5000/api/users/689a92d2e88fe639589bf7b0';

export const devUtils = {
  // Set a test user ID for development
  setTestUser(firebaseUid: string = '1GPlYnEQIlN8m1Idxo6g0fQeqGb2') {
    userService.setCurrentUserFirebaseUid(firebaseUid); // ✅ matches service
    console.log(`🧪 Test user set: ${firebaseUid}`);
  },

  // Clear test user
  clearTestUser() {
    userService.clearCurrentUserFirebaseUid(); // ✅ matches service
    console.log('🧹 Test user cleared');
  },

  // Get current test user ID
  getTestUserId(): string | null {
    return userService.getCurrentUserFirebaseUid(); // ✅ matches service
  },

  // Check if we're in development mode
  isDevelopment(): boolean {
    return import.meta.env?.MODE === 'development';
  },

  // Log current user state
  logUserState() {
    const uid = userService.getCurrentUserFirebaseUid();
    console.log('🔍 Current Firebase UID:', uid);
    console.log('🔍 Development mode:', this.isDevelopment());
    console.log('🔍 Absolute URL:', userService.getUserAbsoluteUrl());
  },

  // Check Firebase UID status
  checkFirebaseUidStatus() {
    const uid = userService.getCurrentUserFirebaseUid();
    const absoluteUrl = userService.getUserAbsoluteUrl();

    console.log('🔥 === FIREBASE UID STATUS ===');
    console.log('Current Firebase UID:', uid || 'None');
    console.log('Status:', uid ? '✅ Set' : '❌ Not Set');
    console.log('Source:', uid ? 'localStorage' : 'None');
    console.log('Absolute URL:', absoluteUrl || 'None');
    console.log('Development Mode:', this.isDevelopment());

    if (uid) {
      console.log('✅ Firebase UID is available for authentication');
    } else {
      console.log('❌ No Firebase UID found - using fallback methods');
    }

    console.log('🔥 === END STATUS ===');
    return {
      uid,
      absoluteUrl,
      isSet: !!uid,
      isDevelopment: this.isDevelopment()
    };
  }
};

// Auto configuration for development
console.log('🚀 devUtils module loaded');
console.log('🔍 Development mode:', devUtils.isDevelopment());

if (devUtils.isDevelopment()) {
  console.log('⚙️ Running development auto-configuration...');

  const currentAbsoluteUrl = userService.getUserAbsoluteUrl();
  console.log('🔍 Current absolute URL:', currentAbsoluteUrl);

  if (!currentAbsoluteUrl) {
    console.log('✅ Setting default absolute URL:', DEFAULT_TEST_USER_URL);
    userService.setUserAbsoluteUrl(DEFAULT_TEST_USER_URL);
  } else {
    console.log('ℹ️ Absolute URL already set:', currentAbsoluteUrl);
  }

  const currentTestUserId = devUtils.getTestUserId();
  console.log('🔍 Current test user ID:', currentTestUserId);

  if (!currentTestUserId) {
    console.log('✅ Setting default test user ID: test-user-123');
    devUtils.setTestUser('test-user-123');
  } else {
    console.log('ℹ️ Test user ID already set:', currentTestUserId);
  }

  console.log('✅ Development auto-configuration completed');
  devUtils.checkFirebaseUidStatus();
}
