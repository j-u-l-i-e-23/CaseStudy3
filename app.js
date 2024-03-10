// Task1: initiate app and run server at 3000
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path=require('path');
const PORT = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));


// Task2: create mongoDB connection 
mongoose.connect('mongodb+srv://juliya:MyaccOUntMDb@cluster0.wn4u6jc.mongodb.net/EmployeeDB')
.then(() => {
  console.log("Connected to MongoDB Atlas");
})
.catch((err) => {
  console.error("Error connecting to MongoDB Atlas:", err);
});


//Defining Employee Schema

const EmployeeSchema = new mongoose.Schema({
    name : String,
    location :String,
    position : String,
    salary :Number

});

// Create Employee model
const Employee = mongoose.model('Employee', EmployeeSchema);

// Middleware to parse JSON
app.use(express.json());


//Task 2 : write api with error handling and appropriate api mentioned in the TODO below


//TODO: get data from db  using api '/api/employeelist'

app.get('/api/employeelist', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//TODO: get single data from db  using api '/api/employeelist/:id'

app.get('/api/employeelist/:id', async (req, res) => {
    try {
      const employee = await Employee.findById(req.params.id);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json(employee);
    } catch (err) {
      console.error("Error fetching employee:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });



//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.post('/api/employeelist', async (req, res) => {
  try {
    const { name, location, position, salary } = req.body;
    const newEmployee = new Employee({ name, location, position, salary });
    await newEmployee.save();
    res.json(newEmployee);
    // res.redirect('/');
  } catch (err) {
    console.error("Error adding employee:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




//TODO: delete a employee data from db by using api '/api/employeelist/:id'
app.delete('/api/employeelist/:id', async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json({msg:"Deleted"})
    // res.redirect('/');
  } catch (err) {
    console.error("Error deleting employee:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.put('/api/employeelist/:id', async (req, res) => {
  try {
    const { name, position, location, salary } = req.body;

    // Check if any of the fields are missing in the request body
    if (!name || !location || !position || !salary) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Update the employee in the database
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, position, location, salary },
      { new: true }
    );

    // Check if employee was not found
    if (!updatedEmployee) {
      console.error("Employee not found");
      return res.status(404).json({ error: "Employee not found" });
    }
    
    // Log and send the updated employee data as JSON response
    console.log("Employee updated successfully:", updatedEmployee);
    res.json(updatedEmployee);
  } catch (err) {
    // Handle any errors that occur during the update operation
    console.error("Error updating employee:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });


