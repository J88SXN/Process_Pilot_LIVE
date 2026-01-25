
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Clock, ArrowRight, Check, X } from "lucide-react";

interface AdminRequestStatsProps {
  stats: {
    total: number;
    inReview: number;
    inProgress: number;
    completed: number;
    denied: number;
  };
}

const AdminRequestStats = ({ stats }: AdminRequestStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Requests
          </CardTitle>
          <CardTitle className="text-2xl">{stats.total}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center text-sm text-muted-foreground">
            <FileText className="h-4 w-4 mr-1" />
            <span>All automation requests</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            In Review
          </CardTitle>
          <CardTitle className="text-2xl">{stats.inReview}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>Awaiting approval</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            In Progress
          </CardTitle>
          <CardTitle className="text-2xl">{stats.inProgress}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center text-sm text-muted-foreground">
            <ArrowRight className="h-4 w-4 mr-1" />
            <span>Currently working on</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Completed
          </CardTitle>
          <CardTitle className="text-2xl">{stats.completed}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center text-sm text-muted-foreground">
            <Check className="h-4 w-4 mr-1" />
            <span>Successfully delivered</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Denied
          </CardTitle>
          <CardTitle className="text-2xl">{stats.denied}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center text-sm text-muted-foreground">
            <X className="h-4 w-4 mr-1" />
            <span>Rejected requests</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRequestStats;
