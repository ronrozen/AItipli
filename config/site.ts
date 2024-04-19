export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: "Tipli",
	description: "AI Chatbots for college",
	navItems: [
		{
			'label': 'Settings',
			'href': '/settings'
		},
		{
			'label': 'Knowledge',
			'href': '/knowledge'
		}
	],
	navMenuItems: [
		{
			'label': 'Settings',
			'href': '/settings'
		},
		{
			'label': 'Knowledge',
			'href': '/knowledge'
		}
	],
	links: {
		github: "https://github.com/nextui-org/nextui",
		twitter: "https://twitter.com/getnextui",
		docs: "https://nextui.org",
		discord: "https://discord.gg/9b6yyZKmH4",
		sponsor: "https://patreon.com/jrgarciadev"
	},
};
