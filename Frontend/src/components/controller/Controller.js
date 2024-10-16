import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Card, Button, Form, Input, message } from 'antd';
import { ReloadOutlined, CaretUpOutlined, CaretDownOutlined, CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import useScreenOrientation from '../Hooks/UseScreenOrientation';

//const url = 'ws://172.20.10.4:8000/connect';
const url = 'ws://localhost:8000/connect';
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
    const [playerId, setPlayerId] = useState(Math.floor(Math.random() * 1000000) + 1);
    const [rotate, setRotate] = useState(0)
    const [player, setPlayer] = useState(0)


    const screenOrientation = useScreenOrientation();

    const showModal = () => {
        setOpen(true);
    };

    function handle_register() {
        sendMessage(2, 0, playerId)
        setPlayer(1)
      }
    
    function handle_register2() {
        sendMessage(2, 1, playerId)
        setPlayer(2)
      }

      function handle_register3() {
        sendMessage(2, 2, playerId)
        setPlayer(3)
      }
    
    function handle_register4() {
        sendMessage(2, 3, playerId)
        setPlayer(4)
      }
    
    function handle_rotate() {
        setRotate(!rotate)
      }

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
        sendMessage(actionType, action, playerId);
    };

    const directionButtonClass = "flex items-center justify-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gray-700 hover:bg-gray-600";
    const actionButtonClass = "w-full h-full rounded-full flex items-center justify-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold";


    return (
        <>
            {contextHolder}
            {screenOrientation === 'landscape-primary' || screenOrientation === 'landscape-secondary' || rotate? <>
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
                   <div className="h-full grid grid-cols-2 grid-rows-2 gap-4">
                   <Button className='col-start-1 col-end-1 row-start-1 row-end-1' onClick={handle_rotate} htmlType="submit"  style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: "50px",
                            overflow: "hidden",
                            fontWeight: 'bold',
                            backgroundImage: rotate ? "linear-gradient(to right, red, red)" : "linear-gradient(to right, #80A1D4, #75C9C8)",
                             }} type="primary"><ReloadOutlined  style={{ fontSize: '30px' }}/>
                    </Button>
                    <p className='col-start-4 col-end-4 row-start-1 row-end-1 text-3xl font-bold text-center pt-3'>
                        {player}
                    </p>
                    </div>
                    {/* Right side - A and B buttons */}
                    <div className="w-2/5 h-4/5 max-w-xl max-h-xl grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6">
                        <Button onClick={() => handleButtonClick(4)} className={`${actionButtonClass} bg-red-600 hover:bg-red-500 text-[#ff3636] col-start-1 col-end-2 row-start-2 row-end-3`}>B</Button>
                        <Button onClick={() => handleButtonClick(5)} className={`${actionButtonClass} bg-green-600 hover:bg-green-500 text-green-600  col-start-2 col-end-3 row-start-1 row-end-2`}>A</Button>
                    </div>
                </div>
                
                
            </> : <>
            <div className='flex flex-col items-center justify-center w-screen h-screen'>
            <div>
             <Button onClick={handle_register} htmlType="submit"  style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: "100px",
                            overflow: "hidden",
                            fontWeight: 'bold',
                            marginRight:"10px",
                            fontSize: '20px',
                            backgroundColor:"red"
                             }} type="primary">1
            </Button>
            <Button onClick={handle_register2} htmlType="submit"  style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: "100px",
                            overflow: "hidden",
                            fontWeight: 'bold',
                            marginRight:"10px",
                            fontSize: '20px',
                            backgroundColor:"blue",
                             }} type="primary">2
            </Button>
             <Button onClick={handle_register3} htmlType="submit"  style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: "100px",
                            overflow: "hidden",
                            fontWeight: 'bold',
                            marginRight:"10px",
                            fontSize: '20px',
                            backgroundColor:"purple",
                             }} type="primary">3
            </Button>
            <Button onClick={handle_register4} htmlType="submit"  style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: "100px",
                            overflow: "hidden",
                            fontWeight: 'bold',
                            fontSize: '20px',
                            marginRight:"10px",
                            backgroundColor:"green",
                             }} type="primary">4
            </Button>
             </div>
                <Card className="flex justify-center space-y-4" style={{
                    width: 330,
                    height: 436,
                    margin: "10px",
                    borderRadius: "20px",
                    overflow: "hidden",
                }}>
                <h1 className='text-3xl text-center font-bold text-[#ff3636] pb-6'>Rotate your phone</h1>
                    <p className='text-xl text-center pt-12'>
                    <Button onClick={handle_rotate} htmlType="submit"  style={{
                            width: '200px',
                            height: '200px',
                            borderRadius: "80px",
                            overflow: "hidden",
                            fontWeight: 'bold',
                            borderStyle: 'solid',
                            boxShadow:'0px 2px 0 2px #D3D3D3',
                            backgroundColor:'white',
                             }} type="primary"><ReloadOutlined  style={{ fontSize: '140px', color: '#ff3636' }}/>
                    </Button>
                        
                    </p>
                    <div className='text-center pt-14'>
                   
                    </div>
                    </Card>
                </div>
            </>}
            
        </>
    );
};

export default Controller;
