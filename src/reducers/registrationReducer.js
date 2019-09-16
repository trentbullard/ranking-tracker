import { USER_CREATED, USER_CREATION_REQUESTED } from "../actions/types";

const initialState = {
  createUserRequested: false,
  userCreated: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case USER_CREATION_REQUESTED:
      return {
        ...state,
        createUserRequested: true,
      };
    case USER_CREATED:
      const result = action.payload;
      return {
        ...state,
        userCreated: {
          ...result,
          isAdmin: result.isadmin,
          passwordHash: result.passwordhash,
          createdAt: result.createdat,
          sessionId: result.sessionid,
        },
        createUserRequested: false,
      };
    default:
      return state;
  }
};
