import { JOB_FAMILIES, type JobFamily } from './job-families'

/**
 * US-002 — "Trust the skills data I am shown".
 * Spec: product/stories/US-002-trustworthy-skills-data/spec.md (status: ready).
 *
 * This is CURATED SAMPLE CONTENT, not live or official employer demand data
 * (AC1). It was drafted by the project team from general knowledge of
 * entry-level work in Cape Town (AC2 provenance), covers exactly the nine
 * families in `job-families.ts` (AC3), and every skill carries a plain-English
 * reason (AC4).
 *
 * CONTENT APPROVAL GATE (decision, Product Owner, 2026-10-18): no skills text
 * is shown in the app until the Product Owner approves this content. The gate
 * is CONTENT_APPROVAL below; the skills map renders only the honest label and
 * provenance while status is 'pending-po-review'.
 */

export interface SkillContent {
  /** Short skill name, e.g. "Safe knife skills". */
  name: string
  /** One plain-English sentence: why this skill matters for these jobs (AC4). */
  whyItMatters: string
}

export interface JobFamilyContent {
  family: JobFamily
  /** Always true — AC1: every family states its sample status. */
  isSampleData: true
  /** Where the skills came from, so city partners can validate (AC2). */
  provenance: string
  skills: SkillContent[]
}

export interface ContentApproval {
  status: 'pending-po-review' | 'approved'
  approvedBy: string | null
  approvedOn: string | null
}

/** The gate. Flipped on explicit Product Owner approval (2026-10-18). */
export const CONTENT_APPROVAL: ContentApproval = {
  status: 'approved',
  approvedBy: 'Product Owner',
  approvedOn: '2026-10-18',
}

/** Resident-facing honest label (US-002 AC5 — exact agreed wording). */
export const HONEST_LABEL =
  'Sample content. These skills were chosen by our team to show how the map works. They are not live data from employers yet. City of Cape Town will check them with local employers.'

function provenance(basis: string): string {
  return `Curated by the project team from ${basis}. Sample content, not employer demand data; to be validated with City of Cape Town partners.`
}

export const SKILLS_CONTENT: Record<JobFamily, JobFamilyContent> = {
  'Retail and shops': {
    family: 'Retail and shops',
    isSampleData: true,
    provenance: provenance(
      'general knowledge of entry-level retail work in Cape Town',
    ),
    skills: [
      { name: 'Serving customers kindly', whyItMatters: 'Friendly help brings shoppers back to the shop.' },
      { name: 'Handling cash and change', whyItMatters: 'Mistakes at the till cost the shop money.' },
      { name: 'Stock counting and shelves', whyItMatters: 'Shops lose money when items are missing or empty.' },
      { name: 'Keeping the shop clean', whyItMatters: 'Customers trust a neat, tidy shop.' },
      { name: 'Working a till or card machine', whyItMatters: 'Most sales are paid by card or phone these days.' },
      { name: 'Talking clearly with people', whyItMatters: 'You must explain prices and deals without confusion.' },
    ],
  },
  Cleaning: {
    family: 'Cleaning',
    isSampleData: true,
    provenance: provenance('general knowledge of cleaning work in Cape Town'),
    skills: [
      { name: 'Safe use of cleaning chemicals', whyItMatters: 'Mixing the wrong products can harm people.' },
      { name: 'Mopping, dusting and sanitising', whyItMatters: 'These are the basic tasks almost every job needs.' },
      { name: 'Handling rubbish and recycling', whyItMatters: 'Sites must stay hygienic for the people using them.' },
      { name: 'Working to a checklist', whyItMatters: 'Offices need cleaning finished before people arrive.' },
      { name: 'Wearing protective gear', whyItMatters: 'Gloves and masks protect you from chemicals and germs.' },
      { name: 'Reporting damage or hazards', whyItMatters: 'Reporting problems early prevents accidents and complaints.' },
    ],
  },
  'Building and manual work': {
    family: 'Building and manual work',
    isSampleData: true,
    provenance: provenance(
      'general knowledge of entry-level building and manual work in Cape Town',
    ),
    skills: [
      { name: 'Lifting and carrying safely', whyItMatters: 'Back injuries can end a manual worker’s career.' },
      { name: 'Measuring with a tape', whyItMatters: 'Materials cut to the wrong size waste money.' },
      { name: 'Using basic hand tools', whyItMatters: 'Hammers, screwdrivers and drills start almost every job.' },
      { name: 'Following site safety rules', whyItMatters: 'Helmets and boots prevent serious injuries.' },
      { name: 'Reading simple plans', whyItMatters: 'You must know what to build before you start.' },
      { name: 'Working as a team on site', whyItMatters: 'Big jobs need people who coordinate well.' },
    ],
  },
  'Office and admin work': {
    family: 'Office and admin work',
    isSampleData: true,
    provenance: provenance(
      'general knowledge of entry-level office and admin work in Cape Town',
    ),
    skills: [
      { name: 'Typing and using a keyboard', whyItMatters: 'Admin work happens on computers all day.' },
      { name: 'Filing and organising', whyItMatters: 'Good records mean you can find information fast.' },
      { name: 'Writing clear emails', whyItMatters: 'Unclear messages cause expensive mistakes.' },
      { name: 'Using spreadsheets', whyItMatters: 'Totals, lists and reports are built in tools like Excel.' },
      { name: 'Keeping records up to date', whyItMatters: 'Bosses trust people whose records are accurate.' },
      { name: 'Meeting deadlines', whyItMatters: 'Offices run on schedules and due dates.' },
    ],
  },
  'Driving and delivery': {
    family: 'Driving and delivery',
    isSampleData: true,
    provenance: provenance(
      'general knowledge of driving and delivery work in Cape Town',
    ),
    skills: [
      { name: 'A valid licence for the vehicle', whyItMatters: 'You cannot drive for work without the right licence.' },
      { name: 'Safe, defensive driving', whyItMatters: 'Accidents cost jobs, money and lives.' },
      { name: 'Keeping to routes and times', whyItMatters: 'Customers expect deliveries on time.' },
      { name: 'Loading and securing goods', whyItMatters: 'Items must arrive without damage.' },
      { name: 'Checking the vehicle first', whyItMatters: 'Tyres, oil and fuel checks prevent breakdowns.' },
      { name: 'Using delivery apps and phones', whyItMatters: 'Proof of delivery and navigation run on apps.' },
    ],
  },
  'Cooking and food work': {
    family: 'Cooking and food work',
    isSampleData: true,
    provenance: provenance(
      'general knowledge of kitchen and food work in Cape Town',
    ),
    skills: [
      { name: 'Food hygiene and handwashing', whyItMatters: 'Poor hygiene makes people sick.' },
      { name: 'Safe knife skills', whyItMatters: 'You must work fast without cutting yourself.' },
      { name: 'Following recipes and portions', whyItMatters: 'The same dish must taste the same every time.' },
      { name: 'Working cleanly under pressure', whyItMatters: 'Kitchens are hot, busy and fast.' },
      { name: 'Safe use of kitchen equipment', whyItMatters: 'Ovens and fryers cause serious burns.' },
      { name: 'Checking food dates and storage', whyItMatters: 'Serving spoiled food can close a kitchen.' },
    ],
  },
  'Hair and beauty': {
    family: 'Hair and beauty',
    isSampleData: true,
    provenance: provenance(
      'general knowledge of hair and beauty work in Cape Town',
    ),
    skills: [
      { name: 'Cleaning and sanitising tools', whyItMatters: 'Dirty tools give clients infections.' },
      { name: 'Basic cutting and styling', whyItMatters: 'This is the core service clients pay for.' },
      { name: 'Listening to what clients want', whyItMatters: 'Happy clients come back and tell friends.' },
      { name: 'Managing appointment time', whyItMatters: 'Bookings must flow without long waiting.' },
      { name: 'Knowing the products you use', whyItMatters: 'Good recommendations earn extra income.' },
      { name: 'Keeping your station welcoming', whyItMatters: 'Clients judge the space before they sit down.' },
    ],
  },
  'Working with computers': {
    family: 'Working with computers',
    isSampleData: true,
    provenance: provenance(
      'general knowledge of entry-level computer work in Cape Town',
    ),
    skills: [
      { name: 'Emails and attachments', whyItMatters: 'Every office job starts with email.' },
      { name: 'Finding information online', whyItMatters: 'Searching well saves hours of work.' },
      { name: 'Documents, slides and spreadsheets', whyItMatters: 'These are the core tools of office work.' },
      { name: 'Fixing small computer problems', whyItMatters: 'Restarting and checking cables beats waiting for help.' },
      { name: 'Protecting passwords and data', whyItMatters: 'One leak can harm you and the company.' },
      { name: 'Confident typing', whyItMatters: 'Faster typing means less time on every task.' },
    ],
  },
  Caregiving: {
    family: 'Caregiving',
    isSampleData: true,
    provenance: provenance(
      'general knowledge of caregiving work in Cape Town',
    ),
    skills: [
      { name: 'Patience and respect', whyItMatters: 'Dignity matters to every person in care.' },
      { name: 'Hygiene and infection control', whyItMatters: 'People in care are often vulnerable to illness.' },
      { name: 'Helping with daily tasks safely', whyItMatters: 'Lifting someone wrongly injures you both.' },
      { name: 'Recording what you observe', whyItMatters: 'Doctors rely on your notes to make decisions.' },
      { name: 'Following care instructions', whyItMatters: 'Medication and routines must be exact.' },
      { name: 'Staying calm in emergencies', whyItMatters: 'Panic makes a crisis worse.' },
    ],
  },
}

/** Every seeded family must have content (AC3 — no gaps, no extras). */
export const SEEDED_FAMILIES: JobFamily[] = [...JOB_FAMILIES]
