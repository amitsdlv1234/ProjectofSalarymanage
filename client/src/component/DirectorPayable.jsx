import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Select, MenuItem } from '@mui/material';

import { Button, FormControl, FormGroup, Input, InputLabel, Typography} from '@mui/material';
import styled from '@emotion/styled';
import { useParams } from 'react-router-dom';
import { addDirectorSalary ,getRegisterData,getDA_PercentData} from '../service/api.js';


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
   const { Id ,year,month} = useParams();
   const navigate = useNavigate();
   const [staff, setStaff] = useState({
     ID: Number,
     Year: String,
     Month: String,
     Name: String,
     Designation: String,
     PayScale: String,
     Level: Number,
     PayMatrix: Number,
     Special_Allowance: Number,
     GPF:Number,
     Group_Insurance: Number,
     GPF_Total:0,
     GSLI: Number,
     HouseRent: Number,
     WaterCharge: Number,
     Mobile: Number,
     Vehicle:Number,
     Income_Tax: Number,
     Other_Charge: Number,
     DA: 0,
     GrandTotal: 0,
     Total: 0,
     Amount: 0,
   });
   let DA_Per;
   useEffect(() => {  
      const getDA_Percent = async () => {
         try {
            const res = await getDA_PercentData();
            console.log(res.data[res.data.length-1].DA_IN_Percent);
            DA_Per=res.data[res.data.length-1].DA_IN_Percent;
            // setStaff({
            //   DA_Percent: res.data[res.data.length-1].DA_IN_Percent,
            // });
          } catch (error) {
            console.error('Error getting data for staff:', error);
          }
        };
        getDA_Percent();
    });
   useEffect(() => {
     const getData = async (Id) => {
      try {
         const res = await getRegisterData(Id);
         setStaff({
            ID:res.data[0].Id,
           Name: res.data[0].Name,
           Designation: res.data[0].Designation,
           Level: res.data[0].Level,
         });
       } catch (error) {
         console.error('Error getting data for staff:', error);
       }
     };
 
     getData(Id);
 
   }, [Id]);
   
   const onValueChange = (e) => {
    const { name, value } = e.target;

    
    setStaff((prevStaff) => {
        const updatedStaff = {
            ...prevStaff,
            [name]: value,
        };

        if (!isNaN(parseFloat(updatedStaff.PayMatrix))) {
            updatedStaff.DA = Math.round(updatedStaff.PayMatrix * (DA_Per* 0.01));
        }
        
        updatedStaff.GrandTotal =
            Math.round(
                parseFloat(updatedStaff.PayMatrix) +
                parseFloat(updatedStaff.DA) +
                parseFloat(updatedStaff.Special_Allowance)
            );

            const GPF=parseFloat(updatedStaff.GPF)||0;
            const Group_Insurance=parseFloat(updatedStaff.Group_Insurance)||0;
            const GSLI= parseFloat(updatedStaff.GSLI) ||0;
            const HouseRent= parseFloat(updatedStaff.HouseRent)||0 ;
             const WaterCharge=parseFloat(updatedStaff.WaterCharge)||0 ;
             const Mobile=parseFloat(updatedStaff.Mobile)||0 ;
             const Vehicle=parseFloat(updatedStaff.Vehicle)||0 ;
             const Income_Tax=parseFloat(updatedStaff.Income_Tax)||0 ;
             const Other_charge=parseFloat(updatedStaff.Other_Charge)||0

        updatedStaff.Total =
            Math.round(
               GPF+Group_Insurance+GSLI+HouseRent+WaterCharge+Mobile+Vehicle+Income_Tax+Other_charge
            );
         updatedStaff.GPF_Total=Math.round(
            GPF+Group_Insurance
         )
        updatedStaff.Amount = updatedStaff.GrandTotal - updatedStaff.Total;

        return updatedStaff;
    });
};

    
 
   const viewDetails = async () => {
     if (!staff.ID) {
       alert('ID is required.');
       console.error('ID is required.');
       return;
     }
    
     const requiredFields = ['ID', 'Name', 'Designation', 'PayScale', 'Level', 'GrandTotal', 'Total', 'Amount'];
     const missingFields = requiredFields.filter(field => !staff[field]);
 
     if (missingFields.length > 0) {
       console.error(`Fields ${missingFields.join(', ')} are required.`);
       alert(`Fields ${missingFields.join(', ')} are required.`);
       return;
     }
 
     try {
      console.log(Id,year,month,staff);
      
       await addDirectorSalary( Id,staff);
       alert("Data Added successfully");
       navigate(`/DirectorDataTable/${year}/${month}`);
     } catch (error) {
       console.error('Error adding staff:', error);
      //  alert("Staff Data is Already Exist OR Fill all Fields :- Refresh the Page and Fill again ");
     }
   };
 
   // Log the current user state
   useEffect(() => {
      
   }, [staff]);
 
  return (
    <div>
      <h2>Data Entry for {month.charAt(0).toUpperCase() + month.slice(1)}to Payable Salary</h2>
      <Container>
        <Typography variant='h4' margin={'10px'}>Add Salary</Typography>
         <Typography variant='h6'>Director Details</Typography>
     <Employee >
        <FormControl ><InputLabel>Year</InputLabel>
        <Input type='text'
    onChange={(e) => {
      const { name, value } = e.target;
      const formattedValue = value.replace(/(\d{5})(\d{5})/, '$1-$2');
      onValueChange({ target: { name, value: formattedValue } });
    }}
    name="Year"
    value={staff.Year}></Input>
        </FormControl>
        <FormControl>
  <InputLabel>Month</InputLabel>
  <Select
    value={staff.Month}
    onChange={(e) => onValueChange({ target: { name: "Month", value: e.target.value } })}
  >
    <MenuItem value="January">January</MenuItem>
    <MenuItem value="Febuary">Febuary</MenuItem>
    <MenuItem value="March">March</MenuItem>
    <MenuItem value="April">April</MenuItem>
    <MenuItem value="May">May</MenuItem>
    <MenuItem value="June">June</MenuItem>
    <MenuItem value="July">July</MenuItem>
    <MenuItem value="August">August</MenuItem>
    <MenuItem value="September">September</MenuItem>
    <MenuItem value="Octuber">Octuber</MenuItem>
    <MenuItem value="November">November</MenuItem>
    <MenuItem value="December">December</MenuItem>
  </Select>
 </FormControl>
        <FormControl><InputLabel>Name</InputLabel>
        <Input onChange={(e)=>setStaff(staff.Name)} name="Name" value={staff.Name}></Input>
        </FormControl>  
        <FormControl><InputLabel>Designation</InputLabel>
        <Input onChange={(e)=>setStaff(staff.Designation)} name="Designation" value={staff.Designation}></Input>
        </FormControl>  
        <FormControl>
  <InputLabel>PayScale</InputLabel>
  <Input
    type='text'
    onChange={(e) => {
      const { name, value } = e.target;
      const formattedValue = value.replace(/(\d{5})(\d{5})/, '$1-$2');
      onValueChange({ target: { name, value: formattedValue } });
    }}
    name="PayScale"
    value={staff.PayScale}
  />
</FormControl>

        <FormControl><InputLabel>Level</InputLabel>
        <Input onChange={(e)=>setStaff(staff.Level)} name="Level" value={staff.Level}></Input>
        </FormControl>
     </Employee>
      <Typography variant='h6'>EMOLUMENT</Typography>
     <Employee>
     <FormControl>
        <InputLabel>PayMatrix</InputLabel>
        <Input   onChange={(e)=>onValueChange(e)}  name="PayMatrix" ></Input>
     </FormControl>
     <FormControl>
        <InputLabel>DA</InputLabel>
        <Input   disabled value={staff.DA}></Input>
     </FormControl>
     <FormControl>
        <InputLabel>Special Allowance</InputLabel>
        <Input onChange={(e)=>onValueChange(e)} name ="Special_Allowance"></Input>
     </FormControl>
     <FormControl>
        <InputLabel>GrandTotal</InputLabel>
        <Input  disabled value={staff.GrandTotal}></Input>
     </FormControl>
     </Employee>
     <Typography variant='h6'>DEDUCTION</Typography>
     <Employee>
      <Employee> 
    <FormControl>
    <InputLabel>GPF</InputLabel>
    <Input onChange={(e)=>onValueChange(e)}value={staff.GPF} name ="GPF"></Input>
     </FormControl>
     <FormControl>
    <InputLabel>Group Insurance</InputLabel>
    <Input onChange={(e)=>onValueChange(e)}value={staff.Group_Insurance} name ="Group_Insurance"></Input>
     </FormControl>
     <FormControl>
    <InputLabel>GPF Total</InputLabel>
    <Input onChange={(e)=>onValueChange(e)}value={(parseFloat(staff.GPF)||0)+(parseFloat(staff.Group_Insurance)||0)} name ="GPF_Total"></Input>
     </FormControl>
     </Employee> 
     <FormControl>
        <InputLabel>GSLI</InputLabel>
        <Input onChange={(e)=>onValueChange(e)} name ="GSLI"></Input>
     </FormControl>
     <FormControl>
        <InputLabel>HouseRent</InputLabel>
        <Input onChange={(e)=>onValueChange(e)} name ="HouseRent"></Input>
     </FormControl>
     <FormControl>
        <InputLabel>WaterCharge</InputLabel>
        <Input onChange={(e)=>onValueChange(e)} name ="WaterCharge"></Input>
     </FormControl>
     <FormControl>
        <InputLabel>Mobile charge</InputLabel>
        <Input onChange={(e)=>onValueChange(e)} name ="Mobile"></Input>
     </FormControl>
     <FormControl>
        <InputLabel>ElectricCharge</InputLabel>
        <Input onChange={(e)=>onValueChange(e)} name ="ElectricCharge"></Input>
     </FormControl>
     <FormControl>
        <InputLabel>Vehicle</InputLabel>
        <Input onChange={(e)=>onValueChange(e)} name ="Vehicle"></Input>
     </FormControl>
     <FormControl>
        <InputLabel>Income Tax</InputLabel>
        <Input onChange={(e)=>onValueChange(e)} name ="Income_Tax"></Input>
     </FormControl>
     <FormControl>
        <InputLabel>Other Charge</InputLabel>
        <Input onChange={(e)=>onValueChange(e)} name ="Other_Charge"></Input>
     </FormControl>
     <FormControl>
        <InputLabel>Total</InputLabel>
        <Input disabled value={staff.Total}></Input>
     </FormControl>
     </Employee>
     <FormControl style={{width:'30%', margin:"10px auto"}}>
        <InputLabel>Amount(TRF.A/C)</InputLabel>
        <Input disabled value={staff.Amount}></Input>
     </FormControl>
     <FormControl style={{width:'30%', margin:"auto"}}>
        <Button variant='contained' onClick={()=>{viewDetails()}}>Add Salary</Button>
     </FormControl>
    </Container>
    </div>
  );
};

export default DataEntry;
