import 'regenerator-runtime/runtime'
import Navbar from "@/app/components/navbar";
import ChatUI from "@/app/components/chat-ui";

export default function Home() {
	return (
		<>
			<Navbar/>
			<main>
				<ChatUI/>
			</main>
		</>
	);
}
