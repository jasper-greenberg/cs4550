import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import modulesReducer from "../Courses/Modules/reducer";
import userReducer from "../Users/reducer";

export interface KanbasState {
    modulesReducer: {
        modules: any[];
        module: any;
    };
    user: any;
}

const persistConfig = {
    key: "root",
    storage,
};

const rootReducer = combineReducers({
    modulesReducer,
    userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredPaths: ["user.dob"],
            },
        }),
});

export const persistor = persistStore(store);
