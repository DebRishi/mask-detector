import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

const Dashboard = () => {

    const webcamRef = useRef<Webcam>(null);
    const [status, setStatus] = useState("CONNECTING");

    const fetchData = async (screenshot: string) => {
        try {
            const response = await fetch("http://127.0.0.1:5000/predict", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data_uri: screenshot
                }),
            });
            if (!response.ok) {
                setStatus("SERVER_ERROR");
            }
            const jsonResponse = await response.json();
            console.log(jsonResponse.status);
            setStatus(jsonResponse.status);
        } catch (error) {
            console.error("Error while connecting:", error);
            setStatus("CONNECTING");
        }
    }

    useEffect(() => {

        let isMounted = true;
        
        const continuousDataFetch = async () => {
            
            if (!isMounted) {
                return;
            }
            
            const screenshot = webcamRef.current?.getScreenshot();
            if (screenshot) {
                await fetchData(screenshot);
            }
            
            continuousDataFetch();
        }
        continuousDataFetch();
        
        return () => {
            isMounted = false;
        }
    }, []);

    return (
        <div className="flex flex-col bg-zinc-800 mx-1 sm:w-[600px] rounded-xl">
            <header className="h-14">

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