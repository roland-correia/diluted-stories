export const SITE_NAME = 'Diluted Stories';
export const DESCRIPTION =
  'Diluted Stories is a business consultancy. We run marketing campaigns and social media ads, and build websites, for growing businesses.';

// The email address is split in two so it never appears whole in the page
// source (see EmailLink.astro). The phone number is meant to be found, so it
// is written out normally.
export const contact = {
  emailUser: 'info',
  emailDomain: 'dilutedstories.com',
  phoneDisplay: '+44 7466 769491',
  phoneHref: 'tel:+447466769491',
};

export const nav = [
  { label: 'Services', path: '/services/' },
  { label: 'Blog', path: '/blog/' },
  { label: 'Team', path: '/team/' },
  { label: 'Contact', path: '/contact/' },
] as const;

// Social profiles, shown as icon links in the footer and on /contact/.
// `icon` picks the drawing in SocialLinks.astro.
export const socials = [
  { name: 'LinkedIn', icon: 'linkedin', url: 'https://www.linkedin.com/company/diluted-stories' },
  { name: 'Instagram', icon: 'instagram', url: 'https://www.instagram.com/dilutedstories/' },
  { name: 'GitHub', icon: 'github', url: 'https://github.com/Diluted-Stories' },
] as const;
