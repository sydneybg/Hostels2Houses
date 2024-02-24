import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserSpots } from "../../store/spots";
import { NavLink } from "react-router-dom";

function ManageSpots() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  let userId;
  if (sessionUser) {
    userId = sessionUser.id;
  }

  const spots = Object.values(useSelector((state) => state.spots)).filter(
    (spot) => spot.ownerId === userId
  );


  useEffect(()=> {
    dispatch(getUserSpots(userId))
  }, [dispatch, userId])

return (
    sessionUser &&

    <>
        <h1>Manage Your Spots</h1>

    </>
)
}

export default ManageSpots;
