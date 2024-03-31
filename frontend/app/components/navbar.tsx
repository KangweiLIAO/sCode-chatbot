import React from 'react';
import Link from 'next/link';

export default function Navbar() {
	return (
		<nav className="fixed bg-opacity-30 backdrop-filter backdrop-blur-lg bg-white top-0 left-0 right-0 z-50 p-2
		shadow-lg shadow-blue-400/15">
			<div className="mx-auto px-4">
				<div className="flex justify-between items-center py-3">
					<div className="text-2xl text-gray-700 font-sans select-none">
						sCode
					</div>
					{/* Add navigation links or buttons here */}
					<div>
						<Link href="/" className="px-4 py-2 text-gray-500 hover:text-gray-900">Chat</Link>
						<Link href={"/about"} className="px-4 py-2 text-gray-500 hover:text-gray-900">About</Link>
					</div>
				</div>
			</div>
		</nav>
	);
};