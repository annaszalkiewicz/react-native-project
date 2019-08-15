// import { ADD_PLACE, DELETE_PLACE, SELECT_PLACE, DESELECT_PLACE } from './actionsTypes';
import {
  SET_PLACES,
  REMOVE_PLACE,
  UPDATE_MODE,
  TRY_AUTH
} from "./actionsTypes";
import { startLoading, stopLoading } from "./uiActions";
import startTabs from "../../screens/startMainTabs";

export const addPlace = (name, location, image) => {
  return dispatch => {
    dispatch(startLoading());
    fetch(
      "https://us-central1-awesome-places-7495b.cloudfunctions.net/storeImage",
      {
        method: "POST",
        body: JSON.stringify({
          image: image.base64
        })
      }
    )
      .catch(err => {
        console.log(err);
        alert("Something went wrong. Please try again :(");
        dispatch(stopLoading());
      })
      .then(res => res.json())
      .then(parsedRes => {
        const placeData = {
          name: name,
          location: location,
          image: parsedRes.imageUrl
        };

        return fetch(
          "https://awesome-places-7495b.firebaseio.com/places.json",
          {
            method: "POST",
            body: JSON.stringify(placeData)
          }
        )
          .catch(err => {
            console.log(err);
            alert("Something went wrong. Please try again :(");
            dispatch(stopLoading());
          })
          .then(res => res.json())
          .then(parsedRes => {
            console.log(parsedRes);
            dispatch(stopLoading());
          });
      });
  };
  // return {
  //   type: ADD_PLACE,
  //   name: name,
  //   location: location,
  //   image: image
  // };
};

export const getPlaces = () => {
  return dispatch => {
    fetch("https://awesome-places-7495b.firebaseio.com/places.json")
      .catch(err => console.log(err))
      .then(res => res.json())
      .then(parsedRes => {
        const places = [];
        for (let key in parsedRes) {
          places.push({
            ...parsedRes[key],
            image: {
              uri: parsedRes[key].image
            },
            key: key
          });
        }
        dispatch(setPlaces(places));
      });
  };
};

export const setPlaces = places => {
  return {
    type: SET_PLACES,
    places: places
  };
};

export const deletePlace = key => {
  return dispatch => {
    dispatch(removePlace(key));
    fetch(
      "https://awesome-places-7495b.firebaseio.com/places/" + key + ".json",
      {
        method: "DELETE"
      }
    )
      .catch(err => console.log(err))
      .then(res => res.json())
      .then(parsedRes => {
        console.log("Deleted place!");
      });
  };
};

export const removePlace = key => {
  return {
    type: REMOVE_PLACE,
    key: key
  };
};

export const updateMode = () => {
  return {
    type: UPDATE_MODE
  };
};

export const tryAuth = (authData, authMode) => {
  return dispatch => {
    if (authMode === 'login') {
      dispatch(signIn(authData));
    }
    else {
      dispatch(signUp(authData));
    }
  }
  // return {
  //   type: TRY_AUTH,
  //   authData: authData
  // };
};

export const signIn = authData => {
  return dispatch => {
    dispatch(startLoading());
    fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyByiOPOD3HmmaEKEI-xvjqsNbFiT_uNuWg', {
      method: 'POST',
      body: JSON.stringify({
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .catch(err => {
      console.log(err);
      alert('Sign in failed. Please try again :(')
      dispatch(stopLoading());
    })
    .then(res => res.json())
    .then(parsedRes => {
      dispatch(stopLoading());
      if (parsedRes.error) {
        alert('Sign in failed. Please try again :(');
      }
      else {
        startTabs();
      }
    })
  }
}

export const signUp = authData => {
  return dispatch => {
    dispatch(startLoading());
    fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyByiOPOD3HmmaEKEI-xvjqsNbFiT_uNuWg', {
      method: 'POST',
      body: JSON.stringify({
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .catch(err => {
      console.log(err);
      alert('Sign up failed. Please try again :(')
      dispatch(stopLoading());
    })
    .then(res => res.json())
    .then(parsedRes => {
      dispatch(stopLoading());
      if (parsedRes.error) {
        alert('Sign up failed. Please try again :(');
      }
      else {
        startTabs();
      }
    })
  }
}

// export const selectPlace = key => {
//   return {
//     type: SELECT_PLACE,
//     key: key
//   }
// }

// export const deselectPlace = () => {
//   return {
//     type: DESELECT_PLACE
//   }
// }
