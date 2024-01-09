import axios from 'axios';

// const usersUrl = 'http://localhost:3003/users';
const usersUrl = 'http://localhost:8000';

export const RegisterUser = async (formData) => {
  try {
    const response = await axios.post(`${usersUrl}/register`, formData);
    return response;
  } catch (error) {
    console.error('Error fetching users Calling on Register API:', error);
    throw error; // Re-throw the error so it can be caught by the caller
  }
};
export const ChangeDA_Percent = async (formData) => {
  try {
    const response = await axios.post(`${usersUrl}/DA_PersentData`, formData);
    return response;
  } catch (error) {
    console.error('Error fetching users Calling on Register API:', error);
    throw error; // Re-throw the error so it can be caught by the caller
  }
};
export const SignInUser = async (user) => {
  try {
    const response = await axios.post(`${usersUrl}/signin`, user);
    return response;
  } catch (error) {
    console.error('Error fetching users Calling on SignIN API:', error);
    throw error; // Re-throw the error so it can be caught by the caller
  }
};

export const getUsers = async (month,year) => {
    try {
      const response = await axios.get(`${usersUrl}/all/admin/${year}/${month}`); return response;
    } catch (error) {
      console.error('Error fetching users Calling on getUsers API:', error);
      throw error; // Re-throw the error so it can be caught by the caller
    }
  };
  export const getDirectorSalary = async (month,year) => {
    try {
      const response = await axios.get(`${usersUrl}/DirectorSalary/admin/${year}/${month}`); return response;
    } catch (error) {
      console.error('Error fetching users Calling on DirectorSalary API:', error);
      throw error; // Re-throw the error so it can be caught by the caller
    }
  };

  export const getDirectorSalaryById = async (Id,month,year) => {
    try {
      const response = await axios.get(`${usersUrl}/DirectorSalarybyId/${Id}/${year}/${month}`); return response;
    } catch (error) {
      console.error('Error fetching users Calling on DirectorSalarybyId API:', error);
      throw error; // Re-throw the error so it can be caught by the caller
    }
  };
  export const getSalary = async (id,users) => {
    console.log(users);
    try {
      const response = await axios.post(`${usersUrl}/staffSalary/staffDash/${id}`,users); return response;
    } catch (error) {
      console.error('Error fetching users Calling on getSalary API:', error);
      throw error; // Re-throw the error so it can be caught by the caller
    }
  };
  export const SearchStaff = async (user) => {
    try {
      const response = await axios.get(`${usersUrl}/search`, {
        params: user,
      });
      return response;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error; // Re-throw the error so it can be caught by the caller
    }
  };
export const addUser = async (Id,year,user) => {
  try{
    return await axios.post(`${usersUrl}/data-entry/${Id}/${year}`, user);
  }
    catch(error){
      console.error("Error calling addUser api in api.js", error);
        throw error;
    }
}
export const addDirectorSalary = async (Id,user) => {
  try{
    return await axios.post(`${usersUrl}/addDirectorSalary/${Id}`, user);
  }
    catch(error){
      console.error("Error calling addUser api in api.js", error);
        throw error;
    }
}
export const deleteUser = async (named,id,month,year) => {
    return await axios.delete(`${usersUrl}/${named}/${id}/${month}/${year}`);
}
export const getUser = async (id, month,year) => {
    try {
        return await axios.get(`${usersUrl}/ViewData/${id}/${year}/${month}`);
    } catch (error) {
        console.error("Error calling getUser api in api.js", error);
        throw error; // Rethrow the error to handle it in the component
    }
}

export const EditUser = async (id,month,year, user) => {
    return await axios.put(`${usersUrl}/${id}/${year}/${month}`, user)
}

export const resetPassword = async (email) => {
  try{
  return await axios.put(`${usersUrl}/forgot-password`, email);
  }
  catch(error){
    console.log("Error on calling resetPassword",error);
  }
}
// export const getStudent =async(user)=>{
//     return await axios.post(`${usersUrl}/Student`,user)
// }

export const fetchData = async (wing, month,year) => {
  try {
      return await axios.get(`${usersUrl}/${wing}/${year}/${month}`);
  } catch (error) {
      console.error("Error calling getUser api in api.js", error);
      throw error; // Rethrow the error to handle it in the component
  }
}
export const getRegisterData = async (Id) => {
  try {
      return await axios.get(`${usersUrl}/getRegisterData/${Id}`);
  } catch (error) {
      console.error("Error calling getRegisterData api in api.js", error);
      throw error; // Rethrow the error to handle it in the component
  }
}
export const getDA_PercentData = async () => {
  try {
      return await axios.get(`${usersUrl}/getDA_PercentData`);
  } catch (error) {
      console.error("Error calling getDAPercentData api in api.js", error);
      throw error; // Rethrow the error to handle it in the component
  }
}
export const getStaffData = async (Id,Year) => {
  try {
      return await axios.get(`${usersUrl}/getStaffData/${Id}/${Year}`);
  } catch (error) {
      console.error("Error calling getRegisterData api in api.js", error);
      throw error; // Rethrow the error to handle it in the component
  }
}