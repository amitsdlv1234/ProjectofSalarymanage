import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Select, MenuItem } from '@mui/material';

import { Button, FormControl, FormGroup, Input, InputLabel, Typography} from '@mui/material';
import styled from '@emotion/styled';
import { useParams } from 'react-router-dom';
import { addUser ,getRegisterData,getDA_PercentData} from '../service/api.js';


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
     wing: String,
     Year: String,
     Month: String,
     Name: String,
     Designation: String,
     PayScale: String,
     Level: Number,
     PayMatrix: Number,
     AdditionalIncrement: Number,
     HRA: Number,
     CCA: Number,
     EPF:'',
     Regular: 0,
     Recovery: 0,
     Installments: '0/0',
     GSLI: Number,
     HouseRent: Number,
     WaterCharge: Number,
     Mobile: Number,
     TDS: Number,
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
           wing: res.data[0].Wing,
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
                updatedStaff.DA +
                parseFloat(updatedStaff.AdditionalIncrement) +
                parseFloat(updatedStaff.HRA) +
                parseFloat(updatedStaff.CCA)
            );

        updatedStaff.Total =
            Math.round(
               parseFloat(updatedStaff.Regular||0)+
               parseFloat(updatedStaff.Recovery||0)+
                parseFloat(updatedStaff.EPF||0) +
                parseFloat(updatedStaff.GSLI) +
                parseFloat(updatedStaff.HouseRent) +
                parseFloat(updatedStaff.WaterCharge) +
                parseFloat(updatedStaff.Mobile) +
                parseFloat(updatedStaff.Other_Charge) +
                parseFloat(updatedStaff.TDS)
            );

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
      console.log(Id,year,staff);
      
       await addUser( Id,year,staff);
       alert("Data Added successfully");
       navigate(`/all/admin/${year}/${month}`);
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
      <h2>Data Entry for {month.charAt(0).toUpperCase() + month.slice(1)}, {year}</h2>
      <Container>
        <Typography variant='h4' margin={'10px'}>Add Staff</Typography>
         <Typography variant='h6'>Staff Details</Typography>
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
<FormControl ><InputLabel>Wing</InputLabel>
        <Input onChange={(e)=>setStaff(staff.wing)} name="wing" value={staff.wing}></Input>
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
        <InputLabel>AdditionalIncrement</InputLabel>
        <Input onChange={(e)=>onValueChange(e)} name ="AdditionalIncrement"></Input>
     </FormControl>
     <FormControl>
        <InputLabel>HRA</InputLabel>
        <Input  onChange={(e)=>onValueChange(e)} name ="HRA" ></Input>
     </FormControl>
     <FormControl>
        <InputLabel>CCA</InputLabel>
        <Input  onChange={(e)=>onValueChange(e)} name ="CCA"></Input>
     </FormControl>
     <FormControl>
        <InputLabel>GrandTotal</InputLabel>
        <Input  disabled value={staff.GrandTotal}></Input>
     </FormControl>
     </Employee>
     <Typography variant='h6'>DEDUCTION</Typography>
     <Employee>
     <FormControl>
        {/* Conditionally render new fields for "diploma" */}
    {staff.wing === 'Diploma' ? (
      
        <Employee> <span>GPF</span>
            <FormControl>
                <InputLabel>Regular</InputLabel>
                <Input onChange={(e) => onValueChange(e)} name="Regular" value={staff.Regular} />
            </FormControl>
            <FormControl>
                <InputLabel>Recovery</InputLabel>
                <Input onChange={(e) => onValueChange(e)} name="Recovery" value={staff.Recovery} />
            </FormControl>
            <FormControl>
                <InputLabel>No. of Installments</InputLabel>
                <Input onChange={(e) => onValueChange(e)} name="Installments" value={staff.Installments} />
            </FormControl>
            <FormControl>
         <InputLabel>GPF</InputLabel>
         <Input  onChange={(e)=>onValueChange(e)} value={parseFloat(staff.Regular||0)+parseFloat(staff.Recovery||0)} name="EPF"></Input>
     </FormControl>
        </Employee>
        
    ):(<FormControl>
    <InputLabel>EPF</InputLabel>
    <Input onChange={(e)=>onValueChange(e)}value={staff.EPF} name ="EPF"></Input>
     </FormControl>)}
     </FormControl>
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
        <InputLabel>Mobile</InputLabel>
        <Input onChange={(e)=>onValueChange(e)} name ="Mobile"></Input>
     </FormControl>
     <FormControl>
        <InputLabel>ElectricCharge</InputLabel>
        <Input onChange={(e)=>onValueChange(e)} name ="ElectricCharge"></Input>
     </FormControl>
     <FormControl>
        <InputLabel>TDS</InputLabel>
        <Input onChange={(e)=>onValueChange(e)} name ="TDS"></Input>
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
        <InputLabel>Amount</InputLabel>
        <Input disabled value={staff.Amount}></Input>
     </FormControl>
     <FormControl style={{width:'30%', margin:"auto"}}>
        <Button variant='contained' onClick={()=>{viewDetails()}}>Add Staff</Button>
     </FormControl>
    </Container>
    </div>
  );
};

export default DataEntry;
