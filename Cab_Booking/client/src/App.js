import React, { useEffect, useState } from "react";
import API from "./api";
import logo from  "./logo.png";
import Login from "./Login";
import MapView from "./components/MapView";
import { calculateDistance, calculateFare,calculateFareETA} from "./services/fare";

function App() {
  const [user, setUser] = useState(null);
  const [rides, setRides] = useState([]);
  const [pickup,setPickup] = useState("");
  const [drop,setDrop] = useState("");
  const[editingId,setEditingId] = useState(null);
  const distance = calculateDistance(pickup,drop);
  const fare = calculateFare(distance);
  const eta = calculateFareETA(distance);
  const [LiveETA, setLiveETA]= useState(0);
  const [rideStatus,setRideStatus] = useState("Booked");
  const [selectedDriver, setSelectedDriver] = useState(null);
  const addRide = (e) => {
    e.preventDefault();
    if(!pickup || !drop){
      alert("Please enter picup and drop");
      return;
    }
    console.log("Button clicked 🚀");

    API.post("/",{pickup,drop})
    .then(res => {
      console.log("Ride added:",res.data);
      setRides(prev => [...prev,res.data]);
    })
    .catch(err => {
      console.error("Error adding ride:",err);
    });
  };
  const deleteRide = (id) => {
    console.log("Delete Clicked 🔥", id);
    API.delete(`/${id}`)
    .then(() => {
      console.log("Deleted from Backend ✅");
      return API.get("/");
    })
    .then(res => {
      setRides(res.data);
    })
    .catch(err => console.log("Delete error ❌", err));
  };
  const editRide = (ride) => {
    setPickup(ride.pickup);
    setDrop(ride.drop);
    setEditingId(ride._id);
  };
  const updateRide = () => {
    API.put(`/${editingId}`,{pickup,drop})
    .then(res => {
      setRides(prev => 
        prev.map(ride =>
          ride._id === editingId ? res.data : ride
        )
      );
      setEditingId(null);
      setPickup("");
      setDrop("");
    })
    .catch(err => console.log(err));
  };
  const driver = [
    {id: 1, name: "Akash", car: "Swift", rating: 4.5},
    {id: 2, name: "Rahul", car: "Baleno", rating: 4.7},
    {id: 3, name: "Sonia", bike: "Splendor", rating: 4.6},
  ];
  const acceptDriver = (driver) => {
    setSelectedDriver(driver);
    setRideStatus("Driver Assigned");
    setTimeout(() => setRideStatus("Driver Arriving"),5000);
    setTimeout(() => setRideStatus("Arrived"), 7000);
  setTimeout(() => setRideStatus("Completed"), 12000);
  };
  const rejectDriver =() => {
    setSelectedDriver(null);
    setRideStatus("Driver Rejected, Searching for new driver...");
    setTimeout(() => {
      const randomDriver = driver[Math.floor(Math.random() * driver.length)];
      setSelectedDriver(randomDriver);
      setRideStatus("New Driver Assigned");
    }, 3000);
  };
  useEffect(() => {
  let timer1;
  let timer2;

  if (rideStatus === "Booked") {
    timer1 = setTimeout(() => {
      setRideStatus("Arrived at Pickup");
    }, 5000);

    timer2 = setTimeout(() => {
      setRideStatus("Completed");
    }, 10000);
  }

  return () => {
    clearTimeout(timer1);
    clearTimeout(timer2);
  };
}, [rideStatus]);
  useEffect(() =>{
    const savedUser = localStorage.getItem("user");
    if(savedUser){
      setUser(JSON.parse(savedUser));
    }
  },[]);
  useEffect(() => {
    API.get("/")
      .then(res => {
        console.log("API Response:",res.data);
        const data = Array.isArray(res.data) ? res.data : [];
        setRides(data);
      })
      .catch(err => {
        console.log("API Error:",err);
      });
  }, []);
  useEffect(() => {
    setLiveETA(eta);
    const timer = setInterval(() => {
      setLiveETA(prev => prev > 0 ? prev - 1 : 0);
    }, 6000);
    return () => clearInterval(timer);
  }, [eta]);

  if(!user){
    return <Login setUser={setUser}/>;
  }

  return (
    <div style={{padding: "20px",fontFamily: "Tempus Sans ITC",background: "#f5f5f5",minHeight: "100vh"}}>
      <div style={{
        textAlign: "center",
        background: "black",
        color: "white",
        padding: "15px",
        fontSize: "20px",
        fontWeight: "bold"
        }}>
        <img src={logo} alt = "Cab Logo" style = {{width: "150px"}} />
        <h1>🚕 Cab Booking App</h1>
        <button onClick={() => {
          localStorage.removeItem("user");
          setUser(null);
        }}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "black",
          color: "white",
          border: "none",
          padding: "5px 10px",
          borderRadius: "5px",
          cursor: "pointer",
        }}>Logout</button>
      </div>
      <div style={{marginBottom :"20px",
        textAlign: "center",
        margin: "20px",
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
        }}>
        <input placeholder="📍Pickup Location" value={pickup}onChange={(e) => setPickup(e.target.value)}/>
        <input placeholder="🏁Drop Location" value={drop} onChange={(e) => setDrop(e.target.value)}/>
        <button onClick={editingId ? updateRide : addRide}
        style={{
          width: "100%",
          padding: "12px",
          background: "black",
          color: "white",
          border: "none",
          borderRadius: "5px",
          marginTop: "10px",
          fontSize: "16px"
        }}>
          {editingId ? "Update Ride" : "Add Ride"}
        </button>
      </div>
      <div style={{
        background: "white",
        padding: "15px",
        borderRadius: "10px",
        margin: "20px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
      }}>
        <h3>Ride Estimate 🚗</h3>
        <p>📏 Distance: {distance} KM</p>
        <p>💰 Fare: ₹{fare}</p>
        <p>⏱️ ETA: {eta} minutes</p>
        <p>⏳ Live ETA: {LiveETA} minutes</p>
      </div>
      <div style={{
  background: "white",
  padding: "15px",
  borderRadius: "10px",
  margin: "20px"
}}>
  <h3>Driver Assignment 🚗</h3>

  {driver.map((d) => (
    <div key={d.id} style={{
      padding: "10px",
      border: "1px solid #ccc",
      margin: "10px",
      borderRadius: "8px"
    }}>
      <p>👤 {d.name}</p>
      <p>🚗 {d.car || d.bike}</p>
      <p>⭐ {d.rating}</p>
      <button onClick={() => acceptDriver(d)}
        style={{ marginRight: "10px", background: "green", color: "white" }}>Accept</button>
      <button onClick={rejectDriver}
        style={{ background: "red", color: "white" }}>Reject</button>
    </div>
  ))}
</div>
{selectedDriver && (
  <div style={{
    margin: "10px",
    padding: "10px",
    backgorund: "#e0ffe0",
    borderRadius: "10px"
  }}>
    <h3>🚗 Selected Driver</h3>
      <p>👤 {selectedDriver.name}</p>
      <p>🚘 {selectedDriver.car || selectedDriver.bike}</p>
      <p>⭐ {selectedDriver.rating}</p>
      <p>📦 Status: {rideStatus}</p>
  </div>
)}

      <h2>Available Rides</h2>
      {rides.length === 0 && <p style={{textAlign: "center"}}>No rides found</p>}
      {rides.map((ride) => (
        <div
          key={ride._id}
          style={{
            border: "1px solid black",
            padding: "10px",
            margin: "10px",
            borderRadius:"10px",
            marginBottom: "10px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}>
        <p style={{margin: "5px 0"}}>
          📍{ride.pickup} → 🏁{ride.drop}
        </p>
        <button onClick={() => editRide(ride)} style={{
          marginRight:"10px",
          background: "lightblue",
          border: "none",
          color: "white",
          padding: "5px 10px",
          borderRadius: "5px",
        }}>Edit</button>
        <button onClick={() => deleteRide(ride._id)} style={{
          background: "red",
          border: "none",
          color: "white",
          padding: "5px 10px",
          borderRadius: "5px",
        }}>Delete</button>
        <h2>Map Test</h2>
        <MapView pickup={ride.pickup} drop = {ride.drop}/>
    </div>
      ))}
    </div>
  );
}

export default App;