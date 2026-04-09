import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnnouncementsTab } from '@/components/communications/AnnouncementsTab';
import { MessagesTab } from '@/components/communications/MessagesTab';
import { TeamChatTab } from '@/components/communications/TeamChatTab';
import { FeedbackTab } from '@/components/communications/FeedbackTab';
import { Megaphone, MessageSquare, Users, ClipboardCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CommunicationsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="mb-6">
        <h1 className="text-xl font-display font-bold text-foreground">Communication Hub</h1>
        <p className="text-sm text-muted-foreground mt-1">Announcements, messages, team chat & player feedback — all in one place.</p>
      </div>

      <Tabs defaultValue="announcements" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="announcements" className="gap-1.5 text-[13px]"><Megaphone className="h-3.5 w-3.5" /> Announcements</TabsTrigger>
          <TabsTrigger value="messages" className="gap-1.5 text-[13px]"><MessageSquare className="h-3.5 w-3.5" /> Messages</TabsTrigger>
          <TabsTrigger value="team-chat" className="gap-1.5 text-[13px]"><Users className="h-3.5 w-3.5" /> Team Chat</TabsTrigger>
          <TabsTrigger value="feedback" className="gap-1.5 text-[13px]"><ClipboardCheck className="h-3.5 w-3.5" /> Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="announcements"><AnnouncementsTab /></TabsContent>
        <TabsContent value="messages"><MessagesTab /></TabsContent>
        <TabsContent value="team-chat"><TeamChatTab /></TabsContent>
        <TabsContent value="feedback"><FeedbackTab /></TabsContent>
      </Tabs>
    </motion.div>
  );
}
