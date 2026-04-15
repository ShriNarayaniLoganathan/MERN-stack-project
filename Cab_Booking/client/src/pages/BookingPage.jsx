import MapView from "../components/MapView";

const BookingPage = () => {
    const pickup = "Anna Nagar,Chennai";
    return(
        <div>
            <h2>Book Your Ride</h2>
            <MapView pickup={pickup}/>
        </div>
    );
};

export default BookingPage;