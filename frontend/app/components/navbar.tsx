import React from 'react';
import Link from 'next/link';

const Navbar = () => {
	return (
		<nav className="fixed bg-opacity-50 backdrop-filter backdrop-blur-lg bg-white top-0 left-0 right-0 z-50 p-2
		shadow-lg shadow-blue-800/10">
			<div className="max-w-6xl mx-auto px-4">
				<div className="flex justify-between items-center py-3">
					<div className="text-2xl text-gray-700 font-sans">
						sCode
					</div>
					{/* Add navigation links or buttons here */}
					<div>
						<Link href="/" className="px-4 py-2 text-gray-500 hover:text-gray-900">Chat</Link>
						<Link href="/about" className="px-4 py-2 text-gray-500 hover:text-gray-900">About</Link>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
