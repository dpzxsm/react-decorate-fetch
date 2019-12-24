import React, { useCallback, useState } from 'react';
import './App.css';
import { initConfig, connect, useLazyFetch, useFetch, useLazyFetches } from 'react-decorate-fetch';
// import { connect} from 'react-refetch'

// similar to react-refetch's connect.defaults
initConfig({
  options: {
    host: 'http://' + process.env.HOST // replace your host
  }
});

function buildOptions(props) {
  return {
    baiduFetch: 'https://www.baidu.com/',
    userFetch: '/users',
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
  let lazyResult = useLazyFetch(options.userFetch, [props.name, props.age]);
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
