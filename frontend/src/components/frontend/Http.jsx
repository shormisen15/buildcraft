export const apiurl = "https://buildcraft-vna1.onrender.com/api/";
export const fileurl = "https://buildcraft-vna1.onrender.com/";
export const token = () => {
  const userInfo = localStorage.getItem("userInfo");
  const data = JSON.parse(userInfo);
  return data.token;
};
