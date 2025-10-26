import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Globe, Play, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { translationJobs } from './mockdata/adminMockData';
import { useLanguage } from '../context/LanguageContext';

const uiStrings = {
  'search_placeholder': {
    en: 'Search by skill or location...',
    zu: 'Sesha ngamakhono noma indawo...',
    xh: 'Khangela ngesakhono okanye indawo...',
    af: 'Soek volgens vaardigheid of ligging...',
  },
  'filter_by': {
    en: 'Filter by',
    zu: 'Hlunga nge',
    xh: 'Hlola nge',
    af: 'Filtreer volgens',
  },
  'contact': {
    en: 'Contact',
    zu: 'Xhumana',
    xh: 'Qhagamshelana',
    af: 'Kontak',
  },
};

export function AdminTranslations() {
  const { language, setLanguage } = useLanguage();
  const [selectedJobType, setSelectedJobType] = useState('profiles');
  const [apiEndpoint, setApiEndpoint] = useState('https://libretranslate.com/translate');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'running':
        return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      completed: 'default',
      running: 'secondary',
      failed: 'destructive',
      pending: 'outline',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-gray-900">Multilingual & Localization</h2>
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-400" />
          <Select value={language} onValueChange={(val) => setLanguage(val as any)}>
            <option value="en">English</option>
            <option value="zu">Zulu</option>
            <option value="xh">Xhosa</option>
            <option value="af">Afrikaans</option>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="jobs" className="w-full">
        <TabsList>
          <TabsTrigger value="jobs">Translation Jobs</TabsTrigger>
          <TabsTrigger value="strings">UI Strings</TabsTrigger>
          <TabsTrigger value="settings">API Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-gray-900">Start New Translation Job</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label>Content Type</Label>
                <Select value={selectedJobType} onValueChange={(val) => setSelectedJobType(val)} >
                  <option value="ui">UI Strings</option>
                  <option value="profiles">Provider Profiles</option>
                  <option value="reviews">Reviews</option>
                </Select>
              </div>
              <div>
                <Label>Source Language</Label>
                <Select defaultValue="en">
                  <option value="en">English</option>
                </Select>
              </div>
              <div>
                <Label>Target Languages</Label>
                <Select defaultValue="all" >
                  <option value="all">All Languages</option>
                  <option value="zu">Zulu</option>
                  <option value="xh">Xhosa</option>
                  <option value="af">Afrikaans</option>
                </Select>
              </div>
            </div>
            <Button className="w-full">
              <Play className="w-4 h-4 mr-2" />
              Start Translation Job
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Recent Translation Jobs</h3>
            <div className="space-y-4">
              {translationJobs.map((job) => (
                <Card key={job.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(job.status)}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-gray-900">
                            {job.type.charAt(0).toUpperCase() + job.type.slice(1)} Translation
                          </p>
                          {getStatusBadge(job.status)}
                        </div>
                        <p className="text-gray-600">
                          {job.totalItems} items • Started{' '}
                          {new Date(job.startedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {job.status === 'running' && (
                      <Button variant="outline" size="sm">
                        Cancel
                      </Button>
                    )}
                  </div>
                  
                  <Progress value={job.progress} className="mb-2" />
                  <p className="text-gray-600">
                    Progress: {job.progress}% ({Math.floor(job.totalItems * job.progress / 100)} / {job.totalItems})
                  </p>

                  {job.errors && job.errors.length > 0 && (
                    <div className="mt-3 p-3 bg-red-50 rounded">
                      <p className="text-red-900 mb-2">Errors:</p>
                      {job.errors.map((error, idx) => (
                        <p key={idx} className="text-red-700">• {error}</p>
                      ))}
                    </div>
                  )}

                  {job.completedAt && (
                    <p className="text-gray-600 mt-2">
                      Completed: {new Date(job.completedAt).toLocaleString()}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="strings" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">UI String Translations</h3>
            <div className="space-y-6">
              {Object.entries(uiStrings).map(([key, translations]) => (
                <div key={key} className="border-b pb-4 last:border-0">
                  <Label className="text-gray-900 mb-3 block">
                    {key.replace(/_/g, ' ').toUpperCase()}
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(translations).map(([lang, text]) => (
                      <div key={lang}>
                        <Label className="text-gray-600">
                          {lang === 'en' ? 'English' : lang === 'zu' ? 'Zulu' : lang === 'xh' ? 'Xhosa' : 'Afrikaans'}
                        </Label>
                        <Input
                          value={text}
                          className="mt-1"
                          readOnly
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Re-translate All Strings
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">LibreTranslate API Configuration</h3>
            <div className="space-y-4">
              <div>
                <Label>API Endpoint</Label>
                <Input
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                  placeholder="https://libretranslate.com/translate"
                  className="mt-1"
                />
                <p className="text-gray-600 mt-1">
                  Leave blank to use default LibreTranslate endpoint
                </p>
              </div>
              <div>
                <Label>API Key (Optional)</Label>
                <Input
                  type="password"
                  placeholder="Your API key..."
                  className="mt-1"
                />
                <p className="text-gray-600 mt-1">
                  Required for private instances or higher rate limits
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="self-hosted" className="rounded" />
                <Label htmlFor="self-hosted">Self-hosted instance</Label>
              </div>
              <Button>Test Connection</Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Translation Cache Settings</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Cached Translations</span>
                <span className="text-gray-900">1,247 strings</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Cache Hit Rate</span>
                <span className="text-gray-900">94.3%</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Storage Used</span>
                <span className="text-gray-900">2.4 MB</span>
              </div>
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Clear Translation Cache
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}