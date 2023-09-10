import "./App.css";
import Dashboard from "./components/Dashboard";

export default function App() {
	return (
		<main className="h-screen w-100 flex flex-col justify-center items-center bg-gradient-to-r from-amber-500 to-pink-500">
			<Dashboard/>
		</main>
	);
}
