// The three services, shown as cards on the home page and in full on /services/.
// Edit the wording here and both pages update.
export const services = [
  {
    id: 'marketing-campaigns',
    name: 'Marketing campaigns',
    blurb:
      'We plan and run campaigns across search, email and social, tied to a goal you can measure, like enquiries or sales.',
    included: [
      'Goals and audience: who you want to reach and what you want them to do',
      'A campaign plan across the channels that suit your business',
      'Content and messaging written for your customers',
      'Tracking and regular updates on how it is going',
    ],
  },
  {
    id: 'social-media-ads',
    name: 'Social media ads',
    blurb:
      'Paid ads on the platforms your customers use. We set up the targeting and the creative, then test and adjust.',
    included: [
      'Account and ad setup on the platforms your customers use',
      'Audience targeting and ad creative',
      'Budget management, testing and adjustments',
      'Straightforward reporting',
    ],
  },
  {
    id: 'website-development',
    name: 'Website development',
    blurb:
      'Clear, fast websites that work on phones and are easy to find on search, built to turn visitors into enquiries.',
    included: [
      'A clear design that works on phones and desktops',
      'Pages written and structured so people can find them on search',
      'Fast loading, accessible and easy to update',
      'Contact and enquiry routes built in',
    ],
  },
] as const;

export const steps = [
  { title: 'We listen', text: 'We start with a conversation about your business, your customers and what you want to achieve.' },
  { title: 'We agree a plan', text: 'You get a clear plan: what we will do, what it costs and how we will know it is working.' },
  { title: 'We do the work', text: 'We run the campaigns and ads or build the site, and keep you updated as it goes.' },
] as const;
