var express = require('express');
var router = express.Router();
var employeeController = require('./employee.Controller')

//Routes

//GET employees sorted or searched by column
router.get('/employees/:_sort_or_searchColumnName=:sortColumnName_or_searchColumnValue', (req, res, next) => {

  if(req.params._sort_or_searchColumnName){

      switch(req.params._sort_or_searchColumnName){

          case "_sort":

            employeeController.sortByOneColumn(req, res)
            return;
          
          default:

              const searchColumnName = req.params._sort_or_searchColumnName;
              const arrayOfSearchColumns = ["employeeFirstName","employeeLastName","employeeDepartment","employeeStartDate","employeeJobTitle","employeeSalary"]

              if(arrayOfSearchColumns.includes(searchColumnName)){

                employeeController.searchByColumn(req, res)

              }else{

                  console.log("Error in your first Variable we can only sort or search")
                  res.json("Error - the first variable can only be _sort or a column to search by ")
              }
              return  
      }
  }else{

      
    res.json("Error in your first Variable we can only sort or search")
  }   

  next()

})

//Gets One employee Based on ID
router.get('/employees/:oneEmployeeId', employeeController.getDataFromOneEmployee)//Gets all Employees

//Gets all employees
router.get('/employees', employeeController.getAllEmployees)//Gets all Employees




//POST an EMPLOYEE to Database
router.post('/employees', employeeController.createOneEmployee)




//UPDATE an Employee to the databse
router.put('/employees/:employeeID', employeeController.updateOneEmployee)




//Delete an EMPLOYEE from the database
router.delete('/employees/:employeeID', employeeController.deleteOneEmployee)

//Landing Default site
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
