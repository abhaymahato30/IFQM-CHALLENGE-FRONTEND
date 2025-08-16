import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { devUtils } from '@/utils/devUtils';
import { useUser } from '@/hooks/useUser';
import { userService } from '@/services/userService';

const DevTools = () => {
  const [testFirebaseUid, setTestFirebaseUid] = useState('test-user-123');
  const [mongoId, setMongoId] = useState('689a92d2e88fe639589bf7b0');
  const [absoluteUrl, setAbsoluteUrl] = useState(
    userService.getUserAbsoluteUrl() || `http://localhost:5000/api/users/${mongoId}`
  );
  const { user, loading, error, fetchUser } = useUser();

  if (import.meta.env?.MODE !== 'development') {
    return null;
  }

  const handleSetTestUser = () => {
    devUtils.setTestUser(testFirebaseUid);
    fetchUser();
  };

  const handleClearUser = () => {
    devUtils.clearTestUser();
    window.location.reload();
  };

  const handleSetAbsoluteUrl = () => {
    userService.setUserAbsoluteUrl(absoluteUrl);
    fetchUser();
  };

  const handleClearAbsoluteUrl = () => {
    userService.clearUserAbsoluteUrl();
    fetchUser();
  };

  const currentFirebaseUid = userService.getCurrentUserFirebaseUid();
  const currentAbsoluteUrl = userService.getUserAbsoluteUrl();

  return (
    <Card className="fixed bottom-4 right-4 w-96 bg-yellow-50 border-yellow-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-yellow-800">🛠️ Dev Tools</CardTitle>
        <CardDescription className="text-xs text-yellow-600">
          Development utilities for testing backend integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Firebase UID Status */}
        <div className="space-y-2">
          <Label className="text-xs text-yellow-700 font-semibold">
            🔥 Firebase UID Status
          </Label>
          <div className="text-xs space-y-1 bg-yellow-100 p-2 rounded">
            <div className="text-yellow-800">
              <strong>Current Firebase UID:</strong> {currentFirebaseUid || 'None'}
            </div>
            <div className="text-yellow-700">
              <strong>Status:</strong> {currentFirebaseUid ? '✅ Set' : '❌ Not Set'}
            </div>
          </div>
        </div>

        {/* Absolute URL */}
        <div className="space-y-2">
          <Label htmlFor="abs-url" className="text-xs text-yellow-700">
            MongoDB _id Absolute API URL
          </Label>
          <div className="flex gap-2">
            <Input
              id="abs-url"
              value={absoluteUrl}
              onChange={(e) => setAbsoluteUrl(e.target.value)}
              className="text-xs"
              placeholder="http://localhost:5000/api/users/<id>"
            />
            <Button size="sm" className="text-xs bg-yellow-600 hover:bg-yellow-700" onClick={handleSetAbsoluteUrl}>
              Set
            </Button>
            <Button size="sm" variant="outline" className="text-xs" onClick={handleClearAbsoluteUrl}>
              Clear
            </Button>
          </div>
        </div>

        {/* MongoDB _id quick set */}
        <div className="space-y-2">
          <Label htmlFor="mongo-id" className="text-xs text-yellow-700">
            Quick Set MongoDB _id
          </Label>
          <div className="flex gap-2">
            <Input
              id="mongo-id"
              value={mongoId}
              onChange={(e) => setMongoId(e.target.value)}
              className="text-xs"
              placeholder="Enter MongoDB _id"
            />
            <Button
              size="sm"
              className="text-xs bg-yellow-600 hover:bg-yellow-700"
              onClick={() => {
                const url = `http://localhost:5000/api/users/${mongoId}`;
                setAbsoluteUrl(url);
                userService.setUserAbsoluteUrl(url);
                fetchUser();
              }}
            >
              Set by _id
            </Button>
          </div>
        </div>

        {/* Firebase UID */}
        <div className="space-y-2">
          <Label htmlFor="test-firebase-uid" className="text-xs text-yellow-700">
            Test Firebase UID (for /profile route)
          </Label>
          <div className="flex gap-2">
            <Input
              id="test-firebase-uid"
              value={testFirebaseUid}
              onChange={(e) => setTestFirebaseUid(e.target.value)}
              className="text-xs"
              placeholder="Enter Firebase UID"
            />
            <Button
              size="sm"
              onClick={handleSetTestUser}
              className="text-xs bg-yellow-600 hover:bg-yellow-700"
            >
              Set Test UID
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleClearUser}
              className="text-xs"
            >
              Clear
            </Button>
          </div>
        </div>

        {/* Status */}
        <div className="text-xs space-y-1">
          <div className="text-yellow-700">
            <strong>Load Status:</strong> {loading ? 'Loading...' : error ? 'Error' : user ? 'Loaded' : 'No User'}
          </div>
          <div className="text-yellow-600 break-all">
            <strong>Absolute URL in use:</strong> {currentAbsoluteUrl || 'None'}
          </div>
          {user && (
            <div className="text-yellow-600">
              <strong>User:</strong> {user.name || user.email}
            </div>
          )}
          {error && (
            <div className="text-red-600">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DevTools;
