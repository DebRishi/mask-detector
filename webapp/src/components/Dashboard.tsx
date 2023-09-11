import { GithubIcon, Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

const Dashboard = () => {

    const webcamRef = useRef<Webcam>(null);
    const [status, setStatus] = useState("CONNECTING");
    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        
        const fetchData = async () => {
            
            const screenshot = webcamRef.current?.getScreenshot();
            
            if (screenshot) {
                try {
                    const response = await fetch(process.env.REACT_APP_PREDICT_URL as string, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            data_uri: screenshot
                        }),
                    });
                    const jsonBody = await response.json();
                    setStatus(jsonBody.status);
                    fetchData();
                } catch (error) {
                    console.error("Error while connecting:", error);
                    setStatus("CONNECTING");
                    setTimeout(fetchData, 1000);
                }
            } else {
                setTimeout(fetchData, 1000);
            }
        }

        setTimeout(fetchData, 1000);
        
    }, [webcamRef])

    const openLink = () => {
        window.open(process.env.REACT_APP_PROJECT_URL, '_blank');
    };

    return (
        <div className="flex flex-col bg-zinc-800 mx-1 sm:w-[600px] rounded-xl">
            <header className="h-14 flex items-center justify-between">
                <div className="p-4">
                    <button
                        className="flex items-center text-zinc-400 hover:text-zinc-200"
                        onClick={openLink}
                    >
                        <GithubIcon />
                        <p className="p-2 text-md">Welcome to the Mask Detector</p>
                    </button>
                </div>
                <div className="p-4 relative group">
                    <Info className="text-zinc-400 hover:text-zinc-200 cursor-pointer"
                        onMouseOver={() => setShowInfo(true)}
                        onMouseOut={() => setShowInfo(false)}
                    />
                    <div 
                        className="absolute right-1 bg-black text-zinc-400 w-[300px] p-2 mt-1 text-center rounded-lg"
                        hidden={!showInfo}
                    >
                        This application sends a series of HTTP requests at regular time intervals instead of using WebSockets, which could potentially result in delayed response depending on your network.
                    </div>
                </div>
            </header>
            <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
            />
            <footer className="h-10 flex justify-center items-center">
                {status === "CONNECTING" && <p className="text-yellow-400 m-auto text-xl font-medium">Trying to connect...</p>}
                {status === "SERVER_ERROR" && <p className="text-rose-400 m-auto text-xl font-medium">Error while connecting</p>}
                {status === "MASK_DETECTED" && <p className="text-lime-400 m-auto text-xl font-medium">Good to see you wearing a mask</p>}
                {status === "NO_MASK_DETECTED" && <p className="text-orange-400 m-auto text-xl font-medium">Please wear a mask!</p>}
                {status === "NO_FACE_DETECTED" && <p className="text-zinc-400 m-auto text-xl font-medium">No face detected</p>}
            </footer>
        </div>
    );
}

export default Dashboard;