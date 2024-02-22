import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getReviews, getSpot, getSpots } from "../../store/spots";
import './SpotDetail.css'
import { FaStar } from 'react-icons/fa';

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

    const reviews = Object.values(useSelector(state => state.reviews))
    // if (reviews){

    // }

    //map through reviews to find the review

    useEffect(() => {
        dispatch(getReviews())
            .then(async() => {
                await dispatch(getReviews(spotId))
            })
    }, [dispatch, spotId])


    return (
        <>
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
                <div className="card">
                <div className="flex justifycontent-between">
                <div className="price">
                    <span>$ {spot.price}</span>
                </div>
                <div className="rating">
                    <span>&#9733; {spot.avgStarRating}</span>
                </div>
                <div className="num-reviews">
                    <span>{spot.numReviews} reviews</span>
                </div>
                </div>
                <button onClick={() => alert("Feature coming soon")}>Reserve</button>
                </div>
            </div>
        </section>
<section>
<div className="review-section">
<FaStar className="star-icon" />
<div className="review-nums">{spot.avgStarRating}  {spot.numReviews} reviews </div>
{/* //Repeat per each review (map) */}
<h2>{review.user.name}</h2>
<h3>{review.date}</h3>
<p>{review.description}</p>
</div>

</section>
</>
     );
}




export default SpotDetails;
