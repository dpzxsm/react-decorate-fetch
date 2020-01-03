import React from 'react';
import { connect } from "react-decorate-fetch";

@connect((props) => ({
  usersFetch: {
    url: '/users',
    method: 'POST',
    then: (data) => {
      //return FetchOptions  make Chained request
      // return '/schools';
    },
    // value: [], // Mock static data
    value: (data) => data.join(','), // transform fetch body
    refreshInterval: 2000
  },
  updateUser: () => ({
    updateUserFetch: {
      url: '/users/update',
      params: {
        name: props.name
      }
    }
  })
}))
export default class HocDemo extends React.Component {
  render() {
    console.log('suming-log', this.props);
    let { usersFetch, updateUser, updateUserFetch } = this.props;
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
}
