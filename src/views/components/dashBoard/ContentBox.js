import React, { Component } from 'react';

class ContentBox extends Component {
    constructor(props) {
        super(props);
    }
    state = {  }
    render() { 
        const {breadcrumb}=this.props;
        return (  <section className="content">
                <div className="wrapper">
                <div className="content-wrapper">

    <section className="content-header">
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-6">
            <h5>{this.props.title}</h5>
          </div>
          <div className="col-sm-6">
            <ol className="breadcrumb float-sm-right">
                {
                        breadcrumb.map((rank, i, row)  => {
                            if (i + 1 === row.length) {
                                // Last one.
                                return <li key={i} className="breadcrumb-item active"><a href="#"  onClick={e => e.preventDefault()}>{row[i]}</a></li>
                              } else {
                                // Not last one.
                                return <li key={i} className="breadcrumb-item"><a href="#"  onClick={e => e.preventDefault()}>{row[i]}</a></li>
                              }
                       })
                }
             
            </ol>
          </div>
        </div>
      </div>
    </section>

                                <div className="row">
                                     <div className="col-12">
                                <div className="card">
                                {/* <div className="card-header">
                                    <h3 className="card-title"><strong>{this.props.title}</strong></h3>
                                    <ol className="breadcrumb float-sm-right">
                                        <li className="breadcrumb-item"><a href="#">Home</a></li>
                                        <li className="breadcrumb-item"><a href="#">Layout</a></li>
                                        <li className="breadcrumb-item active">Fixed Layout</li>
                                        </ol>
                                    <div className="card-tools">
                                    <button type="button" className="btn btn-tool" data-card-widget="collapse" title="Collapse">
                                        <i className="fas fa-minus"></i>
                                    </button>
                                    <button type="button" className="btn btn-tool" data-card-widget="remove" title="Remove">
                                        <i className="fas fa-times"></i>
                                    </button>
                                    
                                        
        
                                    </div>
                                </div> */}
                                <div className="card-body">
                                     {this.props.children}
                                </div>
                            
                                </div>
                              </div>
                            </div>
                        </div>
                </div>
                       
                    </section> );
    }
}
 
export default ContentBox ; 