**Experiment 1: Counter app**



**(App.jsx)**



import { useState } from "react";



export default function App() {

&#x20; const \[count, setCount] = useState(0);



&#x20; return (

&#x20;   <div style={{ textAlign: "center" }}>

&#x20;     <h1>Counter</h1>

&#x20;     <h2>{count}</h2>

&#x20;     <button onClick={() => setCount(count + 1)}>+</button>

&#x20;     <button onClick={() => setCount(count - 1)}>-</button>

&#x20;     <button onClick={() => setCount(0)}>Reset</button>

&#x20;   </div>

&#x20; );

}



**Experiment 2: To-Do List**



**(App.jsx)**



import { useState } from "react";



export default function App() {

&#x20; const \[tasks, setTasks] = useState(\[]);

&#x20; const \[text, setText] = useState("");



&#x20; const addTask = (e) => {

&#x20;   e.preventDefault();

&#x20;   if (!text) return;

&#x20;   setTasks(\[...tasks, { id: Date.now(), text, done: false }]);

&#x20;   setText("");

&#x20; };



&#x20; const toggle = (id) =>

&#x20;   setTasks(tasks.map(t =>

&#x20;     t.id === id ? { ...t, done: !t.done } : t

&#x20;   ));



&#x20; const remove = (id) =>

&#x20;   setTasks(tasks.filter(t => t.id !== id));



&#x20; return (

&#x20;   <div>

&#x20;     <h1>To-Do</h1>

&#x20;     <form onSubmit={addTask}>

&#x20;       <input value={text} onChange={(e)=>setText(e.target.value)} />

&#x20;       <button>Add</button>

&#x20;     </form>

&#x20;     {tasks.map(t => (

&#x20;       <div key={t.id}>

&#x20;         <span onClick={()=>toggle(t.id)}

&#x20;           style={{ textDecoration: t.done ? "line-through" : "" }}>

&#x20;           {t.text}

&#x20;         </span>

&#x20;         <button onClick={()=>remove(t.id)}>X</button>

&#x20;       </div>

&#x20;     ))}

&#x20;   </div>

&#x20; );

}



**Experiment 3: Registration Form** 

**(App.jsx)**



import { useState } from "react";



export default function App() {

&#x20; const \[form, setForm] = useState({ name:"", email:"", pass:"" });

&#x20; const \[data, setData] = useState(null);



&#x20; const handleSubmit = (e) => {

&#x20;   e.preventDefault();

&#x20;   setData(form);

&#x20;   setForm({ name:"", email:"", pass:"" });

&#x20; };



&#x20; return (

&#x20;   <div>

&#x20;     <h1>Form</h1>

&#x20;     <form onSubmit={handleSubmit}>

&#x20;       <input placeholder="Name"

&#x20;         value={form.name}

&#x20;         onChange={(e)=>setForm({...form,name:e.target.value})}/>

&#x20;       <input placeholder="Email"

&#x20;         value={form.email}

&#x20;         onChange={(e)=>setForm({...form,email:e.target.value})}/>

&#x20;       <input type="password" placeholder="Password"

&#x20;         value={form.pass}

&#x20;         onChange={(e)=>setForm({...form,pass:e.target.value})}/>

&#x20;       <button>Submit</button>

&#x20;     </form>



&#x20;     {data \&\& (

&#x20;       <div>

&#x20;         <p>{data.name}</p>

&#x20;         <p>{data.email}</p>

&#x20;         <p>{data.pass}</p>

&#x20;       </div>

&#x20;     )}

&#x20;   </div>

&#x20; );

}



**Experiment 4: Color picker** 

**(App.jsx)**



import { useState } from "react";



export default function App() {

&#x20; const \[color, setColor] = useState("white");



&#x20; return (

&#x20;   <div style={{ textAlign:"center" }}>

&#x20;     <button onClick={()=>setColor("red")}>Red</button>

&#x20;     <button onClick={()=>setColor("blue")}>Blue</button>

&#x20;     <button onClick={()=>setColor("green")}>Green</button>



&#x20;     <div style={{

&#x20;       width:200, height:100,

&#x20;       margin:"20px auto",

&#x20;       background:color

&#x20;     }}></div>

&#x20;   </div>

&#x20; );

}



**Experiment 5: Greeting** 

**(App.jsx)**



import { useState, useEffect } from "react";



export default function App() {

&#x20; const \[greet, setGreet] = useState("");



&#x20; useEffect(() => {

&#x20;   const hour = new Date().getHours();

&#x20;   if (hour < 12) setGreet("Good Morning");

&#x20;   else if (hour < 17) setGreet("Good Afternoon");

&#x20;   else if (hour < 20) setGreet("Good Evening");

&#x20;   else setGreet("Good Night");

&#x20; }, \[]);



&#x20; return <h1>{greet}</h1>;

}



**Experiment 6: Real -Time Calculator**

**(App.jsx)**



import { useState } from "react";



export default function App() {

&#x20; const \[a, setA] = useState("");

&#x20; const \[b, setB] = useState("");



&#x20; const n1 = Number(a);

&#x20; const n2 = Number(b);



&#x20; return (

&#x20;   <div>

&#x20;     <input type="number" onChange={(e)=>setA(e.target.value)} />

&#x20;     <input type="number" onChange={(e)=>setB(e.target.value)} />



&#x20;     <p>Add: {n1+n2}</p>

&#x20;     <p>Sub: {n1-n2}</p>

&#x20;     <p>Mul: {n1\*n2}</p>

&#x20;     <p>Div: {n2===0?"Not possible":n1/n2}</p>

&#x20;   </div>

&#x20; );

}



**Experiment 7: API Fetch**

**(App.jsx)**



import { useState, useEffect } from "react";



export default function App() {

&#x20; const \[users, setUsers] = useState(\[]);



&#x20; useEffect(()=>{

&#x20;   fetch("https://jsonplaceholder.typicode.com/users")

&#x20;     .then(res=>res.json())

&#x20;     .then(data=>setUsers(data));

&#x20; },\[]);



&#x20; return (

&#x20;   <div>

&#x20;     <h1>Users</h1>

&#x20;     {users.map(u=>(

&#x20;       <div key={u.id}>

&#x20;         <p>{u.name}</p>

&#x20;         <p>{u.email}</p>

&#x20;       </div>

&#x20;     ))}

&#x20;   </div>

&#x20; );

}



**Experiment 8:Tab Navigation**

**(App.jsx)**



import { useState } from "react";



export default function App() {

&#x20; const \[tab, setTab] = useState("home");



&#x20; return (

&#x20;   <div>

&#x20;     <button onClick={()=>setTab("home")}>Home</button>

&#x20;     <button onClick={()=>setTab("about")}>About</button>

&#x20;     <button onClick={()=>setTab("contact")}>Contact</button>



&#x20;     {tab==="home" \&\& <p>Home Content</p>}

&#x20;     {tab==="about" \&\& <p>About Content</p>}

&#x20;     {tab==="contact" \&\& <p>Contact Content</p>}

&#x20;   </div>

&#x20; );

}



**Experiment 9: Dark/Light Mode**

**(App.jsx)**



import { useState } from "react";



export default function App() {

&#x20; const \[dark, setDark] = useState(false);



&#x20; return (

&#x20;   <div style={{

&#x20;     background: dark?"black":"white",

&#x20;     color: dark?"white":"black",

&#x20;     minHeight:"100vh"

&#x20;   }}>

&#x20;     <button onClick={()=>setDark(!dark)}>

&#x20;       Toggle Theme

&#x20;     </button>

&#x20;     <h1>Theme Example</h1>

&#x20;   </div>

&#x20; );

}



**Experiment 10: Mini Blog**

**(Main.jsx)**



import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Home";

import Post from "./Post";



createRoot(document.getElementById("root")).render(

&#x20; <BrowserRouter>

&#x20;   <Routes>

&#x20;     <Route path="/" element={<Home />} />

&#x20;     <Route path="/post/:id" element={<Post />} />

&#x20;   </Routes>

&#x20; </BrowserRouter>

);



**(Home.jsx)**



import { Link } from "react-router-dom";



const posts = \[

&#x20; { id:1, title:"Post 1", content:"Full content 1" },

&#x20; { id:2, title:"Post 2", content:"Full content 2" }

];



export default function Home(){

&#x20; return posts.map(p=>(

&#x20;   <div key={p.id}>

&#x20;     <h2>{p.title}</h2>

&#x20;     <Link to={`/post/${p.id}`}>Read More</Link>

&#x20;   </div>

&#x20; ));

}



**(Post.jsx)**



import { useParams, Link } from "react-router-dom";



const posts = \[

&#x20; { id:1, title:"Post 1", content:"Full content 1" },

&#x20; { id:2, title:"Post 2", content:"Full content 2" }

];



export default function Post(){

&#x20; const { id } = useParams();

&#x20; const post = posts.find(p=>p.id===parseInt(id));



&#x20; return (

&#x20;   <div>

&#x20;     <Link to="/">Back</Link>

&#x20;     <h1>{post.title}</h1>

&#x20;     <p>{post.content}</p>

&#x20;   </div>

&#x20; );

}



