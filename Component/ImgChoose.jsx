import React from 'React';

export default class ImgChoose extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._handleClick_ImgChoose = this._handleClick_ImgChoose.bind(this);
    this._handleChange_FileInput = this._handleChange_FileInput.bind(this);
    this.validFileType = this.validFileType.bind(this);
    this.style={

    }
  }

  validFileType(file) {
    var imageType = /^image\//;
    if(imageType.test(file.type)){
      return true;
    }
    return false;
  }

  _handleChange_FileInput(){
    let self = this;
    let imgChosen = self.fileInput.files

    if(this.validFileType(imgChosen[0])) {
      var reader = new FileReader();

      reader.onload = function(event){
        self.props._set_newImgSrc(reader.result, self.props.chooseFor);
      }
      reader.readAsDataURL(imgChosen[0]);
    }
  }

  _handleClick_ImgChoose(event){
    event.stopPropagation();
    event.preventDefault();
    //this.props._set_focusBlock('cover');
    let inputFile = document.getElementById('imgFileInput');
    inputFile.click();
  }

  render(){
    return(
      <div
        style={}
        onClick={this._handleClick_ImgChoose}>
        <input
          type="file"
          id="imgFileInput"
          accept="image/*"
          style={{width:0, opacity:0}}
          ref={(element) => {this.fileInput = element}}
          onClick={(event)=>{event.stopPropagation();}}
          onChange={this._handleChange_FileInput}/>
      </div>
    )
  }
}
