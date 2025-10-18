
import { NavigateFunction } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { RequestWithProfile } from "@/types/requests";

interface RequestTableProps {
  requests: RequestWithProfile[];
  navigate: NavigateFunction;
  showStatus: boolean;
  showActions: boolean;
  onApprove?: (id: string) => void;
  onDeny?: (id: string) => void;
}

const RequestTable = ({ 
  requests, 
  navigate, 
  showStatus, 
  showActions,
  onApprove,
  onDeny 
}: RequestTableProps) => {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Title</TableHead>
              {showStatus && <TableHead>Status</TableHead>}
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.id.substring(0, 8)}...</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>
                      {request.profile?.first_name || ''} {request.profile?.last_name || ''}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {request.profile?.company || ''}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{request.title}</TableCell>
                {showStatus && (
                  <TableCell>
                    <Badge variant={
                      request.status === "In Review" ? "secondary" :
                      request.status === "Approved" ? "outline" :
                      request.status === "In Progress" ? "default" :
                      request.status === "Completed" ? "default" :
                      "destructive"
                    }>
                      {request.status}
                    </Badge>
                  </TableCell>
                )}
                <TableCell>
                  {new Date(request.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => navigate(`/admin/request/${request.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                    
                    {showActions && request.status === "In Review" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => onApprove && onApprove(request.id)}
                        >
                          Approve
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => onDeny && onDeny(request.id)}
                        >
                          Deny
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RequestTable;
