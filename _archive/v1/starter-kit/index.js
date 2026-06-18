import { Button, buttonStyles } from './components/Button.jsx';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardStyles,
} from './components/Card.jsx';
import { SectionHeader, sectionHeaderStyles } from './components/SectionHeader.jsx';
import { MarketingNav, marketingNavStyles } from './components/MarketingNav.jsx';
import { MarketingLayout, marketingLayoutStyles } from './components/MarketingLayout.jsx';
import { AppShell, appShellStyles } from './components/AppShell.jsx';
import { Hero, heroStyles } from './patterns/Hero.jsx';
import { DashboardFrame, dashboardFrameStyles } from './patterns/DashboardFrame.jsx';

export {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  SectionHeader,
  MarketingNav,
  MarketingLayout,
  AppShell,
  Hero,
  DashboardFrame,
  buttonStyles,
  cardStyles,
  sectionHeaderStyles,
  marketingNavStyles,
  marketingLayoutStyles,
  appShellStyles,
  heroStyles,
  dashboardFrameStyles,
};

export const starterKitStyles = [
  buttonStyles,
  cardStyles,
  sectionHeaderStyles,
  marketingNavStyles,
  marketingLayoutStyles,
  appShellStyles,
  heroStyles,
  dashboardFrameStyles,
].join('\n');
