'use client'

import React, {useEffect, useState} from 'react';

interface Message {
	id: number;
	text: string;
	sender: 'user' | 'bot';
}


export default function ChatUI() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputText, setInputText] = useState('');

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch('http://localhost:8000/msg');
			const msg = await response.json();
			setMessages(msg);
		};

		fetchData().then(
			() => {
				console.log('Data fetched successfully')
			},
			(error) => console.error('Error fetching data:', error)
		);
	}, []);

	const handleSend = async () => {
		if (!inputText.trim()) return; // don't send empty messages

		const newMessage: Message = {
			id: Date.now(),
			text: inputText,
			sender: 'user',
		};

		// Add the user's message to the conversation immediately
		setMessages(messages => [...messages, newMessage]);
		setInputText('');

		try {
			// Send the user's message to the backend
			const response = await fetch('http://localhost:8000/msg', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json', // Tell the server we're sending JSON
				},
				body: JSON.stringify(newMessage), // Send the user's message as JSON
			});

			if (!response.ok) {
				throw new Error('Network Error: Could not send message to the server.');
			}

			const botMessage = await response.json(); // Parse the JSON response

			// Update the conversation with the bot's response
			setMessages(messages => [...messages, botMessage]);
		} catch (error) {
			console.error('Error sending message:', error);
		}
	};

	return (
		<main className="flex flex-col h-screen bg-gray-900">
			<div className="flex-grow overflow-auto p-4 space-y-2">
				{messages.map((message) => (
					<div key={message.id}
					     className={`p-2 ${message.sender === 'user' ? 'p-3 bg-blue-900 text-white self-end rounded-lg'
						     : 'p-3 border border-l-amber-50 text-amber-50 self-start rounded-lg'}`}>
						{message.text}
					</div>
				))}
			</div>
			<div className="p-4">
				<input
					type="text"
					value={inputText}
					onChange={(e) => setInputText(e.target.value)}
					className="border border-transparent p-3 pt-4 pb-4 w-full text-black rounded-lg focus:outline-none focus:ring-2
						focus:ring-purple-600 focus:border-transparent"
					placeholder="Type a message..."
					onKeyPress={(e) => e.key === 'Enter' && handleSend()}
				/>
				<button onClick={handleSend}
				        className="w-full mt-3 py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-green-500 hover:bg-green-700">
					Send
				</button>
			</div>
		</main>
	);
};
