import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import { Settings, Database, Smartphone, Image, Shield, Mail, MessageSquare } from 'lucide-react';

export function AdminSettings() {
  const [maxSearchRadius, setMaxSearchRadius] = useState(50);
  const [imageQuality, setImageQuality] = useState(80);
  const [rateLimit, setRateLimit] = useState(100);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-gray-900">System Settings</h2>
      </div>

      <Tabs defaultValue="discovery" className="w-full">
        <TabsList>
          <TabsTrigger value="discovery">Discovery</TabsTrigger>
          <TabsTrigger value="pwa">PWA & Offline</TabsTrigger>
          <TabsTrigger value="media">Media Settings</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="discovery" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-gray-600" />
              <h3 className="text-gray-900">Search & Discovery Settings</h3>
            </div>
            <div className="space-y-6">
              <div>
                <Label>Maximum Search Radius (km)</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Slider
                    value={[maxSearchRadius]}
                    onValueChange={(value) => setMaxSearchRadius(value[0])}
                    max={200}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-gray-900 w-16 text-right">{maxSearchRadius} km</span>
                </div>
              </div>

              <div>
                <Label>Default Search Radius (km)</Label>
                <Input type="number" defaultValue="25" className="mt-1" />
              </div>

              <div>
                <Label>Distance Unit</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="distance" defaultChecked />
                    <span>Kilometers</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="distance" />
                    <span>Miles</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Location-based Search</Label>
                  <p className="text-gray-600">Allow users to search by location</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Distance in Results</Label>
                  <p className="text-gray-600">Display distance to providers</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Geo-distance Calculation Tool</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Point A (Lat, Lng)</Label>
                <Input placeholder="-26.2041, 28.0473" className="mt-1" />
              </div>
              <div>
                <Label>Point B (Lat, Lng)</Label>
                <Input placeholder="-33.9249, 18.4241" className="mt-1" />
              </div>
            </div>
            <Button className="mt-4">Calculate Distance</Button>
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <p className="text-gray-600">Distance: <span className="text-gray-900">1,265.4 km</span></p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="pwa" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="w-5 h-5 text-gray-600" />
              <h3 className="text-gray-900">PWA Configuration</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label>App Name</Label>
                <Input defaultValue="Service Provider Marketplace" className="mt-1" />
              </div>

              <div>
                <Label>Short Name</Label>
                <Input defaultValue="Marketplace" className="mt-1" />
              </div>

              <div>
                <Label>Start URL</Label>
                <Input defaultValue="/" className="mt-1" />
              </div>

              <div>
                <Label>Theme Color</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input type="color" defaultValue="#3b82f6" className="w-20" />
                  <Input defaultValue="#3b82f6" className="flex-1" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Offline Mode</Label>
                  <p className="text-gray-600">Cache content for offline access</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Service Worker & Caching</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Service Worker Version</span>
                <Badge>v2.1.0</Badge>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Cache Size</span>
                <span className="text-gray-900">12.4 MB</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Cached Pages</span>
                <span className="text-gray-900">45 pages</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">Update Service Worker</Button>
                <Button variant="outline" className="flex-1">Clear Cache</Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Low-Data Mode Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Low-Data Mode</Label>
                  <p className="text-gray-600">Reduce data usage for users</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Compress Images on Upload</Label>
                  <p className="text-gray-600">Automatically compress user uploads</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Lazy Load Images</Label>
                  <p className="text-gray-600">Load images only when visible</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Image className="w-5 h-5 text-gray-600" />
              <h3 className="text-gray-900">Image & Media Settings</h3>
            </div>
            <div className="space-y-6">
              <div>
                <Label>Image Quality (%)</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Slider
                    value={[imageQuality]}
                    onValueChange={(value) => setImageQuality(value[0])}
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-gray-900 w-16 text-right">{imageQuality}%</span>
                </div>
              </div>

              <div>
                <Label>Maximum Image Dimensions</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Input placeholder="Width (px)" defaultValue="1920" />
                  <Input placeholder="Height (px)" defaultValue="1080" />
                </div>
              </div>

              <div>
                <Label>Maximum File Size (MB)</Label>
                <Input type="number" defaultValue="5" className="mt-1" />
              </div>

              <div>
                <Label>Allowed File Types</Label>
                <Input defaultValue="jpg, jpeg, png, webp" className="mt-1" />
              </div>

              <Button variant="outline">
                Re-compress Existing Images
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Storage Management</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Total Storage Used</span>
                <span className="text-gray-900">156 MB</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Storage Quota</span>
                <span className="text-gray-900">200 MB (78%)</span>
              </div>
              <div>
                <Label>File Retention Policy (days)</Label>
                <Input type="number" defaultValue="365" className="mt-1" />
                <p className="text-gray-600 mt-1">Delete unused files after this period</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="auth" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-gray-600" />
              <h3 className="text-gray-900">Authentication Settings</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email/Password Login</Label>
                  <p className="text-gray-600">Standard email authentication</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS Verification</Label>
                  <p className="text-gray-600">Verify users via SMS</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Google OAuth</Label>
                  <p className="text-gray-600">Allow Google sign-in</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>2FA for Admins</Label>
                  <p className="text-gray-600">Require two-factor authentication</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="communications" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-gray-600" />
              <h3 className="text-gray-900">Email Configuration</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label>SMTP Server</Label>
                <Input placeholder="smtp.example.com" className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Port</Label>
                  <Input defaultValue="587" className="mt-1" />
                </div>
                <div>
                  <Label>Encryption</Label>
                  <Input defaultValue="TLS" className="mt-1" />
                </div>
              </div>
              <div>
                <Label>From Address</Label>
                <Input defaultValue="noreply@marketplace.co.za" className="mt-1" />
              </div>
              <Button variant="outline">Test Email Configuration</Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-gray-600" />
              <h3 className="text-gray-900">SMS Configuration</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label>SMS Provider</Label>
                <Input placeholder="Twilio, Clickatell, etc." className="mt-1" />
              </div>
              <div>
                <Label>API Key</Label>
                <Input type="password" placeholder="Your API key" className="mt-1" />
              </div>
              <div>
                <Label>Sender ID</Label>
                <Input defaultValue="Marketplace" className="mt-1" />
              </div>
              <Button variant="outline">Test SMS Configuration</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-gray-600" />
              <h3 className="text-gray-900">Rate Limiting & Abuse Prevention</h3>
            </div>
            <div className="space-y-6">
              <div>
                <Label>API Rate Limit (requests/minute)</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Slider
                    value={[rateLimit]}
                    onValueChange={(value) => setRateLimit(value[0])}
                    max={500}
                    step={10}
                    className="flex-1"
                  />
                  <span className="text-gray-900 w-16 text-right">{rateLimit}</span>
                </div>
              </div>

              <div>
                <Label>Max Login Attempts</Label>
                <Input type="number" defaultValue="5" className="mt-1" />
              </div>

              <div>
                <Label>Lockout Duration (minutes)</Label>
                <Input type="number" defaultValue="30" className="mt-1" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable IP Blocking</Label>
                  <p className="text-gray-600">Block suspicious IP addresses</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable CAPTCHA</Label>
                  <p className="text-gray-600">Require CAPTCHA for sensitive actions</p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Blocked IPs</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-900">197.184.123.45</span>
                <Button variant="ghost" size="sm">Unblock</Button>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-900">41.76.242.89</span>
                <Button variant="ghost" size="sm">Unblock</Button>
              </div>
            </div>
            <Button variant="outline" className="mt-4 w-full">Add IP Address</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}