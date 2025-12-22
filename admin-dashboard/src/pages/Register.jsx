import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Toaster, toast } from 'react-hot-toast';

const Register = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const { register, loading } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			toast.error('Passwords do not match');
			return;
		}

		try {
			const result = await register({ name, email, password });
			if (result.success) {
				toast.success('Registration successful');
				navigate('/dashboard');
			} else {
				toast.error(result.error || 'Registration failed');
			}
		} catch (err) {
			toast.error(err.message || 'Registration failed');
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<Toaster />
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create an account</h2>
					<p className="mt-2 text-center text-sm text-gray-600">Register to access the admin dashboard</p>
				</div>
				<form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow" onSubmit={handleSubmit}>
					<div className="rounded-md shadow-sm -space-y-px">
						<div className="mb-4">
							<label htmlFor="name" className="sr-only">Full name</label>
							<input id="name" name="name" type="text" required placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm" />
						</div>
						<div className="mb-4">
							<label htmlFor="email-address" className="sr-only">Email address</label>
							<input id="email-address" name="email" type="email" autoComplete="email" required placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
						</div>
						<div className="mb-4">
							<label htmlFor="password" className="sr-only">Password</label>
							<input id="password" name="password" type="password" autoComplete="new-password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
						</div>
						<div>
							<label htmlFor="confirm-password" className="sr-only">Confirm password</label>
							<input id="confirm-password" name="confirmPassword" type="password" required placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
						</div>
					</div>

					<div>
						<button type="submit" disabled={loading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50">
							{loading ? 'Creating...' : 'Create account'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Register;
