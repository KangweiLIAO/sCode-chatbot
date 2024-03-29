import React from 'react';
import Link from 'next/link';

const About = () => {
	return (
		<div className="min-h-screen bg-gray-300 flex flex-col justify-center">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
						About sCode
					</h2>
					<p className="mt-10 mb-24 text-lg leading-6 text-gray-600">
						sCode is a coding chatbot designed to assist developers by explaining concepts and generating code snippets
						across various programming languages. Whether you&#39;re tackling a tricky problem or learning something
						new, sCode is here to guide you through the complexities of coding with ease.
					</p>
				</div>
				<div className="mt-8 flex justify-center">
					<div className="inline-flex rounded-md shadow">
						<Link href="/"
						      className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base
						      font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
							Go Back Home
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default About;
