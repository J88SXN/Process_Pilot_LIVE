import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  FileText,
  Zap,
  Settings,
  Rocket
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ActivityType =
  | "request_created"
  | "under_review"
  | "quote_sent"
  | "approved"
  | "development_started"
  | "milestone_completed"
  | "testing_phase"
  | "deployed"
  | "comment"
  | "status_change";

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  metadata?: Record<string, any>;
}

interface ActivityTimelineProps {
  requestId: string;
  activities: Activity[];
}

const getActivityIcon = (type: ActivityType) => {
  const iconClass = "w-5 h-5";

  switch (type) {
    case "request_created":
      return <FileText className={iconClass} />;
    case "under_review":
      return <Clock className={iconClass} />;
    case "quote_sent":
      return <MessageSquare className={iconClass} />;
    case "approved":
      return <CheckCircle2 className={iconClass} />;
    case "development_started":
      return <Settings className={cn(iconClass, "animate-spin")} />;
    case "milestone_completed":
      return <Zap className={iconClass} />;
    case "testing_phase":
      return <AlertCircle className={iconClass} />;
    case "deployed":
      return <Rocket className={iconClass} />;
    case "comment":
      return <MessageSquare className={iconClass} />;
    default:
      return <Clock className={iconClass} />;
  }
};

const getActivityColor = (type: ActivityType) => {
  switch (type) {
    case "request_created":
      return "bg-blue-500";
    case "under_review":
      return "bg-yellow-500";
    case "quote_sent":
      return "bg-purple-500";
    case "approved":
      return "bg-green-500";
    case "development_started":
      return "bg-indigo-500";
    case "milestone_completed":
      return "bg-primary";
    case "testing_phase":
      return "bg-orange-500";
    case "deployed":
      return "bg-green-600";
    case "comment":
      return "bg-gray-500";
    default:
      return "bg-gray-400";
  }
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

const ActivityTimeline = ({ requestId, activities }: ActivityTimelineProps) => {
  const [expandedActivities, setExpandedActivities] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedActivities(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
        <CardDescription>
          Real-time updates on your automation project
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No activity yet. We'll update you as soon as we start working on your request.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-border" />

            <div className="space-y-6">
              {activities.map((activity, index) => (
                <div key={activity.id} className="relative pl-14">
                  {/* Timeline dot */}
                  <div
                    className={cn(
                      "absolute left-3 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white",
                      getActivityColor(activity.type),
                      index === 0 && "ring-4 ring-primary/20"
                    )}
                  >
                    {getActivityIcon(activity.type)}
                  </div>

                  {/* Activity content */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {activity.description}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTimestamp(activity.timestamp)}
                      </span>
                    </div>

                    {activity.user && (
                      <p className="text-xs text-muted-foreground">
                        by {activity.user}
                      </p>
                    )}

                    {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                      <button
                        onClick={() => toggleExpanded(activity.id)}
                        className="text-xs text-primary hover:underline"
                      >
                        {expandedActivities.has(activity.id) ? "Hide details" : "Show details"}
                      </button>
                    )}

                    {expandedActivities.has(activity.id) && activity.metadata && (
                      <div className="mt-2 p-3 bg-muted rounded-md text-xs space-y-1">
                        {Object.entries(activity.metadata).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span>
                            <span className="text-muted-foreground">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;
