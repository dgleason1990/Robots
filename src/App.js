import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state={
    input:'',
    students:[],
    toggle:[],
    tag:''
  }

  async componentWillMount(){
    await fetch('https://www.hatchways.io/api/assessment/students')
    .then(res=>res.json())
    .then(data => {this.setState({
        students: data.students,
        toggle:[{
          className: data.students.map(()=>{ return 'isClosed' })
        }]
      });
    })
    await this.setState({ 
      students: [...this.state.students.map( (student) => { return {tag:[],...student} })]
    })
}

  handleTag = (id) => {
    if(this.state.students[id-1].tag === undefined){
      this.state.students[id-1].tag = [];
      this.state.students[id-1].tag.push(this.state.tag);
      let displayTag = document.getElementById(`tag${id-1}`)
      displayTag.innerHTML = this.state.students[id-1].tag
    } 
    else {
      this.state.students[id-1].tag.push(this.state.tag);
      let displayTag = document.getElementById(`tag${id-1}`)
      displayTag.innerHTML = this.state.students[id-1].tag
    }
  }

  handleChange = (e)=>{
    this.setState({ input: e.target.value });
  }

  render() {
    let tag = [];
    let filterInput = (data)=>{
      let firstName = data.firstName.toUpperCase().split('');
      let input = this.state.input.toUpperCase().split('');
      let lastName = data.lastName.toUpperCase().split('');

      if (data.tag === undefined || data.tag.length === 0){
        console.log('nothing')
      } 
      else {
          for(let i=0; i<data.tag.length;i++){
            tag.push(data.tag[i])
          }
      }

      console.log(tag)
      let newArr=[]
      tag.forEach( i => {newArr.push(i.split(''))})

      console.log(newArr)
      if(this.state.input === ''){
        return true
      } 
      else {
        let isTrue;
        for(let i=0 ; i<input.length ; i++){
          if(input[i] !== firstName[i] && input[i] !== lastName[i]){
            isTrue = false
            break;
          } 
          else if(input[i] === firstName[i] || input[i] === lastName[i]){
            isTrue = true
          }
        }
        return isTrue
      }

    }

    let displayInformation = (data) => {
      let add = (total, num)=>{
        return (total + num)
      }

    let handleOpen = ()=>{ 
        const className = [...this.state.toggle[0].className]
        if(className[data.id-1]==='isClosed'){
          className[data.id-1] = 'isOpen'
        } 
        else {
          className[data.id-1] = 'isClosed'
        }
        this.setState({
          toggle:[{
            className: className
          }]
      })
    }
      return <div>
              <div className='studentCard'> 
                <img src={data.pic}/>
                <div className='studentDetails'>
                  <h1 className='button' onClick={handleOpen}>➕</h1>
                  <h1 className='studentName'> {data.firstName} {data.lastName}</h1>
                  <p> Email: {data.email}</p>
                  <p> Company: {data.company} </p>
                  <p> Skill: {data.skill} </p>
                  <p> Average: {data.grades.map( data => Number(data)).reduce(add)/8}% </p>
                  <div className='grades'> 
                    {data.grades.map(grade => {
                      let index = data.grades.indexOf(grade)+1
                        return <p className={this.state.toggle[0].className[data.id-1]}> Test {index}: {grade}% </p>})}
                    <div id={`tag${data.id-1}`}></div>
                    <input onChange={(e)=>{this.setState({tag: e.target.value})}}/>
                    <button onClick={()=>{this.handleTag(data.id)}}> Submit Tag </button>
                  </div>
                </div>
              </div>
              <hr/>
      </div>
    }
    return (
      <div>
        <input className='search' onChange={(e)=>{this.setState({ input: e.target.value })}} placeholder='Search by Name'/>
        <input className='search' onChange={(e)=>{this.setState({ input: e.target.value })}} placeholder='Search by Tag'/>
        <div className="App">
          {this.state.students.filter(filterInput).map(data=>displayInformation(data))}
        </div>
      </div>
    );
  }
}

export default App;
