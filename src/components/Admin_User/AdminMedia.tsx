import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { CheckCircle, XCircle, Eye, Download, Trash2, AlertTriangle, X } from 'lucide-react';
import { moderationQueue } from './mockdata/adminMockData';
import { useAdmin } from './AdminContext';

export function AdminMedia() {
  const { hasPermission } = useAdmin();
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [showModerationDialog, setShowModerationDialog] = useState(false);
  const [moderationReason, setModerationReason] = useState('');
  const [compressionQuality, setCompressionQuality] = useState(80);

  const handleModerate = (item: any) => {
    setSelectedMedia(item);
    setShowModerationDialog(true);
  };

  const handleApprove = () => {
    console.log('Approved media:', selectedMedia.id);
    setShowModerationDialog(false);
    setModerationReason('');
  };

  const handleDelete = () => {
    console.log('Deleted media:', selectedMedia.id, 'Reason:', moderationReason);
    setShowModerationDialog(false);
    setModerationReason('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-gray-900">Content Moderation (Photos & Media)</h2>
      </div>

      <Tabs defaultValue="moderation" className="w-full">
        <TabsList>
          <TabsTrigger value="moderation">
            Moderation Queue
            {moderationQueue.filter(m => m.type === 'photo' && m.status === 'pending').length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {moderationQueue.filter(m => m.type === 'photo' && m.status === 'pending').length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="optimization">Image Optimization</TabsTrigger>
          <TabsTrigger value="storage">Storage Management</TabsTrigger>
        </TabsList>

        <TabsContent value="moderation" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Pending Media Items</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {moderationQueue
                .filter(item => item.type === 'photo' && item.status === 'pending')
                .map((item) => (
                  <Card key={item.id} className="p-4 border-2 border-yellow-200">
                    <div className="aspect-video bg-gray-100 rounded overflow-hidden mb-3">
                      <img
                        src={item.content.url}
                        alt="Moderation item"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <Badge variant="destructive">{item.reportReason}</Badge>
                      <p className="text-gray-900">
                        Provider: {item.content.provider}
                      </p>
                      <p className="text-gray-600">
                        Uploaded: {new Date(item.content.uploadedAt).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600">
                        Reported: {new Date(item.reportedAt).toLocaleTimeString()}
                      </p>
                      {hasPermission('moderateMedia') && (
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="default"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              setSelectedMedia(item);
                              handleApprove();
                            }}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleModerate(item)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleModerate(item)}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Recently Approved Media</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded overflow-hidden relative group">
                  <img
                    src={`https://images.unsplash.com/photo-${1580000000000 + i * 100000}?w=200&h=200&fit=crop`}
                    alt={`Media ${i}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 text-white">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Image Compression Settings</h3>
            <div className="space-y-6">
              <div>
                <Label>Compression Quality (%)</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Slider
                    value={[compressionQuality]}
                    onValueChange={(value) => setCompressionQuality(value[0])}
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-gray-900 w-16 text-right">{compressionQuality}%</span>
                </div>
                <p className="text-gray-600 mt-2">
                  Higher quality = larger file size. Recommended: 80%
                </p>
              </div>

              <div>
                <Label>Maximum Dimensions</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div>
                    <Label className="text-gray-600">Width (px)</Label>
                    <input
                      type="number"
                      defaultValue="1920"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-600">Height (px)</Label>
                    <input
                      type="number"
                      defaultValue="1080"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <Label>Auto-compress on upload</Label>
                  <p className="text-gray-600">Automatically compress images when uploaded</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Bulk Optimization</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-1" />
                <div className="flex-1">
                  <p className="text-gray-900 mb-1">
                    Re-compress Existing Images
                  </p>
                  <p className="text-gray-600 mb-3">
                    This will re-compress all existing images using current settings. 
                    Estimated time: 15-30 minutes. This cannot be undone.
                  </p>
                  <Button variant="outline">
                    Start Bulk Compression Job
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-gray-600">Images in library</span>
                  <span className="text-gray-900">1,247</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-gray-600">Average file size</span>
                  <span className="text-gray-900">542 KB</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-gray-600">Potential savings</span>
                  <span className="text-green-600">~35% (184 MB)</span>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="storage" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <h4 className="text-gray-900 mb-2">Total Storage</h4>
              <p className="text-gray-900 mb-1">678 MB</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '68%' }} />
              </div>
              <p className="text-gray-600 mt-2">68% of 1GB quota</p>
            </Card>

            <Card className="p-6">
              <h4 className="text-gray-900 mb-2">Images</h4>
              <p className="text-gray-900 mb-1">1,247 files</p>
              <p className="text-gray-600">623 MB</p>
            </Card>

            <Card className="p-6">
              <h4 className="text-gray-900 mb-2">Other Files</h4>
              <p className="text-gray-900 mb-1">89 files</p>
              <p className="text-gray-600">55 MB</p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Storage Cleanup</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded">
                <Trash2 className="w-5 h-5 text-gray-600 mt-1" />
                <div className="flex-1">
                  <p className="text-gray-900 mb-1">
                    Remove Unused Files
                  </p>
                  <p className="text-gray-600 mb-3">
                    Delete files that haven't been accessed in 365+ days
                  </p>
                  <div className="flex items-center gap-4">
                    <Button variant="outline">Scan for Unused Files</Button>
                    <span className="text-gray-600">Last scan: 7 days ago</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-gray-600">Files older than 1 year</span>
                  <span className="text-gray-900">234 files (45 MB)</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-gray-600">Orphaned files</span>
                  <span className="text-gray-900">12 files (3.2 MB)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Duplicate files</span>
                  <span className="text-gray-900">8 files (2.1 MB)</span>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Media Moderation Dialog */}
      {showModerationDialog && selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowModerationDialog(false)}>
          <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-gray-900">Media Moderation</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowModerationDialog(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="aspect-video bg-gray-100 rounded overflow-hidden">
                  <img
                    src={selectedMedia.content.url}
                    alt="Moderation item"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Report Reason</Label>
                    <p className="text-gray-900 mt-1">{selectedMedia.reportReason}</p>
                  </div>
                  <div>
                    <Label>Provider</Label>
                    <p className="text-gray-900 mt-1">{selectedMedia.content.provider}</p>
                  </div>
                  <div>
                    <Label>Uploaded</Label>
                    <p className="text-gray-900 mt-1">
                      {new Date(selectedMedia.content.uploadedAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <Label>Reported</Label>
                    <p className="text-gray-900 mt-1">
                      {new Date(selectedMedia.reportedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div>
                  <Label>Moderation Notes (Optional)</Label>
                  <Textarea
                    placeholder="Enter notes or reason for your decision..."
                    value={moderationReason}
                    onChange={(e) => setModerationReason(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 mt-6 justify-end">
                <Button variant="outline" onClick={() => setShowModerationDialog(false)}>
                  Cancel
                </Button>
                <Button variant="default" onClick={handleApprove}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}