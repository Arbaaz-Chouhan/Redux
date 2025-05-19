// 1. CORRECT IMPORTS (CommonJS)
const { createStore, applyMiddleware } = require('redux');
const thunkMiddleware = require('redux-thunk').thunk; 
const axios = require('axios');

// 2. Initial State
const initialState = {
  loading: false,
  users: [],
  error: ''
};

// 3. Action Types
const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';
const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';

// 4. Action Creators
const fetchUsersRequest = () => ({ type: FETCH_USERS_REQUEST });
const fetchUsersSuccess = users => ({ type: FETCH_USERS_SUCCESS, payload: users });
const fetchUsersFailure = error => ({ type: FETCH_USERS_FAILURE, payload: error });

// 5. Reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return { ...state, loading: true };
    case FETCH_USERS_SUCCESS:
      return { loading: false, users: action.payload, error: '' };
    case FETCH_USERS_FAILURE:
      return { loading: false, users: [], error: action.payload };
    default:
      return state;
  }
};

// 6. Async Action (Thunk)
const fetchUsers = () => {
  return dispatch => {
    dispatch(fetchUsersRequest());
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        const users = response.data.map(user => user.id);
        dispatch(fetchUsersSuccess(users));
      })
      .catch(error => {
        dispatch(fetchUsersFailure(error.message));
      });
  };
};


const store = createStore(
  reducer,
  applyMiddleware(thunkMiddleware) 
);


store.subscribe(() => console.log(store.getState()));
store.dispatch(fetchUsers());