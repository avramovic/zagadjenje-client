import deepFreeze from "deep-freeze";
import HandlersReducer, { getCurrentErrors } from "./handlers.reducers";
import {
    HANDLE_REQUEST,
    HANDLE_FAILURE,
    HANDLE_SUCCESS
} from "./handlers.actions";

const REQUEST_TEST = "REQUEST_TEST";

const initialState = {
    isLoading: {},
    hasError: {}
};
describe("Handling any request", () => {
    test("HANDLE_REQUEST should add the previously called action to the isLoading object", () => {
        const action = {
            type: HANDLE_REQUEST,
            previousAction: { type: REQUEST_TEST }
        };
        const stateAfter = {
            isLoading: {
                REQUEST_TEST: true
            },
            hasError: {}
        };

        const stateBefore = initialState;
        deepFreeze(stateBefore);
        deepFreeze(stateAfter);
        deepFreeze(action);
        expect(HandlersReducer(stateBefore, action)).toEqual(stateAfter);
    });
    test("HANDLE_REQUEST should add the previously called action to the isLoading object and maintain already existing actions", () => {
        const action = {
            type: HANDLE_REQUEST,
            previousAction: { type: REQUEST_TEST }
        };
        const localInitialState = {
            isLoading: {
                TEST_ACTION: true
            },
            hasError: {}
        };
        const stateAfter = {
            isLoading: {
                TEST_ACTION: true,
                REQUEST_TEST: true
            },
            hasError: {}
        };

        const stateBefore = localInitialState;
        deepFreeze(stateBefore);
        deepFreeze(stateAfter);
        deepFreeze(action);
        expect(HandlersReducer(stateBefore, action)).toEqual(stateAfter);
    });
    test("HANDLE_REQUEST should update the value of the action if it already exists", () => {
        const action = {
            type: HANDLE_REQUEST,
            previousAction: { type: REQUEST_TEST }
        };
        const localInitialState = {
            isLoading: {
                TEST_ACTION: true,
                REQUEST_TEST: false
            },
            hasError: {}
        };
        const stateAfter = {
            isLoading: {
                TEST_ACTION: true,
                REQUEST_TEST: true
            },
            hasError: {}
        };

        const stateBefore = localInitialState;
        deepFreeze(stateBefore);
        deepFreeze(stateAfter);
        deepFreeze(action);
        expect(HandlersReducer(stateBefore, action)).toEqual(stateAfter);
    });
});

describe("Handling request success", () => {
    test("HANDLE_SUCCESS should change the action from true to false in loading state", () => {
        const action = {
            type: HANDLE_SUCCESS,
            previousAction: { type: REQUEST_TEST }
        };
        const localInitialState = {
            isLoading: {
                TEST_ACTION: true,
                REQUEST_TEST: true
            },
            hasError: {}
        };

        const stateAfter = {
            isLoading: {
                TEST_ACTION: true,
                REQUEST_TEST: false
            },
            hasError: {
                REQUEST_TEST: {
                    failed: false,
                    errorLog: {}
                }
            }
        };

        const stateBefore = localInitialState;
        deepFreeze(stateBefore);
        deepFreeze(stateAfter);
        deepFreeze(action);
        expect(HandlersReducer(stateBefore, action)).toEqual(stateAfter);
    });
    test("HANDLE_SUCCESS should change the action from true to false in error state", () => {
        const action = {
            type: HANDLE_SUCCESS,
            previousAction: { type: REQUEST_TEST }
        };
        const localInitialState = {
            isLoading: {
                TEST_ACTION: true,
                REQUEST_TEST: true
            },
            hasError: {
                REQUEST_TEST: {
                    failed: true,
                    errorLog: { error: "error" }
                }
            }
        };

        const stateAfter = {
            isLoading: {
                TEST_ACTION: true,
                REQUEST_TEST: false
            },
            hasError: {
                REQUEST_TEST: {
                    failed: false,
                    errorLog: {}
                }
            }
        };

        const stateBefore = localInitialState;
        deepFreeze(stateBefore);
        deepFreeze(stateAfter);
        deepFreeze(action);
        expect(HandlersReducer(stateBefore, action)).toEqual(stateAfter);
    });
});

describe("Handling request failure", () => {
    test("HANDLE_FAILURE should change the action from true to false", () => {
        const action = {
            type: HANDLE_FAILURE,
            previousAction: { type: REQUEST_TEST },
            error: { error: "error" }
        };
        const localInitialState = {
            isLoading: {
                TEST_ACTION: true,
                REQUEST_TEST: false
            },
            hasError: {}
        };

        const stateAfter = {
            isLoading: {
                TEST_ACTION: true,
                REQUEST_TEST: false
            },
            hasError: {
                REQUEST_TEST: {
                    failed: true,
                    errorLog: { error: "error" }
                }
            }
        };

        const stateBefore = localInitialState;
        deepFreeze(stateBefore);
        deepFreeze(stateAfter);
        deepFreeze(action);
        expect(HandlersReducer(stateBefore, action)).toEqual(stateAfter);
    });
});

describe("Selectors", () => {
    test("getCurrentErrors should return the error object", () => {
        const fakeState = {
            handlers: {
                isLoading: {
                    TEST_ACTION: true,
                    REQUEST_TEST: false
                },
                hasError: {
                    REQUEST_TEST: {
                        failed: true,
                        errorLog: { message: "error" }
                    }
                }
            }
        };

        const expected = ["error"];

        expect(getCurrentErrors(fakeState)).toEqual(expected);
    });
});