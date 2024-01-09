
import {Box, FormGroup,FormControl,Input ,styled,Button } from '@mui/material';
import React ,{ useState } from "react";
import { ChangeDA_Percent } from '../service/api';

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


const DA_PersentData = () => {
    const [formData, setFormData] = useState({
        Year:'',
        Month:'',
        Wing:'',
        DA_IN_Percent:''
      });

      const onValueChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      };

      const handleChange=async(e)=>{
          console.log(formData);
          try {
            await ChangeDA_Percent(formData);
          } catch (error) {
            alert("Server Error")
          }
      }
  return (
    <Container>
       <FormGroup >
        <Fields><label>
          Year :
          <Input type="text" value={formData.Year} name="Year" onChange={(e) => onValueChange(e)} required />
        </label></Fields>
        <Fields><label>
          Month:
          <select value={formData.Month} name="Month" onChange={(e) => onValueChange(e)} required>
             <option value="Select">Select</option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
              {/* Add more options as needed */}
            </select>
        </label></Fields>
        <Fields><label>
            Wing:
            <select value={formData.Wing} name="Wing" onChange={(e) => onValueChange(e)} required>
             <option value="Select">Select</option>
              <option value="Degree">Degree</option>
              <option value="Diploma">Diploma</option>
              {/* Add more options as needed */}
            </select>
          </label></Fields>
          <Fields><label>
          DA_IN_Percent:
          <Input type="text" value={formData.DA_IN_Percent} name="DA_IN_Percent" onChange={(e) => onValueChange(e)} required />
        </label></Fields>
        <Button onClick={(e)=>handleChange(e)}>Change</Button>
          </FormGroup>
    </Container>
  )
}

export default DA_PersentData
