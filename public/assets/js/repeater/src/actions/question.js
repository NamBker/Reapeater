import { CREATE_QUESTION, DELETE_QUESTION, SWAP_QUESTION, SET_QUESTION_TYPE, RECEIVE_QUESTION } from '../constants/ActionTypes';
import { GET_ALL_PATTERN, MODAL_CREATED_QUESTION_LIST } from '../constants/Constants'
import { showModal } from './modal'
import Rpapi from './rpapi';

export const swapQuestion = (oldIndex, newIndex) => {
    return {
        type: SWAP_QUESTION,
        oldIndex,
        newIndex
    }
};

export const setQuestionType = (index) => {
    return {
        type: SET_QUESTION_TYPE,
        index
    }
};

export const fetchQuestions = (pattern = GET_ALL_PATTERN) => {
    return dispatch => {
        new Rpapi('get', '/questions')
            .query({pattern})
            .end(function (err, res) {
                if (err) {
                    //whenFailure(err);
                } else {
                    let count = res.count ? res.count : 0;
                    dispatch(receiveQuestions(res.question, count));
                }
            });
    }
};

const receiveQuestions = (questions, count) => {
    return {
        type: RECEIVE_QUESTION,
        questions, count
    }
};

export const createQuestion = (questionParams) => {
    return dispatch => {
        new Rpapi('post', '/question')
            .send(questionParams)
            .end(function (err, res) {
                if (err) {
                    alert(err);
                } else {
                    dispatch(showModal(MODAL_CREATED_QUESTION_LIST));
                    dispatch(fetchQuestions());
                }
            })
    }
};

export const updateQuestion = (questionParams) => {
    return dispatch => {
        new Rpapi('put', '/question/' + questionParams.id)
            .send(questionParams)
            .end(function (err, res) {
                if (err) {
                    alert(err);
                } else {
                    dispatch(showModal(MODAL_CREATED_QUESTION_LIST));
                    dispatch(fetchQuestions());
                }
            })
    }
};

export const deleteQuestions = (deleteIds, whenFailed, whenSucceeded) => {
    new Rpapi('delete', '/questions')
        .send({question_ids: deleteIds})
        .end((err, res) => {
            if (err) {
                whenFailed(err);
            } else {
                whenSucceeded(res);
            }
        });
};
