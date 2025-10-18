
export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  email?: string;
}

export interface Request {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  estimated_cost: number | null;
}

export interface RequestWithProfile extends Request {
  profile?: Profile | null;
}
