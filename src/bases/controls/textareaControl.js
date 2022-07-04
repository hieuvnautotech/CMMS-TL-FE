import React, { Component } from "react";

class TextareaControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      [this.props.name]: this.props.value
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      [this.props.name]: nextProps.value
    });
  }
  UNSAFE_UNSAFE_componentDidMount() {
    var textarea = document.querySelector("textarea");
    textarea.addEventListener("keydown", autosize);
    function autosize() {
      var el = this;
      setTimeout(function() {
        el.style.cssText = "height:auto; padding:0";
        el.style.cssText = "height:" + (Number(el.scrollHeight) + 10) + "px";
      }, 0);
    }
  }
  onChange = e => {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  };
  onBlur = () => {
    this.props.onBlur(this.state);
  };
  render() {
    return (
      <textarea
        className={this.props.className}
        name={this.props.name}
        value={this.state[this.props.name]}
        onChange={this.onChange}
        onBlur={this.onBlur}
        placeholder={this.props.placeholder ? this.props.placeholder : ""}
      />
    );
  }
}
export default TextareaControl;
