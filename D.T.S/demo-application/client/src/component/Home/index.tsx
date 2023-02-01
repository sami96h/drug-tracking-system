/* eslint-disable max-len */
/* eslint-disable react/no-unescaped-entities */
import { FC } from 'react'
import './style.css'
import howWorks from '../../assets/image/drug-tracking.png'

export const Introduction:FC = () => (
  <section className="introduction">
    <div className="get-started">
      <div className="first">
        <div className="brief-container">
          <h1>Welcome to B.D.T.S company</h1>
          <p style={{
            marginTop: '25px',
          }}
          >
            The revolutionary drug tracking app that utilizes the power of a fabric network to bring transparency and traceability to the drug supply chain.

            The pharmaceutical industry is plagued by counterfeit drugs, which puts patients at risk and undermines the credibility of the entire system. B.D.T.S company solves this problem by providing real-time tracking of drugs from the manufacturer to the pharmacy, using tamper-proof records that are stored on a secure, decentralized network.

            With B.D.T.S company, you can have confidence in the authenticity of your drugs and ensure that they have not been tampered with. The app also allows for secure data sharing among all parties in the supply chain, improving efficiency and reducing the risk of errors.
          </p>

        </div>

      </div>

      <div className="image-container">
        <img src={howWorks} alt="" />
      </div>
    </div>
  </section>

)
