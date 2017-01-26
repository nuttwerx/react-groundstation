import React, { Component } from 'react';
import StreamingPageManager from '../StreamingPageManager.js';
import LineChart from './charts/LineChart.js';
import FaultFlagDisplay from './FaultFlagDisplay.js';
import GenericParameterLabel from './GenericParameterLabel.js';
import ConfirmButton from './buttons/ConfirmButton.js';

import io from 'socket.io-client';
let socket = io.connect('127.0.0.1:3000', {
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionDelayMax : 5000,
			reconnectionAttempts: Infinity
		});

const NamedParameter = (props) => {
	return (
		<div className="form-group row">
			<label className="col-md-6">{props.name}</label>
			<div className="col-md-6">
				<GenericParameterLabel {...props}/>
			</div>
		</div>
	);
}

const LeftRightParameters = ({children}) => {
	return (
		<div className="row">
			<div className="col-sm-6">
				{children[0]}
			</div>
			<div className="col-sm-6">
				{children[1]}
			</div>
		</div>
	);
}

class Overview extends Component {
	constructor(props) {
		super(props)
		this.state = {
			streamManager: new StreamingPageManager()
		}
	}

	componentWillMount() {
	}

	componentWillUnmount(){

    }

    resetPod() {
    	socket.emit('EnterPreRunPhase');
    }

	render() {
	    return (
			<div>
				<legend>Mission</legend>
				<div className="row">
					<ConfirmButton className="btn btn-danger" delay={2000} action={this.resetPod}>Enter pre-run phase</ConfirmButton>
				</div>
				<div>
					<legend>Pod Health</legend>
					<div className="col-md-6">
						<div className="row">
							<div className="col-md-12">
								<h3 className="section-title">Brakes</h3>
							</div>
						</div>
						<LeftRightParameters>
							<NamedParameter
								name="State"
								parameter="Brake State"
								hex="true"
								StreamingPageManager={this.state.streamManager}
							/>
							<NamedParameter
								name="Calibration State"
								parameter="Brake Calibration State"
								hex="true"
								StreamingPageManager={this.state.streamManager}
							/>
						</LeftRightParameters>
						<LeftRightParameters>
							<FaultFlagDisplay   StreamingPageManager={this.state.streamManager} label="Left Fault Flags" parameter='Brake Fault flags 1' />
							<FaultFlagDisplay   StreamingPageManager={this.state.streamManager} label="Right Fault Flags" parameter='Brake Fault flags 2' />
						</LeftRightParameters>
						<LeftRightParameters>
							<NamedParameter
								name="FL Beam Dist"
								parameter="Brake FL I-Beam Dist"
								StreamingPageManager={this.state.streamManager}
							/>
							<NamedParameter
								name="FR Beam Dist"
								parameter="Brake FR I-Beam Dist"
								StreamingPageManager={this.state.streamManager}
							/>
						</LeftRightParameters>
						<LeftRightParameters>
							<NamedParameter
								name="RL Beam Dist"
								parameter="Brake RL I-Beam Dist"
								StreamingPageManager={this.state.streamManager}
							/>
							<NamedParameter
								name="RR Beam Dist"
								parameter="Brake RR I-Beam Dist"
								StreamingPageManager={this.state.streamManager}
							/>
						</LeftRightParameters>
					</div>
				</div>
				<div className="row">
					<div className="col-md-6">
						<div className="row">
							<div className="col-md-6">
								<label>Pitch</label>
								<GenericParameterLabel StreamingPageManager={this.state.streamManager} parameter="Accel 0 Pitch"/>
								<label>Roll</label>
								<GenericParameterLabel StreamingPageManager={this.state.streamManager} parameter="Accel 0 Roll"/>
								<LineChart
									id="AccelerometerChart1"
									StreamingPageManager={this.state.streamManager}
									parameters={['Accel 0 X Gs', 'Accel 0 Y Gs', 'Accel 0 Z Gs']}
									title="Accelerometer 0"
									yAxisLabel="Acceleration"
									xAxisLabel="Time"
									totalPoints={60}
									height={250}
								/>
							</div>
							<div className="col-md-6">
								<label>Pitch</label>
								<GenericParameterLabel StreamingPageManager={this.state.streamManager} parameter="Accel 0 Pitch"/>
								<label>Roll</label>
								<GenericParameterLabel StreamingPageManager={this.state.streamManager} parameter="Accel 0 Roll"/>
								<LineChart
									id="AccelerometerChart3"
									StreamingPageManager={this.state.streamManager}
									parameters={['Accel 1 X Gs', 'Accel 1 Y Gs', 'Accel 1 Z Gs']}
									title="Accelerometer 1"
									yAxisLabel="Acceleration"
									xAxisLabel="Time"
									totalPoints={60}
									height={250}
								/>
							</div>
						</div>
					</div>
					<div className="col-md-6">
						<div className="row">
							<div className="col-md-6">
								<LineChart
									id="BMSAPressure"
									StreamingPageManager={this.state.streamManager}
									parameters={['Power A BMS Node Pressure']}
									title="Power node A pressure"
									yAxisLabel="Pressure"
									xAxisLabel="Time"
									totalPoints={60}
									height={250}
								/>
							</div>
							<div className="col-md-6">
								<LineChart
									id="BMSBPressure"
									StreamingPageManager={this.state.streamManager}
									parameters={['Power B BMS Node Pressure']}
									title="Power node B pressure"
									yAxisLabel="Pressure"
									xAxisLabel="Time"
									totalPoints={60}
									height={250}
								/>
							</div>
						</div>
						<div className="row">
							<div className="col-md-6">
								<LineChart
									id="BMSAPressure"
									StreamingPageManager={this.state.streamManager}
									parameters={['Power A BMS Node Temp']}
									title="Power node A temperature"
									yAxisLabel="Temperature"
									xAxisLabel="Time"
									totalPoints={60}
									height={250}
								/>
							</div>
							<div className="col-md-6">
								<LineChart
									id="BMSBPressure"
									StreamingPageManager={this.state.streamManager}
									parameters={['Power B BMS Node Temp']}
									title="Power node B temperature"
									yAxisLabel="Temperature"
									xAxisLabel="Time"
									totalPoints={60}
									height={250}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Overview;
