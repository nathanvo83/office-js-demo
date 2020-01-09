import * as React from "react";
import "./Chunk.css";

export interface AppProps {
  title: string;
}

export interface AppState {}

export default class Chunk extends React.Component<AppProps, AppState> {
  componentWillUnmount() {}

  componentDidMount() {}

  render() {
    const { title } = this.props;

    return <div className="chunk">{title}</div>;
  }
}


