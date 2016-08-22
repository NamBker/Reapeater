import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import { USER_AUTHORITY_SECTION } from '../../constants/Constants';

import DropDownMenu from '../../components/commons/DropDownMenu';

class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            body: {
                text: props.bodyText,
            },
            isShowSelectPicture: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.body != nextProps.bodyText) {
            let body = {text: nextProps.bodyText};
            this.setState({body});
        }
    }

    onSelectedPicture(pictureInfo) {
        this.addStringToBody("{picture: " + pictureInfo.id + "}");
    }

    onChangeBody(value) {
        let body = this.state.body;
        body.text = value;
        this.props.onChangeBody(value);
        this.setState({body: body});
    }

    addStringToBody(string) {
        let bodyNode = ReactDOM.findDOMNode(this.refs.delivery__add__body);
        let pos = bodyNode.selectionStart
        let context = bodyNode.value;
        bodyNode.value = context.substring(0, pos) + string + context.substring(pos, context.length);

        let newPos = pos + string.length;
        if (bodyNode.setSelectionRange) {
            bodyNode.focus();
            bodyNode.setSelectionRange(newPos, newPos);
        } else {
            let range = bodyNode.createTextRange();
            range.collapse(true);
            range.moveEnd('character', newPos);
            range.moveStart('character', newPos);
            range.select();
        }
        this.onChangeBody(bodyNode.value);
    }

    render() {
        const { onChangeBody } = this.props;
        return (
            <div className="">
                <div className="mb20">
                    <div className="btn-lightgray" onClick={() => this.props.onSelectPicture(this)}>
                        {Globalize.localize('delivery_add_add_picture', Globalize.culture())}
                    </div>
                </div>
                <div className="widget__page__input__contents__table mb20">
                    <textarea
                        className="delivery__add__body"
                        ref="delivery__add__body"
                        onChange={(e) => {this.onChangeBody(e.target.value)}}
                        value={this.state.body.text}
                    />
                </div>
            </div>
        );
    }
}

export default Body
