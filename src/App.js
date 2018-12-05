import React, { Component } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Progress 
} from 'antd';
import DynamicForm from './DynamicForm';
import './App.css';

const questions = require('./data.json')

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      progress: 0,
      data: []
    }
  }

  goNext = () => {
    this.setState({
      index: this.state.index + 1
    }, () => this.updateProgress())
  }

  goPrev = () => {
    this.setState({
      index: this.state.index - 1
    })
  }

  updateProgress = () => {
    let { index } = this.state;
    if(index === 0) index = index + 1
    this.setState({
      progress: (index / questions.questions.length) * 100
    })
  }

  onFinish = (data) => {
    let tempData = [];
    questions.questions.map((item, index) => {
      tempData.push({
        question: item.prompt,
        ans: data[index]
      });
    });
    this.setState({
      progress: 100,
      data: tempData
    });
  }

  getDynamicForm = (questions) => {
    const { progress, index } = this.state;
    return (
      <div width="100%">
        <Row type="flex" align="center" className="form-container">
          <Col md={10} xs={20}>
            <Progress percent={progress} />
            <Card title={questions.title}>
              <DynamicForm
                item={questions.questions[index]}
                index={index}
                goNext={this.goNext}
                goPrev={this.goPrev}
                length={questions.questions.length}
                onFinish={this.onFinish}
                updateProgress={this.updateProgress}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  getResults = () => {
    const { data } = this.state;
    return data.map((item) => {
      return (
        <div key={item.question}>
          <Row align="center" type="flex" className="results-container">
            <Col md={10} xs={20}>
              <Card>
                <h4>{item.question}</h4> <br />
                <span>
                  {
                    Array.isArray(item.ans) ? item.ans.join(' ') : item.ans
                  }
                </span>
              </Card>
            </Col>
          </Row>
        </div>
      );
    });
  }

  render() {
    const { progress } = this.state;
    if(progress === 100) {
      return (
        this.getResults()
      ); 
    }
    return (
      this.getDynamicForm(questions)
    );
  }
}

export default App;