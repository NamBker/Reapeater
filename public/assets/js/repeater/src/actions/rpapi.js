import * as request from 'superagent';
import moment from 'moment';

class Rpapi {
    constructor(method, path, needToken = true) {
        switch(method.toLowerCase()) {
            case 'get':
                this.request = request.get(apiHost + path);
                break;
            case 'post':
                this.request = request.post(apiHost + path);
                break;
            case 'put':
                this.request = request.put(apiHost + path);
                break;
            case 'delete':
                this.request = request.delete(apiHost + path);
                break;
        }
        if (needToken) {
            this.request = this.request.query({token: accessToken});
        }
        this.request = this.request.set('Accept', 'application/json');
        return this;
    }

    query(params) {
        for (var key in params) {
            let value = params[key]
            if (Array.isArray(value)) {
                if (0 < value.length) {
                    let tmp = key + '[]=' + value.join('&' + key + '[]=');
                    this.request = this.request.query(tmp);
                }
            } else if (value instanceof moment) {
                let tmp = {};
                tmp[key] = value.format('YYYY-MM-DD');
                this.request = this.request.query(tmp);
            }else {
                let tmp = {};
                tmp[key] = value;
                this.request = this.request.query(tmp);
            }
        }
        return this;
    }

    send(params) {
        if (params) {
            if ((params instanceof Array) || params.constructor === Object) {
                this.request = this.request.send(JSON.stringify(params));
            } else {
                this.request = this.request.send(params);
            }
        }
        return this;
    }

    attach(file) {
        if (file) {
            this.request = this.request.attach('file', file);
        }
        return this;
    }

    end(fn = (err, res) => {}) {
        this.request.end(function (err, res) {
                if (err) {
                    fn(err, null);
                } else if (!res || !res.ok) {
                    fn("サーバーエラーが発生しました。しばらく経ってから再度操作お願いします。", null);
                } else if (res.body.error_code) {
                    fn(res.body.user_message, null);
                } else {
                    fn(null, res.body);
                }
            });
        return this;
    }

    getQuery() {
        return this.request._query;
    }

    getUrl() {
        return this.request.url;
    }
}

export default Rpapi;
