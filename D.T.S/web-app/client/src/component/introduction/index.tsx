/* eslint-disable max-len */
import { FC } from 'react'
import { Button, Divider } from 'antd'
import { useNavigate } from 'react-router-dom'
import howWorksImg from '../../assets/image/how-works.jpg'
import Logo from '../../assets/image/logo.svg'

import './style.css'

const Introduction:FC = () => {
  const navigate = useNavigate()
  return (
    <div className="introduction">
      <div>

        <p>
          Welcome to B.D.T.S company, the revolutionary drug tracking app that utilizes the power of a fabric network to bring transparency and traceability to the drug supply chain.

          The pharmaceutical industry is plagued by counterfeit drugs, which puts patients at risk and undermines the credibility of the entire system. B.D.T.S company solves this problem by providing real-time tracking of drugs from the manufacturer to the pharmacy, using tamper-proof records that are stored on a secure, decentralized network.

          With B.D.T.S company, you can have confidence in the authenticity of your drugs and ensure that they have not been tampered with. The app also allows for secure data sharing among all parties in the supply chain, improving efficiency and reducing the risk of errors.
          {' '}

        </p>
        <Button
          type="primary"
          style={{ color: 'rgb(242, 242, 242)', marginTop: '50px' }}
          onClick={() => {
            navigate('/login')
          }}
        >
          Sign In
        </Button>
        <Button
          type="primary"
          style={{ color: 'rgb(242, 242, 242)', marginTop: '50px' }}
          onClick={() => {
            navigate('/qr-scanner')
          }}
        >
          Scan Drug QR
        </Button>

      </div>
      <div className="intro-img-container">
        <img
          src={Logo}
          style={{
            width: '250px',
            height: '250px',
          }}
          alt=""
        />
        <Divider />
        <img src={howWorksImg} alt="how works" />
      </div>
    </div>
  )
}

export default Introduction
