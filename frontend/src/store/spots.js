import { csrfFetch } from "./csrf";


export const LOAD_SPOTS = 'spots/LOAD_SPOTS';
export const LOAD_SPOT_DETAILS = 'spots/LOAD_SPOT_DETAILS';
export const LOAD_SPOT_IMAGES = 'spots/LOAD_SPOT_IMAGES';
export const LOAD_REVIEWS = 'spots/LOAD_REVIEWS';
export const UPDATE_SPOT = 'spots/UPDATE_SPOT';
export const REMOVE_SPOT = 'spots/REMOVE_SPOT';


export const loadSpots = (spots) => {
  return {
    type: LOAD_SPOTS,
    spots,
  };
};

export const loadOneSpot = (spot) => {
  return {
    type: LOAD_SPOT_DETAILS,
    spot,
  };
};

export const loadSpotImages = (spotImage, spotId) =>  {
  return {
    type: LOAD_SPOT_IMAGES,
    spotImage,
    spotId,
  };
};

export const loadReviews = (spotId, reviews) => {
    return {
        type: LOAD_REVIEWS,
        spotId,
        reviews
    }
}

export const updateOneSpot = (spot) => {
    return {
      type: UPDATE_SPOT,
      spot,
    };
  };


export const getSpots = () => async (dispatch) => {
    const response = await csrfFetch("/api/spots")

    if(response.ok) {
        const spots = await response.json();
        dispatch(loadSpots(spots))
    }
}

export const getSpot = (spotId) =>  async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`)

    if(response.ok) {
        const spot = await response.json();
        dispatch(loadOneSpot(spot))
    }
}

export const getUserSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots/current')

    if (response.ok) {
        const data =  await response.json()
        dispatch(getSpots(data))
        return data
    }
}

export const getReviews = (spotId) => async (dispatch) => {
    const reponse = await csrfFetch(`/api/spots/${spotId}/reviews`)

    if(reponse.ok){
        const reviews = await reponse.json();
        dispatch(loadReviews(spotId, reviews))
    }
}

export const createSpot = (spot) => async (dispatch) => {
    const response = await csrfFetch("/api/spots", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(spot)
    })

    if (response.ok) {
        const newSpot = await response.json();
        dispatch(loadOneSpot(newSpot));
        return newSpot
    } else {
        const errors = await response.json();
        return errors;
    }
}

export const updateSpot = (spotId, spotData) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(spotData),
    });

    if (response.ok) {
      const updatedSpot = await response.json();
      dispatch(updateOneSpot(updatedSpot));
      return updatedSpot;
    }
  };

  export const deleteSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`,
    { method: 'DELETE' });
    if (response.ok) {
      dispatch({ type: REMOVE_SPOT, payload: spotId });
    }
  };



export const createSpotImage = (spotId, spotImage) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(spotImage)
    })

    if (response.ok) {
        const newImage = await response.json();
        dispatch(loadSpotImages(newImage, spotId))
        return newImage
    } else {
        const errors = await response.json();
        return errors;
    }
}


const spotsReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_SPOTS:{
            const spotsState = {}
            action.spots.Spots.forEach(spot => {
                spotsState[spot.id] = spot
            })
            return spotsState
        }

        case LOAD_SPOT_DETAILS : {
            const spotState = {};
            spotState[action.spot.id] = action.spot
            return spotState
        } case LOAD_SPOT_IMAGES : {
            return {...state, [action.spot.id]: action.spot}
        }

        case LOAD_REVIEWS: {
            return {...state,
                [action.spotId]: {
                    ...state[action.spotId],
                    reviews: action.reviews
                }
            }
        }

        case UPDATE_SPOT: {
            const newState = { ...state };
            newState[action.spot.id] = action.spot;
            return newState;
          }

        case REMOVE_SPOT: {
            const { [action.payload]: _, ...newState } = state;
            return newState;
          }

        default:
            return state
    }
}

export default spotsReducer;
