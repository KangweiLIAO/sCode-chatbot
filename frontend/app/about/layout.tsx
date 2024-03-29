import React from 'react';
import Navbar from '../components/navbar'; // Adjust the import path according to your file structure

export default function Layout({children,}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Navbar/>
			<div>{children}</div>
		</>
	);
};