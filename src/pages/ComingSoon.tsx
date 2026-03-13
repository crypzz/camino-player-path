import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';

interface Props {
  title: string;
  description: string;
}

export default function ComingSoon({ title, description }: Props) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Construction className="h-8 w-8 text-primary" />
        </div>
        <h2 className="font-display font-bold text-xl text-foreground mb-2">{title}</h2>
        <p className="text-muted-foreground text-sm max-w-md">{description}</p>
      </motion.div>
    </div>
  );
}
