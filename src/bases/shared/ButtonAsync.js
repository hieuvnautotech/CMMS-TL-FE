import React from 'react';
import PropTypes from 'prop-types';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import UploadIcon from '@mui/icons-material/Upload';
//by mrhieu84
export default class ButtonAsync extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            asyncState: null,
          };
         
    }

  


 componentWillUnmount() {
    this.isUnmounted = true;
  }

  resetState=()=> {
    this.setState({
      asyncState: null,
    });
  }

  handleClick =(args)=> {
    const clickHandler = this.props.onClick;
    
    if (typeof clickHandler === 'function') {
      this.setState({
        asyncState: 'pending',
      });

      const returnFn = clickHandler.apply(null, args);
      if (returnFn && typeof returnFn.then === 'function') {
        returnFn
          .then(() => {
            if (this.isUnmounted) {
              return;
            }
            this.setState({
              asyncState: 'resolved',
            });
          })
          .catch(error => {
            if (this.isUnmounted) {
              return;
            }
            
            this.setState({
              asyncState: 'rejected',
            });

          });
      } else {

        this.resetState();
      }
    }
  }
  renderIcon(icon) {
    switch(icon) {
      case 'save':
        return <SaveIcon />;
        case 'search':
        return <SearchIcon />
        case 'send':
            return <SendIcon />
        case 'upload':
            return <UploadIcon />

      default:
        return '';
    }
  }
  render() {
    const {
      icon,
      text
    } = this.props;

    const { asyncState } = this.state;
    const isPending = asyncState === 'pending';
    const isResolved = asyncState === 'resolved';
    const isRejected = asyncState === 'rejected';
   
    return (
               
                icon ? <LoadingButton
                loading={isPending}
                startIcon={ this.renderIcon(icon) }
              
                loadingPosition="start"
                variant="contained"
                {...this.props}
                onClick={this.handleClick}
                >
                {text}
                </LoadingButton>
                : <LoadingButton
                loading={isPending}
              
                variant="contained"
                {...this.props}
                onClick={this.handleClick}
                >
                {text}
                </LoadingButton>
              
               
        
    );
  }
}

ButtonAsync.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
};

