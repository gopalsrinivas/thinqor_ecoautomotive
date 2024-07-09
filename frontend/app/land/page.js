import React from 'react'

export function generateMetadata({ params }) {
  return {
    title: "Eco Automotive | Home",
    description: 'Eco Automotive Home',
  }
}


const Landpage = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              {/* <li className="breadcrumb-item active" aria-current="page"><a href="/land">Home</a></li> */}
            </ol>
          </nav>
        </div>
      </nav>
      <div className='container'>
        <div className='row'>
          <div className='col-md-12'>
          <div className="embed-responsive embed-responsive-16by9">
              <video controls autoPlay loop className="embed-responsive-item" style={{width:"100%"}}>
              <source src="/asset/images/home.mp4" type="video/mp4" />
            </video>
          </div>
          </div>
        </div>
        <div className='row mt-4'>
          <div className='col-md-8'>
            <h2 className="featurette-heading" style={{color:'orange'}}>The World is Yours <br /><span className="text-muted">No Compromise</span></h2>
            <p className="lead">Performance and design were the keywords during the conception of this super eBike. No compromises were made to keep the pleasure of driving despite constraints.Take advantage of a free track trial to discover it.</p>
          </div>
          <div className='col-md-4'>
            <img className="featurette-image img-fluid mx-auto" src="/asset/images/scanner.png" alt="Generic placeholder image" />
          </div>
        </div>
      </div>
    </>
  )
}

export default Landpage