import STORE from './store'
import Backbone from 'backbone'
import {Teacher} from './models/teacherModel'
import {Student} from './models/studentModel'
import User from './models/userModel'

var ACTIONS = {
	addTeacher: function(teacherData) {
		console.log(teacherData)
		var newTeacher = new Teacher(teacherData)
		newTeacher.save()
			.then(
				function(response) {
					console.log('Saved!')
					ACTIONS.fetchAllData()
				},
				function(err) {
					console.log(err)
				}
			)
	},
	addStudent: function(studentData) {
		console.log(studentData)
		var newStudent = new Student(studentData)
		newStudent.save()
			.then(
				function(response) {
					console.log('Saved!')
					ACTIONS.fetchAllData()
				},
				function(err) {
					console.log(err)
				}
			)
	},
	fetchAllData: function() {
		var teacherColl = STORE.get('teacherCollection')
		var studentColl = STORE.get('studentCollection')
		teacherColl.fetch()
		studentColl.fetch()
			.then(function(){
				STORE.set({
					teacherCollection: teacherColl,
					studentCollection: studentColl
				})
			})
	},
	registerUser: function(userData) {
		User.register(userData)
			.done(
				function(response) {
					alert(`New user ${response.firstName} registered!`)
					console.log(response)
					ACTIONS.loginUser(userData.email, userData.password)
				}
			)
			.fail(
				function(error) {
					alert('Problem registering user!')
					console.log(error)
				}
			)
	},
	loginUser: function(email,password) {
		User.login(email,password)
			.done(
				function(response) {
					alert('Success logging in!')
					console.log(response)
					location.hash = 'dashboard'
				}
			)
			.fail(
				function(error) {
					alert('Problem logging in!')
					console.log(error)
				}
			)
	},
	setActiveID : function(studentID) {
		STORE.set({
			activeID : studentID
		})
	},
	unsetActiveID: function() {
		STORE.set({
			activeID: null
		})
	},
	increaseStage: function(model) {
		model.set({
			stage: model.get('stage') + 1
		})
		model.save()
			.done(function(response) {
				ACTIONS.fetchAllData()
			})
			.fail(function(error) {
				alert('couldn\'t change the stage')
				console.log(error)
			})

	},
	getTeacherID: function(id) {
		STORE.set({
			showTeacherModal: false,
			teacher_id: id
		})
	},
}

export default ACTIONS
