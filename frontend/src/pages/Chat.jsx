import React, { useEffect, useState } from "react"
import axios from "axios"

const Chat = () => {
    const [reply, setReply] = useState("")
    const [replies, setReplies] = useState(JSON.parse(localStorage.getItem("replies")) === null ? [] : JSON.parse(localStorage.getItem("replies")))
    const [result, setResult] = useState(null)
    const [chat, setChat] = useState(JSON.parse(localStorage.getItem("chat")) === null ? ["Hey, how are you today?"] : JSON.parse(localStorage.getItem("replies")))

    useEffect(() => {
        const saveReplies = () => {
            localStorage.setItem("replies", JSON.stringify(replies))
        }

        const saveChat = () => {
            localStorage.setItem("chat", JSON.stringify(chat))
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
        saveChat()
        startWebCam()

    }, [replies, chat])
    
    const handleReplyChange = (event) => {
        event.preventDefault()
        setReply(event.target.value)
    }
    
    const handleSendReply = async (event) => {
        setReplies((previous) => ([...previous, reply]))
        setChat((previous) => ([...previous, reply]))
        setReply("")
        await axios.post("http://localhost:8080/storeReply", {
            "reply": reply
        })
        .then((response) => {
            setChat((previous) => ([...previous, response.data["botReply"]]))
        })
    }

    const handleGetResult = async (event) => {
        await axios.get("http://localhost:8080/getResult")
        .then((response) => {
            setResult(response.data)
        })
    }

    const captureImage = () => {
        let video = document.getElementById("webcam")
        let canvas = document.getElementById("canvas")
        canvas.width = video.witdh
        canvas.height = video.height
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        let imageDataURL = canvas.toDataURL("image/jpeg")
        console.log(imageDataURL)
    }

    setInterval(captureImage, 3000)
    
    const outerStyle = {
        margin: "15px 0px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        border: "1px solid #ccc",
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        background: "#f8f8f8"
    }
    
    const chatStyle = {
        margin: "15px 0px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #ccc",
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        background: "#f8f8f8"
    }
    
    const inputStyle = {
        marginTop: "20px",
        padding: "10px",
        width: "50vh",
        border: "1px solid #ccc",
        borderRadius: "5px"
    }

    const sendButtonStyle = {
        margin: "20px",
        padding: "8px 20px",
        fontSize: "16px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    }

    const getResultButtonStyle = {
        margin: "20px",
        padding: "8px 20px",
        fontSize: "16px",
        backgroundColor: "green",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    }

    return (
        <div style = {outerStyle}>
            <div style = {chatStyle}>
                {chat.map((item, index) => (
                    <div key = {index}>
                        {index % 2 === 1 ? "User: " : "System: "} {item}
                    </div>
                ))}
            </div>
            <div>
                <input style = {inputStyle} id = "replyBox" type = "text" onChange = {handleReplyChange} value = {reply} />
                <input style = {sendButtonStyle} type = "submit" value = "Send" onClick = {handleSendReply} />
            </div>
            <div>
                <input style = {getResultButtonStyle} type = "submit" value = "Get result" onClick = {handleGetResult} />
            </div>
            <div>
                <video id = "webcam" witdh = "480" height = "400" autoPlay></video>
            </div>
            <div>
                <canvas id = "canvas" />
            </div>
            {/* {result === true && (
                <div>
                    <h3>Depression</h3>
                </div>
            )}
            {result === false && (
                <div>
                    <h3>No depression</h3>
                </div>
            )} */}
            {result !== null && result.map((probability, index) => (
                <div>
                    <h3>{index === 0 ? "Happiness Score: " : "Depression Score: "} {probability}%</h3>
                </div>
            ))}
        </div>
    )
}

export default Chat