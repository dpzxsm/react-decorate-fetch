import React, { useCallback, useState } from 'react';
import { applyMiddleware, initConfig } from 'react-decorate-fetch';
import HookDemo from "./HookDemo";
import HocDemo from "./HocDemo";
// import { connect} from 'react-refetch'

// similar to react-refetch's connect.defaults
initConfig({
  fetchOptions: {
    host: 'http://' + process.env.HOST, // host
    globalParams: { version: '1.0.0' }, //globalParams,
    headers: {}, //override default headers
  },
  transformPostParams: (params, options) => {
    let formData = new FormData();
    Object.keys(params).forEach(key => {
      formData.append(key, params[key]);
    });
    return formData
  }
});

// hook fetch result
applyMiddleware({
  before: (context, next) => {
    // console.log('suming-log', context[0]);  //options
    next();
  },
  after: (context, next) => {
    // console.log('suming-log', context[0]);  //options
    // console.log('suming-log', context[1]);  //result
    // context[1].hook = true;
    next();
  }
});

export default function App() {
  let [name, setName] = useState('Alan');
  let [age, setAge] = useState(15);
  const callback = useCallback(() => {
    setName('Bill');
    setAge(18);
  }, [name, age]);
  return <div>
    {/*----------- Hook Demo -----------*/}
    {/*<HookDemo name={name} age={age} />*/}
    {/*----------- Hoc Demo ------------*/}
    <HocDemo name={name} age={age} />
    <button onClick={callback}>change props</button>
  </div>;
}
