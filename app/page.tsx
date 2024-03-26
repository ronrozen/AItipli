"use client"

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';

import { useRouter } from 'next/navigation'
import React, { useMemo, useState, useEffect } from 'react';
import { Button, Input, Spinner } from "@nextui-org/react";
import { useAuth } from './auth-context';

//import SuccessModal from "@/components/modals/successModal";
import ErrorModal from "@/app/modals/errorModal";

import { logIn } from '@/managers/userManager'

const customSliderStyles = `
  .slick-dots li button:before {
      color: white;
	  margin-top: 3%;
  }
`;

export default function Home() {
	const router = useRouter()

	const { login, isAuthenticated: isAuthenticatedClient } = useAuth();

	const [isLoading, setIsLoading] = useState(false)

	const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
	const [successModalMessage, setSuccessModalMessage] = useState('');
	const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
	const [errorModalMessage, setErrorModalMessage] = useState('');

	const [isSignUp, setIsSignUp] = useState(false);
	const [isLogin, setIsLogin] = useState(true);
	const [isForgot, setIsForgot] = useState(false);

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [password_2, setPassword_2] = useState('')

	const validateEmail = (email: string): boolean => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

	const validatePassword = (password: string): boolean => {
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
		return passwordRegex.test(password);
	};

	const isInvalidEmail = useMemo(() => email === "" ? null : !validateEmail(email), [email]);
	const isInvalidPassword = useMemo(() => password === "" ? null : !validatePassword(password), [password]);
	const isInvalidPassword_2 = useMemo(() => {
		if (password_2 === "") return null;
		return password !== password_2 || !validatePassword(password_2) ? true : false;
	}, [password, password_2]);

	const areFieldsValid = validateEmail(email) && validatePassword(password) && (isLogin || (!isInvalidPassword_2));

	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 2000,
		arrows: false
	};

	useEffect(() => {
		if (isAuthenticatedClient) {
			router.push('/documents')
		}

		/*const urlParams = new URLSearchParams(window.location.search);
		const verifyToken = urlParams.get('verifyToken');
		const fetchData = async () => {
			try {
				await activateAccount(verifyToken)
				setSuccessModalMessage("Email verified! Now you can login to your account.")
				setIsSuccessModalOpen(true)
			} catch (e) {
				const error = e as any;
				if (error.response) {
					console.log(error.response)
				}
			}
		}

		if (verifyToken) {
			fetchData()
		}*/

	}, []);

	const handleLogin = async () => {
		try {
			setIsLoading(true)
			const authToken = await logIn(email, password)
			console.log("authToken", authToken)
			login(authToken, 1);
			router.push('/documents')

		} catch (e) {
			setIsLoading(false)
			const error = e as any;
			if (error.response) {
				console.log(error.response.data.response)
				setErrorModalMessage(error.response.data.response)
				setIsErrorModalOpen(true);
			}
		}
		/*if (isSignUp) {
			try {
				setIsLoading(true)
				await signUp(email, password, password_2)
				setIsLoading(false)
				setSuccessModalMessage("Thanks for joining us! Please check your email to verify your account.")
				setIsSuccessModalOpen(true);
			} catch (e) {
				setIsLoading(false)
				console.log(e)
				const error = e as any;
				if (error.response) {
					setErrorModalMessage(error.response.data.response)
					setIsErrorModalOpen(true);
				}
			}

		} else if (isLogin) {
			try {
				setIsLoading(true)
				const authToken = await logIn(email, password)
				login(authToken, 1);
				router.push('/home')

			} catch (e) {
				setIsLoading(false)
				const error = e as any;
				if (error.response) {
					setErrorModalMessage(error.response.data.response)
					setIsErrorModalOpen(true);
				}
			}

		} else if (isForgot) {
			await initiatePasswordReset(email)
			setEmail("")
			setIsLogin(true)
			setIsForgot(false)
			setIsSignUp(false)

			setSuccessModalMessage("Please check your email to reset your password")
			setIsSuccessModalOpen(true)
		}*/
	}

	if (isLoading) {
		return (
			<div className="flex flex-col md:flex-row items-center justify-center gap-8 py-8 md:py-10" style={{ marginTop: "10%" }}>
				<Spinner color="success" />
			</div>
		)
	}

	return (
		<section className="flex flex-col md:flex-row items-center justify-center gap-8 py-8 md:py-10">
			<style>{customSliderStyles}</style>

			<div className="w-full md:w-1/2">
				<div style={{ height: '100%', width: "100%" }}>
					<h1 className="text-4xl font-bold">
						{isSignUp && <span>Sign Up</span>}
						{isLogin && <span>Login</span>}
						{isForgot && <span>Reset Password</span>}
					</h1>
					<br />
					{/*<div className="flex gap-2">
						{isSignUp && <span>Already have an account?</span>}
						{(isLogin || isForgot) && <span>Are you new here?</span>}
						<span style={{ cursor: 'pointer' }} onClick={() => {
							if (!isForgot) {
								setIsLogin(!isLogin)
								setIsSignUp(!isSignUp)
							} else {
								setIsLogin(false)
								setIsSignUp(true)
							}

							setIsForgot(false)
							setEmail("")
							setPassword("")
							setPassword_2("")
						}}>
							{isSignUp && <span style={{ color: "blue" }}>Login</span>}
							{(isLogin || isForgot) && <span style={{ color: "blue" }}>Sign Up</span>}
						</span>
					</div>*/}
					<span>Welcome to Tipli AI!</span>

					<Input
						value={email}
						onChange={e => {
							setEmail(e.target.value)
						}}
						fullWidth
						label="Enter your email"
						type="email"
						isRequired
						size='sm'
						radius='lg'
						variant="bordered"
						className='mt-16'
						isInvalid={isInvalidEmail == null ? undefined : isInvalidEmail}
						errorMessage={isInvalidEmail && "Please enter a valid email"}
						color={isInvalidEmail == null ? undefined : (isInvalidEmail ? "danger" : "success")}
					/>
					{
						!isForgot &&
						<Input
							value={password}
							onChange={e => {
								setPassword(e.target.value)
							}}
							fullWidth
							label="Enter your password"
							type="password"
							isRequired
							size='sm'
							radius='lg'
							variant="bordered"
							className='mt-4'
							isInvalid={isInvalidPassword == null ? undefined : isInvalidPassword}
							errorMessage={isInvalidPassword && "Password must be at least 8 characters long with 1 capital letter and 1 number"}
							color={isInvalidPassword == null ? undefined : (isInvalidPassword ? "danger" : "success")}
						/>
					}
					{/*isLogin &&
						<a href="#" style={{ fontSize: "14px", color: "blue" }} className="ml-2" onClick={() => {
							setIsForgot(true)
							setIsLogin(false)
							setIsSignUp(false)
							setEmail("")
							setPassword("")
						}}>Forgot password</a>
					*/}
					{
						isSignUp &&
						<Input
							value={password_2}
							onChange={e => {
								setPassword_2(e.target.value)
							}}
							fullWidth
							label="Re-enter your password"
							type="password"
							isRequired
							size='sm'
							radius='lg'
							variant="bordered"
							className='mt-4'
							isInvalid={isInvalidPassword_2 == null ? undefined : isInvalidPassword_2}
							errorMessage={isInvalidPassword_2 && "Passwords do not match or does not meet requirements"}
							color={isInvalidPassword_2 == null ? undefined : (isInvalidPassword_2 ? "danger" : "success")}
						/>
					}

					<Button
						fullWidth
						color="success"
						style={{ color: "white" }}
						radius='lg'
						className='mt-4'
						//className='mt-16'
						onClick={async () => await handleLogin()}
						isDisabled={Boolean((!areFieldsValid && (isLogin || isSignUp)))}
					>
						{isSignUp && <span>Sign Up</span>}
						{isLogin && <span>Login</span>}
						{isForgot && <span>Reset Password</span>}
					</Button>
					<p className='text-center mt-2'>
						By using Tipli you agree to our <span style={{ color: "blue" }}>Terms & Conditions</span>
					</p>
				</div>
			</div>
			<div className="items-center text-center w-full md:w-1/2">
				<Slider {...settings}>
					<div className="flex justify-center items-center h-full">
						<img src="https://placehold.co/400" alt="Placeholder 1" className="m-auto" />
						<h1 className="text-3xl font-bold mt-4">Ask</h1>
						<p className="mx-auto w-5/6 md:w-3/4 lg:w-2/3 xl:w-1/2">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras consequat volutpat odio.
						</p>
					</div>
					<div className="flex justify-center items-center h-full">
						<img src="https://placehold.co/400" alt="Placeholder 2" className="m-auto" />
						<h1 className="text-3xl font-bold mt-4">Learn</h1>
						<p className="mx-auto w-5/6 md:w-3/4 lg:w-2/3 xl:w-1/2">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras consequat volutpat odio.
						</p>
					</div>
					<div className="flex justify-center items-center h-full">
						<img src="https://placehold.co/400" alt="Placeholder 3" className="m-auto" />
						<h1 className="text-3xl font-bold mt-4">Improve</h1>
						<p className="mx-auto w-5/6 md:w-3/4 lg:w-2/3 xl:w-1/2">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras consequat volutpat odio.
						</p>
					</div>
				</Slider>
			</div>

			{/*<SuccessModal
				isOpen={isSuccessModalOpen}
				onClose={() => setIsSuccessModalOpen(false)}
				message={successModalMessage}
				onSuccess={() => {
					setIsSuccessModalOpen(false)
				}}
			/>*/}

			<ErrorModal
				isOpen={isErrorModalOpen}
				onClose={() => setIsErrorModalOpen(false)}
				message={errorModalMessage}
			/>
		</section>
	);
}

