import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, FormControl, FormGroup, Input, InputLabel, Typography} from '@mui/material';
import styled from '@emotion/styled';
import { EditUser,getUser ,getDA_PercentData,getDirectorSalaryById} from '../service/api.js';
// import axios from 'axios';
import { useParams } from 'react-router-dom';


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

const EditStaff = () => {
   const {id, year, month ,name} = useParams();
   let named=name;
   let navigate = useNavigate();
   const[directorData,setDirectorData]=useState({});
  const [staff, setStaff] = useState({
   //  ID: '',
   //  Name: '',
   //  Designation: '',
   //  PayScale:'',
   //  Level: '',
   //  PayMatrix:'',
   //  AdditionalIncrement:'',
   //  HRA:'',
   //  CCA: '',
   //  EPF: '',
   //  Regular:'',
   //  Recovery:'',
   //  Installments:'',
   //  GSLI:'',
   //  HouseRent:'',
   //  WaterCharge:'',
   //  Mobile:'',
   //  ElectricCharge:'',
   //  TDS: '',
   //  DA: '',
   //  GrandTotal: '',
   //  Total: '',
   //  Amount: ''
  });

  
  useEffect(() => {
    const loadUserDetails = async () => {
      
      try {
        if(named==='Director'){
         console.log("Director")
         const response=await getDirectorSalaryById(id,month,year)
          if (response && response.data) {
           setDirectorData(response.data[0])
           console.log(response.data)
          } else {
            console.error("Invalid API response:", response);
            // Handle or display an error message to the user
          }
         }else{
          // console.log(name);
          const response = await getUser(id, month,year);
          if (response && response.data) {
            setStaff(response.data[0]);
            console.log(response.data);
          } else {
            console.error("Invalid API response:", response);
            // Handle or display an error message to the user
          }
           
         }
       
      } catch (error) {
        console.error("Error loading user details:", error);
        // Handle or display an error message to the user
      }
    };
 
    loadUserDetails();
  }, [id, month,year]); // Include id and month as dependencies
   
//   const [errors, setErrors] = useState({});
const [DA_Per, setDA_Per] = useState(0); // Use state to hold the DA_Per value
useEffect(() => {
  const getDA_Percent = async () => {
    try {
      const res = await getDA_PercentData();
      // console.log(res.data[res.data.length - 1].DA_IN_Percent);
      setDA_Per(res.data[res.data.length - 1].DA_IN_Percent);
    } catch (error) {
      console.error('Error getting data for staff:', error);
    }
  };

  getDA_Percent();
}, []);



const onValueChange = (e) => {
  const { name, value } = e.target;
//   const numericValue = !isNaN(parseFloat(value)) ? parseFloat(value) : value;
if(named==='Director'){
   setDirectorData((prevData) => {
      const updatedData = {
          ...prevData,
          [name]: value,
      };

      if (!isNaN(parseFloat(updatedData.PayMatrix))) {
          updatedData.DA = Math.round(updatedData.PayMatrix * (DA_Per* 0.01));
      }
      
      updatedData.GrandTotal =
          Math.round(
              parseFloat(updatedData.PayMatrix) +
              parseFloat(updatedData.DA) +
              parseFloat(updatedData.Special_Allowance)
          );

          const GPF=parseFloat(updatedData.GPF)||0;
          const Group_Insurance=parseFloat(updatedData.Group_Insurance)||0;
          const GSLI= parseFloat(updatedData.GSLI) ||0;
          const HouseRent= parseFloat(updatedData.HouseRent)||0 ;
           const WaterCharge=parseFloat(updatedData.WaterCharge)||0 ;
           const Mobile=parseFloat(updatedData.Mobile)||0 ;
           const Vehicle=parseFloat(updatedData.Vehicle)||0 ;
           const Income_Tax=parseFloat(updatedData.Income_Tax)||0 ;
           const Other_charge=parseFloat(updatedData.Other_Charge)||0

      updatedData.Total =
          Math.round(
             GPF+Group_Insurance+GSLI+HouseRent+WaterCharge+Mobile+Vehicle+Income_Tax+Other_charge
          );
       updatedData.GPF_Total=Math.round(
          GPF+Group_Insurance
       )
      updatedData.Amount = updatedData.GrandTotal - updatedData.Total;

      return updatedData;
  });
}
else{
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
  
          // Add additional handling for fields that may be undefined or empty
      const Regular = parseFloat(updatedStaff.Regular) || 0;
      const Recovery = parseFloat(updatedStaff.Recovery) || 0;
      const EPF = parseFloat(updatedStaff.EPF) || 0;
      const GSLI = parseFloat(updatedStaff.GSLI) || 0;
      const HouseRent = parseFloat(updatedStaff.HouseRent) || 0;
      const WaterCharge = parseFloat(updatedStaff.WaterCharge) || 0;
      const Mobile = parseFloat(updatedStaff.Mobile) || 0;
      const Other_Charge = parseFloat(updatedStaff.Other_Charge) || 0;
      const TDS = parseFloat(updatedStaff.TDS) || 0;
      updatedStaff.Total = Math.round(
        Regular + Recovery + EPF + GSLI + HouseRent + WaterCharge + Mobile + Other_Charge + TDS
      );
  
      updatedStaff.Amount = updatedStaff.GrandTotal - updatedStaff.Total;
  
      return updatedStaff;
  });
}
  
};

//  console.log(staff);
const viewDetails = async () => {
   // Validate required fields before submitting
  if (named==='Director'?!directorData.ID:!staff.ID) {
   alert('ID is required.');
   // If ID is not provided, show an error message or handle it as needed
   console.error('ID is required.');
   return;
 }
// Check if all other required fields are filled
const requiredFields = ['ID', 
'Name' ,
'Designation',
'PayScale' ,
'Level'   ,
'GrandTotal', 
'Total' ,
'Amount' ];
const missingFields = requiredFields.filter(field => named==='Director'?!directorData[field]:!staff[field]);

if (missingFields.length > 0) {
  // If any required field is missing, show an error message or handle it as needed
  console.error(`Fields ${missingFields.join(', ')} are required.`);
  alert(`Fields ${missingFields.join(', ')} are required.`);
  return;
}

   // If all required fields are provided, proceed to call the API
 try {
   if(named==='Director'){
      await EditUser(id,month,year,directorData);
      // console.log('Staff added successfully:',{named, year,month,data: directorData});
      alert("Data Edit successfully");
      navigate(`/DirectorDataTable/${year}/${month}`);
   }
    else{
      await EditUser(id,month,year,staff);
      // console.log('Staff added successfully:',{named, year,month,data: staff});
      alert("Data Edit successfully");
      navigate(`/all/admin/${year}/${month}`);
   }  
      
 } catch (error) {
   console.error('Error editing staff:', error);
   alert("Fill all Fields :- Refresh the Page and edit again ");
 }
};
  return (
    <div>
      <h2>Edit Entry for {month}, {year}</h2>
      <Container>
        <Typography variant='h4' margin={'10px'}>Edit Staff Data</Typography>
         <Typography variant='h6'>{named==='Director'?'Director Details':'Staff Details'}</Typography>
     <Employee >
      <FormControl ><InputLabel>Mobile No.</InputLabel>
        <Input onChange={(e)=>onValueChange(e)} name="ID" value={named==='Director'?directorData.ID:staff.ID}></Input>
        {/* <Typography variant="caption" color="error">
          {errors.ID}
        </Typography> */}
        </FormControl>
        {/* <FormControl><InputLabel>Month</InputLabel>
        <Input onChange={(e)=>onValueChange(e)} name="Month"></Input>
        </FormControl> */}
        <FormControl><InputLabel>Name</InputLabel>
        <Input onChange={(e)=>onValueChange(e)} value={named==='Director'?directorData.Name:staff.Name} name="Name"></Input>
        </FormControl>
        <FormControl><InputLabel>Designation</InputLabel>
        <Input onChange={(e)=>onValueChange(e)} value={named==='Director'?directorData.Designation:staff.Designation} name="Designation"></Input>
        </FormControl>
            <FormControl><InputLabel>PayScale(in words)</InputLabel>
            <Input
    type='text'
    onChange={(e) => {
      const { name, value } = e.target;
      const formattedValue = value.replace(/(\d{5})(\d{5})/, '$1-$2');
      onValueChange({ target: { name, value: formattedValue } });
    }}
    name="PayScale"
    value={named==='Director'?directorData.PayScale:staff.PayScale}
  />
        </FormControl>
        <FormControl><InputLabel>Level</InputLabel>
        <Input onChange={(e)=>onValueChange(e)} value={named==='Director'?directorData.Level:staff.Level} name="Level"></Input>
        </FormControl>
     </Employee>
      <Typography variant='h6'>EMOLUMENT</Typography>
     <Employee>
     <FormControl>
        <InputLabel>PayMatrix</InputLabel>
        <Input   onChange={(e)=>onValueChange(e)}  value={named==='Director'?directorData.PayMatrix:staff.PayMatrix} name="PayMatrix" ></Input>
     </FormControl>
     <FormControl>
        <InputLabel>DA</InputLabel>
        <Input   disabled value={named==='Director'?directorData.DA:staff.DA}></Input>
     </FormControl>
     {name==="Director" ? <FormControl>
        <InputLabel>Special Allowance</InputLabel>
        <Input onChange={(e)=>onValueChange(e)} name ="Special_Allowance" value={directorData.Special_Allowance}></Input>
     </FormControl> :<>
     <FormControl>  
      <InputLabel>AdditionalIncrement</InputLabel>
      <Input onChange={(e)=>onValueChange(e)} value={staff.AdditionalIncrement} name ="AdditionalIncrement"></Input>
   </FormControl>
   <FormControl>
      <InputLabel>HRA</InputLabel>
      <Input  onChange={(e)=>onValueChange(e)}value={staff.HRA} name ="HRA" ></Input>
   </FormControl>
   <FormControl>
      <InputLabel>CCA</InputLabel>
      <Input  onChange={(e)=>onValueChange(e)} value={staff.CCA} name ="CCA"></Input>
   </FormControl></>}
     
     <FormControl>
        <InputLabel>GrandTotal</InputLabel>
        <Input  disabled value={named==='Director'?directorData.GrandTotal:staff.GrandTotal}></Input>
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
        
    ) : name==='Director'? <Employee> 
    <FormControl>
    <InputLabel>GPF</InputLabel>
    <Input onChange={(e)=>onValueChange(e)}value={directorData.GPF} name ="GPF"></Input>
     </FormControl>
     <FormControl>
    <InputLabel>Group Insurance</InputLabel>
    <Input onChange={(e)=>onValueChange(e)}value={directorData.Group_Insurance} name ="Group_Insurance"></Input>
     </FormControl>
     <FormControl>
    <InputLabel>GPF Total</InputLabel>
    <Input onChange={(e)=>onValueChange(e)}value={(parseFloat(directorData.GPF)||0)+(parseFloat(staff.Group_Insurance)||0)} name ="GPF_Total"></Input>
     </FormControl>
     <FormControl>
        <InputLabel>Vehicle</InputLabel>
        <Input onChange={(e)=>onValueChange(e)} name ="Vehicle" value={directorData.Vehicle}></Input>
     </FormControl><FormControl>
        <InputLabel>Income Tax</InputLabel>
        <Input onChange={(e)=>onValueChange(e)} name ="Income_Tax" value={directorData.Income_Tax}></Input>
     </FormControl>
     </Employee> :(<><FormControl>
    <InputLabel>EPF</InputLabel>
    <Input onChange={(e)=>onValueChange(e)}value={staff.EPF} name ="EPF"></Input>
     </FormControl>
     <FormControl>
     <InputLabel>TDS</InputLabel>
     <Input onChange={(e)=>onValueChange(e)} value={staff.TDS} name ="TDS"></Input>
  </FormControl></>)}
     </FormControl>
     <FormControl>
        <InputLabel>GSLI</InputLabel>
        <Input onChange={(e)=>onValueChange(e)} value={named==='Director'?directorData.GSLI:staff.GSLI} name ="GSLI"></Input>
     </FormControl>
     <FormControl>
        <InputLabel>HouseRent</InputLabel>
        <Input onChange={(e)=>onValueChange(e)} value={named==='Director'?directorData.HouseRent:staff.HouseRent} name ="HouseRent"></Input>
     </FormControl>
     <FormControl>
        <InputLabel>WaterCharge</InputLabel>
        <Input onChange={(e)=>onValueChange(e)} value={named==='Director'?directorData.WaterCharge:staff.WaterCharge} name ="WaterCharge"></Input>
     </FormControl>
     <FormControl>
        <InputLabel>Mobile</InputLabel>
        <Input onChange={(e)=>onValueChange(e)}value={named==='Director'?directorData.Mobile:staff.Mobile}  name ="Mobile"></Input>
     </FormControl>
     <FormControl>
        <InputLabel>ElectricCharge</InputLabel>
        <Input onChange={(e)=>onValueChange(e)} value={named==='Director'?directorData.ElectricCharge:staff.ElectricCharge} name ="ElectricCharge"></Input>
     </FormControl>
     <FormControl>
        <InputLabel>Other Charge</InputLabel>
        <Input onChange={(e)=>onValueChange(e)} name ="Other_Charge" value={named==='Director'?directorData.Other_Charge:staff.Other_Charge}></Input>
     </FormControl>
     <FormControl>
        <InputLabel>Total</InputLabel>
        <Input disabled value={named==='Director'?directorData.Total:staff.Total}></Input>
     </FormControl>
     </Employee>
     <FormControl style={{width:'30%', margin:"10px auto"}}>
        <InputLabel>Amount</InputLabel>
        <Input disabled value={named==='Director'?directorData.Amount:staff.Amount}></Input>
     </FormControl>
     <FormControl style={{width:'30%', margin:"auto"}}>
        <Button variant='contained' onClick={()=>{viewDetails()}}>Edit staff Data</Button>
     </FormControl>
    </Container>
    </div>
  );
};

export default EditStaff;
