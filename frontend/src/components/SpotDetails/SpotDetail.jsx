import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpot } from "../../store/spots";
import "./SpotDetail.css";
import { FaStar } from "react-icons/fa";
import { getSpotReviews, deleteReview } from "../../store/reviews";
import NewReviewModal from "../CreateReview/CreateReviewModal";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import ConfirmationModal from "../DeleteReview/DeleteReview";
import '../ManageSpots/ManageSpots.css';


function SpotDetails() {
  const dispatch = useDispatch();
  const { spotId } = useParams();

  const sessionUser = useSelector((state) => state.session.user);

  const spotReviews = useSelector((state) => state.reviews[spotId]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);

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
  }, [dispatch, spotId]);

  useEffect(() => {
    dispatch(getSpotReviews(spotId));
  }, [dispatch, spotId]);

  useEffect(() => {
    let shouldShowReview = false;
    let isLoggedIn = false;
    let isOwner = false;
    let userAlreadyReview = false;

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
    } else {
        setShouldShowReview(false)
    }
  }, [sessionUser, reviews, spot]);

  if (!spot) return <p>Loading</p>;

  function formatRating(rating) {
    if (!rating) return "New";
    return Math.round(rating);
  }

  const handleDeleteClick = (e, reviewId) => {
    e.stopPropagation();
    setIsModalOpen(true);
    setSelectedReviewId(reviewId);
  };

  const confirmDelete = () => {
    if (selectedReviewId) {
      dispatch(deleteReview(selectedReviewId, spotId));
      setIsModalOpen(false);
    }
  };

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
                (image, index) =>
                  image.preview && (
                    <img
                      key={image.id}
                      src={image.url}
                      alt={`Spot Image ${index + 1}`}
                    />
                  )
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
                {spot.numReviews > 0 && (
                  <>
                    <span> · </span>
                    <span className="num-reviews">
                      {spot.numReviews}{" "}
                      {spot.numReviews === 1 ? "review" : "reviews"}
                    </span>
                  </>
                )}
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
            {spot.numReviews > 0 && (
              <>
                <span> · </span>
                <span className="num-reviews">
                  {spot.numReviews}{" "}
                  {spot.numReviews === 1 ? "review" : "reviews"}
                </span>
              </>
            )}
          </div>

          {shouldShowReview && (
            <OpenModalButton
              buttonText="Post Your Review"
              modalComponent={<NewReviewModal spotId={spotId} />}
            />
          )}
            {sessionUser?.id && !(spot && spot.ownerId === sessionUser.id) && reviews.length === 0 && <h2>Be the first to write a review!</h2>}
          <ul>
            {reviews.map((review) => {
                const createdAt = new Date(review.createdAt)

                const monthName = createdAt.toLocaleString('default', { month: 'long' });

                const year = createdAt.toLocaleString('default', {year: 'numeric'})

              return (
                <li key={review.id}>
                  <h2>{review.User.firstName}</h2>
                  <h3>{monthName} {year}</h3>
                  <p>{review.review}</p>
                  {sessionUser?.id === review.User.id && (
                    <button onClick={(e) => handleDeleteClick(e, review.id)}>
                      Delete
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this review?"
      />
    </>
  );
}

export default SpotDetails;
