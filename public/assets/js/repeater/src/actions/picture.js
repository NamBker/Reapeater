import * as request from 'superagent';
import * as types from '../constants/ActionTypes';
import * as Const from '../constants/Constants';

var default_filters = {};
default_filters.pattern = Const.GET_DISPLAY_ITEMS_ONLY_PATTERN;

export const fetchPictures = (filterParams = default_filters) => {
    return dispatch => {
        request.get(apiHost + '/pictures')
            .query(Object.assign(filterParams, {token: accessToken}))
            .set('Accept', 'application/json')
            .end(function (err, res) {
                console.log('pictures api called.');
                if (err || !res.ok || res.body.error_code) {
                    alert("画像情報を取得できません。");
                    console.log(err);
                } else {
                    let total_count = res.body.count ? res.body.count : 0;
                    dispatch(receivePictures(res.body.pictures, total_count));
                }
            });
    }
};


const receivePictures = (pictures, total_count) =>  {
    return {
        type: types.RECEIVE_PICTURE,
        pictures: pictures,
        picture_count: total_count,
    }
};

export const fetchPictureInfo = (pictureId = '', pattern=Const.GET_DISPLAY_ITEMS_ONLY_PATTERN) => {
    return dispatch => {
        request.get(apiHost + '/pictures/' + pictureId+'?pattern='+pattern)
            .query({token: accessToken})
            .set('Accept', 'application/json')
            .end(function (err, res) {
                console.log('picture api called.');
                if (err || !res.ok || res.body.error_code) {
                    alert("画像を取得できません。");
                    console.log(err);
                } else {
                    dispatch(receivePictureInfo(res.body.picture));
                }
            });
    }
};

const receivePictureInfo = (picture) => {
    return {
        type: types.RECEIVE_PICTURE_INFO,
        picture: picture,
    }
};

export const pictureUpload = (image, filterParams, closeDialog, history) => {
    return dispatch => {
        request.post(apiHost + '/pictures/')
            .query({token: accessToken})
            .attach('file', image, image.name)
            .end(function (err, res) {
                if (!res.ok || res.body.error_code) {
                    if (res.body.error_code) {
                        alert("画像アップロードに失敗しました。\n" + res.body.user_message);
                    } else {
                        alert("画像アップロードに失敗しました。");
                    }
                    console.log(err);
                } else {
                    alert("画像アップロードに成功しました。");
                    closeDialog();
                    dispatch(fetchPictures(filterParams));
                }
            });
    }
}

export const updatePicture = (pictureParams, filterParams, closeDialog, history) => {
    return dispatch => {
        request.put(apiHost + '/pictures')
            .query({token: accessToken})
            .send(JSON.stringify(pictureParams))
            .set('Accept', 'application/json')
            .end(function (err, res) {
                if (!res.ok || res.body.error_code) {
                    if (res.body != undefined &&
                        res.body.error_code) {
                        alert("画像情報が編集できません。\n" + res.body.user_message);
                    } else {
                        alert("画像情報が編集できません。");
                    }
                    console.log(err);
                } else {
                    alert("画像情報が編集されました。");
                    closeDialog();
                    dispatch(fetchPictures(filterParams));
                }
            })
    }
};

export const deletePicture = (pictureParams, closeDialog, history) => {
    return dispatch => {
        request.delete(apiHost + '/pictures')
            .query({token: accessToken})
            .send(JSON.stringify(pictureParams))
            .set('Accept', 'application/json')
            .end(function (err, res) {
                if (!res.ok || res.body.error_code) {
                    if (res.body != undefined &&
                        res.body.error_code) {
                        alert("画像が削除できません。\n" + res.body.user_message);
                    } else {
                        alert("画像が削除できません。");
                    }
                    console.log(err);
                } else {
                    alert("画像が削除されました。");
                    if(closeDialog) {
                        closeDialog();
                    }
                    dispatch(fetchPictures(pictureParams));
                }
            })
    }
};

export const clearPictures = () => {
    return dispatch => {
        dispatch(receivePictures([]));
    }
}

