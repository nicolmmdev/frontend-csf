export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{5,}$/;

 export    const removeSpaces = (value: string, lower = false) =>
    lower
      ? value.replace(/\s/g, "").toLowerCase()
      : value.replace(/\s/g, "");