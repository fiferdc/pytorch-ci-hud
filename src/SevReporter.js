// Copyright (c) Facebook, Inc. and its affiliates.
//
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.

import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import AuthorizeGitHub from "./AuthorizeGitHub.js";
import TestReportRenderer from "./pr/TestReportRenderer.js";
import {
  BsFillCaretRightFill,
  BsCaretDownFill,
  BsFillCaretDownFill,
  GoPrimitiveDot,
  GoCircleSlash,
  GoCheck,
  GoX,
} from "react-icons/all";
import { LazyLog } from "react-lazylog";

import { github } from "./utils.js";

function getIssuesQuery() {
  return `
      {
        search(type:ISSUE,first:100,query:"is:issue is:open sort:updated-desc author:driazati") {
          nodes {
            ... on Issue {
              number
              title
              body
              url
            }
          }
        }
      }
    `;
}

export default class PrDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sevs: [],
    };
  }

  componentDidMount() {
    this.update();
  }

  async update() {
    if (!localStorage.getItem("gh_pat")) {
      // Not logged in, can't search GitHub
      // TODO: Show login option
      return;
    }
    const response = await github.graphql(getIssuesQuery());
    this.state.sevs = response.search.nodes;
    this.state.sevs = [this.state.sevs[0]];

    this.setState(this.state);
  }

  renderSev(issue) {
    return (
      <div className="sevbox">
        <a href="https://github.com/pytorch/pytorch/wiki/%5BWIP%5D-What-is-a-SEV">
          SEV:
        </a>{" "}
        {issue.title} (<a href={issue.url}>#{issue.number}</a>)
      </div>
    );
  }

  render() {
    const existingSevs = this.state.sevs;
    const renderedSevs = [];
    for (const [index, sev] of existingSevs.entries()) {
      console.log("rendeing");
      renderedSevs.push(<div key={`sev-${index}`}>{this.renderSev(sev)}</div>);
    }

    return <div>{renderedSevs}</div>;
  }
}
