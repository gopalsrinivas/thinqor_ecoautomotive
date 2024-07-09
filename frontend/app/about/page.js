import React from 'react'
import './page.module.css'

export function generateMetadata({params}){
  return{
      title:"Eco Automotive | About Us",
      description: 'Eco Automotive about us',
  }
}

const About = () => {
  return (
    <>
          <div id="myCarousel" className="carousel slide" data-ride="carousel">
              <ol className="carousel-indicators">
                  <li data-target="#myCarousel" data-slide-to="0" className="active"></li>
                  <li data-target="#myCarousel" data-slide-to="1"></li>
                  <li data-target="#myCarousel" data-slide-to="2"></li>
              </ol>
              <div className="carousel-inner">
                  <div className="carousel-item active">
                      <img className="d-block w-100" src="/asset/images/first.jpg" alt="First slide" />
                          <div className="container">
                              <div className="carousel-caption text-left">
                                  <h1>ECO AUTOMOTIVE</h1>
                                  <p>Switch to Eco-Automotive Smart Biking Ride for the future</p>
                              </div>
                          </div>
                  </div>
                  <div className="carousel-item">
                      <img className="d-block w-100" src="/asset/images/safe.jpg" alt="Second slide" />
                          <div className="container">
                              <div className="carousel-caption">
                                  <h1>Why Evive</h1>
                                  <p>Evive strives to bring forth a wide range of quality E-Cycles , and offer lifestyle improvement opportunities using cutting-edge Artificial Intelligence (AI) powered platform in a responsible and sustainable way.</p>
                                  <p><a className="btn btn-lg btn-primary" href="#" role="button">Learn more</a></p>
                              </div>
                          </div>
                  </div>
                  <div className="carousel-item">
                      <img className="d-block w-100" src="/asset/images/third.png" alt="Third slide" />
                          <div className="container">
                              <div className="carousel-caption text-right">
                                  <h1>One more for good measure.</h1>
                                  <p>E-Cycles that cater to all your needs</p>
                                  <p><a className="btn btn-lg btn-primary" href="#" role="button">Browse gallery</a></p>
                              </div>
                          </div>
                  </div>
              </div>
              <a className="carousel-control-prev" href="#myCarousel" role="button" data-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="sr-only">Previous</span>
              </a>
              <a className="carousel-control-next" href="#myCarousel" role="button" data-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="sr-only">Next</span>
              </a>
          </div>


          <div className="container marketing">
              <div className="row">
                  <div className="col-lg-4">
                      <h2 style={{color:"orange"}}>Cost Effective</h2>
                      <p>Commute at minimal cost and take a small step towards environment-concious living.</p>
                      <p><a className="btn btn-secondary" href="#" role="button">View details &raquo;</a></p>
                  </div>
                  <div className="col-lg-4">
                      <h2 style={{ color: "orange" }}>A Safe and Secure Experience</h2>
                      <p>Monitor and customise for evive experience by linking your Ecycle to mobile application.</p>
                      <p><a className="btn btn-secondary" href="#" role="button">View details &raquo;</a></p>
                  </div>
                  <div className="col-lg-4">
                      <h2 style={{color:"orange"}}>Healthy Choice</h2>
                      <p>Know about the health benefits by switching your mode of transport to an E-Cycle.</p>
                      <p><a className="btn btn-secondary" href="#" role="button">View details &raquo;</a></p>
                  </div>
              </div>
              <hr className="featurette-divider" />
                  <div className="row featurette">
                      <div className="col-md-7">
                          <h2 className="featurette-heading" style={{color:"orange"}}>The World is Yours <br /><span className="text-muted">No Compromise</span></h2>
                          <p className="lead">Performance and design were the keywords during the conception of this super eBike. No compromises were made to keep the pleasure of driving despite constraints.Take advantage of a free track trial to discover it.</p>
                      </div>
                      <div className="col-md-5">
                          <img className="featurette-image img-fluid mx-auto" src="/asset/images/about1.svg" alt="Generic placeholder image" />
                      </div>
                  </div>

              <hr className="featurette-divider" />
                      <div className="row featurette">
                          <div className="col-md-7 order-md-2">
                              <h2 className="featurette-heading" style={{color:"orange"}}>OUR STORY<br /><span className="text-muted">ECO AUTOMOTIVE</span></h2>
                              <p className="lead">Evive is an effort to provide inclusive, accessible micro-mobility solutions designed specifically for the Indian users, while cultivating a sense of responsibility towards the planet, and working towards a sustainable future. Know more about the philosophy of our brand of evive.</p>
                          </div>
                          <div className="col-md-5 order-md-1">
                              <img className="featurette-image img-fluid mx-auto" src="/asset/images/about2.JPG" alt="Generic placeholder image" />
                          </div>
                      </div>

                      <hr className="featurette-divider" />
                          <div className="row featurette">
                              <div className="col-md-7">
                                  <h2 className="featurette-heading" style={{color:"orange"}}>A GREENER LIFESTYLE<br/><span className="text-muted">ELECTRIC DRIVING</span></h2>
                                  <p className="lead">At Eco-Automotive, we have a passion for creating innovative electric cycles that are environmentally friendly and efficient. Our mission is to provide high-quality e-bikes that are affordable and accessible to everyone. We take pride in our commitment to sustainable transportation and reducing our carbon footprint. Our electric cycles are designed with advanced features such as pedal assist, powerful motors, and long-lasting batteries to provide a comfortable and enjoyable ride. We are dedicated to providing exceptional customer service and support, ensuring that every customer has a positive experience with our products. Thank you for choosing Eco-Automotive powered by eVive as your go-to electric cycle.</p>
                              </div>
                              <div className="col-md-5">
                                  <img className="featurette-image img-fluid mx-auto" src="asset/images/cost.jpg" alt="Generic placeholder image" />
                              </div>
                          </div>

                          <hr className="featurette-divider" />
                          </div>
    </>
  )
}

export default About