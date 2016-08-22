import React, { Component, PropTypes } from 'react';
import { uuid } from '../../utils/CommonUtils';

class DropDownMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMenu: false,
        };
        this.handleClick = (e) => this.onClickOtherArea(e);
        this.myId = uuid();
    }

    componentDidMount() {
        window.addEventListener('click', this.handleClick);
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.handleClick);
    }

    onClickOtherArea(e) {
        let target = e.target;
        if (!target.matches('.common__component__dropdownmenu__button') || target.id != this.myId) {
            this.setState({showMenu: false});
        }
    }

    onClickShowMenu() {
        if (this.props.disabled || (this.props.disableWhenNoData && this.props.menuItems.length < 1)) {
            return;
        }
        this.setState({showMenu: !this.state.showMenu});
    }

    onClickMenuItem(value) {
        this.props.onMenuSelected(value);
    }

    render() {
        const { buttonTitle, menuItems, labelKey, valueKey, disabled, disableWhenNoData } = this.props;
        return (
            <div className="common__component__dropdownmenu">
                <div
                    className={"common__component__dropdownmenu__button" + (disabled || (disableWhenNoData && menuItems.length < 1) ? " disabled" : "")}
                    id={this.myId}
                    onClick={() => this.onClickShowMenu()}
                >
                    {buttonTitle}
                </div>
                { disabled ? null :
                <div id="common_component_dropdownmenu_id" className={"common__component__dropdownmenu__items" + (this.state.showMenu ? " show" : "")}>
                    {menuItems.map((item) => {
                        return (
                            <div key={"common_component_dropdownmenu_id " + item[valueKey]} onClick={() => this.onClickMenuItem(item[valueKey])}>
                                {item[labelKey]}
                            </div>
                        );
                    })
                    }
                </div>
                }
            </div>
        );
    }
}

DropDownMenu.propTypes = {
    buttonTitle: PropTypes.string.isRequired,
    menuItems: PropTypes.array.isRequired,
    labelKey: PropTypes.string,
    valueKey: PropTypes.string,
    onMenuSelected: PropTypes.func,
    disabled: PropTypes.bool,
    disableWhenNoData: PropTypes.bool,
};

DropDownMenu.defaultProps = {
    onMenuSelected: (value) => {},
    labelKey: 'label',
    valueKey: 'value',
    disabled: false,
    disableWhenNoData: false,
}

export default DropDownMenu;
