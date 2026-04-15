const cabPricing = {
  Mini: { baseFare: 70, perKm: 12 },
  Sedan: { baseFare: 110, perKm: 16 },
  SUV: { baseFare: 160, perKm: 20 },
};

const statusMeta = {
  booked: { label: "Booking confirmed", progress: 10 },
  driver_assigned: { label: "Driver assigned", progress: 25 },
  on_the_way: { label: "Driver is heading to pickup", progress: 45 },
  in_progress: { label: "Ride in progress", progress: 72 },
  completed: { label: "Trip completed", progress: 100 },
  cancelled: { label: "Ride cancelled", progress: 0 },
};

const calculateFare = ({ cabType, distanceKm }) => {
  const pricing = cabPricing[cabType] || cabPricing.Mini;
  const surgeMultiplier = distanceKm > 20 ? 1.18 : 1.08;
  const estimatedFare = Math.round((pricing.baseFare + distanceKm * pricing.perKm) * surgeMultiplier);

  return {
    cabType,
    estimatedFare,
    fareBreakdown: {
      baseFare: pricing.baseFare,
      perKm: pricing.perKm,
      distanceKm,
      surgeMultiplier,
    },
  };
};

const getStatusMeta = (status) => statusMeta[status] || statusMeta.booked;

module.exports = {
  cabPricing,
  calculateFare,
  getStatusMeta,
};
