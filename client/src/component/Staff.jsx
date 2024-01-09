import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, FormControl, FormGroup, Input, InputLabel, Typography} from '@mui/material';
import styled from '@emotion/styled';
import { useParams } from 'react-router-dom';
// import { addUser } from '../service/api';


const Container=styled(FormGroup)`
margin:10px;
padding:10px;
text-align: center;
border:1px solid black;
`;
                                   
                                   
const Employee=styled(FormGroup)  `
display:flex;
flex-direction:row;
border:1px solid black;
margin:10px;
padding:10px;
& > div ,lebel{
   padding:10px;
   margin:auto;
}`;

const DataEntry = () => {
   const { year, month } = useParams();
   const navigate=useNavigate();
   const [Id , setId] =useState("");
   const [Year , setYear] =useState("");
   

   
 
  
  
const getData = async () => {
  
 try {
  //  console.log(Id);
      // console.log(Id ,Year);
      navigate(`/data-entry/admin/${Year}/${month}/${Id}/staff`);
 } catch (error) {
   alert('Page Not Found:', error);
//    alert("Staff Data is Already Exist OR Fill all Fields :- Refresh the Page and Fill again ");
 }
};

  return (
    <div>
      
      <Container>
        <Typography variant='h4' margin={'10px'}>Add Staff</Typography>
         <Typography variant='h6'>Staff Details</Typography>
         <Employee>
         <FormControl ><InputLabel>Mobile No.</InputLabel>
        <Input onChange={(e)=>setId(e.target.value)} name="ID"></Input>
        </FormControl>
        <FormControl ><InputLabel>Year</InputLabel>
        <Input onChange={(e)=>setYear(e.target.value)} name="Year"></Input>
        </FormControl>
        <Button onClick={()=>getData()}>Search</Button>
        </Employee>
    
    </Container>
    </div>
  );
};

export default DataEntry;
