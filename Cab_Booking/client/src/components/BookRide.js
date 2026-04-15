import { useState } from "react";
import API from "../api";

function BookRide({ refreshRides }) {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.post("/rides", { pickup, drop });

    alert("Ride Booked 🚕");

    setPickup("");
    setDrop("");

    refreshRides();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Book a Ride</h2>

      <input
        type="text"
        placeholder="Pickup Location"
        value={pickup}
        onChange={(e) => setPickup(e.target.value)}
      />

      <input
        type="text"
        placeholder="Drop Location"
        value={drop}
        onChange={(e) => setDrop(e.target.value)}
      />

      <button type="submit">Book</button>
    </form>
  );
}

export default BookRide;