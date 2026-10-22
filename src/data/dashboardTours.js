/*
 * Icons are STRINGS and must match a key in TourIcons.js.
 * Only targets that really exist in the Dashboard and header are listed here.
 */
export const DASHBOARD_TOUR_STEPS = [
  {
    path: '/',
    target: '[data-tour="dashboard-todays-meetings"]',
    title: "Today's meetings",
    icon: 'CalendarMonth',
    body:
      'This section shows the meetings scheduled for today. You can quickly see what has already happened and what is coming next.',
    action: 'Look through the meetings shown here.',
    tip: 'Completed and upcoming meetings are shown differently so they are easier to recognise.',
  },
  {
    path: '/',
    target: '[data-tour="dashboard-meetai-status"]',
    title: 'MeetAI status',
    icon: 'Mic',
    body:
      'These switches show whether MeetAI is invited to a meeting and whether video recording is on.',
    action: 'Select the switches to change MeetAI settings for a meeting.',
    tip: 'MeetAI is optional. You can decide whether to invite it for each meeting.',
  },
  {
    path: '/',
    target: '[data-tour="dashboard-action-items"]',
    title: 'Action items',
    icon: 'TaskAlt',
    body:
      'Action items are follow-up tasks from your meetings. This section helps you remember what needs to be done.',
    action: 'Look at the action items shown on the dashboard.',
    tip: 'You can open My Tasks to see all of your action items together.',
    scrollTop: true,
    scrollStart: true,
  },
  {
    path: '/',
    target: '[data-tour="dashboard-new-meeting"]',
    title: 'Schedule a Meeting',
    icon: 'EventAvailable',
    body:
      'Use Schedule a Meeting to create a new meeting with its time, platforms and participants.',
    action: 'Select Schedule a Meeting to open the meeting form.',
    tip: 'Add MeetAI to a Meeting next to it is for when you already have a meeting link ready.',
  },
  {
    path: '/',
    target: '[data-tour="companion"]',
    title: 'Ask your Companion',
    icon: 'Lightbulb',
    body:
      'The Companion button opens your MeetAI assistant. Ask it about your meetings, tasks and recordings.',
    action: 'Select the Companion button and ask a question.',
    tip: 'The Companion can also take you to a page or start a meeting for you.',
  },
  {
    path: '/',
    target: '[data-tour="account-menu"]',
    title: 'Account menu',
    icon: 'Groups',
    body:
      'Open the account menu to start this app tour again or to log out.',
    action: 'Select your account picture to open the menu.',
    tip: 'Choose App tour to replay the tour, or Logout to sign out.',
  },
]