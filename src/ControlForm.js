
import React, { Component } from 'react';

class ControlForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      agonistName: 'acetylcholine',
      agonistConc: 0.00000005,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value; //note would have to chnage this with checkbox - see: https://reactjs.org/docs/forms.html
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    this.props.onSubmit(this.state.agonistName, this.state.agonistConc);
    //alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Agonist:
          <select name="agonistName" value={this.state.agonistName} onChange={this.handleInputChange}>
            <option value=''>Choose an agonist</option>
            {this.props.agonists.map(({ name }, index) => <option key={name} value={name} >{name}</option>)}
          </select>
        </label>
        <label>
          Concentration (M):
          <input type="number" name="agonistConc" value={this.state.agonistConc} onChange={this.handleInputChange} />
        </label>
        <input disabled={this.state.agonistName.length === 0} type="submit" value="Submit" />
      </form>
    );
  }
}

export default ControlForm;