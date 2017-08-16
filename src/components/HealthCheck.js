import React, { Component } from 'react';
import StreamingPageManager from '../StreamingPageManager.js';
import GenericParameterInput from './GenericParameterInput.js';
import GenericParameterLabel from './GenericParameterLabel.js';
import FaultFlagDisplay from './FaultFlagDisplay.js';

import faultFlagDefinitions from '../../config/faultFlagDefinitions.js';
import createSocket from '../shared/socket';
import './HealthCheck.css';

let socket = createSocket();

class HealthCheck extends Component {
  constructor (props) {
    super(props);

    this.state = {
      streamManager: new StreamingPageManager()
    };

    // Best attempt to fit in http://confluence.rloop.org/display/KIR/Ground+Station%3A+Pod+Health+Check
    this.labels = [
      // Power
      {label: 'Power A Average Temp', param: 'Power A BMS Average Temp'},
      {label: 'Power B Average Temp', param: 'Power B BMS Average Temp'},
      {label: 'Power A Highest Cell Temp', param: 'TODO:PLACEHOLDER'},
      {label: 'Power B Highest Cell Temp', param: 'TODO:PLACEHOLDER'},
      {label: 'Power A Voltage Range', param: 'TODO:PLACEHOLDER'},
      {label: 'Power B Voltage Range', param: 'TODO:PLACEHOLDER'},
      {label: 'Power A Pack Current', param: 'Power A BMS Pack Current'},
      {label: 'Power B Pack Current', param: 'Power A BMS Pack Current'},

      // HEs
      {label: 'Hover Engine Temperature', param: 'ASI Temperature'},
      {label: 'Hover Engine RPM', param: 'ASI HE RPM'},

      // PV packets are vague

      // ASI
      {label: 'ASI 1 Temperature', param: 'ASI 1 Temperature'},
      {label: 'ASI 2 Temperature', param: 'ASI 2 Temperature'},
      {label: 'ASI 3 Temperature', param: 'ASI 3 Temperature'},
      {label: 'ASI 4 Temperature', param: 'ASI 4 Temperature'},
      {label: 'ASI 5 Temperature', param: 'ASI 5 Temperature'},
      {label: 'ASI 6 Temperature', param: 'ASI 6 Temperature'},
      {label: 'ASI 7 Temperature', param: 'ASI 7 Temperature'},
      {label: 'ASI 8 Temperature', param: 'ASI 8 Temperature'},
      // ASI Voltage not in packets or code.
      {label: 'ASI 1 Motor Current', param: 'ASI 1 Motor Current'},
      {label: 'ASI 2 Motor Current', param: 'ASI 2 Motor Current'},
      {label: 'ASI 3 Motor Current', param: 'ASI 3 Motor Current'},
      {label: 'ASI 4 Motor Current', param: 'ASI 4 Motor Current'},
      {label: 'ASI 5 Motor Current', param: 'ASI 5 Motor Current'},
      {label: 'ASI 6 Motor Current', param: 'ASI 6 Motor Current'},
      {label: 'ASI 7 Motor Current', param: 'ASI 7 Motor Current'},
      {label: 'ASI 8 Motor Current', param: 'ASI 8 Motor Current'},
      // Throttles (it's all fault flags)

      // Navigational
      {label: 'Accel 1 X Gs', param: 'Accel 1 X Gs'},
      {label: 'Accel 2 X Gs', param: 'Accel 2 X Gs'},
      {label: 'Accel 1 Y Gs', param: 'Accel 1 Y Gs'},
      {label: 'Accel 2 Y Gs', param: 'Accel 2 Y Gs'},
      {label: 'Accel 1 Z Gs', param: 'Accel 1 Z Gs'},
      {label: 'Accel 2 Z Gs', param: 'Accel 2 Z Gs'},
      {label: 'Laser Range Finder distance', param: 'ForwardLaser Distance'},
      {label: 'Height optoNCDT laser distance 1', param: 'LaserOpto 1 Raw distance'},
      {label: 'Height optoNCDT laser distance 2', param: 'LaserOpto 2 Raw distance'},
      {label: 'Height optoNCDT laser distance 3', param: 'LaserOpto 3 Raw distance'},
      {label: 'Height optoNCDT laser distance 4', param: 'LaserOpto 4 Raw distance'},
      {label: 'I-beam optoNCDT laser distance 1', param: 'LaserOpto 5 Raw distance'},
      {label: 'I-beam optoNCDT laser distance 2', param: 'LaserOpto 6 Raw distance'},

      // LGU
      // MLP Flag / MLP Value not in?
      {label: 'LGU Switch Extend 1', param: 'LGU Switch Extend 1'},
      {label: 'LGU Switch Extend 2', param: 'LGU Switch Extend 2'},
      {label: 'LGU Switch Retract 1', param: 'LGU Switch Retract 1'},
      {label: 'LGU Switch Retract 2', param: 'LGU Switch Retract 2'},

      // Brakes
      {label: 'Brake Calibration State', param: 'Brake Calibration State'},
      {label: 'Brake State', param: 'Brake State'},
      // Brake Limit Switches State?
      {label: 'Brake MLP 1', param: 'Brake MLP 1'},
      {label: 'Brake MLP 2', param: 'Brake MLP 2'},
      // Brake Stepper Temperature soon to come

      // Pusher
      {label: 'Pusher Status', param: 'Pusher Status'}
    ];
  }
  render () {
    return (
        <div className="Overview-content">
        <legend>Pod Health</legend>
        <div className="col-md-12">
          {this.labels.map(function (item, index) {
            return (
              <form className="form-inline col-xs-6 col-md-4" key={'health' + index}>
                <div className="form-group">
                  <label htmlFor="a0_y">{item.label}</label>
                  <div className="health">
                  <GenericParameterInput
                        StreamingPageManager={this.state.streamManager}
                        parameter={item.param}
                        readOnly='true'
                        hideUnits='true'
                    />
                  </div>
                </div>
              </form>
            );
          }, this)}
        </div>

        <legend>All Fault Flags</legend>
        <div className="col-md-12">
        {Object.keys(faultFlagDefinitions).map(function (item, index) {
          console.log(item);
          return (
              <form className="form-inline col-xs-6 col-md-4" key={'healthfault' + index}>
                <div className="form-group">
                  <label htmlFor="a0_y">{item.label}</label>
                  <div className="health">
                  <FaultFlagDisplay StreamingPageManager={this.state.streamManager} label={item} parameter={item} />
                  </div>
                </div>
              </form>
          );
        }, this)}
        </div>
      </div>
    );
  }
}
export default HealthCheck;