import React from 'react'
import Backbone from 'backbone'
import STORE from '../store'
import ACTIONS from '../actions'

import Profile from './profile'
import TeacherModal from './components/teacherModal'
import MyClassModal from './components/myClassModal'
import Header from './components/header'

var Class = React.createClass({
	componentWillMount: function() {
		ACTIONS.fetchAllData()
		ACTIONS.fetchTeacherData()
		STORE.on('dataUpdated', () => {
			this.setState(STORE.data)
		})
	},
	getInitialState: function() {
		return STORE.data
	},
	componentWillUnmount: function() {
		STORE.off()
	},
	render: function() {
		var date = new Date()
		var teacherCollection = this.state.teacherCollection
		var teacher_id = this.state.teacher_id
		return (
			<div className='class-container'>
				<div className='page-header'>
					<h4>MyClass</h4>
					<button onClick={ACTIONS.changeTeacher} className='change-teacher'><i className="material-icons md-light md-36">account_box</i></button>
				</div>
				<div className='post-header'>
					<a href='#dashboard'>
						<div className='home-icon'><i className="material-icons">home</i></div>
					</a>
					<a href='#dashboard'>
						<p>Dashboard</p>
					</a>
					<div className='date'>
						<p>{moment(date).format('MMMM Do YYYY')}</p>
					</div>
				</div>
				<Profile showProfileModal={this.state.showProfileModal}
						 studentModel={this.state.studentModel}
						 pickupCollection={this.state.pickupCollection}/>
				<TeacherModal 
					teachers={this.state.teacherCollection}
					modalState={this.state.showModal}
					teacherSearchCollection={this.state.searchTeachers} />
				<div className='class-student-group'>
					<p className='teacher-name'>{ACTIONS.getTeacherName(teacherCollection, teacher_id)}</p>
					<StudentGroup 
						teacher_id={this.state.teacher_id}
						students={this.state.studentCollection}
						activeID={this.state.activeID} />
				</div>
			</div>
		)
	}
})

var StudentGroup = React.createClass({
	_makeStudentList: function(model) {
		if (model.get('teacher_id') === this.props.teacher_id) {
			return (
				<StudentList 
					studentModel={model} 
					activeID={this.props.activeID}
					key={model.cid} />
			)
		}
	},
	render: function() {
		return (
			<div>
				{this.props.students.map(this._makeStudentList)}
			</div>
		)
	}
})

var StudentList = React.createClass({
	_handleClick: function() {
		ACTIONS.setActiveID(this.props.studentModel.get('_id'))
	},
	_handleIncreaseStage: function() {
		  ACTIONS.increaseStage(this.props.studentModel)
		  ACTIONS.unsetActiveID()
	},
	_handleRemoveStage: function() {
		  ACTIONS.removeStage(this.props.studentModel)
		  ACTIONS.unsetActiveID()
	},
	_handleProfile: function() {
		ACTIONS.showProfileModal(this.props.studentModel)	
	},
	render: function() {
		var valetPopUp = 'hidden'
		var modalBackground = 'hidden'
		if (this.props.activeID === this.props.studentModel.get('_id')) {
			valetPopUp = 'active'
			modalBackground = 'modalBackground'
		}
		if (this.props.studentModel.get('stage') === 1) {
			return (
				<div className='class-list'>
					<div className={modalBackground}>
						<div className={valetPopUp}>
							<h5>{this.props.studentModel.get('firstName')}&nbsp;{this.props.studentModel.get('lastName')}</h5>
							<button onClick={this._handleRemoveStage}>NO PICKUP NEEDED</button>
							<button id='profile' onClick={this._handleProfile}>STUDENT PROFILE</button>
							<button id='cancel' onClick={ACTIONS.unsetActiveID}>CANCEL</button>
						</div>
					</div>
					<div onClick={this._handleClick} className='class-student-list' id='stage-one'>
						<p>{this.props.studentModel.get('firstName')}&nbsp;{this.props.studentModel.get('lastName')}</p>
					</div>
				</div>
			)
		}
		if (this.props.studentModel.get('stage') === 2) {
			return (
				<div className='class-list'>
					<div className={modalBackground}>
						<div className={valetPopUp}>
							<h5>{this.props.studentModel.get('firstName')}&nbsp;{this.props.studentModel.get('lastName')}</h5>
							<button onClick={this._handleIncreaseStage}>ON THE WAY!</button>
							<button id='profile' onClick={this._handleProfile}>STUDENT PROFILE</button>
							<button id='cancel' onClick={ACTIONS.unsetActiveID}>CANCEL</button>
						</div>
					</div>
					<div onClick={this._handleClick} className='class-student-list' id='stage-two'>
						<div className='class-status-arrival'></div>
						<div className='class-zone-status'>{this.props.studentModel.get('zone')}</div>
						<p>{this.props.studentModel.get('firstName')}&nbsp;{this.props.studentModel.get('lastName')}</p>
						<p id='class-small-arrival'>{this.props.studentModel.get('currentDriver')} <span id='lowercase'>is here!</span></p>
					</div>
				</div>
			)
		}
		if (this.props.studentModel.get('stage') === 3) {
			return (
				<div className='class-list'>
					<div className={modalBackground}>
						<div className={valetPopUp}>
							<h5>{this.props.studentModel.get('firstName')}&nbsp;{this.props.studentModel.get('lastName')}</h5>
							<button id='inactive-button'>GOING HOME</button>
							<button id='profile' onClick={this._handleProfile}>STUDENT PROFILE</button>
							<button id='cancel' onClick={ACTIONS.unsetActiveID}>CANCEL</button>
						</div>
					</div>
					<div onClick={this._handleClick} className='class-student-list' id='stage-three'>
						<div className='class-zone-status'>{this.props.studentModel.get('zone')}</div>
						<p>{this.props.studentModel.get('firstName')}&nbsp;{this.props.studentModel.get('lastName')}</p>
						<p id='class-small-transit'>{this.props.studentModel.get('firstName')} <span id='lowercase'>is on the way!</span></p>
					</div>
				</div>
			)
		}
		if (this.props.studentModel.get('stage') === 4) {
			return (
				<div className='class-list'>
					<div className={modalBackground}>
						<div className={valetPopUp}>
							<h5>{this.props.studentModel.get('firstName')}&nbsp;{this.props.studentModel.get('lastName')}</h5>
							<button id='profile' onClick={this._handleProfile}>STUDENT PROFILE</button>
							<button id='cancel' onClick={ACTIONS.unsetActiveID}>CANCEL</button>
						</div>
					</div>
					<div onClick={this._handleClick} className='class-student-list' id='stage-four'>
						<p>{this.props.studentModel.get('firstName')}&nbsp;{this.props.studentModel.get('lastName')}</p>
					</div>
				</div>
			)
		}
	}
})



export default Class