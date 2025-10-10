// const authHeader = () => {
//   const user = JSON.parse(localStorage.getItem('user'));

//   if (user && user?.payload?.tokens?.accessToken) {
//     return {
//       headers: {
//         Authorization: `Bearer ${user.payload.tokens.accessToken}`,
//       },
//     };
//   } else {
//     return {};
//   }
// };

// export default authHeader;