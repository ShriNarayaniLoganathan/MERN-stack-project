const MapView = ({ pickup, drop }) => {
  const from = pickup?.trim();
  const to = drop?.trim();
  const route = `${from} to ${to}`;

  return (
    <div style={{ margin: "20px" }}>

      <iframe
        title="route-map"
        width="100%"
        height="250"
        style={{ border: 0, borderRadius: "15px" }}
        loading="lazy"
        src={`https://maps.google.com/maps?q=${encodeURIComponent(route)}&output=embed`}
      />

    </div>
  );
};

export default MapView;