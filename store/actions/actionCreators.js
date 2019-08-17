import { AsyncStorage } from 'react-native';

import {
  SET_PLACES,
  REMOVE_PLACE,
  UPDATE_MODE,
  AUTH_SET_TOKEN
} from "./actionsTypes";
import { startLoading, stopLoading } from "./uiActions";
import startTabs from "../../screens/startMainTabs";

export const addPlace = (name, location, image) => {
  return dispatch => {
    let authToken;
    dispatch(startLoading());
    dispatch(authGetToken())
      .catch(() => {
        alert("Sorry, we couldn't find valid token :(");
      })
      .then(token => {
        authToken = token
        return fetch(
          "https://us-central1-awesome-places-7495b.cloudfunctions.net/storeImage",
          {
            method: "POST",
            body: JSON.stringify({
              image: image.base64
            }),
            headers: {
              'Authorization': 'Bearer ' + authToken
            }
          }
        )
      })
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
          "https://awesome-places-7495b.firebaseio.com/places.json?auth=" + authToken,
          {
            method: "POST",
            body: JSON.stringify(placeData)
          }
        )
          .then(res => res.json())
          .then(parsedRes => {
            console.log(parsedRes);
            dispatch(stopLoading());
          })
          .catch(err => {
            console.log(err);
            alert("Something went wrong. Please try again :(");
            dispatch(stopLoading());
          });
      })
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
    dispatch(authGetToken())
      .then(token => {
        return fetch("https://awesome-places-7495b.firebaseio.com/places.json?auth=" + token)
      })
      .catch(() => {
        alert("No valid token found!");
      })
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
      })
      .catch(err => {
        console.log(err);
        alert("Something went wrong. Please try again :(");
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
    dispatch(authGetToken())
    .catch(() => {
      alert('No valid token found!');
    })
    .then(token => {
      dispatch(removePlace(key));
      return fetch(
        "https://awesome-places-7495b.firebaseio.com/places/" + key + ".json?auth=" + token,
        {
          method: "DELETE"
        }
      )
    })
    
      .then(res => res.json())
      .then(parsedRes => {
        console.log("Deleted place!");
      })
      .catch(err => {
        alert('Something went wrong. Please try again :(')
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
  const apiKey = "AIzaSyByiOPOD3HmmaEKEI-xvjqsNbFiT_uNuWg";
  let url =
    authMode === "login"
      ? "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="
      : "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=";

  return dispatch => {
    dispatch(startLoading());
    fetch(url + apiKey, {
      method: "POST",
      body: JSON.stringify({
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .catch(err => {
        console.log(err);
        authMode === "login"
          ? alert("Sign in failed. Please try again :(")
          : alert("Sign up failed. Please try again :(");
        dispatch(stopLoading());
      })
      .then(res => res.json())
      .then(parsedRes => {
        dispatch(stopLoading());
        if (!parsedRes.idToken) {
          alert("Authentication failed. Please try again :(");
        } else {
          dispatch(authStoreToken(parsedRes.idToken, parsedRes.expiresIn));
          startTabs();
        }
      });
  };
};

export const authStoreToken = (token, expiresIn) => {
  return dispatch => {
    dispatch(authSetToken(token));

    const now = new Date();
    const expire = now.getTime() + expiresIn * 1000;

    AsyncStorage.setItem('ap:auth:token', token)
    AsyncStorage.setItem('ap:auth:expDate', expire.toString())
  }
}

export const authSetToken = token => {
  return {
    type: AUTH_SET_TOKEN,
    token: token
  };
};

export const authGetToken = () => {
  return (dispatch, getState) => {
    const promise = new Promise((resolve, reject) => {
      const token = getState().auth.token;
      if (!token) {
        let fetchedToken;
        AsyncStorage.getItem('ap:auth:token')
        .catch(err => reject())
        .then(tokenFromStorage => {
          fetchedToken = tokenFromStorage;
          if (!tokenFromStorage) {
            reject();
            return;
          }
          return AsyncStorage.getItem('ap:auth:expDate')

        })
        .then(expDate => {
          const parsedExpDate = new Date(parseInt(expDate));
          const now = new Date();

          if (parsedExpDate > now) {
            dispatch(authSetToken(fetchedToken))
            resolve(fetchedToken)
          } else {
            reject();
          }

        }
        )
        .catch(err => reject());
      } else {
        resolve(token);
      }
    });
    return promise;
  };
};

export const autoSignin = () => {
  return dispatch => {
    dispatch(authGetToken())
      .then(token => {
        startTabs();
      })
      .catch(err => console.log('Failed to find token! :(')
      )
  }
}