'use client'

import React, {useEffect, useState} from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import TypeIt from "typeit-react";

// const FETCH_URL = 'http://localhost:8000/dialogflow'
const FETCH_URL = 'https://scode-chatbot-236603824520.herokuapp.com/dialogflow'

interface Message {
	id: number;
	text: string;
	sender: 'user' | 'bot';
}

export default function ChatUI() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [dialog, setDialog] = useState<Message[]>([]);
	const [inputText, setInputText] = useState('');

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true)
			try {
				const response = await fetch(FETCH_URL);
				const msg = await response.json();
				if (Array.isArray(msg)) {
					setDialog(msg);
				} else {
					console.error('Fetched data is not an array:', msg);
				}
			} catch (error) {
				console.log("Failed to fetch welcome message: ", error);
			}
		};
		fetchData().then(() => {
			setIsLoading(false);
		})
	}, []);

	const handleSend = async () => {
		if (!inputText.trim()) return; // don't send empty messages

		const newMessage: Message = {
			id: Date.now(),
			text: inputText,
			sender: 'user',
		};

		// Add the user's message to the conversation and clear the input field
		setDialog(messages => [...messages, newMessage]);
		setInputText('');

		try {
			setIsLoading(true)
			// Send the user's message to the backend
			const response = await fetch(FETCH_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json', // Tell the server we're sending JSON
				},
				body: JSON.stringify(newMessage), // Send the user's message as JSON
			});

			const botMessage = await response.json(); // Parse the JSON response
			// Update the conversation with the new response
			setDialog(messages => [...messages, botMessage]);
		} catch (error) {
			console.error('Error sending message:', error);
		} finally {
			setIsLoading(false)
		}
	};

	return (
		<main className="flex flex-col h-screen bg-gray-300">
			<div className="flex-grow overflow-auto p-4 space-y-2">
				{dialog.map((message) => (
					// Display each message in the conversation
					<div key={message.id}
					     className={`p-2 ${message.sender === 'user' ? 'p-3 bg-blue-800 text-white self-end rounded-lg'
						     : 'p-3 border-2 border-blue-950 text-blue-950 self-start rounded-lg'}`}>
						<TypeIt options={{
							strings: [message.text],
							speed: 3,
							waitUntilVisible: true,
							cursor: false
						}}
						/>
					</div>
				))}
			</div>
			{/* Text Field */}
			<div className="p-4">
				<input
					type="text"
					value={inputText}
					onChange={(e) => setInputText(e.target.value)}
					className="p-3 pt-4 pb-4 w-full border border-transparent text-black rounded-lg focus:outline-none
						focus:ring-2 focus:ring-purple-600 focus:border-transparent"
					placeholder="Message sCode..."
					onKeyDown={(e) => e.key === 'Enter' && handleSend()}
				/>
				{isLoading ? (
					<div>
						{/* Loading button */}
						<button onClick={handleSend} className="w-full mt-3 py-2 px-4 font-semibold rounded-lg shadow-md text-white
				      bg-green-700 text-center" disabled>
							<CircularProgress className={"h-5 w-5 mr-3"} size={15} color="inherit"/>
							Processing...
						</button>
					</div>
				) : (
					<div>
						{/* Send button */}
						<button onClick={handleSend} className="w-full mt-3 py-2 px-4 font-semibold rounded-lg shadow-md text-white
				      bg-green-500 hover:bg-green-700">
							Send
						</button>
					</div>
				)}
			</div>
		</main>
	);
};
