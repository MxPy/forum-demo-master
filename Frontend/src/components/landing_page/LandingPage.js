import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from "react-router-dom";
import { Card, Button, Form, Input, message  } from 'antd'
import SnakeGame from '../snake_demo/Snakee';

//move it somewhere
function getCookie(key) {
    var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return b ? b.pop() : null;
  }
  
  function getFromLocalStorage(key) {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
  
      const parsedItem = JSON.parse(item);
      if (parsedItem.expiration && new Date().getTime() > parsedItem.expiration) {
        localStorage.removeItem(key);
        console.log("kuuuuutas");
      
        console.log(new Date().getTime(), parsedItem.expiration);
        console.log(`Item '${key}' wygasł i został usunięty z localStorage.`);
        return null;
      }
  
      return parsedItem.value;
    } catch (error) {
      console.error("Błąd podczas odczytu z localStorage:", error);
      return null;
    }
  }
const url = 'ws://localhost:8001/connect';
const LandingPage = () => {
    let navigate = useNavigate();
    useEffect(() => {
        // if (getFromLocalStorage("token") === null){
        //     return navigate("/login");
        // }
      }, [])

      const [form] = Form.useForm();
      const [messages, setMessages] = useState([]);
      const [socket, setSocket] = useState(null);
      const [inputMessage, setInputMessage] = useState('');
      const [posts, setPosts] = useState([[]])
      const [open, setOpen] = useState(false);
      const [confirmLoading, setConfirmLoading] = useState(false);
      const [modalText, setModalText] = useState('Content of the modal');
      const [newestPost, setNewestPost] = useState("2024-10-05 22:57:55.321049")
      const [counter, setCounter] = useState(0)
      const [messageApi, contextHolder] = message.useMessage();
      const [player1Id, setPlayer1Id] = useState(0)
      const [player2Id, setPlayer2Id] = useState(0)
      const player1IdRef = useRef(null);
      const player2IdRef = useRef(null);

      const gameRef = useRef(null);
      const gameRef2 = useRef(null);

      const handleGameOver = (score) => {
        
      };

      function handle_register() {
        return navigate("/");
      }

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
        // Tworzenie połączenia WebSocket
        const newSocket = new WebSocket(url);
    
        // Obsługa otwarcia połączenia
        newSocket.onopen = () => {
          console.log('WebSocket połączenie otwarte');
        };
    
        // Obsługa otrzymanych wiadomości
        newSocket.onmessage = (event) => {
          const message = JSON.parse(event.data);
          // messageApi.open({
          //   type: 'error',
          //   content: `${message.body.action} ${message.body.author_id}`,
          //   duration: 1,
          // });
          if(message.body.action_type == 2){
            if(message.body.action == 0){
              messageApi.open({
                type: 'warning',
                content: `Connected player 1 with id ${message.body.author_id}`,
                duration: 1,
              });
              setPlayer1Id(message.body.author_id)
              player1IdRef.current = message.body.author_id;
              sendMessage(3,1,0)
            }else if(message.body.action == 1){
              messageApi.open({
                type: 'warning',
                content: `Connected player 2 with id ${message.body.author_id}`,
                duration: 1,
              });
              setPlayer2Id(message.body.author_id)
              player2IdRef.current = message.body.author_id;
              sendMessage(3,2,0)
            }
          }else{
            messageApi.open({
              type: 'warning',
              content: `${message.body.action} ${message.body.author_id} ${player1Id} ${player2Id}`,
              duration: 1,
            });
            if(message.body.author_id === player1IdRef.current){
              switch (message.body.action) {
                case 0:
                  gameRef.current.onLeft()
                  break;
                case 1:
                  gameRef.current.onUp()
                  break;
                case 2:
                    gameRef.current.onRight()
                    break;
                case 3:
                    gameRef.current.onDown()
                    break;
              
                default:
                  break;
              }
            } else if(message.body.author_id === player2IdRef.current){
              switch (message.body.action) {
                case 0:
                  gameRef2.current.onLeft()
                  break;
                case 1:
                  gameRef2.current.onUp()
                  break;
                case 2:
                    gameRef2.current.onRight()
                    break;
                case 3:
                    gameRef2.current.onDown()
                    break;
              
                default:
                  break;
              }
            }
          }
         
        };
    
        // Obsługa błędów
        newSocket.onerror = (error) => {
          console.error('Błąd WebSocket:', error);
        };
    
        // Obsługa zamknięcia połączenia
        newSocket.onclose = () => {
          console.log('WebSocket połączenie zamknięte');
        };
    
        // Zapisanie socketu w stanie
        setSocket(newSocket);
    
        // Czyszczenie przy odmontowaniu komponentu
        return () => {
          newSocket.close();
        };
      }, [url]);
    
      // Funkcja do wysyłania wiadomości
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

      
    const request_posts = (time) => {
      fetch(`http://localhost:8001/todos/older_than/${time}`)
          .then((res) => {
            //console.log(newestPost);
            return res.json();
          })
          .then((data) => {
            setPosts((prevPosts) => [data.todos])
          });
        // Przykład użycia funkcji:
    }

    // useEffect(() => {
    //   console.log(counter);
    //   if(counter==5){
    //     messageApi.open({
    //       type: 'warning',
    //       content: 'There are 5+ new posts on this topic refresh page to see them',
    //       duration: 1000,
    //     });
    //   }
    // }, [counter])
    

    useEffect(() => {
      var date = new Date();
      request_posts(`${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()} ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}.599999`)
      }, []);

    function handle_posts_request(value) {
        postData(`http://localhost:8000/posts?title=${value.author}&description=${value.text}`)
        .then(data => {
            console.log(data.details); // Loguj odpowiedź z serwera
            let modifiedString = data.details.body.toString();
            modifiedString = modifiedString.slice(0, -1) + '9';
            request_posts(modifiedString);
            
            // Ustawianie wartości pól na puste
            form.setFieldValue('text', "");
            form.setFieldValue('author', "");
            setCounter(0);
        })

        .catch(error => {
            console.error('Błąd:', error); // Obsługa błędów
        });
    }
    const { TextArea } = Input;
    useEffect(() => {
        console.log(posts);
      }, [posts])
      
      async function postData(url = '', data = {}) {
        // Domyślne ustawienia dla metody POST
        const response = await fetch(url, {
          method: 'POST', // Metoda HTTP
          headers: {
            'Content-Type': 'application/json' // Typ zawartości, dane wysyłane w formacie JSON
          },
          body: JSON.stringify(data) // Konwersja danych do formatu JSON
        });
      
        // Zwraca odpowiedź jako obiekt JSON
        return response.json(); 
      }
    
      return (
        <>
        {contextHolder}
        <Button onClick={handle_register} htmlType="submit"  style={{
                            width: '171px',
                            height: '46px',
                            borderRadius: "100px",
                            overflow: "hidden",
                            fontWeight: 'bold',
                            backgroundImage: "linear-gradient(to right, #80A1D4, #75C9C8)",
                             }} type="primary">Stop Game
        </Button>
        <div className="flex flex-row w-screen h-screen">
          <div className="w-1/2 h-full overflow-auto">
            <SnakeGame ref={gameRef} onGameOver={handleGameOver} />
          </div>
          <div className="w-1/2 h-full overflow-auto">
            <SnakeGame ref={gameRef2} onGameOver={handleGameOver} />
          </div>
        </div>
        </>
      );
    };

export default LandingPage