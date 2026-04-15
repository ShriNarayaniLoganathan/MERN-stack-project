import React,{useState} from "react";
import { AuthAPI} from "./api";

function Login({setUser}) {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const login = () => {
        AuthAPI.post("/login",{email,password})
        .then((res) => {
            alert("Login success✅");
            localStorage.setItem("user",JSON.stringify(res.data.user));
            localStorage.setItem("token",res.data.token);
            setUser(res.data.user);
    })
    .catch(() => alert("Login failed❌"));
};
const register = () => {
    AuthAPI.post("/register",{email,password})
    .then(() => alert("Registration success✅"))
    .catch(() => alert("Registration failed❌"));
};
return (
    <div style={{textAlign: "center",marginTop: "100px"}}>
        <h2>🔐 Login</h2>
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)}/><br/><br/>
        <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)}/><br/><br/>
        <button onClick={login}>Login</button>
        <button onClick={register} style={{marginLeft: "10px"}}>Register</button>
    </div>
);
}

export default Login;