export const CANADIAN_CITIES = [
  'Calgary', 'Edmonton', 'Vancouver', 'Toronto', 'Montreal',
  'Ottawa', 'Winnipeg', 'Saskatoon', 'Regina', 'Halifax',
  'Victoria', 'Hamilton', 'Kitchener', 'London', 'Quebec City',
  'St. John\'s', 'Kelowna', 'Barrie', 'Sherbrooke', 'Guelph',
  'Lethbridge', 'Red Deer', 'Kamloops', 'Thunder Bay', 'Sudbury',
] as const;

export const AGE_GROUPS = [
  'U10', 'U11', 'U12', 'U13', 'U14', 'U15', 'U16', 'U17', 'U18', 'U19', 'U21', 'Senior',
] as const;

export type CanadianCity = typeof CANADIAN_CITIES[number];
export type AgeGroup = typeof AGE_GROUPS[number];
