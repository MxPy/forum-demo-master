import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Card, Button, Form, Input, message } from 'antd';
import { ReloadOutlined, CaretUpOutlined, CaretDownOutlined, CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import useScreenOrientation from '../Hooks/UseScreenOrientation';

const url = 'ws://172.20.10.4:8000/connect';
const Controller = () => {
    let navigate = useNavigate();
    useEffect(() => {
        // if (getFromLocalStorage("token") === null){
        //     return navigate("/login");
        // }
    }, []);

    const [form] = Form.useForm();
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const [inputMessage, setInputMessage] = useState('');
    const [posts, setPosts] = useState([[]]);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Content of the modal');
    const [newestPost, setNewestPost] = useState("2024-10-05 22:57:55.321049");
    const [counter, setCounter] = useState(0);
    const [messageApi, contextHolder] = message.useMessage();

    const screenOrientation = useScreenOrientation();

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setModalText('The modal will be closed after two seconds');
        setConfirmLoading(false);
        setOpen(false);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };

    useEffect(() => {
        const newSocket = new WebSocket(url);

        newSocket.onopen = () => {
            console.log('WebSocket połączenie otwarte');
        };

        newSocket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            messageApi.open({
                type: 'warning',
                content: message.body.action,
                duration: 10,
            });
        };

        newSocket.onerror = (error) => {
            console.error('Błąd WebSocket:', error);
        };

        newSocket.onclose = () => {
            console.log('WebSocket połączenie zamknięte');
        };

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, [url]);

    const sendMessage = (actionType, action, authorId) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            const message = {
                body: {
                    action_type: actionType,
                    action: action,
                    author_id: authorId,
                }
            };
            socket.send(JSON.stringify(message));
        }
    };

    const handleButtonClick = (action) => {
        const actionType = 1; // Zmień na odpowiedni typ akcji
        const authorId = 1010101; // Zmień na odpowiednie ID autora
        sendMessage(actionType, action, authorId);
    };

    const directionButtonClass = "flex items-center justify-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gray-700 hover:bg-gray-600";
    const actionButtonClass = "w-full h-full rounded-full flex items-center justify-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold";


    return (
        <>
            {contextHolder}
            {screenOrientation === 'landscape-primary'? <>
                <div className="flex items-center justify-between w-screen h-screen p-4">
                    {/* Left side - Direction buttons */}
                    <div className="w-2/5 h-4/5 max-w-xl max-h-xl grid grid-cols-3 grid-rows-3 gap-2 sm:gap-4">
                        <div className="col-start-1 col-end-2 row-start-2 row-end-3">
                        <Button onClick={() => handleButtonClick(0)} className={`${directionButtonClass} w-full h-full`}><CaretLeftOutlined style={{ fontSize: '100px', color: 'blue' }}/></Button>
                        </div>
                        <div className="col-start-2 col-end-3 row-start-1 row-end-2">
                        <Button onClick={() => handleButtonClick(1)} className={`${directionButtonClass} w-full h-full`}><CaretUpOutlined style={{ fontSize: '100px', color: 'blue' }}/></Button>
                        </div>
                        <div className="col-start-3 col-end-4 row-start-2 row-end-3">
                        <Button onClick={() => handleButtonClick(2)} className={`${directionButtonClass} w-full h-full`}><CaretRightOutlined style={{ fontSize: '100px', color: 'blue' }}/></Button>
                        </div>
                        <div className="col-start-2 col-end-3 row-start-3 row-end-4">
                        <Button onClick={() => handleButtonClick(3)} className={`${directionButtonClass} w-full h-full`}><CaretDownOutlined style={{ fontSize: '100px', color: 'blue' }}/></Button>
                        </div>
                    </div>

                    {/* Right side - A and B buttons */}
                    <div className="w-2/5 h-4/5 max-w-xl max-h-xl grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6">
                        <Button onClick={() => handleButtonClick(4)} className={`${actionButtonClass} bg-red-600 hover:bg-red-500 text-[#ff3636] col-start-1 col-end-2 row-start-2 row-end-3`}>B</Button>
                        <Button onClick={() => handleButtonClick(5)} className={`${actionButtonClass} bg-green-600 hover:bg-green-500 text-green-600  col-start-2 col-end-3 row-start-1 row-end-2`}>A</Button>
                    </div>
                </div>
                
                
            </> : <>
            <div className='flex flex-col items-center justify-center w-screen h-screen'>
                <Card className="flex justify-center space-y-4" style={{
                    width: 330,
                    height: 436,
                    margin: "20px",
                    borderRadius: "20px",
                    overflow: "hidden",
                }}>
                <h1 className='text-3xl text-center font-bold text-[#ff3636] pb-6'>Rotate your phone</h1>
                    <p className='text-xl text-center pt-20'>
                        <ReloadOutlined  style={{ fontSize: '140px', color: '#ff3636' }}/>
                    </p>
                    
                    </Card>
                </div>
            </>}
            
        </>
    );
};

export default Controller;
