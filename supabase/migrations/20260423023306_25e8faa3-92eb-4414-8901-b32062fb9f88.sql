CREATE OR REPLACE FUNCTION public.get_signup_email_status(_email text)
RETURNS TABLE(status text, error_message text, created_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT esl.status, esl.error_message, esl.created_at
  FROM public.email_send_log esl
  WHERE lower(esl.recipient_email) = lower(_email)
    AND esl.template_name = 'signup'
  ORDER BY esl.created_at DESC
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_signup_email_status(text) TO anon, authenticated;