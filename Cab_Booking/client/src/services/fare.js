export const calculateDistance = (pickup,drop) => {
    if(!pickup || !drop) return 5;
    return Math.floor(Math.random() * 15)+2;
};

export const calculateFare = (distance) =>{
    const baseFare = 50;
    const perKm = 10;
    return baseFare + distance * perKm;
};

export const calculateFareETA = (distance) => {
    return distance * 3;
};
