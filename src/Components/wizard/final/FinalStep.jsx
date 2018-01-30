import React from 'react';

export const FinalStep = () => (
  <div>
      <div style={{position: 'absolute', top: 50, backgroundColor: 'white', width: '100%', height: '100%'}}>
          <img width={"200px"} src={"image/successful.svg"} alt="successful"/>
          <div style={{color:'black', zIndex: '1500'}}>
              <h2>Successfully Submitted</h2>
              <h6>Please Check Your Email</h6>
          </div>
          <a href="http://www.modelplatform.com">Go To Homepage</a>
      </div>
  </div>
);
