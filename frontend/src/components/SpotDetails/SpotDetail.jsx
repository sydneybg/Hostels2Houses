import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpot } from "../../store/spots";
import './SpotDetail.css'
import { FaStar } from 'react-icons/fa';
import { getSpotReviews } from "../../store/reviews";
import NewReviewModal from '../CreateReview/CreateReviewModal';
import OpenModalButton from '../OpenModalButton/OpenModalButton';

function SpotDetails() {
    const dispatch = useDispatch();
    const { spotId } = useParams();

    const [shouldShowReview, setShouldShowReview] = useState(false);


    let spot = null;

    const spots = useSelector(state => state.spots);
    if (spots) {
      spot = spots[spotId];
    }

    useEffect(() => {
        dispatch(getSpot(spotId))

    }, [dispatch, spotId])

    let reviews = [];

    const allReviews = useSelector(state => state.reviews);
    if (allReviews && allReviews[spotId]) {
      reviews = allReviews[spotId];
    }


    useEffect(() => {
        console.log(spotId)
        dispatch(getSpotReviews(spotId))
    }, [dispatch, spotId])
    if(!spot) return <p>Loading</p>

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

{shouldShowReview &&    <OpenModalButton
                buttonText="Post Your Review"
                modalComponent={<NewReviewModal spotId={spotId}/>}
              />}

<ul>
    {reviews.map(review => {
        return(
        <li key ={review.id}>
        <h2>{review.User.firstName}</h2>
        <h3>{review.createdAt}</h3>
        <p>{review.review}</p>
        </li>
        )
    })}
</ul>
</div>

</section>
</>
     );
}




export default SpotDetails;
