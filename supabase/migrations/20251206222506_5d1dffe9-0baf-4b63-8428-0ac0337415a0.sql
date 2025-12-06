-- Create function to add user as admin on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_users (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

-- Create trigger to run after user signup
CREATE TRIGGER on_auth_user_created_add_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_admin();