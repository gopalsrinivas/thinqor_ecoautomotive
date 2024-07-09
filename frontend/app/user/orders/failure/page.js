import React from 'react'

const UserOrderFailure = () => {
  return (
    <div className='container'>
    <div className='row'>
    <div className='co-md-12 card mt-3 mb-3'>
              <img className="align-center" src="/asset/images/Transactionfailed.png" alt="" style={{ width:"50%",marginLeft:"16em"}}/>
                {/* <p className='text-center'>if the amount was deducted, it will be credited to your account within 7 to 8 days.</p> */}
                <h3 className='text-center'>Try again</h3>
    </div>
    </div>
    </div>
  )
}

export default UserOrderFailure