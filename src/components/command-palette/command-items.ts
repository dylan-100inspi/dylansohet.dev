import {
  House,
  User,
  Rocket,
  Wrench,
  FolderGit2,
  GraduationCap,
  Quote,
  MessageCircle,
  FileDown,
  Languages,
  CodeXml,
} from '@lucide/astro';
import { sections } from '../../config/sections';
import { author, site } from '../../config/site';
import { useTranslations } from '../../i18n/translations';
import type { Locale } from '../../i18n/translations';

type CommandIcon = typeof House;

export interface CommandItem {
  readonly id: string;
  readonly label: string;
  readonly keywords: string;
  readonly action: 'navigate' | 'download' | 'theme' | 'lang' | 'copy' | 'external';
  readonly href?: string;
  readonly targetLocale?: string;
  readonly copy?: string;
  readonly Icon?: CommandIcon | undefined;
}

interface CommandGroup {
  readonly key: string;
  readonly label: string;
  readonly items: readonly CommandItem[];
}

const navKeywords: Record<string, string> = {
  home: 'home top start accueil',
  about: 'about bio me qui apropos',
  now: 'now current currently actuel maintenant',
  skills: 'skills tech stack technologies competences outils',
  projects: 'projects portfolio work repos github projets travaux depots',
  formations: 'formations education courses training learning etudes cours diplomes udemy parcours',
  recommendations: 'recommendations testimonials reviews references temoignages avis',
  contact: 'contact reach hire coordonnees',
};

const navIcon: Record<string, CommandIcon> = {
  home: House,
  about: User,
  now: Rocket,
  skills: Wrench,
  projects: FolderGit2,
  formations: GraduationCap,
  recommendations: Quote,
  contact: MessageCircle,
};

export function buildCommandGroups(locale: Locale): readonly CommandGroup[] {
  const t = useTranslations(locale);
  const targetLocale = locale === 'en' ? 'fr' : 'en';

  const navItems: readonly CommandItem[] = sections.map((section) => ({
    id: section.id,
    label: t(section.labelKey),
    keywords: navKeywords[section.id] ?? '',
    action: 'navigate',
    href: `/${locale}/#${section.id}`,
    Icon: navIcon[section.id],
  }));

  const actionItems: readonly CommandItem[] = [
    {
      id: 'download-cv',
      label: t('hero.downloadCv'),
      keywords: 'cv resume download curriculum telecharger',
      action: 'download',
      href: `/docs/cv-${locale}.pdf`,
      Icon: FileDown,
    },
    {
      id: 'toggle-theme',
      label: t('commandPalette.toggleTheme'),
      keywords: 'theme dark light mode appearance sombre clair',
      action: 'theme',
    },
    {
      id: 'switch-lang',
      label: t('commandPalette.switchLang'),
      keywords: 'language lang locale fr en francais english langue',
      action: 'lang',
      targetLocale,
      Icon: Languages,
    },
    {
      id: 'copy-email',
      label: t('commandPalette.copyEmail'),
      keywords: 'email mail copy address courriel copier adresse',
      action: 'copy',
      copy: author.email,
    },
  ];

  const linkItems: readonly CommandItem[] = [
    {
      id: 'view-source',
      label: t('commandPalette.viewSource'),
      keywords: 'source repo repository code sources depot github',
      action: 'external',
      href: site.repo,
      Icon: CodeXml,
    },
    {
      id: 'github-profile',
      label: t('commandPalette.githubProfile'),
      keywords: 'github git profile profil',
      action: 'external',
      href: author.github,
    },
    {
      id: 'linkedin-profile',
      label: t('commandPalette.linkedin'),
      keywords: 'linkedin professional profile profil',
      action: 'external',
      href: author.linkedin,
    },
  ];

  return [
    { key: 'navigation', label: t('commandPalette.groupNavigation'), items: navItems },
    { key: 'actions', label: t('commandPalette.groupActions'), items: actionItems },
    { key: 'links', label: t('commandPalette.groupLinks'), items: linkItems },
  ];
}
