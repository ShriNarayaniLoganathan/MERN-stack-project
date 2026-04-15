import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { rideApi } from "../services/api";

const statusFlow = ["driver_assigned", "on_the_way", "in_progress", "completed"];

const bookingDefaults = {
  pickup: "",
  dropoff: "",
  distanceKm: 8,
  cabType: "Mini",
  bookedFor: "",
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const formatStatus = (status) =>
  status.replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase());

export default function DashboardPage() {
  const { token, user, logout } = useAuth();
  const [bookingForm, setBookingForm] = useState(bookingDefaults);
  const [estimate, setEstimate] = useState(null);
  const [rides, setRides] = useState([]);
  const [loadingEstimate, setLoadingEstimate] = useState(false);
  const [submittingRide, setSubmittingRide] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadRides = async () => {
      try {
        const response = await rideApi.getMine(token);
        setRides(response.data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load rides.");
      }
    };

    loadRides();
  }, [token]);

  const fetchRides = async () => {
    try {
      const response = await rideApi.getMine(token);
      setRides(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load rides.");
    }
  };

  const activeRide = useMemo(
    () => rides.find((ride) => !["completed", "cancelled"].includes(ride.status)),
    [rides]
  );

  const handleBookingChange = (event) => {
    setBookingForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleEstimate = async () => {
    setLoadingEstimate(true);
    setError("");
    setMessage("");

    try {
      const response = await rideApi.estimate({
        cabType: bookingForm.cabType,
        distanceKm: Number(bookingForm.distanceKm),
      });

      setEstimate(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not estimate fare.");
    } finally {
      setLoadingEstimate(false);
    }
  };

  const handleBookingSubmit = async (event) => {
    event.preventDefault();
    setSubmittingRide(true);
    setError("");
    setMessage("");

    try {
      const response = await rideApi.book(
        {
          pickup: { address: bookingForm.pickup },
          dropoff: { address: bookingForm.dropoff },
          cabType: bookingForm.cabType,
          distanceKm: Number(bookingForm.distanceKm),
          bookedFor: bookingForm.bookedFor || new Date().toISOString(),
        },
        token
      );

      setEstimate({
        estimatedFare: response.data.ride.estimatedFare,
        fareBreakdown: response.data.fareBreakdown,
      });
      setBookingForm(bookingDefaults);
      setMessage("Ride booked and driver assigned.");
      await fetchRides();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Booking failed.");
    } finally {
      setSubmittingRide(false);
    }
  };

  const advanceRideStatus = async () => {
    if (!activeRide) {
      return;
    }

    const currentIndex = statusFlow.indexOf(activeRide.status);
    const nextStatus = statusFlow[Math.min(currentIndex + 1, statusFlow.length - 1)];

    try {
      await rideApi.updateStatus(activeRide._id, { status: nextStatus }, token);
      setMessage(`Ride updated to ${formatStatus(nextStatus)}.`);
      setError("");
      await fetchRides();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not update ride status.");
    }
  };

  const cancelRide = async (rideId) => {
    try {
      await rideApi.updateStatus(rideId, { status: "cancelled" }, token);
      setMessage("Ride cancelled.");
      setError("");
      await fetchRides();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not cancel ride.");
    }
  };

  const deleteRide = async (rideId) => {
    try {
      await rideApi.remove(rideId, token);
      setMessage("Ride removed from history.");
      setError("");
      await fetchRides();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not delete ride.");
    }
  };

  return (
    <div className="app-shell page">
      <header className="topbar">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Hello, {user?.name || "Rider"}</h1>
          <p className="muted-text">
            Book a cab, estimate fares, track active rides, and review trip history.
          </p>
        </div>

        <div className="button-row">
          <button className="button-secondary" onClick={fetchRides} type="button">
            Refresh rides
          </button>
          <button className="button" onClick={logout} type="button">
            Logout
          </button>
        </div>
      </header>

      {error ? <div className="message error">{error}</div> : null}
      {message ? <div className="message success">{message}</div> : null}

      <div className="dashboard-grid">
        <section className="card">
          <p className="eyebrow">New Ride</p>
          <h2>Book your next cab</h2>

          <form className="stack" onSubmit={handleBookingSubmit}>
            <div className="card-grid">
              <div className="field">
                <label htmlFor="pickup">Pickup location</label>
                <input
                  id="pickup"
                  name="pickup"
                  onChange={handleBookingChange}
                  placeholder="Airport Terminal 2"
                  required
                  value={bookingForm.pickup}
                />
              </div>

              <div className="field">
                <label htmlFor="dropoff">Dropoff location</label>
                <input
                  id="dropoff"
                  name="dropoff"
                  onChange={handleBookingChange}
                  placeholder="MG Road"
                  required
                  value={bookingForm.dropoff}
                />
              </div>
            </div>

            <div className="card-grid">
              <div className="field">
                <label htmlFor="distanceKm">Distance (km)</label>
                <input
                  id="distanceKm"
                  min="1"
                  name="distanceKm"
                  onChange={handleBookingChange}
                  required
                  type="number"
                  value={bookingForm.distanceKm}
                />
              </div>

              <div className="field">
                <label htmlFor="cabType">Cab type</label>
                <select
                  id="cabType"
                  name="cabType"
                  onChange={handleBookingChange}
                  value={bookingForm.cabType}
                >
                  <option value="Mini">Mini</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label htmlFor="bookedFor">Schedule time</label>
              <input
                id="bookedFor"
                name="bookedFor"
                onChange={handleBookingChange}
                type="datetime-local"
                value={bookingForm.bookedFor}
              />
            </div>

            <div className="button-row">
              <button
                className="button-secondary"
                onClick={handleEstimate}
                disabled={loadingEstimate}
                type="button"
              >
                {loadingEstimate ? "Estimating..." : "Estimate Fare"}
              </button>
              <button className="button" disabled={submittingRide} type="submit">
                {submittingRide ? "Booking..." : "Book Cab"}
              </button>
            </div>
          </form>
        </section>

        <section className="card highlight">
          <p className="eyebrow">Fare Estimation</p>
          <h2>Price snapshot</h2>

          {estimate ? (
            <>
              <div className="fare-banner">
                <div>
                  <span className="muted-text">Estimated fare</span>
                  <strong>{formatCurrency(estimate.estimatedFare)}</strong>
                </div>
                <span className="badge">{estimate.cabType}</span>
              </div>

              <div className="ride-list">
                <div className="ride-item">
                  <div className="meta-row">
                    <span>Base fare</span>
                    <strong>{formatCurrency(estimate.fareBreakdown.baseFare)}</strong>
                  </div>
                  <div className="meta-row">
                    <span>Distance charge</span>
                    <strong>
                      {estimate.fareBreakdown.distanceKm} km x {formatCurrency(estimate.fareBreakdown.perKm)}
                    </strong>
                  </div>
                  <div className="meta-row">
                    <span>Surge multiplier</span>
                    <strong>{estimate.fareBreakdown.surgeMultiplier}x</strong>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="muted-text">
              Use the fare estimator to preview pricing before booking the ride.
            </p>
          )}
        </section>
      </div>

      <div className="dashboard-grid" style={{ marginTop: 20 }}>
        <section className="card">
          <p className="eyebrow">Live Tracking</p>
          <h2>Active ride</h2>

          {activeRide ? (
            <>
              <div className="ride-item">
                <div className="ride-item-top">
                  <div>
                    <strong>{activeRide.pickup.address}</strong>
                    <p className="muted-text">to {activeRide.dropoff.address}</p>
                  </div>
                  <span className={`badge ${activeRide.status}`}>
                    {formatStatus(activeRide.status)}
                  </span>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-bar"
                    style={{ width: `${activeRide.liveLocation?.progress || 0}%` }}
                  />
                </div>

                <p className="muted-text">{activeRide.liveLocation?.label}</p>

                <div className="ride-list">
                  <div className="meta-row">
                    <span>Driver</span>
                    <strong>{activeRide.driver?.name}</strong>
                  </div>
                  <div className="meta-row">
                    <span>Vehicle</span>
                    <strong>
                      {activeRide.driver?.vehicle} · {activeRide.driver?.plateNumber}
                    </strong>
                  </div>
                  <div className="meta-row">
                    <span>Contact</span>
                    <strong>{activeRide.driver?.phone}</strong>
                  </div>
                </div>
              </div>

              <div className="status-row">
                <button className="button-secondary" onClick={advanceRideStatus} type="button">
                  Advance status
                </button>
                <button
                  className="button-secondary button-danger"
                  onClick={() => cancelRide(activeRide._id)}
                  type="button"
                >
                  Cancel ride
                </button>
              </div>
            </>
          ) : (
            <p className="muted-text">No active ride right now. Book one to start tracking.</p>
          )}
        </section>

        <section className="card">
          <p className="eyebrow">Ride History</p>
          <h2>Your trips</h2>

          <div className="ride-list">
            {rides.length ? (
              rides.map((ride) => (
                <article className="ride-item" key={ride._id}>
                  <div className="ride-item-top">
                    <div>
                      <strong>{ride.pickup.address}</strong>
                      <p className="muted-text">to {ride.dropoff.address}</p>
                    </div>
                    <span className={`badge ${ride.status}`}>{formatStatus(ride.status)}</span>
                  </div>

                  <div className="meta-row">
                    <span>{ride.cabType}</span>
                    <strong>{formatCurrency(ride.finalFare)}</strong>
                  </div>
                  <div className="meta-row">
                    <span>{ride.distanceKm} km</span>
                    <span>{new Date(ride.bookedFor).toLocaleString()}</span>
                  </div>

                  <div className="button-row">
                    {["completed", "cancelled"].includes(ride.status) ? (
                      <button
                        className="button-secondary button-danger"
                        onClick={() => deleteRide(ride._id)}
                        type="button"
                      >
                        Delete
                      </button>
                    ) : null}
                  </div>
                </article>
              ))
            ) : (
              <p className="muted-text">Your completed and upcoming rides will appear here.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
