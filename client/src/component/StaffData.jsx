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
import { getStaffData, deleteUser } from '../service/api';
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

const ActionButtons = styled(Box)`
  @media print {
    display: none;
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

function AllUser() {
  const [isPrinting, setIsPrinting] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { Id,Year,month } = useParams();

  useEffect(() => {
    getAllUsers();
  }, [Id, Year]);

  const getAllUsers = async () => {
    try {
        console.log(Id , Year)
      let res = await getStaffData(Id, Year);
      console.log('Fetched users:', res.data);
      setUsers(res.data);
    //   console.log(res);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  
  const deleteUserDetails = async (Id, month, Year) => {
    await deleteUser(Id, month, Year);
    getAllUsers();
  };

  const filteredUsers = users.filter(
    (user) =>
      user.ID.toString().includes(searchTerm) ||
      user.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.wing.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log(filteredUsers[0])
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
//   useEffect(() => {
//     getAllUsers();
//     // console.log(users)
//   }, [Id, Year]);
  return (
    <>
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
            getAllUsers();
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
      <Box style={{marginTop:"50px"}} ref={TableRef}> <h2 style={{marginLeft:"20%"}}>
        Dr. Ambedkar Institute Of Technology for Handicapped Kanpur
        <br></br>
        {
          (filteredUsers.length)?`Pay Bill of ${filteredUsers[0].wing} of month ${filteredUsers[0].Month}`:`Pay Bill of both Wings`
        }
        {/* Pay Bill of {filteredUsers[0].wing} of month {filteredUsers[0].Month} */}
      </h2>
      {filteredUsers && filteredUsers.length > 0 ? (
        <StyledTable>
          <TableHead>
            <THead>
              <TableCell>Mobile No.</TableCell>
              <TableCell>Wing</TableCell>
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
          <TableBody>
            {filteredUsers.map((user) => (
              <TBody key={user.ID}>
                <TableCell>{user.ID}</TableCell>
                <TableCell>{user.wing}</TableCell>
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
                    to={`/ViewData/${user.ID}/${Year}/${user.Month}`}
                  >
                    View
                  </Button>
                  <Button
                    variant="contained"
                    style={{ margin: 10 }}
                    component={Link}
                    to={`/edit/${user.ID}/${Year}/${user.Month}`}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() =>
                      deleteUserDetails(user.ID, user.Month, Year)
                    }
                  >
                    Delete
                  </Button>
                  </ActionButtons>
                </TableCell>
              </TBody>
            ))}
          </TableBody>
        </StyledTable>
      ) : (
        <div>No Data found.</div>
      )}
      <h2 style={{marginLeft:"20%"}}>
        Signature
      </h2>
      </Box>
    </>
  );
}

export default AllUser;
