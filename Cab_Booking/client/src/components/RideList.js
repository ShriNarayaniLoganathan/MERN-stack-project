function RideList({ rides }) {
  return (
    <div>
      <h2>Booked Rides</h2>

      {rides.length === 0 ? (
        <p>No rides yet</p>
      ) : (
        rides.map((ride, index) => (
          <div key={index}>
            <p>
              🚕 {ride.pickup} ➡️ {ride.drop}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default RideList;