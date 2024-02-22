import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpots } from "../../store/spots";
import { Link } from "react-router-dom";
import './SpotList.css'

function SpotsList() {
    const dispatch = useDispatch();

    const spots = Object.values(useSelector(state => state.spots));

    useEffect(() => {
        dispatch(getSpots())
    }, [dispatch])


    return (
    <>
    <section>
        <div className="spot-list">
            {spots.map(spot => (
                    <div key={spot.id}>
                        <Link to={`/spots/${spot.id}`}>
                            <span>{spot.name}</span>
                            <img
                                src={spot.previewImage}
                                alt={spot.name}
                                className="spot-image"
                            />
                        </Link>
                    <div>
                        <span className="city-state">
                            {`${spot.city}, ${spot.state}`}</span>
                        <span>&#9733; {parseFloat(spot.avgRating).toFixed(2)}</span>

                    </div>
                        <span>{`$${parseFloat(spot.price).toFixed(2)} night`}</span>
                    </div>
                ))
            }
        </div>
    </section>
    </>);
}

export default SpotsList;
