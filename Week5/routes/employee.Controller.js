let EmployeeDatabase = require('./employeeDatabase')
let debug = require('debug')('demo:review')

const sendJSONresponse = (res, status, content) =>{
    res.status(status) //status of the response
    res.json(content) //sends Json response data
}

module.exports.getAllEmployees = (req,res)=>{


    debug('Getting all reviews')

    EmployeeDatabase.find().exec().then(results =>{
        sendJSONresponse(res, 200,results)
    }).catch(err => {
        sendJSONresponse(res, 404, err)
    })
}

module.exports.getDataFromOneEmployee = (req,res)=>{
    
    console.log("This is the number before, the variable below EmployeeID is the variable passed in from the request on the path")
    console.log(req.params)
    console.log("This is the number After")


    if(req.params && req.params.oneEmployeeId){
        debug("Getting a single review with id =", req.params.oneEmployeeId)

        EmployeeDatabase.findById(req.params.oneEmployeeId).exec().then(results =>{
            sendJSONresponse(res, 200,results)
        }).catch(err => {
            sendJSONresponse(res, 404,{
                "message":"Review not found"
            })
        })
    }else{
        sendJSONresponse(res, 404,{
            "message":"reviewi not found"
        })
    }   
}

module.exports.createOneEmployee = (req,res)=>{
    debug('Creating Review ', req.body)

    EmployeeDatabase.create({

        employeeFirstName:req.body.employeeFirstName.toLowerCase(),
        employeeLastName:req.body.employeeLastName.toLowerCase(),
        employeeDepartment:req.body.employeeDepartment.toLowerCase(),
        employeeStartDate:req.body.employeeStartDate,
        employeeJobTitle:req.body.employeeJobTitle.toLowerCase(),
        employeeSalary:req.body.employeeSalary

    }).then(employeeSaved =>{

        console.log("HEREEE1 ")
        debug(employeeSaved)
        console.log("HEREEE2 ")


        sendJSONresponse(res, 201, employeeSaved) //send back the data as JSON so we could see it
    }).catch(err =>{
        debug(err)
        sendJSONresponse(res, 404, err)
    })
}

module.exports.updateOneEmployee = (req,res)=>{

    try{

        console.log("This is the req.params.employeeID " + req.params.employeeID)
        if(!req.params.employeeID){ //if ID is empty
            sendJSONresponse(res, 404, {
                "message":"Not found employee ID is missing this is required"
            })
            return
        }
    
        EmployeeDatabase.findById(req.params.employeeID).exec()
        .then(dataOfEmployeeFound =>{
            dataOfEmployeeFound.employeeFirstName = req.body.employeeFirstName;
            dataOfEmployeeFound.employeeLastName = req.body.employeeLastName;
            dataOfEmployeeFound.employeeDepartment = req.body.employeeDepartment;
            dataOfEmployeeFound.employeeStartDate = req.body.employeeStartDate;
            dataOfEmployeeFound.employeeJobTitle = req.body.employeeJobTitle;
            dataOfEmployeeFound.employeeSalary = req.body.employeeSalary;
            return dataOfEmployeeFound.save()
    
        }).then(data =>{
            sendJSONresponse(res,200,data) //sending the updated data of employee so we could see it as JSON
        }).catch(err=>{
            sendJSONresponse(res, 400, err)
        })
    }catch(err){

        console.log(err)
    }

 
}

module.exports.deleteOneEmployee = (req,res)=>{
    if(!req.params.employeeID){
        sendJSONresponse(res, 404, {
            "message":"Not found... reviewid required"
        })
        return
    }

    EmployeeDatabase.findByIdAndRemove(req.params.employeeID).exec()
    .then(dataOfEmployeeFound =>{
       debug("Employee ID " + req.params.employeeID + " deleted")
       debug(dataOfEmployeeFound)
        sendJSONresponse(res,204, null)
    }).catch(err=>{
        sendJSONresponse(res, 400, err)
    })
}


module.exports.sortByOneColumn = (req,res)=>{

    try{

        const sortColumnName_and_Order = req.params.sortColumnName_or_searchColumnValue;
        const asc_or_desc_Order = sortColumnName_and_Order.toLowerCase().charAt(0) == "-"? "descending" : "ascending"
        const columnName = asc_or_desc_Order == "ascending" ? sortColumnName_and_Order : sortColumnName_and_Order.substring(1);

        const arrayOfSortColumns = ["employeeFirstName","employeeLastName","employeeDepartment","employeeStartDate","employeeJobTitle","employeeSalary"]

        if(arrayOfSortColumns.includes(columnName)){

            EmployeeDatabase.find().sort([[columnName, asc_or_desc_Order]]).collation({'locale':'en'}).exec().then(results =>{ //collation fixed the sorting for upper and lower case sensative

                sendJSONresponse(res,200, results)
            }).catch(err => {

                sendJSONresponse(res, 404, err)
            })

        }else{

            res.json(`ERROR - Invalid Column, ${sortColumnName} was not in the list of columns to search by`)
        }

    }catch(e){
        
        res.json("ERROR - We could not sort by that column")
    }
}


module.exports.searchByColumn = (req,res)=>{

    const searchColumnName = req.params._sort_or_searchColumnName;
    let searchObject = {}
  
    const searchColumnValue = req.params.sortColumnName_or_searchColumnValue

    searchObject[searchColumnName] = searchColumnValue

    console.log("Search colum by name ",searchColumnName)
    EmployeeDatabase.find(searchObject).collation({'locale':'en'}).exec().then(results =>{ //collation fixed the sorting for upper and lower case sensative
        
        sendJSONresponse(res,200, results)
    }).catch(err => {
        
        sendJSONresponse(res, 404, {
            "message": "Employee not found"
        })
    })
        
              
             
         
}
