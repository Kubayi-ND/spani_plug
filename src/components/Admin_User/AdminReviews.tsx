import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { CheckCircle, XCircle, Flag, Star, AlertTriangle, X } from 'lucide-react';
import { moderationQueue, ratingDistribution } from './adminMockData';
import { useAdmin } from './AdminContext';

export function AdminReviews() {
  const { hasPermission } = useAdmin();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showModerationDialog, setShowModerationDialog] = useState(false);
  const [moderationReason, setModerationReason] = useState('');

  const handleModerate = (item: any) => {
    setSelectedItem(item);
    setShowModerationDialog(true);
  };

  const handleApprove = () => {
    console.log('Approved:', selectedItem.id);
    setShowModerationDialog(false);
    setModerationReason('');
  };

  const handleReject = () => {
    console.log('Rejected:', selectedItem.id, 'Reason:', moderationReason);
    setShowModerationDialog(false);
    setModerationReason('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-gray-900">Reviews & Trust Layer</h2>
      </div>

      <Tabs defaultValue="moderation" className="w-full">
        <TabsList>
          <TabsTrigger value="moderation">
            Moderation Queue
            {moderationQueue.filter(m => m.status === 'pending').length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {moderationQueue.filter(m => m.status === 'pending').length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="moderation" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Pending Reviews</h3>
            <div className="space-y-4">
              {moderationQueue
                .filter(item => item.type === 'review' && item.status === 'pending')
                .map((item) => (
                  <Card key={item.id} className="p-4 border-l-4 border-l-yellow-500">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="destructive">{item.reportReason}</Badge>
                          <span className="text-gray-600">
                            Reported {new Date(item.reportedAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-gray-900">
                          Review for: {item.content.provider}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < item.content.rating
                                ? 'fill-yellow-500 text-yellow-500'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-900 mb-3 bg-gray-50 p-3 rounded">
                      "{item.content.text}"
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-600">By: {item.content.author}</p>
                      {hasPermission('moderateReviews') && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleModerate(item)}
                          >
                            <Flag className="w-4 h-4 mr-2" />
                            Review
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(item);
                              handleApprove();
                            }}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleModerate(item)}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-gray-900 mb-4">Rating Distribution</h3>
              <div className="space-y-3">
                {ratingDistribution.map((item) => (
                  <div key={item.rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-gray-900">{item.rating}</span>
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                      <div
                        className="bg-yellow-500 h-full rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-gray-900">
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-gray-900 mb-4">Review Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Total Reviews</span>
                  <span className="text-gray-900">723</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Average Rating</span>
                  <span className="text-gray-900">4.6 ★</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Pending Moderation</span>
                  <Badge variant="destructive">
                    {moderationQueue.filter(m => m.type === 'review' && m.status === 'pending').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Flagged Reviews</span>
                  <Badge variant="outline">12</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">This Week</span>
                  <span className="text-gray-900">+34 new reviews</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Suspicious Patterns Detection</h3>
            <div className="space-y-3">
              <Card className="p-4 border-l-4 border-l-orange-500">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-500 mt-1" />
                  <div>
                    <p className="text-gray-900 mb-1">
                      Multiple 5-star reviews from same IP
                    </p>
                    <p className="text-gray-600">
                      Provider "Joe's Plumbing" received 8 reviews from IP 197.184.xxx.xxx
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Investigate
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-l-4 border-l-orange-500">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-500 mt-1" />
                  <div>
                    <p className="text-gray-900 mb-1">
                      Potential review bombing detected
                    </p>
                    <p className="text-gray-600">
                      Provider "Sarah's Cleaning" received 12 negative reviews in 24 hours
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Investigate
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-l-4 border-l-green-500">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <p className="text-gray-900">No other suspicious patterns detected</p>
                  </div>
                </div>
              </Card>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Moderation Dialog */}
      {showModerationDialog && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowModerationDialog(false)}>
          <Card className="max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-gray-900">Review Moderation</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowModerationDialog(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Review Content</Label>
                  <div className="mt-2 p-3 bg-gray-50 rounded">
                    <p className="text-gray-900">"{selectedItem.content.text}"</p>
                  </div>
                </div>
                <div>
                  <Label>Report Reason</Label>
                  <p className="text-gray-900 mt-1">{selectedItem.reportReason}</p>
                </div>
                <div>
                  <Label>Moderation Reason (Optional)</Label>
                  <Textarea
                    placeholder="Enter reason for your decision..."
                    value={moderationReason}
                    onChange={(e) => setModerationReason(e.target.value)}
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
                <Button variant="destructive" onClick={handleReject}>
                  <XCircle className="w-4 h-4 mr-2" />
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