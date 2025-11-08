import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PageTitle from '@/components/PageTitle';
import { Heart, Moon, Sun, Bell, BellOff } from 'lucide-react';

// Type definition for RoleSwitchPressedPage props
type RoleSwitchPressedPageProps = {
  title?: string;
};

const RoleSwitchPressedPage: React.FC<RoleSwitchPressedPageProps> = ({
  title = "Role Switch & ARIA-Pressed Test"
}) => {
  // Update document title when component mounts
  useEffect(() => {
    console.log("RoleSwitchPressedPage: Setting document title to:", title);
    document.title = title;
  }, [title]);

  // State for aria-pressed examples
  const [simpleToggle, setSimpleToggle] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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
          {/* Section 1: ARIA-Pressed Examples */}
          <div className="border-t pt-6">
            <PageTitle level={2} className="mb-4">
              Section 1: ARIA-Pressed Examples
            </PageTitle>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Simple Toggle Button */}
              <Card>
                <CardHeader>
                  <PageTitle level={3} className="text-lg">
                    1. Simple Toggle Button
                  </PageTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    aria-pressed={simpleToggle}
                    onClick={() => handleToggle('Simple Toggle', simpleToggle, setSimpleToggle)}
                    className={`w-full transition-all ${
                      simpleToggle
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-gray-400 hover:bg-gray-500'
                    }`}
                  >
                    {simpleToggle ? 'ON' : 'OFF'}
                  </Button>
                  <code className="text-xs block bg-gray-50 p-2 rounded">
                    aria-pressed="{simpleToggle ? 'true' : 'false'}"
                  </code>
                </CardContent>
              </Card>

              {/* Like/Favorite Button */}
              <Card>
                <CardHeader>
                  <PageTitle level={3} className="text-lg">
                    2. Like/Favorite Button
                  </PageTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    aria-pressed={isFavorite}
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    onClick={() => handleToggle('Favorite', isFavorite, setIsFavorite)}
                    variant="outline"
                    className={`w-full transition-all ${
                      isFavorite
                        ? 'border-red-500 text-red-600 hover:bg-red-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Heart
                      className={`mr-2 transition-all ${isFavorite ? 'fill-red-600' : ''}`}
                      size={20}
                    />
                    {isFavorite ? 'Favorited' : 'Add to Favorites'}
                  </Button>
                  <code className="text-xs block bg-gray-50 p-2 rounded">
                    aria-pressed="{isFavorite ? 'true' : 'false'}"
                  </code>
                </CardContent>
              </Card>

              {/* Dark Mode Toggle */}
              <Card>
                <CardHeader>
                  <PageTitle level={3} className="text-lg">
                    3. Dark Mode Toggle
                  </PageTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    aria-pressed={isDarkMode}
                    aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                    onClick={() => handleToggle('Dark Mode', isDarkMode, setIsDarkMode)}
                    className={`w-full transition-all ${
                      isDarkMode
                        ? 'bg-gray-800 hover:bg-gray-900 text-yellow-300'
                        : 'bg-yellow-400 hover:bg-yellow-500 text-gray-800'
                    }`}
                  >
                    {isDarkMode ? (
                      <>
                        <Moon className="mr-2" size={20} />
                        Dark Mode
                      </>
                    ) : (
                      <>
                        <Sun className="mr-2" size={20} />
                        Light Mode
                      </>
                    )}
                  </Button>
                  <code className="text-xs block bg-gray-50 p-2 rounded">
                    aria-pressed="{isDarkMode ? 'true' : 'false'}"
                  </code>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Section 2: Role Switch Examples */}
          <div className="border-t pt-6">
            <PageTitle level={2} className="mb-4">
              Section 2: Role Switch Examples
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
