import React, { Component } from 'react';
import ConfirmButton from './buttons/ConfirmButton.js';
import { STATEMACHINE_STATES, STATEMACHINE_COMMANDS } from '../shared/constants';

import createSocket from '../shared/socket';

let socket = createSocket();

class StateMachineControl extends Component {
  doPodCommand (action, command) {
    if (action !== 'unlock' && action !== 'execute') {
      console.error(`Unknown pod action command. ${action}`);
      return;
    }

    socket.emit('FlightControl:GenPodCommand', {
      action: action,
      command: command
    });
  }

  render () {
    return (<div className='stateBlock'>
      {STATEMACHINE_COMMANDS.map(function (item, index) {
        // Excludes NO_COMMAND from transitions.
        if (index < 1) {
          return;
        } else if (this.props.showAvailable && this.props.availableStates.indexOf(item) === -1) {
          return;
        } else if (!this.props.showAvailable && this.props.availableStates.indexOf(item) !== -1) {
          return;
        }

        let cleanName = item.replace('_', ' ').toLowerCase();
        return (
          <div className='d-inline-block' key={'SwitchGroup_' + item}>
            <legend>{cleanName}</legend>
            <ConfirmButton delay={2000} className="btn btn-state" action={this.doPodCommand.bind(this, 'unlock', index)}>Unlock</ConfirmButton>
            <ConfirmButton delay={2000} className="btn btn-state" action={this.doPodCommand.bind(this, 'execute', index)}>Execute</ConfirmButton>
          </div>
        );
      }, this)}
    </div>);
  }
}

export default StateMachineControl;

