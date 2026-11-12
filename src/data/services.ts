// The three services, shown as cards on the home page and in full on /services/.
// The names are also the three lines of the home page headline, so keep them short.
// The order here is the order everywhere, shortest name first so the headline steps out to the right.
// `short` is the one-line description on the home cards; `blurb` is the fuller one on /services/.
// Edit the wording here and both pages update.
export const services = [
  {
    id: 'social-media-ads',
    name: 'Social Media Ads',
    short: 'Paid ads on the platforms your customers use.',
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
    name: 'Web Development',
    short: 'Clear, fast websites that turn visitors into enquiries.',
    blurb:
      'Clear, fast websites that work on phones and are easy to find on search, built to turn visitors into enquiries.',
    included: [
      'A clear design that works on phones and desktops',
      'Pages written and structured so people can find them on search',
      'Fast loading, accessible and easy to update',
      'Contact and enquiry routes built in',
    ],
  },
  {
    id: 'marketing-campaigns',
    name: 'Marketing Campaigns',
    short: 'Campaigns across search, email and social, tied to a goal.',
    blurb:
      'We plan and run campaigns across search, email and social, tied to a goal you can measure, like enquiries or sales.',
    included: [
      'Goals and audience: who you want to reach and what you want them to do',
      'A campaign plan across the channels that suit your business',
      'Content and messaging written for your customers',
      'Tracking and regular updates on how it is going',
    ],
  },
] as const;

export const steps = [
  { title: 'We listen', text: 'Your business, your customers, your goals.' },
  { title: 'We agree a plan', text: 'What we will do, what it costs and how we will measure it.' },
  { title: 'We do the work', text: 'We deliver, and keep you updated as we go.' },
] as const;
