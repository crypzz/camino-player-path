import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreatePlayer } from '@/hooks/usePlayers';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CANADIAN_CITIES, AGE_GROUPS } from '@/lib/constants';

const positions = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST', 'CF'];
const teams = ['U12', 'U13', 'U14', 'U15', 'U16', 'U17', 'U18', 'U19', 'First Team'];
const feet = ['Left', 'Right', 'Both'] as const;

const defaultMetrics = {
  technical: { 'First Touch': 5, 'Ball Control': 5, 'Passing Accuracy': 5, 'Dribbling': 5, 'Shooting Technique': 5, 'Weak Foot': 5, '1v1 Attacking': 5, '1v1 Defending': 5 },
  tactical: { 'Positioning': 5, 'Decision Making': 5, 'Off-Ball Movement': 5, 'Defensive Awareness': 5, 'Game Understanding': 5 },
  physical: { '10m Sprint': 5, '30m Sprint': 5, 'Agility': 5, 'Vertical Jump': 5, 'Endurance': 5 },
  mental: { 'Confidence': 5, 'Work Ethic': 5, 'Coachability': 5, 'Leadership': 5, 'Resilience': 5 },
};

const schema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  age: z.coerce.number().int().min(5, 'Min age is 5').max(25, 'Max age is 25'),
  position: z.string().min(1, 'Select a position'),
  team: z.string().min(1, 'Select a team'),
  nationality: z.string().trim().max(60).optional(),
  preferredFoot: z.enum(['Left', 'Right', 'Both']),
  height: z.coerce.number().int().min(100, 'Min 100 cm').max(220, 'Max 220 cm'),
  weight: z.coerce.number().int().min(25, 'Min 25 kg').max(120, 'Max 120 kg'),
  location: z.string().optional(),
  ageGroup: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function AddPlayerDialog() {
  const [open, setOpen] = useState(false);
  const createPlayer = useCreatePlayer();
  const { user } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      age: 14,
      position: '',
      team: '',
      nationality: '',
      preferredFoot: 'Right',
      height: 170,
      weight: 65,
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!user) return;
    try {
      await createPlayer.mutateAsync({
        ...defaultMetrics,
        name: values.name,
        age: values.age,
        position: values.position,
        team: values.team,
        nationality: values.nationality || '',
        preferredFoot: values.preferredFoot,
        height: values.height,
        weight: values.weight,
        avatar: '',
        joinDate: new Date().toISOString().split('T')[0],
        attendance: 0,
        overallRating: 0,
      });
      toast.success(`${values.name} added successfully!`);
      form.reset();
      setOpen(false);
    } catch (e: any) {
      toast.error(e.message || 'Failed to add player');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Player
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Player</DialogTitle>
          <DialogDescription>Fill in the player details below. Metrics default to 5/10 and can be adjusted later.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl><Input placeholder="e.g. Marcus Johnson" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="age" render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="nationality" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nationality</FormLabel>
                  <FormControl><Input placeholder="e.g. USA" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="position" render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {positions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="team" render={({ field }) => (
                <FormItem>
                  <FormLabel>Team</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {teams.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <FormField control={form.control} name="preferredFoot" render={({ field }) => (
                <FormItem>
                  <FormLabel>Foot</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      {feet.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="height" render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (cm)</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="weight" render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <Button type="submit" className="w-full" disabled={createPlayer.isPending}>
              {createPlayer.isPending ? 'Adding...' : 'Add Player'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
