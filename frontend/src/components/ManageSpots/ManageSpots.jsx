import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserSpots, deleteSpot } from "../../store/spots";
import { NavLink, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import ConfirmationModal from "../DeleteSpot/ConfirmationModal";

function ManageSpots() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpotId, setSelectedSpotId] = useState(null);

  let userId;
  if (sessionUser) {
    userId = sessionUser.id;
  }

  const spots = Object.values(useSelector((state) => state.spots)).filter(
    (spot) => spot.ownerId === userId
  );

  useEffect(() => {
    dispatch(getUserSpots(userId));
  }, [dispatch, userId]);

  const handleDelete = (spotId) => {
    dispatch(deleteSpot(spotId));
    setIsModalOpen(false);
  };

  return (
    sessionUser && (
      <>
        <h1>Manage Spots</h1>
        {spots.length > 0 && (
          <div className="spot-list">
            {spots.map((spot) => (
              <div
                key={spot.id}
                className="spot-tile"
                onClick={() => navigate(`/spots/${spot.id}`)}
              >
                <img
                  src={spot.previewImage}
                  alt={spot.name}
                  className="spot-thumbnail"
                />
                <div className="spot-info">
                  <div>
                    {spot.city}, {spot.state}
                  </div>
                  <div>
                    <FaStar /> {spot.avgRating || "New"}
                  </div>
                  <div>${spot.price} per night</div>
                  <div className="spot-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/spots/${spot.id}/edit`);
                      }}
                    >
                      Update
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSpotId(spot.id);
                        setIsModalOpen(true);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {spots.length === 0 && (
          <NavLink to="/spots/new">Create a New Spot</NavLink>
        )}
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={() => handleDelete(selectedSpotId)}
          title="Confirm Delete"
          message="Are you sure you want to remove this spot?"
        />
      </>
    )
  );
}

export default ManageSpots;
