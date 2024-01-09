import React, { useState } from 'react';
import { SignInUser } from '../service/api';
import {FormGroup, Box,Typography, Input,Button}from "@mui/material";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import styled from '@emotion/styled';

const Container=styled(Box)`
display:flex;
Width:30%;
margin:10% auto;
border:1px solid black;
background:#dc5e5e66;
border-radius:10px;
padding:2%;
font-size:20px;
flex-direction:column;`;
const SignIn = () => {
  const navigate = useNavigate();
  const [user,setUser]=useState({
    Id:'',
    password:''
  })
  const onValueChange=(e)=>{
    setUser({...user,[e.target.name]:e.target.value});
  }
 const OnSignIn=async()=>{
  // event.preventDefault();
  console.log(user);
  try {
      const response=await SignInUser(user);
      
      const Role=response.data.result[0].Role;
      const Id=response.data.result[0].Id;
      const token = response.data.tokens; 
      // console.log(response.data.result[0].role);
      localStorage.setItem('token', token);
      setUser({
        Id:'',
        password:''
      })
      if(Role==="admin"){
      navigate("/year"); 
      }
      else{
        navigate(`/staffDash/${user.Id}`);
      }
  } catch (error) {
    // console.log("SignIn Failed");
    alert(error.response.data.message || 'SignIn failed');
  }
 }
  return (
    <Container>
      <Typography variant='h5' style={{margin:"auto"}}>Sign In</Typography>
      <FormGroup>
        <label>
          Mobile No. :
          <Input type="Id" name='Id' value={user.Id} onChange={(e)=>onValueChange(e)} />
        </label>
        <label>
          Password :
          <Input type="password" name='password'value={user.password} onChange={(e)=>onValueChange(e)} />
          <Link to="/reset-password">Forgot Password?</Link>
        </label>
        <Button onClick={()=>OnSignIn()}>Sign In</Button>
      </FormGroup>
      <Typography style={{margin:"auto"}}>No Account ?</Typography>
      <Link to="/register" style={{margin:"auto"}}>
        <Button>Register</Button>
      </Link>
    </Container>
  );
};

export default SignIn;
