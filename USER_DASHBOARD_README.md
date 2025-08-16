# User Dashboard Implementation

This document describes the implementation of the user dashboard that fetches and displays user data based on the provided User schema.

## Features

The UserDashboard component now includes:

1. **Real-time User Data**: Fetches user data from the API based on the User schema
2. **Loading States**: Shows skeleton loading components while data is being fetched
3. **Error Handling**: Displays appropriate error messages if data fetching fails
4. **Dynamic Content**: All user information is dynamically populated from the API
5. **Profile Management**: Displays user skills, achievements, and verification status

## User Schema Integration

The dashboard integrates with the following User schema fields:

- `firebaseUid`: Links to Firebase Auth UID
- `name`: User's display name
- `email`: User's email address
- `is_verified`: Verification status
- `skills`: Array of user skills
- `achievements`: Array of achievement objects with titles
- `active_challenges`: Number of active challenges
- `solutions_submitted`: Number of solutions submitted
- `rewards_earned`: Total rewards earned
- `avg_rating`: Average rating

## API Integration

### User Service (`src/services/userService.ts`)

The user service provides methods for:
- `getUserByFirebaseUid(firebaseUid)`: Fetch user data by Firebase UID
- `updateUser(firebaseUid, userData)`: Update user profile
- `getCurrentUserFirebaseUid()`: Get current user's Firebase UID from localStorage
- `setCurrentUserFirebaseUid(firebaseUid)`: Set current user's Firebase UID
- `clearCurrentUser()`: Clear current user data

### Custom Hook (`src/hooks/useUser.ts`)

The `useUser` hook provides:
- `user`: Current user data
- `loading`: Loading state
- `error`: Error state
- `fetchUser()`: Function to fetch user data
- `updateUser(userData)`: Function to update user data
- `clearUser()`: Function to clear user data

## API Endpoints

The dashboard expects the following API endpoints:

### GET `/api/users/:firebaseUid`
Fetches user data by Firebase UID.

**Response:**
```json
{
  "_id": "user_id",
  "firebaseUid": "firebase_uid",
  "name": "User Name",
  "email": "user@example.com",
  "is_verified": true,
  "skills": ["AI/ML", "Sustainability", "Product Design"],
  "achievements": [
    { "title": "Top Solution Award" },
    { "title": "Community Contributor" }
  ],
  "active_challenges": 3,
  "solutions_submitted": 12,
  "rewards_earned": 8500,
  "avg_rating": 4.8,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-15T00:00:00.000Z"
}
```

### PUT `/api/users/:firebaseUid`
Updates user data.

**Request Body:**
```json
{
  "name": "Updated Name",
  "skills": ["AI/ML", "Data Science"],
  "is_verified": true
}
```

## Environment Configuration

Set the API base URL in your environment variables:

```env
VITE_API_URL=http://localhost:5000
```

## Development Setup

For development and testing, the dashboard includes several utilities:

### DevTools Component
A development panel that appears in the bottom-right corner (only in development mode) allowing you to:
- Set test user IDs
- View current user state
- Debug API calls
- Clear user data

### Auto Test User
In development mode, if no Firebase UID is found, the system will automatically set a test user ID (`test-user-123`) to prevent errors.

### Manual Test User Setup
You can manually set a test user ID:

```tsx
import { devUtils } from '@/utils/devUtils';

// Set a test user ID
devUtils.setTestUser('your-test-user-id');

// Clear test user
devUtils.clearTestUser();

// Check current user state
devUtils.logUserState();
```

## Usage

### Basic Usage
```tsx
import { useUser } from '@/hooks/useUser';

const MyComponent = () => {
  const { user, loading, error } = useUser();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user found</div>;

  return <div>Welcome, {user.name}!</div>;
};
```

### Updating User Data
```tsx
import { useUser } from '@/hooks/useUser';

const MyComponent = () => {
  const { user, updateUser } = useUser();

  const handleUpdateSkills = async () => {
    try {
      await updateUser({
        skills: [...user.skills, 'New Skill']
      });
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  return <button onClick={handleUpdateSkills}>Add Skill</button>;
};
```

## Authentication

The dashboard expects the Firebase UID to be stored in localStorage under the key `firebaseUid`. You can set this during the login process:

```tsx
import { userService } from '@/services/userService';

// During login
userService.setCurrentUserFirebaseUid(firebaseUser.uid);
```

## Error Handling

The dashboard includes comprehensive error handling:
- Network errors during API calls
- Missing user data
- Invalid user IDs
- Server errors

All errors are displayed to the user with appropriate messaging and recovery options.

## Styling

The dashboard uses the existing UI components and follows the established design system:
- Cards for content sections
- Badges for status indicators
- Skeleton components for loading states
- Alert components for error messages
- Responsive grid layouts

## Future Enhancements

Potential improvements:
1. Real-time updates using WebSocket connections
2. Caching user data for better performance
3. Offline support with local storage
4. User data validation and sanitization
5. Integration with notification system
6. Advanced filtering and sorting options
