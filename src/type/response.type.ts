enum RESPONSE_MSG_CODE {
    SUCCESS = 200,
    FAIL = 500
};

enum RESPONSE_MSG_DETAIL {
    SUCCESS = "Success",
    FAIL_PRAJNA = "Failure when storing Prajna"
};

interface Result {
    prajnaResult?: any
}

interface Response {
    code: RESPONSE_MSG_CODE,
    message: RESPONSE_MSG_DETAIL,
    result?: Result
}

export {
    RESPONSE_MSG_CODE,
    RESPONSE_MSG_DETAIL,
    Result,
    Response
}
