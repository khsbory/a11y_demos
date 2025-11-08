import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import PageTitle from '@/components/PageTitle';
import { Bell, BellOff, Bookmark, Heart } from 'lucide-react';

// Type definition for RoleSwitchPressedPage props
type RoleSwitchPressedPageProps = {
  title?: string;
};

const RoleSwitchPressedPage: React.FC<RoleSwitchPressedPageProps> = ({
  title = "Role Switch Demo"
}) => {
  // Update document title when component mounts
  useEffect(() => {
    console.log("RoleSwitchPressedPage: Setting document title to:", title);
    document.title = title;
  }, [title]);

  // State for aria-pressed examples
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // State for role="switch" examples
  const [switchOn, setSwitchOn] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [highContrastMode, setHighContrastMode] = useState(false);

  // Log state changes for educational purposes
  const handleToggle = (name: string, currentState: boolean, setState: (value: boolean) => void) => {
    const newState = !currentState;
    setState(newState);
    console.log(`${name} toggled to:`, newState);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="shadow-lg">
        <CardHeader>
          <PageTitle level={1} className="border-b pb-2">
            {title}
          </PageTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* ARIA-Pressed Examples */}
          <div className="pt-6">
            <PageTitle level={2} className="mb-4">
              ARIA-Pressed Examples
            </PageTitle>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bookmark Button */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center space-y-4">
                    <PageTitle level={3} className="text-base">
                      1. Bookmark/Save Button
                    </PageTitle>
                    <button
                      type="button"
                      onClick={() => handleToggle('Bookmark', isBookmarked, setIsBookmarked)}
                      aria-pressed={isBookmarked}
                      aria-label="Bookmark"
                      className={`p-4 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        isBookmarked
                          ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Bookmark
                        size={28}
                        fill={isBookmarked ? "currentColor" : "none"}
                        strokeWidth={2}
                      />
                    </button>
                    <code className="text-xs block bg-gray-50 p-2 rounded w-full">
                      aria-pressed="{isBookmarked ? 'true' : 'false'}"
                    </code>
                  </div>
                </CardContent>
              </Card>

              {/* Favorite/Like Button */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center space-y-4">
                    <PageTitle level={3} className="text-base">
                      2. Favorite/Like Button
                    </PageTitle>
                    <button
                      type="button"
                      onClick={() => handleToggle('Favorite', isFavorited, setIsFavorited)}
                      aria-pressed={isFavorited}
                      aria-label="Favorite"
                      className={`p-4 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                        isFavorited
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Heart
                        size={28}
                        fill={isFavorited ? "currentColor" : "none"}
                        strokeWidth={2}
                      />
                    </button>
                    <code className="text-xs block bg-gray-50 p-2 rounded w-full">
                      aria-pressed="{isFavorited ? 'true' : 'false'}"
                    </code>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Role Switch Examples */}
          <div className="pt-6">
            <PageTitle level={2} className="mb-4">
              Role Switch Examples
            </PageTitle>

            <div className="space-y-4">
              {/* Simple On/Off Switch */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <PageTitle level={3} className="text-base">
                        1. Simple On/Off Switch
                      </PageTitle>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={switchOn}
                      onClick={() => handleToggle('Switch', switchOn, setSwitchOn)}
                      onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                          e.preventDefault();
                          handleToggle('Switch', switchOn, setSwitchOn);
                        }
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        switchOn ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          switchOn ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <code className="text-xs block bg-gray-50 p-2 rounded mt-3">
                    role="switch" aria-checked="{switchOn ? 'true' : 'false'}"
                  </code>
                </CardContent>
              </Card>

              {/* Notification Settings Switch */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <PageTitle level={3} className="text-base">
                        2. Notification Settings
                      </PageTitle>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={notificationsEnabled}
                      aria-label="Toggle notifications"
                      onClick={() => handleToggle('Notifications', notificationsEnabled, setNotificationsEnabled)}
                      onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                          e.preventDefault();
                          handleToggle('Notifications', notificationsEnabled, setNotificationsEnabled);
                        }
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        notificationsEnabled ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform flex items-center justify-center ${
                          notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      >
                        {notificationsEnabled ? (
                          <Bell className="w-2 h-2 text-green-600" />
                        ) : (
                          <BellOff className="w-2 h-2 text-gray-400" />
                        )}
                      </span>
                    </button>
                  </div>
                  <code className="text-xs block bg-gray-50 p-2 rounded mt-3">
                    role="switch" aria-checked="{notificationsEnabled ? 'true' : 'false'}"
                  </code>
                </CardContent>
              </Card>

              {/* Auto-save Toggle */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <PageTitle level={3} className="text-base">
                        3. Auto-save Changes
                      </PageTitle>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={autoSaveEnabled}
                      aria-label="Toggle auto-save"
                      onClick={() => handleToggle('Auto-save', autoSaveEnabled, setAutoSaveEnabled)}
                      onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                          e.preventDefault();
                          handleToggle('Auto-save', autoSaveEnabled, setAutoSaveEnabled);
                        }
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        autoSaveEnabled ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          autoSaveEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <code className="text-xs block bg-gray-50 p-2 rounded mt-3">
                    role="switch" aria-checked="{autoSaveEnabled ? 'true' : 'false'}"
                  </code>
                </CardContent>
              </Card>

              {/* High Contrast Mode Toggle */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <PageTitle level={3} className="text-base">
                        4. High Contrast Mode
                      </PageTitle>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={highContrastMode}
                      aria-label="Toggle high contrast mode"
                      onClick={() => handleToggle('High Contrast', highContrastMode, setHighContrastMode)}
                      onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                          e.preventDefault();
                          handleToggle('High Contrast', highContrastMode, setHighContrastMode);
                        }
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        highContrastMode ? 'bg-black' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                          highContrastMode
                            ? 'translate-x-6 bg-yellow-400'
                            : 'translate-x-1 bg-white'
                        }`}
                      />
                    </button>
                  </div>
                  <code className="text-xs block bg-gray-50 p-2 rounded mt-3">
                    role="switch" aria-checked="{highContrastMode ? 'true' : 'false'}"
                  </code>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleSwitchPressedPage;
