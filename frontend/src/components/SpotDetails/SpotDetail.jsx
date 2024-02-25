import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpot } from "../../store/spots";
import "./SpotDetail.css";
import { FaStar } from "react-icons/fa";
import { getSpotReviews } from "../../store/reviews";
import NewReviewModal from "../CreateReview/CreateReviewModal";
import OpenModalButton from "../OpenModalButton/OpenModalButton";

function SpotDetails() {
  const dispatch = useDispatch();
  const { spotId } = useParams();

  const sessionUser = useSelector((state) => state.session.user);

  const spotReviews = useSelector((state) => state.reviews[spotId]);

  let reviews = [];

  const allReviews = useSelector((state) => state.reviews);
  if (allReviews && allReviews[spotId]) {
    reviews = allReviews[spotId];
  }

  let spot = null;

  const spots = useSelector((state) => state.spots);
  if (spots) {
    spot = spots[spotId];
  }

  const [shouldShowReview, setShouldShowReview] = useState(false);

  useEffect(() => {
    dispatch(getSpot(spotId));
  }, [spotId]);

  useEffect(() => {
    dispatch(getSpotReviews(spotId));
  }, [spotId]);

  useEffect(() => {
    let shouldShowReview = false;
    let isLoggedIn = false;
    let isOwner = false;
    let userAlreadyReview = false;

    console.log(sessionUser)

if (sessionUser) {
    if (sessionUser.id) {
      isLoggedIn = true;
    }

    if (spot && spot.ownerId === sessionUser.id) {
      isOwner = true;
    }

    if (spotReviews && spotReviews.length > 0) {
        userAlreadyReview = spotReviews.find((spotReview) => {
        return sessionUser.id === spotReview.userId;
      });
    }
}


    if (!isOwner && !userAlreadyReview && isLoggedIn) {
      setShouldShowReview(true);
    }
  }, [sessionUser, reviews, spot]);

  if (!spot) return <p>Loading</p>;

  function formatRating(rating) {
    if (!rating) return "New";
    return Math.round(rating);
  }



  return (
    <>
      <section>
        <div className="spot-details">
          <h2>{spot.name}</h2>
          <h4>
            {spot.city}, {spot.state}, {spot.country}
          </h4>
          <div className="images">
            {spot.SpotImages &&
              spot.SpotImages.map(
                (image) =>
                  image.preview && <img key={image.id} src={image.url} />
              )}
          </div>
          <h3 className="host">
            Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}
          </h3>
          <div className="details-flex">
            <span className="desc">{spot.description}</span>
            <div className="card">
              <div className="flex justifycontent-between">
                <div className="price">
                  <span>$ {spot.price} night </span>
                </div>
                <div className="rating">
                  <FaStar className="star-icon" />
                  <span>{formatRating(spot.avgStarRating)}</span>
                </div>
                <div className="num-reviews">
                  <span>{spot.numReviews} {spot.numReviews === 1 ? "review" : "reviews"}</span>
                </div>
              </div>
              <button onClick={() => alert("Feature coming soon")}>
                Reserve
              </button>
            </div>
          </div>
        </div>
      </section>
      <hr></hr>
      <section>
        <div className="review-section">
          <div className="rating-and-review">
            <span className="rating-container">
              <FaStar className="star-icon" />
              <span className="avg-rating">
                {Math.round(spot.avgStarRating)}
              </span>
            </span>
            <span className="num-reviews">{spot.numReviews} {spot.numReviews === 1 ? "review" : "reviews"}</span>
          </div>

          {shouldShowReview && (
            <OpenModalButton
              buttonText="Post Your Review"
              modalComponent={<NewReviewModal spotId={spotId} />}
            />
          )}

          <ul>
            {reviews.map((review) => {
              return (
                <li key={review.id}>
                  <h2>{review.User.firstName}</h2>
                  <h3>{review.createdAt}</h3>
                  <p>{review.review}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}

export default SpotDetails;
