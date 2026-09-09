import { DifficultyLevel } from '@/hooks/useDrills';

export interface DrillTemplate {
  name: string;
  description: string;
  difficulty_level: DifficultyLevel;
  category: DrillCategory;
}

export type DrillCategory =
  | 'Passing & Possession'
  | 'Finishing'
  | 'Dribbling & 1v1'
  | 'Defending'
  | 'Fitness & Speed'
  | 'Goalkeeping'
  | 'Warm-Up';

export const DRILL_CATEGORIES: DrillCategory[] = [
  'Warm-Up',
  'Passing & Possession',
  'Dribbling & 1v1',
  'Finishing',
  'Defending',
  'Fitness & Speed',
  'Goalkeeping',
];

export const DRILL_TEMPLATES: DrillTemplate[] = [
  // Warm-Up
  {
    name: 'Dynamic Movement Warm-Up',
    category: 'Warm-Up',
    difficulty_level: 'Beginner',
    description:
      '10 min. Jog the width of the box, then progress through high knees, heel flicks, open/close gates, lunges with rotation and 3 build-up strides. Purpose: raise heart rate and prepare hips, groin and hamstrings before ball work.',
  },
  {
    name: 'Ball Mastery Circuit',
    category: 'Warm-Up',
    difficulty_level: 'Beginner',
    description:
      '8 min. Each player with a ball in a 15x15 grid. 45s per move, 15s rest: sole rolls, toe taps, inside-inside, Cruyff turn, drag-back, step-over. Coach calls "turn" or "accelerate" at random. Purpose: touch quality and comfort under the ball.',
  },
  {
    name: 'Pass & Move Diamond',
    category: 'Warm-Up',
    difficulty_level: 'Beginner',
    description:
      '10 min. Four cones in a diamond, one player per cone plus one spare. Pass and follow your pass. Progress: two-touch, one-touch, then add a second ball. Purpose: first-touch direction and constant scanning.',
  },

  // Passing & Possession
  {
    name: 'Rondo 5v2',
    category: 'Passing & Possession',
    difficulty_level: 'Intermediate',
    description:
      '4 x 4 min. 10x10 grid, 5 outside players vs 2 defenders. Two-touch max; defenders swap when they win it or force it out. Coach points: body open, pass to the back foot, split when the gap appears. Purpose: quick decisions under pressure.',
  },
  {
    name: '4v4+3 Positional Possession',
    category: 'Passing & Possession',
    difficulty_level: 'Advanced',
    description:
      '4 x 5 min. 30x25 area, 3 neutrals always with the team in possession. 8 consecutive passes = 1 point. Neutrals limited to two touches. Purpose: creating and using overloads, switching the point of attack.',
  },
  {
    name: 'Third-Man Runs',
    category: 'Passing & Possession',
    difficulty_level: 'Advanced',
    description:
      '15 min. Player A plays into a bounce player B, who sets to C running beyond. Rotate positions after every rep, both sides. Purpose: recognise and time the third-man run to break lines.',
  },
  {
    name: 'Switch the Play Grid',
    category: 'Passing & Possession',
    difficulty_level: 'Intermediate',
    description:
      '12 min. Two 15x15 grids separated by a 10m channel. 4v2 in one grid; after 4 passes the ball must be driven or lofted to the other grid where a new 4v2 starts. Purpose: recognising when to switch and quality of the long pass.',
  },

  // Dribbling & 1v1
  {
    name: '1v1 to Two Gates',
    category: 'Dribbling & 1v1',
    difficulty_level: 'Intermediate',
    description:
      '10 min. 12x12 area with two 2m gates on the defender end. Attacker scores by dribbling through either gate; defender scores by winning it and dribbling out. 30s rounds, rotate. Purpose: change of direction, feints, attacking the defender at speed.',
  },
  {
    name: 'Take-On Corridors',
    category: 'Dribbling & 1v1',
    difficulty_level: 'Beginner',
    description:
      '10 min. Three 5m-wide lanes with a mannequin/passive defender mid-lane. Player attacks with a chosen move (step-over, scissor, body feint), then accelerates 5m out. 3 sets per move each foot. Purpose: build a repeatable go-to move.',
  },
  {
    name: '2v1 Attacking Waves',
    category: 'Dribbling & 1v1',
    difficulty_level: 'Intermediate',
    description:
      '15 min. Continuous waves of two attackers vs one defender into a goal with keeper. 8s to finish. Coach points: commit the defender before releasing, run the far post. Purpose: decision-making in numerical advantage.',
  },

  // Finishing
  {
    name: 'Finishing Under Fatigue',
    category: 'Finishing',
    difficulty_level: 'Intermediate',
    description:
      '15 min. Sprint 15m around a cone, receive a served ball, finish first-time from the edge of the box. Alternate near/far post servers. 6 reps x 3 sets. Purpose: composure and technique with a raised heart rate.',
  },
  {
    name: 'Cross & Finish Patterns',
    category: 'Finishing',
    difficulty_level: 'Intermediate',
    description:
      '20 min. Wide player receives, drives to the byline and crosses. Three runners attack near post, penalty spot and back post. Alternate left and right, mix cut-backs with whipped crosses. Purpose: box timing and attacking the ball.',
  },
  {
    name: 'One-Touch Finishing Gate',
    category: 'Finishing',
    difficulty_level: 'Advanced',
    description:
      '12 min. Two servers on the edge of the box, striker checks away then to the ball, one-touch finish only. Alternate side of the serve every rep. 10 reps per player. Purpose: clean strike technique and shot placement.',
  },
  {
    name: 'Small-Sided Shooting Game',
    category: 'Finishing',
    difficulty_level: 'Beginner',
    description:
      '4 x 4 min. 30x20 pitch, two goals with keepers, 4v4. Goals only count from inside the shooting zone. Purpose: high shot volume in a game context.',
  },

  // Defending
  {
    name: 'Pressing Triggers 3v3',
    category: 'Defending',
    difficulty_level: 'Advanced',
    description:
      '4 x 4 min. 25x20 area. Defending team must press as a unit on the trigger: a backwards pass or a poor touch. Win it inside 6s = 2 points. Purpose: collective pressing and recognising the moment to jump.',
  },
  {
    name: '1v1 Defending Channel',
    category: 'Defending',
    difficulty_level: 'Beginner',
    description:
      '10 min. 10x8 channel. Defender passes in and closes down, showing the attacker to the touchline. Approach, slow, side-on, patient. 30s rounds, rotate. Purpose: individual defending shape and timing of the tackle.',
  },
  {
    name: 'Back Four Shifting',
    category: 'Defending',
    difficulty_level: 'Intermediate',
    description:
      '15 min. Four defenders and a keeper against four servers passing across the top. Defensive line shifts, presses the nearest server and drops together on the switch. Purpose: line discipline, distances and communication.',
  },
  {
    name: 'Recovery Runs 2v2',
    category: 'Defending',
    difficulty_level: 'Intermediate',
    description:
      '12 min. Attackers start with a 5m head start on goal; defenders begin from a lying or seated position. Purpose: sprint recovery, goal-side positioning and delaying the attack.',
  },

  // Fitness & Speed
  {
    name: 'Repeated Sprint Ability',
    category: 'Fitness & Speed',
    difficulty_level: 'Advanced',
    description:
      '6 x 30m maximum sprints, 25s recovery between reps, 3 min between sets, 2 sets. Log times to track fatigue drop-off. Purpose: repeat-sprint capacity for match demands.',
  },
  {
    name: 'Agility Ladder & Cone Weave',
    category: 'Fitness & Speed',
    difficulty_level: 'Beginner',
    description:
      '10 min. Ladder sequence (one foot, two feet, lateral in-out), then a 5-cone weave and 10m sprint out. 6 reps. Purpose: foot speed, coordination and acceleration mechanics.',
  },
  {
    name: 'Small-Sided Conditioning 4v4',
    category: 'Fitness & Speed',
    difficulty_level: 'Intermediate',
    description:
      '6 x 3 min with 90s rest. 30x25 pitch, four mini goals, no keepers. Balls always ready around the pitch for instant restarts. Purpose: game-specific aerobic load.',
  },
  {
    name: 'Change of Direction T-Test',
    category: 'Fitness & Speed',
    difficulty_level: 'Intermediate',
    description:
      '10 min. Standard T-shape: 10m sprint, 5m shuffle left, 10m shuffle right, 5m back, backpedal 10m. 4 reps with full recovery, record best time. Purpose: lateral quickness and deceleration control.',
  },

  // Goalkeeping
  {
    name: 'Handling & Set Position',
    category: 'Goalkeeping',
    difficulty_level: 'Beginner',
    description:
      '12 min. Servers strike from 12m at varied heights. Keeper resets to set position between every save; W-hands high, scoop low. 3 sets of 10. Purpose: clean handling and consistent set position.',
  },
  {
    name: 'Shot Stopping & Reaction Saves',
    category: 'Goalkeeping',
    difficulty_level: 'Intermediate',
    description:
      '15 min. First shot from distance, immediate rebound served to either side, then a close-range reaction save. 8 sequences with 45s rest. Purpose: recovery speed and reaction handling.',
  },
  {
    name: 'Distribution & Playing Out',
    category: 'Goalkeeping',
    difficulty_level: 'Intermediate',
    description:
      '12 min. Keeper receives back-passes under light pressure and distributes to targets: short to full-back, into midfield, long to the wing. Both feet. Purpose: composure and range in build-up.',
  },
];
