import React from 'react';
import { useFetch, useLazyFetch } from "react-decorate-fetch";

export default function HookDemo(props) {
  let [updateUserFetch, updateUser] = useFetch({
      url: '/users/update',
      params: {
        name: props.name,
        age: props.age
      }
    },
    [props.name, props.age]);
  let usersFetch = useLazyFetch({
    url: '/users',
    method: 'POST',
    then: (data) => {
      //return FetchOptions  make Chained request
      // return '/schools';
    },
    // value: [], // Mock static data
    value: (data) => data.join(','), // transform fetch body
    refreshInterval: 2000
  }, [props.name, props.age]);
  return <div>
    <div>
      <span>lazy request</span>
      <pre>{JSON.stringify(usersFetch)}</pre>
    </div>
    <button onClick={updateUser}>fetch data</button>
    <div className="info">
      <span>request</span>
      <pre>
          {JSON.stringify(updateUserFetch)}
        </pre>
    </div>
  </div>;
}
