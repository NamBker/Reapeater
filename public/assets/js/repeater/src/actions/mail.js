import Rpapi from './rpapi';

export const sendTestMail = (parameters, whenFailure = (err) => {}, whenSuccess = (res) => {}) => {
    return dispatch => {
        new Rpapi('post', '/mail')
            .send(parameters)
            .end(function(err, res){
                if (err) {
                    whenFailure(err);
                } else {
                    whenSuccess(res);
                }
            });
    }
};

