import React, { Component } from 'react';
import { Redirect } from 'react-router';
import StreamingPageManager from '../StreamingPageManager.js';
import GenericParameterInput from './GenericParameterInput.js';
import HealthCheckDisplay from './HealthCheckDisplay.js';
import FaultFlagDisplay from './FaultFlagDisplay.js';

import faultFlagDefinitions from '../../config/faultFlagDefinitions.js';
import nominalConditions from '../../config/nominalConditions.js';
import createSocket from '../shared/socket';
import './HealthCheck.css';

let socket = createSocket();

class HealthCheckOverview extends Component {

  constructor (props) {
    super(props);

    this.state = {
      streamManager: new StreamingPageManager()
    };

    this.overviewParameters = {
      nominals: [
        'Power A BMS Average Temp',
        'Power A BMS Highest Sensor Value',
        'Power A BMS Pack Volts',
        'Power A BMS Highest Cell Volts',
        'Power A BMS Lowest Cell Volts',
        'Power A BMS Pack Current',
        'Power A BMS Node Temp',
        'Power B BMS Average Temp',
        'Power B BMS Highest Sensor Value',
        'Power B BMS Pack Volts',
        'Power B BMS Highest Cell Volts',
        'Power B BMS Lowest Cell Volts',
        'Power B BMS Pack Current',
        'ForwardLaser Distance',
        'Brake State',
        'Brake Calibration State'
      ],
      groups: {
        'Node Pressure A/B': {
          min: 0.7,
          max: 1.1,
          params: [
            'Power A BMS Node Pressure',
            'Power B BMS Node Pressure'
          ]
        },
        'Node Temp A/B': {
          min: 0,
          max: 40,
          params: [
            'Power A BMS Node Pressure',
            'Power B BMS Node Pressure'
          ]
        },
        'Accel 1/2 X Gs': {
          min: 0,
          max: 3,
          params: [
            'Accel 1 X Gs',
            'Accel 2 X Gs'
          ]
        },
        'Accel 1/2 Y Gs': {
          min: 0,
          max: 3,
          params: [
            'Accel 1 Y Gs',
            'Accel 2 Y Gs'
          ]
        },
        'Accel 1/2 Z Gs': {
          min: 0,
          max: 3,
          params: [
            'Accel 1 Y Gs',
            'Accel 2 Y Gs'
          ]
        },
        'HE Temps Left': {
          min: 0,
          max: 80,
          params: [
            'ASI 1 Temperature',
            'ASI 2 Temperature',
            'ASI 3 Temperature',
            'ASI 4 Temperature'
          ]
        },
        'HE Temps Right': {
          min: 0,
          max: 80,
          params: [
            'ASI 5 Temperature',
            'ASI 6 Temperature',
            'ASI 7 Temperature',
            'ASI 8 Temperature'
          ]
        },
        'HE RPMs Left': {
          min: 0,
          max: 3000,
          params: [
            'ASI 1 HE RPM',
            'ASI 2 HE RPM',
            'ASI 3 HE RPM',
            'ASI 4 HE RPM'
          ]
        },
        'HE RPMs Right': {
          min: 0,
          max: 3000,
          params: [
            'ASI 5 HE RPM',
            'ASI 6 HE RPM',
            'ASI 7 HE RPM',
            'ASI 8 HE RPM'
          ]
        },
        'HE Controller Currents Left': {
          min: 0,
          max: 70,
          params: [
            'ASI 1 Motor Current',
            'ASI 2 Motor Current',
            'ASI 3 Motor Current',
            'ASI 4 Motor Current'
          ]
        },
        'HE Controller Currents Right': {
          min: 0,
          max: 70,
          params: [
            'ASI 5 Motor Current',
            'ASI 6 Motor Current',
            'ASI 7 Motor Current',
            'ASI 8 Motor Current'
          ]
        },
        'HE Controller Voltages Left': {
          min: 0,
          max: 70,
          params: [
            'ASI 1 Throttle Voltage',
            'ASI 2 Throttle Voltage',
            'ASI 3 Throttle Voltage',
            'ASI 4 Throttle Voltage'
          ]
        },
        'HE Controller Voltages Right': {
          min: 0,
          max: 70,
          params: [
            'ASI 5 Throttle Voltage',
            'ASI 6 Throttle Voltage',
            'ASI 7 Throttle Voltage',
            'ASI 8 Throttle Voltage'
          ]
        },
        'optoNCDT Height Filtered Distance': {
          min: 6,
          max: 20,
          params: [
            'LaserOpto 1 Filtered value',
            'LaserOpto 2 Filtered value',
            'LaserOpto 3 Filtered value',
            'LaserOpto 4 Filtered value'
          ]
        },
        'optoNCDT I-Beam Filtered Distance': {
          min: 20,
          max: 30,
          params: [
            'LaserOpto 5 Filtered value',
            'LaserOpto 6 Filtered value'
          ]
        },
        'Pusher Switch 1/2 State': {
          min: 0,
          max: 1,
          params: [
            'Pusher Switch State 1',
            'Pusher Switch State 2'
          ]
        },
        'Brake 1/2 MLP Current': {
          min: 0,
          max: 75,
          params: [
            'Brake MLP 1 Current',
            'Brake MLP 2 Current'
          ]
        },
        'Brake 1/2 Limit Switches': {
          min: 1,
          max: 2,
          params: [
            'Limit Extend 1',
            'Limit Retract 1',
            'Limit Extend Edge 1',
            'Limit Retract Edge 1',
            'Limit Extend 2',
            'Limit Retract 2',
            'Limit Extend Edge 2',
            'Limit Retract Edge 2'
          ]
        },
        'LGU Limit Switches': {
          min: 1,
          max: 2,
          params: [
            'LGU Switch Extend 1',
            'LGU Switch Retract 1',
            'LGU Switch Extend 2',
            'LGU Switch Retract 2'
          ]
        }
      }
    };
    this.watchParams = [];

    for (let paramName of this.overviewParameters.nominals) {
      console.log(paramName, this.lookupNominal(paramName));
      this.watchParams.push({
        label: paramName,
        min: this.lookupNominal(paramName).min,
        max: this.lookupNominal(paramName).max,
        params: [paramName]
      });
    }

    for (let groupName in this.overviewParameters.groups) {
      this.watchParams.push({
        label: groupName,
        min: this.overviewParameters.groups[groupName].min,
        max: this.overviewParameters.groups[groupName].max,
        params: this.overviewParameters.groups[groupName].params
      });
    }
  }

  lookupNominal (param) {
    for (let nominalPrefix in nominalConditions) {
      for (let nominalParam in nominalConditions[nominalPrefix]) {
        if (nominalPrefix + ' ' + nominalParam === param) {
          return nominalConditions[nominalPrefix][nominalParam];
        }
      }
    }
  }

  render () {
    let viewMode = this.props.route.viewMode || 'overview';

    return (
        <div className="Overview-content">
        <legend>Pod Health</legend>
        <div className="col-md-12">
          {this.watchParams.map(function (item, index) {
            return (
              <div className="health d-inline-block" key={'health' + index}>
                <HealthCheckDisplay
                      StreamingPageManager={this.state.streamManager}
                      parameters={item.params}
                      label={item.label}
                      max={item.max}
                      min={item.min}
                      hideUnits='true'
                      viewMode={viewMode}
                  />
              </div>
            );
          }, this)}
        </div>

        <legend>All Fault Flags</legend>
        <div className="col-md-12">
        {Object.keys(faultFlagDefinitions).map(function (item, index) {
          return (
              <div className="d-inline-block" key={'healthfault' + index}>
                <label htmlFor="a0_y">{item.label}</label>
                <div className="health">
                  <FaultFlagDisplay StreamingPageManager={this.state.streamManager} label={item} parameter={item} />
                </div>
              </div>
          );
        }, this)}
        </div>
      </div>
    );
  }
}
export default HealthCheckOverview;