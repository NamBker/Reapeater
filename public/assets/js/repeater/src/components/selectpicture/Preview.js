import React, { Component, PropTypes } from 'react';

class Preview extends Component {

    render() {
        const {handleInsertPicture} = this.props;
        return (
            <div className="selectpicture__preview">
                <p className="title">{this.props.title}</p>
                <div>
                    {(this.props.fileUrl)? <img src={this.props.fileUrl} width="240px" height="auto"/>: "" }
                    <div>
                        <p className="content">{this.props.fileName}</p>
                        <p className="content">{this.props.fileSize}</p>
                    </div>
                    <input type ="button" value = "画像を挿入する" className="btn" onClick={(e) => this.props.handleInsertPicture(e)}/>
                </div>
            </div>
        );
    }
}

Preview.propTypes = {
    title: PropTypes.string.isRequired,
    fileUrl: PropTypes.string.isRequired,
    fileName: PropTypes.string.isRequired,
    fileSize: PropTypes.string.isRequired,
    handleInsertPicture: PropTypes.func.isRequired,
};

export default Preview
