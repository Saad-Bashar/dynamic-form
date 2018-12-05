import React from 'react';
import {
  Input, 
  Button, 
  Icon, 
  Radio, 
  Checkbox
} from 'antd';

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;



export default class DynamicForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answer: Array.apply(null, Array(props.length)).map(() => {return ""})
    }
  }

  onChange = (e) => {
    this.setData(e.target.value)
  }

  onChangeRadio = (checkedList) => {
    this.setData(checkedList);
  }

  setData = (data) => {
    const { index } = this.props;
    const { answer } = this.state;

    let tempAnswer = answer; 
    tempAnswer[index] = data

    this.setState({ answer: tempAnswer })
  }

  isDisabled = () => {
    const { item, index } = this.props;
    const { answer } = this.state;
    if (item.is_required) {
      if(answer[index] === "" 
        || answer[index].length < item.min_char_length) {
        return true
      }
    }
    return false
  }

  getRadioOptions = () => {
    const { item } = this.props;
    return (
      item.options.map(option => {
        return (
          <Radio
            key={option} 
            value={option}
          >
            {option}
          </Radio>
        );
      })
    )
  }

  getInput = (type, answer, index, item) => {
    switch (type) {
      case "RadioQuestion":
        return (
          <RadioGroup onChange={this.onChange} value={answer[index]}>
            {this.getRadioOptions()}
          </RadioGroup>
        );
      case "TextQuestion":
        return (
          <Input.TextArea
            style={{ height: 200 }}
            required={item.required}
            value={answer[index]}
            onChange={(e) => this.onChange(e)}
          />
        );
      case "CheckboxQuestion":
        return (
          <CheckboxGroup 
            options={item.options} 
            onChange={this.onChangeRadio}   
          />
        );
      default:
        return null;
    }
  }

  render() {
    const { item, index, length } = this.props;
    const { answer } = this.state;
  
    return (
      <div style={{ padding: 25 }}>
        <label>
          {item.prompt}
          {item.min_char_length && 
            <span className="warning"> 
              Min Characters: {item.min_char_length}
            </span>
          }
        </label>
        <div className="input-container">
          {this.getInput(item.question_type, answer, index, item)}
        </div>
        <div className="form-button-container">
          {index !== 0 && 
            <Button 
              onClick={() => this.props.goPrev()} 
              type="primary"
            >
              <Icon type="left" />Prev
            </Button>
          }
          {index !== length - 1 ? 
            <Button 
              disabled={this.isDisabled()} 
              onClick={() => {
                this.props.goNext();
              }} 
              type="primary"
            >
              Next <Icon type="right" />
            </Button>
            :
            <Button
              disabled={this.isDisabled()} 
              className="finish-button"
              onClick={() => {
                this.props.onFinish(this.state.answer)
              }}
            >
              Finish <Icon type="trophy" />
            </Button>
          }
        </div>
      </div>
    );
  }
}
