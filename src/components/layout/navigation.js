import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import BedOutlinedIcon from '@mui/icons-material/BedOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

export const PORTALS = [
  {
    id: 'patient',
    label: 'Patient portal',
    base: '/patient',
    items: [
      { label: 'Overview', to: '/patient', icon: DashboardOutlinedIcon, end: true },
      { label: 'Report symptoms', to: '/patient/symptoms', icon: AssignmentOutlinedIcon },
      {
        label: 'Book appointment',
        to: '/patient/book-appointment',
        icon: EventAvailableOutlinedIcon,
      },
      { label: 'Find care', to: '/patient/facilities', icon: PlaceOutlinedIcon },
      { label: 'Reminders', to: '/patient/reminders', icon: NotificationsOutlinedIcon },
      { label: 'Messages', to: '/patient/messages', icon: MailOutlineIcon },
    ],
  },
  {
    id: 'hospital',
    label: 'Hospital portal',
    base: '/hospital',
    items: [
      { label: 'Overview', to: '/hospital', icon: DashboardOutlinedIcon, end: true },
      { label: 'Resources', to: '/hospital/resources', icon: BedOutlinedIcon },
      { label: 'Crisis prediction', to: '/hospital/crisis', icon: WarningAmberOutlinedIcon },
      { label: 'Appointments', to: '/hospital/appointments', icon: CalendarMonthOutlinedIcon },
    ],
  },
];

export function portalForPath(pathname) {
  return PORTALS.find((p) => pathname === p.base || pathname.startsWith(`${p.base}/`)) ?? null;
}

/** Returns the nav item that best matches the current path (longest prefix wins). */
export function activeItemForPath(portal, pathname) {
  if (!portal) return null;
  const matches = portal.items.filter((item) =>
    item.end ? pathname === item.to : pathname === item.to || pathname.startsWith(`${item.to}/`),
  );
  return matches.sort((a, b) => b.to.length - a.to.length)[0] ?? null;
}
