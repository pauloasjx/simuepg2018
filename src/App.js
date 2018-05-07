import React, { Component } from 'react'
import { HorizontalGridLines,
         VerticalGridLines,
         XAxis,
         XYPlot,
         YAxis,
         LineSeries
        } from 'react-vis'

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

class Fire {
  constructor(params) {
    this.table = []

    this.I  = params.I
    this.Q  = params.Q
    this.NT = params.NT

    this.G1 = params.G1
    this.G2 = params.G2
    this.F  = params.F

    this.K  = params.K
    this.K1 = params.K1
    this.K2 = params.K2

    this.Q0 = params.Q0
    this.N0 = params.N0
    this.T0 = params.T0
    this.TF = params.TF
  }

  run() {
    for(let t=this.T0; t<=this.TF; t++) {
      var T = t

      if(T==0) {
        var R  = "-"
        var DQ = "-"
        var Q  = this.Q
      } else {
        var R  = this.I/(1+this.K*this.table[t-1].N)
        var DQ = this.K1*this.table[t-1].N*R-this.K2*this.table[t-1].Q

        if(this.table[t-1].Q+DQ > this.G1) {
          var Q = this.G2
        } else {
          var Q = this.table[t-1].Q+DQ
        }
      }

      var N  = this.NT-this.F*Q
      var Q0 = Q*this.Q0
      var N0 = N*this.N0

      this.table.push({T, R, DQ, Q, N, Q0, N0})
    }

    return this.table
  }
}

class App extends Component {
  constructor() {
    super()

    this.state = {
      I:  10,
      Q:  1000,
      NT: 100,
      G1: 5000,
      G2: 2000,
      F:  0.01,
      K:  0.9,
      K1: 8,
      K2: 0.01,
      Q0: 0.01,
      N0: 0.9,
      T0:  0,
      TF: 320,
      DT: 1
    }
  } 

  render() {
    let fire = new Fire(this.state).run()

    return (
      <div className="App">
        <div className="container-fluid">
          <div className="row">
          <br/>
          <div className="col-md-6">
            <h3>Fogo (FIRE)</h3>
            <p class="text-justify">
              Fogo é um modelo pulsante, o qual inclui um interruptor. Quando a grama <b>(Q)</b> cresceu como uma massa crítica <b>(G1)</b>, então o fogo é acionado. Quando a grama tiver queimado a um nível bem baixo <b>(G2)</b> não há mais o suficiente para queimar, o fogo é desacionado. Conforme o fogo queima, ele libera nutrientes, os quais estimulam crescimento e ficam presentes na grama novamente.
            </p>
            <p class="text-justify">
              No programa o interruptor do fogo é acionado quando <b>Q>G1</b>. <b>G2</b> é a quantidade de grama remanescente após o fogo. <b>G1</b> e <b>G2</b> são pontos iniciais e são mostrados no topo do símbolo do interruptor como na figura.
              O total de nutrientes no sistema <b>(TN)</b> inclui os nutrientes no solo <b>(N)</b> mais aqueles ligados a grama <b>(F*Q)</b>. Quando a grama <b>(Q)</b> é queimada, todos os nutrientes da grama queimada retornam ao solo: isto é, os nutrientes no solo são os nutrientes totais menos os nutrientes ligados a grama que não foi queimada <b>(N-TN-F*Q)</b>.
            </p>

            <p> <b> Simulação Original: </b> <a href="http://www.unicamp.br/fea/ortega/ModSim/fire/fire-pt.html">http://www.unicamp.br/fea/ortega/ModSim/fire/fire-pt.html</a></p>
            <p> <b> Alunos: </b> Leonardo Matheus Mendes e Paulo Alves dos Santos Jr </p>  
          </div>
          <div className="col-md-6">
            <br/>
            <img src="img/fire.gif"/>
          </div>
          </div>
          <div className="row">
          <div className="col-md-4">
            <XYPlot width={400} height={300}>
              <XAxis title="T"/>
              <YAxis title="Q0 e N0"/>
              <HorizontalGridLines />
              <VerticalGridLines />
              
              <LineSeries data={fire.map((r) => {
                    return {
                      x: r.T,
                      y: r.Q0
                    } 
                  })
              } />
              <LineSeries data={fire.map((r) => {
                    return {
                      x: r.T,
                      y: r.N0
                    } 
                  })
              } />
            </XYPlot>
            <XYPlot width={400} height={300}>
              <XAxis title="T"/>
              <YAxis title="Q"/>
              <HorizontalGridLines />
              <VerticalGridLines />
              
              <LineSeries data={fire.map((r) => {
                    return {
                      x: r.T,
                      y: r.Q
                    } 
                  })
              } />
            </XYPlot>
            <XYPlot width={400} height={300}>
              <XAxis title="T"/>
              <YAxis title="N"/>
              <HorizontalGridLines />
              <VerticalGridLines />
              
              <LineSeries data={fire.map((r) => {
                    return {
                      x: r.T,
                      y: r.N
                    } 
                  })
              } />
            </XYPlot>
          </div>

          <div className="col-md-4">
            <br/>
            <h3> I </h3>
            <Slider defaultValue={this.state.I} min={0} max={20}
              onChange={(value) => {
                this.setState({...this.state, I: value})
              }}
            />
            <span>{this.state.I}</span>
            <br/>
            <h3> Q </h3>
            <Slider defaultValue={this.state.Q} min={0} max={5000}
              onChange={(value) => {
                this.setState({...this.state, Q: value})
              }}
            />
            <br/>
            <span>{this.state.Q}</span>
            <h3> NT </h3>
            <Slider defaultValue={this.state.NT} min={0} max={1000}
              onChange={(value) => {
                this.setState({...this.state, NT: value})
              }}
            />
            <br/>
            <span>{this.state.NT}</span>
            <h3> G1 </h3>
            <Slider defaultValue={this.state.G1} min={0} max={10000}
              onChange={(value) => {
                this.setState({...this.state, G1: value})
              }}
            />
            <br/>
            <span>{this.state.G1}</span>
            <h3> G2 </h3>
            <Slider defaultValue={this.state.G2} min={0} max={10000}
              onChange={(value) => {
                this.setState({...this.state, G2: value})
              }}
            />
            <span>{this.state.G2}</span>
            <h3> F </h3>
            <Slider defaultValue={this.state.F} min={0} max={0.1} step={0.001}
              onChange={(value) => {
                this.setState({...this.state, F: value})
              }}
            />
            <span>{this.state.F}</span>
            <h3> K </h3>
            <Slider defaultValue={this.state.K} min={0} max={2} step={0.001}
              onChange={(value) => {
                this.setState({...this.state, K: value})
              }}
            />
            <span>{this.state.K}</span>
            <h3> K1 </h3>
            <Slider defaultValue={this.state.K1} min={0} max={20} step={0.01}
              onChange={(value) => {
                this.setState({...this.state, K1: value})
              }}
            />
            <span>{this.state.K1}</span>
            <h3> K2 </h3>
            <Slider defaultValue={this.state.K2} min={0} max={0.1} step={0.001}
              onChange={(value) => {
                this.setState({...this.state, K2: value})
              }}
            />
            <span>{this.state.K2}</span>
          </div>
          <div className="col-md-3">
            <br/>
            <h3> Parâmetros Pré-configurados </h3>
            <button className="btn btn-default btn-lg btn-block" onClick={() => {
              this.setState({
                I:  10,
                Q:  1000,
                NT: 100,
                G1: 5000,
                G2: 2000,
                F:  0.01,
                K:  0.9,
                K1: 8,
                K2: 0.01,
                Q0: 0.01,
                N0: 0.9,
                T0:  0,
                TF: 320,
                DT: 1
              })
            }}>Padrão</button>  <br/><br/>
            <button className="btn btn-default btn-lg btn-block" onClick={() => {
              this.setState({
                I:  10,
                Q:  1000,
                NT: 200,
                G1: 5000,
                G2: 2000,
                F:  0.01,
                K:  0.9,
                K1: 8,
                K2: 0.01,
                Q0: 0.01,
                N0: 0.9,
                T0:  0,
                TF: 320,
                DT: 1
              })
            }}>Exe. 01</button> <br/><br/>
            <button className="btn btn-default btn-lg btn-block" onClick={() => {
              this.setState({
                I:  10,
                Q:  1000,
                NT: 200,
                G1: 5000*0.75,
                G2: 2000,
                F:  0.01,
                K:  0.9,
                K1: 8,
                K2: 0.01,
                Q0: 0.01,
                N0: 0.9,
                T0:  0,
                TF: 320,
                DT: 1
              })
            }}>Exe. 02</button> <br/><br/>
            <button className="btn btn-default btn-lg btn-block" onClick={() => {
              this.setState({
                I:  10,
                Q:  1000,
                NT: 100,
                G1: 2000,
                G2: 2000,
                F:  0.01,
                K:  0.9,
                K1: 8,
                K2: 0.01,
                Q0: 0.01,
                N0: 0.9,
                T0:  0,
                TF: 320,
                DT: 1
              })
            }}>Exe. 03</button> <br/><br/>
          </div>
          </div>
          <br/>
          <div className="row">
          <div className="col-md-12">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>T</th>
                    <th>R</th>
                    <th>DQ</th>
                    <th>Q</th>
                    <th>N</th>
                    <th>Q0</th> 
                    <th>N0</th>
                  </tr>
                </thead>
                <tbody>
                  {fire.map(l => (
                    <tr key={l}>
                      <td>{l.T}</td>
                      <td>{l.R}</td>
                      <td>{l.DQ}</td>
                      <td>{l.Q}</td>
                      <td>{l.N}</td>
                      <td>{l.Q0}</td>
                      <td>{l.N0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
