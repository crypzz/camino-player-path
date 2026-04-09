
-- Trigger: auto-notify on new announcement
CREATE OR REPLACE FUNCTION public.notify_on_announcement()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert a notification for every user except the creator
  INSERT INTO public.notifications (user_id, type, title, body, reference_id)
  SELECT p.user_id, 'announcement', NEW.title,
         LEFT(NEW.content, 120),
         NEW.id
  FROM public.profiles p
  WHERE p.user_id != NEW.created_by;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_announcement
AFTER INSERT ON public.announcements
FOR EACH ROW
EXECUTE FUNCTION public.notify_on_announcement();

-- Trigger: auto-notify on new message
CREATE OR REPLACE FUNCTION public.notify_on_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  conv_title text;
  sender_name text;
BEGIN
  SELECT COALESCE(c.title, 'Direct Message') INTO conv_title
  FROM public.conversations c WHERE c.id = NEW.conversation_id;

  SELECT COALESCE(p.display_name, 'Someone') INTO sender_name
  FROM public.profiles p WHERE p.user_id = NEW.sender_id;

  INSERT INTO public.notifications (user_id, type, title, body, reference_id)
  SELECT cp.user_id, 'message',
         sender_name || ' sent a message',
         LEFT(NEW.content, 120),
         NEW.conversation_id
  FROM public.conversation_participants cp
  WHERE cp.conversation_id = NEW.conversation_id
    AND cp.user_id != NEW.sender_id;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_message
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.notify_on_message();

-- Trigger: auto-notify on new player feedback
CREATE OR REPLACE FUNCTION public.notify_on_feedback()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  player_name text;
  player_owner uuid;
  coach_name text;
BEGIN
  SELECT pl.name, pl.created_by INTO player_name, player_owner
  FROM public.players pl WHERE pl.id = NEW.player_id;

  SELECT COALESCE(p.display_name, 'Coach') INTO coach_name
  FROM public.profiles p WHERE p.user_id = NEW.coach_id;

  -- Notify the player's owner (the coach/parent who created the player profile)
  IF player_owner IS NOT NULL AND player_owner != NEW.coach_id THEN
    INSERT INTO public.notifications (user_id, type, title, body, reference_id)
    VALUES (player_owner, 'feedback',
            'New feedback for ' || COALESCE(player_name, 'a player'),
            coach_name || ' left feedback: ' || LEFT(COALESCE(NEW.strengths, NEW.improvements, ''), 100),
            NEW.id);
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_feedback
AFTER INSERT ON public.player_feedback
FOR EACH ROW
EXECUTE FUNCTION public.notify_on_feedback();
