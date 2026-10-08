import { createContext, useContext, useState } from "react";
import axios, { HttpStatusCode } from "axios";
import server from "../environment"
import { useNavigate } from "react-router";


// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext({})



const client =   axios.create({
    baseURL: `${server}/api/v1/users`
})


export const  AuthProvider = ({children}) => {

const authContext = useContext(AuthContext);
const [userData, setUserData] = useState(authContext);
const router = useNavigate();


  const handleRegister = async (name, username, password) => {
    try {
      
        let request = await client.post("/register", {
      name,
      username,
      password
    });
// console.log(request)

    
 if (request.status === HttpStatusCode.Created) {
      return request.data.message
    }
    return request.data.message; // return the message from the response
      

    } catch (err) {
      
      return err.response.data.message
           
      
    }
}
const handleLogin = async (username, password) => {
  try {
    let request = await client.post("/login", { username, password });

    
    console.log(request.data.message);
   if (request.status === HttpStatusCode.Ok) {
  
  localStorage.setItem("token", request.data.token);
  router("/home");
}
return request;   // return the response

  } catch (err) {
    let message = err.response?.data?.message || err.message;
    console.log(message);
    return { error: message }; // return something in case of error
  }
};
  
  const data = {userData, setUserData, handleLogin, handleRegister
  }
  return (
  <AuthContext.Provider value ={data}>
      {children}
  </AuthContext.Provider>
  )
}
