export const initialState = {
  isLoggingOut: false, // 로그아웃 시도중
  isLoggingIn: false, // 로그인 시도중
  isLoggedIn: false,
  isLoadUserFail: false,
  logInErrorReason: "", // 로그인 실패 사유
  isSigningUp: false, // 회원가입 시도중
  signUpErrorReason: "", // 회원가입 실패 사유
  isSignedUp: false, // 회원가입 성공
  user: null, // 내 정보
  chatbotList: [], //내 챗봇 리스트
  telegramToken: null, //텔레그램 토큰
};

//액션 이름
export const SIGN_UP_REQUEST = "SIGN_UP_REQUEST";
export const SIGN_UP_SUCCESS = "SIGN_UP_SUCCESS";
export const SIGN_UP_FAILURE = "SIGN_UP_FAILURE";
export const SIGN_UP_RESET = "SIGN_UP_RESET";

export const LOG_IN_REQUEST = "LOG_IN_REQUEST";
export const LOG_IN_SUCCESS = "LOG_IN_SUCCESS";
export const LOG_IN_FAILURE = "LOG_IN_FAILURE";
export const LOG_IN_FAILURE_RESET = "LOG_IN_FAILURE_RESET";

export const LOG_OUT_REQUEST = "LOG_OUT_REQUEST";
export const LOG_OUT_SUCCESS = "LOG_OUT_SUCCESS";
export const LOG_OUT_FAILURE = "LOG_OUT_FAILURE";

export const LOAD_USER_REQUEST = "LOAD_USER_REQUEST";
export const LOAD_USER_SUCCESS = "LOAD_USER_SUCCESS";
export const LOAD_USER_FAILURE = "LOAD_USER_FAILURE";

export const UPDATE_USERINFO_REQUEST = "UPDATE_USERINFO_REQUEST";
export const UPDATE_USERINFO_SUCCESS = "UPDATE_USERINFO_SUCCESS";
export const UPDATE_USERINFO_FAILURE = "UPDATE_USERINFO_FAILURE";

export default (state = initialState, action) => {
  switch (action.type) {
    case SIGN_UP_REQUEST: {
      return {
        ...state,
        isSigningUp: true,
        isSignedUp: false,
        signUpErrorReason: "",
      };
    }
    case SIGN_UP_SUCCESS: {
      return {
        ...state,
        isSigningUp: false,
        isSignedUp: true,
      };
    }
    case SIGN_UP_FAILURE: {
      return {
        ...state,
        isSigningUp: false,
        signUpErrorReason: action.error,
      };
    }
    case SIGN_UP_RESET: {
      return {
        ...state,
        isSigningUp: false,
        isSignedUp: false,
        signUpErrorReason: "",
      };
    }
    case LOG_IN_REQUEST: {
      return {
        ...state,
        isLoggingIn: true,
        logInErrorReason: "",
      };
    }
    case LOG_IN_SUCCESS: {
      return {
        ...state,
        isLoggingIn: false,
        user: action.data,
        isLoading: false,
        isLoggedIn: true,
        isLoadUserFail: false,
      };
    }
    case LOG_IN_FAILURE: {
      return {
        ...state,
        isLoggingIn: false,
        logInErrorReason: action.error,
        user: null,
      };
    }
    case LOG_IN_FAILURE_RESET: {
      return {
        ...state,
        logInErrorReason: null,
      };
    }
    case LOG_OUT_REQUEST: {
      return {
        ...state,
        isLoggingOut: true,
      };
    }
    case LOG_OUT_SUCCESS: {
      return {
        ...state,
        isLoggingOut: false,
        user: null,
      };
    }
    case LOAD_USER_REQUEST: {
      return {
        ...state,
      };
    }
    case LOAD_USER_SUCCESS: {
      return {
        ...state,
        user: action.data,
        isLoadUser: false,
      };
    }
    case LOAD_USER_FAILURE: {
      return {
        ...state,
        isLoadUserFail: true,
      };
    }
    case UPDATE_USERINFO_REQUEST: {
      return {
        ...state,
      };
    }
    case UPDATE_USERINFO_SUCCESS: {
      return {
        ...state,
        user: action.data,
      };
    }
    case UPDATE_USERINFO_FAILURE: {
      return {
        ...state,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
};
