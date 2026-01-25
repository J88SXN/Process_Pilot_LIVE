-- Fix profile exposure: Replace public view policy with owner-only and admin access
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add DELETE policy for payments (admin-only)
CREATE POLICY "Only admins can delete payments" ON public.payments
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));