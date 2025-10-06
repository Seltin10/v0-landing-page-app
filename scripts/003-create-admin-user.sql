-- Create an admin user for testing
-- Replace with your actual user ID after creating an account

-- First, create a test admin account (you'll need to sign up normally first)
-- Then run this to make that user an admin:

-- INSERT INTO public.admins (user_id, role)
-- VALUES ('YOUR_USER_ID_HERE', 'super_admin')
-- ON CONFLICT (user_id) DO NOTHING;

-- Example: After signing up with email admin@irun.com, get the user_id and insert:
-- INSERT INTO public.admins (user_id, role)
-- SELECT id, 'super_admin' FROM public.users WHERE email = 'admin@irun.com'
-- ON CONFLICT (user_id) DO NOTHING;
