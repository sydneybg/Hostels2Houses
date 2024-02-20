import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpot, getSpots } from "../../store/spots";

function SpotDetails() {
    const dispatch = useDispatch();
    const { spotId } = useParams();

    let spot = null;

    const spots = useSelector(state => state.spots);
    if (spots) {
      spot = spots[spotId];
    }


    useEffect(() => {
        dispatch(getSpots())
            .then(async () => {
                await dispatch(getSpot(spotId))
            })
    }, [dispatch, spotId])

    return (
        <section>
            <div className="spot-details">
                <h2>{spot.name}</h2>
                <h4>{spot.city}, {spot.state}, {spot.country}</h4>
                <div className="images">
                    {spot.SpotImages && spot.SpotImages.map(image => (
                        image.preview &&
                        <img key={image.id} src={image.url} />
                    ))}
                </div>
                <h3 className="host">Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</h3>
                <span>{spot.description}</span>
                <div className="price">
                    <span>$ {spot.price}</span>
                </div>
                <div className="rating">
                    <span>&#9733; {spot.avgStarRating}</span>
                </div>
                <button onClick={() => alert("Feature coming soon")}>Reserve</button>
            </div>
        </section>
     );
}

export default SpotDetails;
