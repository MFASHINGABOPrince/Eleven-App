import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import authReducer from "../feature/auth/authSlice";
import { persistReducer } from 'redux-persist';
import { combineReducers } from '@reduxjs/toolkit';


const persistConfig = {
  key: 'root',
  version: '1',
  storage
}

const rootReducer = combineReducers({
	auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: {
    reducer:persistedReducer
  }
})