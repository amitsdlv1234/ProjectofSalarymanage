import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  FormControl,
  FormGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  styled,
  Box
} from '@mui/material';
import { deleteUser ,getDirectorSalary} from '../service/api';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

const StyledTable = styled(Table)`
  width: 95%;
  margin:auto;
`;

const THead = styled(TableRow)`
  background: black;
  width: 98vw;
  z-index: 998;
  & > th {
    color: #ffff;
    font-size: 20px;
  }
`;

const TBody = styled(TableRow)`
  margin-top: 100px;
  & > td {
    font-size: 20px;
  }
`;

const Filterbox = styled(FormGroup)`
  display: flex;
  flex-direction: row;
  border: 1px solid black;
  background: rgb(167 77 77);
  margin: 0px 2px;
  padding: 5px;
  position: fixed;
  top: 0;
  width: 99%;
  z-index: 999;
  & > div {
    width: 200px;
    height: 30px;
    margin: auto;
  }
  & > div input {
    width: 200px;
    height: 30px;
  }
`;

const ActionButtons = styled(Box)`
  @media print {
    display: none;
  }
`;
function AllUser() {
  const [isPrinting, setIsPrinting] = useState(false);

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { year, month } = useParams();
  console.log(year)
  useEffect(() => {
    getDirectorData();
  }, [month, year]);
  const getDirectorData = async () => {
    try {
      // console.log("AMIT")
      let res=await getDirectorSalary(month,year)

      // console.log('Fetched users:', res.data);
      setUsers(res.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  
  const deleteUserDetails = async (named,id, month, year) => {
    console.log(named,id, month, year);
    await deleteUser(named,id, month, year);
    getDirectorData();
  };

  const filteredUsers = users.filter(
    (user) =>
      user.ID.toString().includes(searchTerm) ||
      user.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Month.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // console.log(filteredUsers[0])
  const TableRef = React.createRef();
  const handlePrint = useReactToPrint({
    content: () => TableRef.current,
    onBeforeGetContent: () => {
      setIsPrinting(true);
    },
    onAfterPrint: () => {
      setIsPrinting(false);
    },
  });
  
  // Calculate sum for each field in teaching staff
  const DirectorSalarySum = {
    PayMatrix: filteredUsers.reduce((sum, user) => sum + user.PayMatrix, 0),
    GrandTotal: filteredUsers.reduce((sum, user) => sum + user.GrandTotal, 0),
    Total: filteredUsers.reduce((sum, user) => sum + user.Total, 0),
    Amount: filteredUsers.reduce((sum, user) => sum + user.Amount, 0),
  };

  function convertToWords(amount) {
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
    function convertLessThanOneThousand(number) {
      let words = '';
      if (number >= 100) {
        words += units[Math.floor(number / 100)] + ' Hundred ';
        number %= 100;
      }
      if (number >= 11 && number <= 19) {
        words += teens[number - 11] + ' ';
      } else if (number >= 10) {
        words += tens[Math.floor(number / 10)] + ' ';
        number %= 10;
      }
      if (number > 0) {
        words += units[number] + ' ';
      }
      return words;
    }
  
    if (amount === 0) {
      return 'Zero';
    }
  
    let words = '';
    if (amount >= 100000) {
      words += convertLessThanOneThousand(Math.floor(amount / 100000)) + 'Lakh ';
      amount %= 100000;
    }
    if (amount >= 1000) {
      words += convertLessThanOneThousand(Math.floor(amount / 1000)) + 'Thousand ';
      amount %= 1000;
    }
    if (amount > 0) {
      words += convertLessThanOneThousand(amount);
    }
  
    return words.trim();
  }
  console.log(users)
  
    return (
        <>
          {/* Filter box for searching and buttons */}
          <Filterbox>
            <FormControl>
              <input
                type="text"
                name="search"
                placeholder="Search by ID, Name, or Designation"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </FormControl>
            <Button
              variant="contained"
              style={{ marginRight: '50px' }}
              onClick={() => {
                setSearchTerm('');
                getDirectorData();
              }}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              style={{ marginLeft: '10px' }}
              onClick={handlePrint}
            >
              Print
            </Button>
          </Filterbox>
    
          {/* Table header and content */}
          <Box style={{ marginTop: "50px" }} ref={TableRef}>
            <h2 style={{ marginLeft: "20%" }}>
              Dr. Ambedkar Institute Of Technology for Handicapped Kanpur
              <br></br>
              {
                (filteredUsers.length) ? `Pay Bill of ${filteredUsers[0].wing} of month ${filteredUsers[0].Month}` : `Pay Bill of both Wings`
              }
            </h2>
    
            {/* Table header */}
            {filteredUsers && filteredUsers.length > 0 ? (
              <StyledTable>
                <TableHead>
                  <THead>
                    <TableCell>Mobile No.</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Designation</TableCell>
                    <TableCell>Year</TableCell>
                    <TableCell>Month</TableCell>
                    <TableCell>Pay Matrix</TableCell>
                    <TableCell>Grand Total</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Amount</TableCell>
                  </THead>
                </TableHead>
    
                {/* Table body */}
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TBody key={user.ID}>
                    <TableCell>{user.ID}</TableCell>
                    <TableCell>{user.Name}</TableCell>
                    <TableCell>{user.Designation}</TableCell>
                    <TableCell>{user.Year}</TableCell>
                    <TableCell>{user.Month}</TableCell>
                    <TableCell>{user.PayMatrix}</TableCell>
                    <TableCell>{user.GrandTotal}</TableCell>
                    <TableCell>{user.Total}</TableCell>
                    <TableCell>{user.Amount}</TableCell>
                    <TableCell>
                    <ActionButtons>
                      <Button
                        variant="contained"
                        style={{ marginRight: 10 }}
                        component={Link}
                        to={`/ViewData/${user.Designation}/${user.ID}/${user.Year}/${user.Month}`}
                      >
                        View
                      </Button>
                      <Button
                        variant="contained"
                        style={{ margin: 10 }}
                        component={Link}
                        to={`/edit/${user.Designation}/${user.ID}/${user.Year}/${user.Month}`}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() =>
                          deleteUserDetails(user.Designation,user.ID,user.Month, user.Year)
                        }
                      >
                        Delete
                      </Button>
                      </ActionButtons>
                    </TableCell>
                  </TBody>
                  ))}
    
                  {/* Extra row for sum in Teaching Staff section */}
                  <TBody>
                    <TableCell colSpan={5}><strong>Total</strong></TableCell>
                    <TableCell>{DirectorSalarySum.PayMatrix}</TableCell>
                    <TableCell>{DirectorSalarySum.GrandTotal}</TableCell>
                    <TableCell>{DirectorSalarySum.Total}</TableCell>
                    <TableCell>{DirectorSalarySum.Amount}</TableCell>
                    <TableCell></TableCell>
                  </TBody>
                </TableBody>
              </StyledTable>
            ) : (
              <div>No users found.</div>
            )}
    
            <h3 style={{ marginLeft: "20%" }}>Passed for Rs. {DirectorSalarySum.Amount}/- ( Rupees {convertToWords(DirectorSalarySum.Amount)} only)</h3>
            <h2 style={{ marginLeft: "50%" }}>
              Director
            </h2>
            <Box />
          </Box>
        </>
      );
    }
export default AllUser;
