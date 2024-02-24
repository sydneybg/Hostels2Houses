import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpots } from "../../store/spots";
import { Link } from "react-router-dom";
import "./SpotList.css";
import { FaStar } from "react-icons/fa";



function SpotsList() {
  const dispatch = useDispatch();

  const spots = Object.values(useSelector((state) => state.spots));

  useEffect(() => {
    dispatch(getSpots());
  }, [dispatch]);

  function formatRating(rating) {
    if (!rating) return "New";

    return Math.round(rating);
  }

  return (
    <>
      <section>
        <div className="spot-list">
          {spots.map((spot) => (
            <Link to={`/spots/${spot.id}`} key={spot.id} title={spot.name}>

              <div className="spot-tile" title={spot.name}>

                <img
                  src={spot.previewImage}
                  alt={spot.name}
                  className="spot-image"
                />

                <div title={spot.name} className="spot-details">
                  <div className="spot-title">{spot.name}</div>

                  <div className="spot-reviews">
                  <FaStar className="star-icon" />
                    {formatRating(spot.avgRating)}
                  </div>

                  <div className="spot-location">
                    {spot.city}, {spot.state}
                  </div>

                  <div className="spot-price">
                    ${spot.price} <small>night</small>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

export default SpotsList;
