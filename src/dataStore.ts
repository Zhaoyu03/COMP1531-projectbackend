import fs from 'fs';

// Use get() to access the data
const getData = () => {
  const data = JSON.parse(fs.readFileSync('src/savedData.json', 'utf8'));
  return data;
};

// Use set(newData) to pass in the entire data object, with modifications made
const setData = (newData: any): any => {
  // data = newData;
  fs.writeFileSync('src/savedData.json', JSON.stringify(newData, null, 4));
};

export { getData, setData };
