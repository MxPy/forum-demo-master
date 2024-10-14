import React, { useState, useEffect } from 'react'
import { Card } from 'antd'
import { Button, Form, Input, Switch } from 'antd';
import {ReactComponent as Languages} from '../../assets/Languages.svg';
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";


const Login = () => {
  const [form] = Form.useForm();
  const [loginOrRegister, setloginOrRegister] = useState(true)
  const [showRessetPasswordModal, setshowRessetPasswordModal] = useState(false)
  const [passwordCode, setpasswordCode] = useState("0000")
  let navigate = useNavigate();

  function handle_register() {
    return navigate("/scale");
  }

  function handle_proceed() {
    setshowRessetPasswordModal(false)
    setloginOrRegister(true)
  }


  function setCookie(key, value, expirationDate) {
    try {
      let cookieString = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      
      if (expirationDate) {
        const date = new Date(expirationDate);
        if (isNaN(date.getTime())) {
          throw new Error("wrong date");
        }
        cookieString += `; expires=${date.toUTCString()}`;
      }
      
      cookieString += "; path=/";
      
      document.cookie = cookieString;
  
    } catch (error) {
      console.error("cookie set error: ", error);
    }
  }

  //we use it cause cookies are blocked in http connection by default in prod use setcookie
  function setLocalStorage(key, value, expirationDate) {
    try {
      const item = {
        value: value,
        expiration: expirationDate ? new Date(expirationDate).getTime()+ (2*60*60*1000) : null
      };

      localStorage.setItem(key, JSON.stringify(item));
  
    } catch (error) {
      console.error("Błąd podczas zapisu do localStorage:", error);
    }
  }

  function getFromLocalStorage(key) {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      
      const parsedItem = JSON.parse(item);
      if (parsedItem.expiration && new Date().getTime() > parsedItem.expiration) {
        localStorage.removeItem(key);
        console.log(`Item '${key}' wygasł i został usunięty z localStorage.`);
        return null;
      }
  
      return parsedItem.value;
    } catch (error) {
      console.error("Błąd podczas odczytu z localStorage:", error);
      return null;
    }
  }

  // useEffect(() => {
  //   if (getFromLocalStorage("token") !== null){
  //       return navigate("/");
  //   }
  // }, [])



  useEffect(() => {
    console.log(showRessetPasswordModal)
  
  }, [])
  

  function handle_language() {
    return navigate("/language");
  }
  return (
    <div className='flex flex-col items-center justify-center w-screen h-screen'>
        <Card className="flex justify-center space-y-4" style={{
              width: 330,
              height: 436,
              margin: "20px",
              borderRadius: "20px",
              overflow: "hidden",
        }}>
          <div className='flex flex-col items-center  w-screen h-screen overflow-auto'>
            <Button onClick={handle_register} htmlType="submit"  style={{
                            width: '171px',
                            height: '46px',
                            borderRadius: "100px",
                            overflow: "hidden",
                            fontWeight: 'bold',
                            backgroundImage: "linear-gradient(to right, #80A1D4, #75C9C8)",
                             }} type="primary">Start Game
            </Button>
            <h1 className='text-xl text-center font-bold text-blue-700'>Scan QR code to connect</h1>
            <h1 className='text-xl text-center font-bold text-blue-700 pb-1'>your phone as GamePad</h1>
            <div style={{ height: "auto", margin: "0 auto", maxWidth: 260, width: "100%" }}>
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={"http://172.20.10.4:3000s/controller"}
                viewBox={`0 0 256 256`}
              />
            </div>
            </div>
        </Card>

    </div>
  )
}

export default Login