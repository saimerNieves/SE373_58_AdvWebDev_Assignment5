const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    employeeFirstName:String,
    employeeLastName:String,
    employeeDepartment:String,
    employeeStartDate:Date,
    employeeJobTitle:String,
    employeeSalary:Number
})

let Employee = mongoose.model('Employee', reviewSchema)

module.exports = Employee