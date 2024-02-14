
const parse = (input: any) => {
    
    const method = input[0];
    const params = input;
    params.splice(0,1);
  return {
    beforeHandle: (d: any) => method(d,params)
  };
};

export default parse;
