import React, { Component } from "react";
import Checkbox from '@material/react-checkbox';

class Check extends Component {
  state = {
    checked: false, 
    indeterminate: false
  }
    
  render(){
    return (
      <div className="form-check">
        <Checkbox
          nativeControlId='my-checkbox'
          checked={this.state.checked}
          indeterminate={this.state.indeterminate}
          onChange={(e) => this.setState({
            checked: e.target.checked,
            indeterminate: e.target.indeterminate})
          }
        />
      </div>
    )
  }
}

export default Checkbox;