
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import userReducer from "../Feature/Userslice"
import resumeReducer from "../Feature/resumeSlice";
import { combineReducers } from 'redux';

// Combine your reducers
const rootReducer = combineReducers({
  user: userReducer,
  resume: resumeReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['resume'], // Only persist the resume slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export { store, persistor };
