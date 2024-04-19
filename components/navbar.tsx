"use client"

import React, { useState, useEffect } from 'react';

import {
	Navbar as NextUINavbar,
	NavbarContent,
	NavbarMenu,
	NavbarMenuToggle,
	NavbarBrand,
	NavbarItem,
	NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";

import { link as linkStyles } from "@nextui-org/theme";
import { usePathname, useRouter } from 'next/navigation';
import { siteConfig } from "@/config/site";
import NextLink from "next/link";
import clsx from "clsx";
import { useAuth } from '@/app/auth-context';
import { ThemeSwitch } from "@/components/theme-switch";

const ScriptLoader = () => {
	useEffect(() => {
		const script = document.createElement('script');
		script.onload = function () {
			window.voiceflow.chat.load({
				verify: { projectID: '6602a8abe0853d4e25ec3c4c' },
				url: 'https://general-runtime.voiceflow.com',
				versionID: 'production',
				assistant: {
					color: "green",
					stylesheet: "chat.css"
				}
			});
		};
		script.src = 'https://cdn.voiceflow.com/widget/bundle.mjs';
		script.type = 'text/javascript';
		document.body.appendChild(script);

		return () => {
			// Cleanup the script when the component is unmounted
			document.body.removeChild(script);
		};
	}, []);

	return null; // This component does not render anything
};

export const Navbar = () => {
	const router = useRouter()
	const pathname = usePathname()
	const { isAuthenticated: isAuthenticatedClient, logout } = useAuth();
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [showChat, setShowChat] = useState(false);
	const [showMenu, setShowMenu] = useState(false);
	const [currentPage, setCurrentPage] = useState('')

	useEffect(() => {
		if (isAuthenticatedClient) {
			setIsAuthenticated(true);
		} else {
			setShowMenu(false)
		}

		switch (pathname) {
			case '/': {
				setShowChat(false)
				setShowMenu(false)
			}
				break;
			case '/settings': {
				setCurrentPage('settings')
				setShowChat(true)
				setShowMenu(true)
			}
				break;
			case '/knowledge': {
				setCurrentPage('knowledge')
				setShowChat(true)
				setShowMenu(true)
			}
				break;
			default: setShowChat(false)
				break
		}

	}, [isAuthenticatedClient, pathname]);

	const logOut = () => {
		logout()
		setIsAuthenticated(false)
		window.location.href = '/'
	}

	return (
		<>
			<NextUINavbar maxWidth="xl" position="sticky">
				<NavbarContent className="basis-1/5 sm:basis-full" justify="start">
					<NavbarBrand as="li" className="gap-3 max-w-fit">
						<NextLink className="flex justify-start items-center gap-1" href="/">
							<img src='logo.png' width="25%" />
						</NextLink>
					</NavbarBrand>
					<ul className="hidden lg:flex gap-4 justify-start ml-2">
						{showMenu && siteConfig.navItems.map((item) => (
							<NavbarItem key={item.href}>
								<NextLink
									style={{
										color: currentPage === item.label.toLowerCase()
											? 'green'
											: 'initial'
									}}
									href={item.href}
								>
									{item.label}
								</NextLink>
							</NavbarItem>
						))}
					</ul>
				</NavbarContent>

				<NavbarContent
					className="hidden sm:flex basis-1/5 sm:basis-full"
					justify="end"
				>
					<NavbarItem className="hidden sm:flex gap-2">
						{/*<Link isExternal href={siteConfig.links.twitter} aria-label="Twitter">
						<TwitterIcon className="text-default-500" />
					</Link>
					<Link isExternal href={siteConfig.links.discord} aria-label="Discord">
						<DiscordIcon className="text-default-500" />
					</Link>
					<Link isExternal href={siteConfig.links.github} aria-label="Github">
						<GithubIcon className="text-default-500" />
								</Link>*/}
						{/*<ThemeSwitch />*/}
					</NavbarItem>
					{
						isAuthenticated && <NavbarItem className="hidden md:flex">
							<Button
								size="sm"
								color="danger"
								className="text-sm font-normal"
								variant="light"
								onClick={logOut}
							>
								Logout
							</Button>
						</NavbarItem>
					}

				</NavbarContent>

				{/*<NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
				<Link isExternal href={siteConfig.links.github} aria-label="Github">
					<GithubIcon className="text-default-500" />
				</Link>
				<ThemeSwitch />
				<NavbarMenuToggle />
			</NavbarContent>*/}

				<NavbarMenu>
					<div className="mx-4 mt-2 flex flex-col gap-2">
						{showMenu && siteConfig.navMenuItems.map((item, index) => (
							<NavbarMenuItem key={`${item}-${index}`}>
								<Link
									style={{
										color: currentPage === item.label.toLowerCase()
											? 'green'
											: 'initial'
									}}
									href={item.href}
									size="lg"
								>
									{item.label}
								</Link>
							</NavbarMenuItem>
						))}
					</div>
				</NavbarMenu>
			</NextUINavbar>
			{
				showChat && <ScriptLoader />
			}

		</>

	);
};
