import type { Education } from 'types';

/**
 * Static profile content (About Me + Education).
 *
 * Projects, certificates and skills are managed through the admin panel and
 * served by the API; the content below changes rarely and lives in code.
 */
export const profile = {
  name: { first: 'Ahmad', highlight: 'Sani', last: 'Jabarulloh' },
  fullName: 'Ahmad Sani Jabarulloh',
  brand: { primary: 'San', accent: 'Dev' },
  role: 'Frontend Developer',
  specialties: ['React.js', 'Next.js', 'Node.js'],
  taglineSuffix:
    'I transform complex ideas into elegant, high-performance web experiences.',
  about: {
    heading: 'Passionate Frontend Developer Based in West Bandung',
    bio:
      'I am a dedicated Frontend Developer with a focus on the modern JavaScript ecosystem. ' +
      'With expertise in building responsive, interactive, and high-performance web applications ' +
      'using React.js and Next.js, I am passionate about learning new technologies and always ' +
      'strive to implement best practices in every project I undertake.',
    facts: [
      { label: 'Modern Stack', value: 'Next.js & Tailwind CSS' },
      { label: 'Location', value: 'West Bandung, ID' },
    ],
    experience: { value: '2+', label: 'Years Exp' },
  },
  location: 'West Bandung, ID',
  photo: '/profile/profile.png',
  cvUrl: '/CV/CV-Ahmad_Sani_Jabarulloh-Web_Developer.pdf',
  email: 'ahmadsanijabarulloh.02@gmail.com',
  socials: {
    github: 'https://github.com/ahmadsanny02',
    linkedin: 'https://linkedin.com/in/ahmadsanny02',
    instagram: 'https://instagram.com/ahmadsanny02',
  },
} as const;

/**
 * Education history, newest first. The Education section and its navigation
 * link are rendered only when this list is not empty.
 *
 * Example entry:
 *   {
 *     institution: 'Universitas Contoh',
 *     degree: 'S1',
 *     field: 'Teknik Informatika',
 *     startYear: 2021,
 *     endYear: 2025,          // omit while still in progress
 *     location: 'Bandung, ID',
 *     description: 'Optional one-line highlight.',
 *   }
 */
export const education: Education[] = [];
