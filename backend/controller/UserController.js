import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dbConnection from '../database/db.js';


export const getStaffData = async (req, res) => {
    try {
        
        const { Id ,Year} = req.params;
        // console.log(Id,Year);
        const connection = await dbConnection();
        const [rows, fields] = await connection.execute(`SELECT * FROM t${Year} WHERE Id=?`, [Id]);
        connection.release();
        // console.log(rows);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Data not found' });
        }

        return res.status(200).json(rows);
    } catch (error) {
        // console.log(error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};
export const RegisterUser = async (req, res) => {
    try {
      const user = req.body;
     console.log(user);
      // Hash the password
      const password = await bcrypt.hash(user.Password, 10);
  
      // Check for required fields
      if (!user.Id || !user.email || !password || !user.Role) {
          return res.status(400).json({ error: 'Invalid request parameters' });
      }
  
      const connection = await dbConnection();
      
      // Perform database operation: insert user data into registerData table
      const [result] = await connection.execute(
          'INSERT INTO RegisterData (Id, Name, Designation, Level, wing, email, Password, Role,Category) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?)',
          [user.Id, user.Name, user.Designation, user.Level, user.wing, user.email, password, user.Role,user.Category]
      );
  
      // Release the connection back to the pool
      connection.release();
  
      if (result.affectedRows === 1) {
          // User data successfully inserted
          return res.status(201).json({ message: 'User registered successfully' });
      } else {
          // No rows were affected, indicating the insertion failed
          return res.status(500).json({ message: 'Failed to add user' });
      }
    } catch (error) {
      console.error('Error registering user:', error);
      return res.status(500).json({ message: 'Mobile No. already Registered', error });
    }
  };

  export const ChangeDA_Percent = async (req, res) => {
    try {
      const user = req.body;
     
      const connection = await dbConnection();
      
      // Perform database operation: insert user data into registerData table
      const [result] = await connection.execute(
          'INSERT INTO DAPercentDetails(Year,Month,Wing,DA_IN_Percent) VALUES (?, ?, ?, ?)',
          [user.Year, user.Month, user.Wing, user.DA_IN_Percent]
      );
  
      // Release the connection back to the pool
      connection.release();
  
      if (result.affectedRows === 1) {
          // User data successfully inserted
          return res.status(201).json({ message: 'Change successfully' });
      } else {
          // No rows were affected, indicating the insertion failed
          return res.status(500).json({ message: 'Failed to Change' });
      }
    } catch (error) {
    //   console.error('Error registering user:', error);
      return res.status(500).json({ message: 'Server Error', error });
    }
  };
  

export const SignInUser = async (req, res) => {
    try {
        const connection = await dbConnection();
        const {Id,password} = req.body;
        // console.log(Id,password);
        const [results] = await connection.execute('SELECT * FROM RegisterData WHERE Id = ?',
            [Id]);

        if (results.length > 0) {
            // console.log(results);
            if (password&&results[0].Password) {
                const isPasswordMatch = await bcrypt.compare(password, results[0].Password);
                // throw error; 
                if (isPasswordMatch) {
                    // User found, generate a JWT token
                    const token = jwt.sign({ userId: results[0].Id }, 'your_secret_key', { expiresIn: '1h' });
                    // console.log(token);
                    const resulttoken={
                        result:results,
                        tokens:token
                    }
                    // Send the token in the response
                    // return res.status(200).json({ token });
                    // User found, send a success response
                    return res.status(200).json(resulttoken);
                } else {
                    // Passwords do not match, send a response indicating invalid credentials
                    return res.status(401).json({ message: 'Pasword not Match' });
                }
            } else {
                // Stored password is missing, send a response indicating invalid credentials
                return res.status(401).json({ message: 'Password is required' });
            }
        } else {
            // User not found, send a response indicating the user does not exist
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        // Handle errors, e.g., database connection error, etc.
        console.error('SignIn failed:', error);
        return res.status(500).json({ message: 'SignIn failed' });
    }
};
export const addDirectorSalary = async (req, res) => {
    const user = req.body;
    const { Id } = req.params;
    console.log(user);

    let connection; // Declare connection variable outside the try block

    try {
        connection = await dbConnection();

        // Modify the user object to replace undefined values with null and convert non-integer values to integers
        // const userValues = Object.values(user).map(value => {
        //     if (value === undefined) {
        //         return null;
        //     } else if (!isNaN(value) && !Array.isArray(value)) {
        //         return parseInt(value, 10);
        //     } else {
        //         return value;
        //     }
        // });
// we also use a object to store data 

        const userValue = {};
Object.keys(user).forEach(key => {
    const value = user[key];

    if (value === undefined) {
        userValue[key] = null;
    } else if (!isNaN(value) && !Array.isArray(value)) {
        userValue[key] = parseInt(value, 10);
    } else {
        userValue[key] = value;
    }
});

console.log(userValue);

    // //    console.log(userValues);
    //     console.log(userValue.ID,userValue.Year,userValue.Month,userValue.Name,userValue.Designation,userValue.PayScale,userValue.Level,userValue.PayMatrix,userValue.Special_Allowance,userValue.GPF,userValue.Group_Insurance,userValue.GPF_Total,userValue.GSLI,userValue.HouseRent,userValue.WaterCharge,userValue.Mobile,userValue.ElectricCharge,userValue.Vehicle,userValue.Income_Tax,userValue.Other_Charge,userValue.DA,userValue.GPF_Total,userValue.Total,userValue.Amount);

        // Insert data into the table
        const [result, fields] = await connection.execute(`
            INSERT INTO DirectorSalaryData (ID, Year, Month, Name, Designation, PayScale, Level, PayMatrix, Special_Allowance, GPF, Group_Insurance, GPF_Total, GSLI, HouseRent, WaterCharge, Mobile, ElectricCharge, Vehicle, Income_Tax, Other_Charge, DA, GrandTotal, Total, Amount) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [userValue.ID,userValue.Year,userValue.Month,userValue.Name,userValue.Designation,userValue.PayScale,userValue.Level,userValue.PayMatrix,userValue.Special_Allowance,userValue.GPF,userValue.Group_Insurance,userValue.GPF_Total,userValue.GSLI,userValue.HouseRent,userValue.WaterCharge,userValue.Mobile,userValue.ElectricCharge,userValue.Vehicle,userValue.Income_Tax,userValue.Other_Charge,userValue.DA,userValue.GPF_Total,userValue.Total,userValue.Amount]);

        // Check if the insertion was successful
        if (result.affectedRows === 1) {
            // User data successfully inserted
            return res.status(200).json({ message: 'User added successfully!' });
        } else {
            // No rows were affected, indicating the insertion failed
            return res.status(500).json({ error: 'Failed to add user.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        // Release the connection back to the pool
        if (connection) {
            connection.release();
        }
    }
};


export const addUser = async (req, res) => {
    const user = req.body;
        const { Id,year } = req.params;
        console.log(Id,year,user);
    try {
        const connection = await dbConnection();
        
        // Check if all required parameters are present in the request body
        const requiredParams = ['ID','wing', 'Name', 'Designation', 'PayScale', 'Level', 'PayMatrix', 'AdditionalIncrement', 'HRA', 'CCA', 'EPF', 'GSLI', 'HouseRent', 'WaterCharge', 'Mobile', 'ElectricCharge', 'TDS', 'DA', 'GrandTotal', 'Total', 'Amount'];

        
        // console.log("forLOop");
        for (const param of requiredParams) {
            if (user[param] === undefined) {
                // console.log(`Warning: ${param} is undefined in the user object.`);
                user[param] = null;
            }
        }
        // console.log({error: `${param} is required.`});
        // console.log("For End");
        // Perform database operation: insert user data
        
         const tableName = `T${year}`;
         const createTableQuery = `
         CREATE TABLE IF NOT EXISTS ${tableName} (
             ID BIGINT,
             wing VARCHAR(50),
             Year VARCHAR(255),
             Month VARCHAR(255),
             Name VARCHAR(255),
             Designation VARCHAR(255),
             PayScale VARCHAR(255),
             Level VARCHAR(255),
             PayMatrix INT,
             AdditionalIncrement INT,
             HRA INT,
             CCA INT,
             EPF INT,
             Regular INT,
             Recovery INT,
             Installments VARCHAR(25),
             GSLI INT,
             HouseRent INT,
             WaterCharge INT,
             Mobile INT,
             ElectricCharge INT,
             TDS INT,
             DA INT,
             GrandTotal INT,
             Total INT,
             Amount INT,
             PRIMARY KEY (ID, Year, Month)
         )
     `;
     

// Check if the table exists
const [tables] = await connection.execute(`SHOW TABLES LIKE '${tableName}'`);

// If the table doesn't exist, create it
if (tables.length === 0) {
    await connection.execute(createTableQuery);
} else {
    // Table already exists
    // console.log("Table already exists");
}


        // Insert data into the table
        const [result, fields] = await connection.execute(`
            INSERT INTO T${year} (ID,wing, Year, Month, Name, Designation, PayScale, Level, PayMatrix, AdditionalIncrement, HRA, CCA, EPF,Regular,Recovery,Installments, GSLI, HouseRent, WaterCharge, Mobile, ElectricCharge, TDS, DA, GrandTotal, Total, Amount) 
            VALUES (?,?, ?, ?,?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [Id,user.wing, user.Year, user.Month, user.Name, user.Designation, user.PayScale, user.Level, user.PayMatrix, user.AdditionalIncrement, user.HRA, user.CCA, user.EPF||null,user.Regular||null,user.Recovery||null,user.Installments||null, user.GSLI, user.HouseRent, user.WaterCharge, user.Mobile, user.ElectricCharge, user.TDS, user.DA, user.GrandTotal, user.Total, user.Amount]);

        // Check if the insertion was successful
        if (result.affectedRows === 1) {
            // User data successfully inserted
            return res.status(200).json({ message: 'User added successfully!' });
        } else {
            // No rows were affected, indicating the insertion failed
            return res.status(500).json({ error: 'Failed to add user.' });
        }

        // Release the connection back to the pool
        connection.release();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const getUsers = async (req, res) => {
  const {year}=req.params;
    const { id} = req.query; // Get filter parameters from query params
//  console.log(month,year,id)
    try {
        const filters = [];
        const values = [];

        if (id) {
            filters.push('ID = ?');
            values.push(id);
        }
       
        if (year) {
            filters.push('Year = ?');
            values.push(year);
        }

        let query = `SELECT * FROM T${year}`;
        
        const connection = await dbConnection(); // Establish database connection

        // Perform database operation: fetch users based on filters
        const [rows, fields] = await connection.execute(query, values);
        
        // console.log(rows);
        // Release the connection back to the pool
        connection.release();

        // Send the list of filtered users as a response
        return res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const {named,id,month,year} = req.params; // Get the user ID from request parameters
        const connection = await dbConnection();
        console.log(named,id,month,year);
        // Perform database operation: delete user by ID
        let result;
        if(named==='Director'){
        result = await connection.execute(`DELETE FROM DirectorSalaryData WHERE ID = ? AND Month=? AND Year=? `, [id,month,year]);
        }
        else{
            result = await connection.execute(`DELETE FROM T${year} WHERE id = ? AND month=? `, [id,month]);
        }
        
        // Release the connection back to the pool
        connection.release();
        //  console.log(result[0]);
        if (result[0].affectedRows > 0) {
            // User deleted successfully
            return res.status(200).json({ message: 'User deleted successfully' });
        } else {
            // User with given ID not found
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getUser = async (req, res) => {
    try {
        const { id, month ,year} = req.params;
       // Get the user ID from request parameters
        const connection = await dbConnection();
        console.log(id,month,year) 
        // Perform database operation: fetch users
        const [rows, fields] = await connection.execute(`SELECT * FROM T${year} WHERE id=? AND month=?`, [id, month]);
        console.log(fields);
        // Release the connection back to the pool
        connection.release();
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Data not found' });
        }

        // Send the list of users as a response
        return res.status(200).json(rows);
    } catch (error) {
        // console.error(error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};
export const getDirectorSalary = async (req, res) => {
    try {
        const { month ,year} = req.params;
        // console.log(id,month,year) // Get the user ID from request parameters
        const connection = await dbConnection();
        // Perform database operation: fetch users
        const [rows, fields] = await connection.execute(`SELECT * FROM DirectorSalaryData WHERE Year=?`, [year]);
        // Release the connection back to the pool
        connection.release();
        // console.log(rows);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Data not found' });
        }

        // Send the list of users as a response
        return res.status(200).json(rows);
    } catch (error) {
        // console.error(error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};

export const getDirectorSalarybyId = async (req, res) => {
    try {
        const { month ,year,id} = req.params;
        console.log(id,month,year) // Get the user ID from request parameters
        const connection = await dbConnection();
        // Perform database operation: fetch users
        const [rows, fields] = await connection.execute(`SELECT * FROM DirectorSalaryData WHERE ID=? AND Year=? AND Month=?`, [id,year, month]);
        // Release the connection back to the pool
        connection.release();
        console.log(rows);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Data not found' });
        }

        // Send the list of users as a response
        return res.status(200).json(rows);
    } catch (error) {
        // console.error(error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};
export const getDA_PercentData = async (req, res) => {
    try {
        
        const connection = await dbConnection();
        // Perform database operation: fetch users
        const [rows, fields] = await connection.execute(`SELECT * FROM DAPercentDetails`);
        // Release the connection back to the pool
        connection.release();
        // console.log(rows);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Data not found' });
        }

        // Send the list of users as a response
        return res.status(200).json(rows);
    } catch (error) {
        // console.error(error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};
export const editUser = async (req, res) => {
    try {
        const { id, month ,year} = req.params; // Get the user ID and month from request parameters
        const updatedUserData = req.body; // Get updated user data from request body

        const connection = await dbConnection();
        // console.log(id,month,year,updatedUserData.Designation)
        // Perform database operation: update user data by ID and month
        let result;
       if(updatedUserData.Designation==='Director'){
        // console.log("Director")
        result = await connection.execute(`
            UPDATE DirectorSalaryData 
            SET 
                Name = ?, 
                Designation = ?, 
                PayScale = ?, 
                Level = ?, 
                PayMatrix = ?, 
                Special_Allowance = ?, 
                GPF = ?, 
                Group_Insurance = ?,
                GPF_Total=?,
                GSLI = ?, 
                HouseRent = ?, 
                WaterCharge = ?, 
                Mobile = ?, 
                Vehicle=?,
                Income_Tax= ?,
                Other_Charge=?,
                DA = ?, 
                GrandTotal = ?, 
                Total = ?, 
                Amount = ?
            WHERE ID = ? AND Month = ? AND Year=?`,
            [
                updatedUserData.Name,
                updatedUserData.Designation,
                updatedUserData.PayScale,
                updatedUserData.Level,
                updatedUserData.PayMatrix,
                updatedUserData.Special_Allowance,
                updatedUserData.GPF,
                updatedUserData.Group_Insurance,
                updatedUserData.GPF_Total,
                updatedUserData.GSLI,
                updatedUserData.HouseRent,
                updatedUserData.WaterCharge,
                updatedUserData.Mobile,
                updatedUserData.Vehicle,
                updatedUserData.Income_Tax,
                updatedUserData.Other_Charge,
                updatedUserData.DA,
                updatedUserData.GrandTotal,
                updatedUserData.Total,
                updatedUserData.Amount,
                id,
                month,
                year
            ]
        );

       }
       else{
            result = await connection.execute(`
            UPDATE T${year} 
            SET 
                Name = ?, 
                Designation = ?, 
                PayScale = ?, 
                Level = ?, 
                PayMatrix = ?, 
                AdditionalIncrement = ?, 
                HRA = ?, 
                CCA = ?, 
                EPF = ?, 
                Regular=?,
                Recovery=?,
                Installments=?,
                GSLI = ?, 
                HouseRent = ?, 
                WaterCharge = ?, 
                Mobile = ?, 
                TDS = ?, 
                DA = ?, 
                GrandTotal = ?, 
                Total = ?, 
                Amount = ?
            WHERE id = ? AND month = ?`,
            [
                updatedUserData.Name,
                updatedUserData.Designation,
                updatedUserData.PayScale,
                updatedUserData.Level,
                updatedUserData.PayMatrix,
                updatedUserData.AdditionalIncrement,
                updatedUserData.HRA,
                updatedUserData.CCA,
                updatedUserData.EPF||null,
                updatedUserData.Regular||null,
                updatedUserData.Recovery||null,
                updatedUserData.Installments||null,
                updatedUserData.GSLI,
                updatedUserData.HouseRent,
                updatedUserData.WaterCharge,
                updatedUserData.Mobile,
                updatedUserData.TDS,
                updatedUserData.DA,
                updatedUserData.GrandTotal,
                updatedUserData.Total,
                updatedUserData.Amount,
                id,
                month
            ]
        );

       }
       
        // Release the connection back to the pool
        connection.release();
    //    console.log(result[0].affectedRows);
        if (result[0].affectedRows > 0) {
            // User data updated successfully
            return res.status(200).json({ message: 'User data updated successfully' });
        } else {
            // User with given ID and month not found
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        // console.error(error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};
export const SearchStaff = async (req, res) => {
    try {
        const { id, month, year } = req.query; // Get filter parameters from query params

        // console.log('user Params:', req.query); // Log filter parameters for debugging

        const user = [];
        const values = [];

        if (id) {
            user.push('ID = ?');
            values.push(id);
        }
        if (month) {
            user.push('Month = ?');
            values.push(month);
        }
        if (year) {
            user.push('Year = ?');
            values.push(year);
        }
        let query = `SELECT * FROM T${year}`;
        if (user.length > 0) {
            query += ' WHERE ' + user.join(' AND ');
        }

        // console.log('Generated Query:', query, values); // Log the generated query for debugging

        const connection = await dbConnection();

        // Perform database operation: fetch users based on filters
        const [rows, fields] = await connection.execute(query, values);

        // Release the connection back to the pool
        connection.release();

        // Send the list of filtered users as a response
        return res.status(200).json(rows);
    } catch (error) {
        // console.error(error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};
export const getSalary = async (req, res) => {
    // console.log(req.body);
    try {
         const year=req.body.year;
        const {id}=req.params;
        const connection = await dbConnection();
        // Perform database operation: fetch users
        const [rows, fields] = await connection.execute(`SELECT * FROM T${year} WHERE id=?`,[id]);
        // Release the connection back to the pool
        connection.release();

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Data not found' });
        }

        // Send the list of users as a response
        return res.status(200).json(rows);
    } catch (error) {
        // console.error(error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};

export const getRegisterData = async (req, res) => {
    try {
        // console.log(req.params);
        const { Id } = req.params;
        // console.log(Id);
        const connection = await dbConnection();
        const [rows, fields] = await connection.execute(`SELECT * FROM RegisterData WHERE Id=?`, [Id]);
        connection.release();

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Data not found' });
        }

        return res.status(200).json(rows);
    } catch (error) {
        // console.log(error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};

