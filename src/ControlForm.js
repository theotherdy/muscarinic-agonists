
import React, { Component } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

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
      <Form onSubmit={this.handleSubmit}>
        <Form.Group controlId="formAgonistName">
          <Form.Label>Agonist</Form.Label>
          <Form.Control as="select" name="agonistName" value={this.state.agonistName} onChange={this.handleInputChange}>
            <option value=''>Choose an agonist</option>
            {this.props.agonists.map(({ name }, index) => <option key={name} value={name} >{name}</option>)}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formAgonistConc">
          <Form.Label>Concentration (M)</Form.Label>
          <Form.Control type="number" placeholder="e.g 0.00005 or 5e-4" name="agonistConc" value={this.state.agonistConc} onChange={this.handleInputChange}/>
        </Form.Group>
        <Button disabled={this.state.agonistName.length === 0} variant="primary" type="submit">
          Run
        </Button>
        {/*<label>
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
        <input disabled={this.state.agonistName.length === 0} type="submit" value="Submit" />*/}
      </Form>
    );
  }
}

export default ControlForm;