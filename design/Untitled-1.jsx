

function useState (initailValue) {
  const [ setValue, getValue ] = createSetValue(initailValue);


  return [ getValue(), setValue ];
}


function createSetValue (initailValue) {
  let value = initailValue;

  return [
    function setValue (nextValue) {
      value = nextValue;
    },
    function getValue () {
      return value;
    },
  ];
}


function Com1 () {
  const [ count, countSet ] = useState();
}
