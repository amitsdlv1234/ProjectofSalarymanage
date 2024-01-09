import React, { useState } from 'react';
import { RegisterUser } from '../service/api';
import { useNavigate ,Link} from "react-router-dom";
import {Box, Button, FormGroup, Input,styled,Typography, FormControl} from "@mui/material";

const Container=styled(Box)`
display:flex;
Width:30%;
margin:10% auto;
border:1px solid black;
background:#dc5e5e66;
border-radius:10px;
padding:2%;
font-size:15px;
flex-direction:column;`;
const Fields=styled(FormControl)`
display:flex;
flex-direction:row;
margin:2% 14%
`;
const HiddenFields = styled(Box)`
  display: ${(props) => (props.isHidden ? 'none' : 'flex')};
  flex-direction: row;
  margin: 2% 14%;
`;

const Register = () => {
  const navigate = useNavigate();
  const [hideFields,setHideFields]=useState(false);
  const [formData, setFormData] = useState({
    Category:'',
    Id: '',
    Name:'',
    Designation:'',
    Level:'',
    wing:'',
    email:'',
    Password: '',
    ConfirmPassword: '',
    Role: 'Staff',
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const onValueChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const isStrongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
    const handleRegister = async (event) => {
      event.preventDefault();
      
      // Validate form fields
      if (
        formData.Id.trim() === '' ||
        formData.email.trim() === '' ||
        formData.Password.trim() === '' ||
        formData.ConfirmPassword.trim() === ''
      ) {
        alert('Please fill out all the required fields.');
        return; // Exit the function early if any required field is empty
      }
    // Check if password and confirm password match
  if (formData.Password !== formData.ConfirmPassword) {
    alert('Password and Confirm Password do not match. Please try again.');
    return; // Exit the function if passwords do not match
  }
  if (!isStrongPassword.test(formData.Password)) {
    alert(
      'Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 8 characters long.'
    );
    return;
  }
 // Set Role and Wing to null if they are empty
 const updatedFormData = {
  ...formData,
  Role: formData.Role.trim() === '' ? '-' : formData.Role,
  wing: formData.wing.trim() === '' ? '-' : formData.wing,
};
      try {
        // Make an API call using Axios with the FormData object
        const response = await RegisterUser(updatedFormData);
        
        // Handle the response
        alert('Registration successful');
    
        // Reset the form after successful registration
        setFormData({
          Category:'',
    Id: '',
    Name:'',
    Designation:'',
    Level:'',
    wing:'',
    email:'',
    Password: '',
    ConfirmPassword: '',
    Role: 'Staff',
        });
      } catch (error) {
        // Handle errors, e.g., show an error message to the user
        console.log(error.response.data.message);
        alert(error.response.data.message);
      }
    };

  return (
    <Container>
      <Typography variant='h5' style={{margin:"auto"}}>Register</Typography>
      <FormGroup >
      <Fields><label>
          Category:
          <select value={formData.Category} name="Category" onChange={(e) => onValueChange(e)} required>
             <option value="Select">Select</option>
              <option value="Teaching Staff">Teaching Staff</option>
              <option value="Director">Director</option>
              <option value="Non Teaching Staff">Non Teaching Staff</option>
              {/* Add more options as needed */}
            </select>
        </label></Fields>
        <Fields><label>
          User Id :
          <Input type="text" value={formData.Id} name="Id" onChange={(e) => onValueChange(e)} required />
        </label></Fields>
        <Fields><label>
          Name :
          <Input type="text" value={formData.Name} name="Name" onChange={(e) => onValueChange(e)} required />
        </label></Fields>
        <Fields><label>
            Designation :
            <select
            value={formData.Designation}
            name="Designation"
            onChange={(e) => {
              onValueChange(e);
              // Check if the selected designation is 'Director'
              const isDirector = e.target.value === 'Director';
              // Update the state to hide or show the fields based on the designation
              setHideFields({ wing: isDirector, staff: isDirector });
            }}
            required
          >
             <option value="Select">Select</option>
             <option value="Director">Director</option>
              <option value="Assistant Professor">Assistant Professor</option>
              <option value="Lecturer">Lecturer</option>
              <option value="Technician">Tech Assistant</option>
              <option value="Sr. Clerk">Sr. Clerk</option>
              <option value="Cashier">TechCashier</option>
              <option value="Jr. Clerk">Jr. Clerk</option>
              <option value="Councellor">Councellor</option>
              <option value="Foreman">Foreman</option>
              <option value="Computer Programmer">Computer Programmer</option>
              <option value="D.E.O.">D.E.O.</option>
              <option value="Steno">Steno</option>
              <option value="Store keeper">Store keeper</option>
              <option value="Driver">Driver</option>
              <option value="Lab Attendt">Lab Attendt</option>
              <option value="Host. Attendt">Host. Attendt</option>
              <option value="Hos. Attendt">Hos. Attendt</option>
              <option value="OFF. Attendt">OFF. Attendt</option>
              <option value="Gardener">Gardener</option>
              {/* Add more options as needed */}
            </select>
          </label></Fields>
        <Fields><label>
        Level :
          <Input type="text" value={formData.Level} name="Level" onChange={(e) => onValueChange(e)} required />
        </label></Fields>
        <HiddenFields isHidden={hideFields.wing}>
        <Fields>
          <label>
            Wing :
            <select
              value={formData.wing}
              name="wing"
              onChange={(e) => onValueChange(e)}
              required
            >
           
            <option value="Select_Wing">Select Wing</option>
              <option value="Digree">Digree</option>
              <option value="Diploma">Diploma</option>
              {/* Add more options as needed */}
              </select>
          </label>
        </Fields>
      </HiddenFields>
        <Fields><label>
          Email :
          <Input type="text" value={formData.email} name="email" onChange={(e) => onValueChange(e)} required />
        </label></Fields>
        <Fields><label>
          Password:
          <Input
            type={isPasswordVisible ? 'text' : 'password'}
            value={formData.Password}
            name="Password"
            onChange={(e) => onValueChange(e)}
            required
          />
        </label>
        <Button type="button" onClick={togglePasswordVisibility}>
          {isPasswordVisible ? 'Hide' : 'Show'}
        </Button>
        </Fields>
        
        <Fields><label>
          Confirm Password:
          <Input
            type="password"
            name="ConfirmPassword"
            value={formData.ConfirmPassword}
            onChange={(e) => onValueChange(e)}
            required
          />
        </label></Fields>
        <Button onClick={(e)=>handleRegister(e)}>Register</Button>
        <Typography style={{margin:"auto"}}>Already Account ?</Typography>
      <Link to="/signin" style={{margin:"auto"}}>
        <Button>SignIN</Button>
      </Link>
      </FormGroup>
    </Container>
  );
};

export default Register;
