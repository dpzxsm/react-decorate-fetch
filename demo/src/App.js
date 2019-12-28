import React, { useCallback, useState } from 'react';
import './App.css';
import { initConfig, connect, useLazyFetch, useFetch, applyMiddleware } from 'react-decorate-fetch';
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
    console.log('suming-log', context[0]);  //options
    next();
  },
  after: (context, next) => {
    console.log('suming-log', context[0]);  //options
    console.log('suming-log', context[1]);  //result
    context[1].hook = true;
    next();
  }
});


function buildOptions(props) {
  return {
    baiduFetch: 'https://www.baidu.com/',
    usersFetch: {
      url: '/users',
      method: 'POST'
    },
    updateUser: () => ({
      updateUserFetch: {
        url: '/users/update',
        params: {
          name: props.name
        }
      },
      updateUserFetch2: {
        url: '/users/update',
        params: {
          age: props.age
        }
      }
    })
  };
}

function App(props) {
  let options = buildOptions(props);
  let updateUserMap = options.updateUser();
  let updateUserOptions = Object.keys(updateUserMap).map(key => updateUserMap[key]);
  let [result, updateUser] = useFetch(updateUserOptions, [props.name, props.age]);
  let lazyResult = useLazyFetch(options.usersFetch, [props.name, props.age]);
  console.log('suming-log', lazyResult);
  return (
    <div className="App">
      <div>
        <span>lazy request</span>
        <pre>{JSON.stringify(lazyResult)}</pre>
      </div>
      <button onClick={updateUser}>fetch data</button>
      <div className="info">
        <span>request</span>
        <pre>
          {JSON.stringify(result)}
        </pre>
      </div>
    </div>
  );
}

// @connect((buildOptions))
// export default class App extends React.Component {
//   render() {
//     console.log('suming-log', this.props);
//     return <div>
//       <button onClick={this.props.updateUser}>click</button>
//     </div>;
//   }
// }


export default function AppWrapper() {
  let [name, setName] = useState('Alan');
  let [age, setAge] = useState(15);
  const callback = useCallback(() => {
    setName('Bill');
    setAge(18);
  }, [name, age]);
  return <div>
    <App name={name} age={age} />
    <button onClick={callback}>change props</button>
  </div>;
}