const toBase64 = obj => {
    // converts the obj to a string
   const str = JSON.stringify (obj);
   // returns string converted to base64
   return Buffer.from(str).toString ('base64');
}

const replaceSpecialChars = b64string => {
    // create a regex to match any of the characters =,+ or / and replace them with their // substitutes
      return b64string.replace (/[=+/]/g, charToBeReplaced => {
        switch (charToBeReplaced) {
          case '=':
            return '';
          case '+':
            return '-';
          case '/':
            return '_';
        }
      });
    };

export {toBase64 , replaceSpecialChars }; 

