import React, { useEffect, useState } from "react"
import axios from "axios"

const Chat = () => {
    const [reply, setReply] = useState("")
    const [replies, setReplies] = useState(JSON.parse(localStorage.getItem("replies")) === null ? [] : JSON.parse(localStorage.getItem("replies")))
    const [result, setResult] = useState(null)

    useEffect(() => {
        const saveReplies = () => {
            localStorage.setItem("replies", JSON.stringify(replies))
        }

        const startWebCam = () => {
            const webcam = document.getElementById("webcam")
            if (navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                .then((stream) => {
                    webcam.srcObject = stream;
                })
                .catch((error) => {
                    console.error('Error accessing webcam:', error);
                });
            } else {
                console.error('getUserMedia not supported in this browser.');
            }
        }

        saveReplies()
        // startWebCam()
    }, [replies])

    const handleReplyChange = (event) => {
        event.preventDefault()
        setReply(event.target.value)
    }

    const handleSendReply = async (event) => {
        setReplies((previous) => ([...previous, reply]))
        setReply("")
        await axios.post("http://localhost:8080/storeReply", {
            "reply": reply
        })
    }

    const handleGetResult = async (event) => {
        await axios.get("http://localhost:8080/getResult")
        .then((response) => {
            setResult(response.data["label"])
        })
    }

    return (
        <div style={{
            border: "1px solid #ccc",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
        }}>
            <div style={{ margin: "10px", textAlign: "center" }}>
                {replies.map((reply, index) => (
                    <div key={index}>
                        User: {reply}
                    </div>
                ))}
            </div>
            <div style={{ margin: "10px" }}>
                <input id="replyBox" type="text" style={{ margin: "10px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", width: "300px" }} onChange={handleReplyChange} value={reply} placeholder="Type your message..." />
                <button style={{ padding: "10px 20px", margin: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }} onClick={handleSendReply}>Send</button>
            </div>
            <div>
                <button style={{ padding: "10px 20px", margin: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }} onClick={handleGetResult}>Get result</button>
            </div>
            <div>
                <video id="webcam" width="640" height="480" autoPlay></video>
            </div>
            {result !== null && (
                <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <h3 style={{ color: result ? "red" : "green" }}>{result ? "Depression" : "No depression"}</h3>
                </div>
            )}
        </div>
    )
}

export default Chat
