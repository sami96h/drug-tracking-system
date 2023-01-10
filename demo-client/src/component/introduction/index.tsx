import { FC } from 'react'
import { Button, Divider } from 'antd'
import { useNavigate } from 'react-router-dom'
import howWorksImg from '../../assets/image/how-works.jpg'
import drugTrackingImg from '../../assets/image/drug-tracking.png'
import './style.css'

const Introduction:FC = () => {
  console.log('first')
  const navigate = useNavigate()
  return (
    <div className="introduction">
      <div>
        <h1>samico</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Beatae cupiditate qui, necessitatibus recusandae,
          nemo aliquam provident labore odit reiciendis temporibus voluptate.
          Quidem dolorum aliquid recusandae numquam earum perferendis quam pariatur?
        </p>
        <Button
          type="primary"
          style={{ color: 'rgb(242, 242, 242)', marginTop: '50px' }}
          onClick={() => navigate('/drugs/new')}
        >
          Get Started
        </Button>

      </div>
      <div className="intro-img-container">
        <img src={drugTrackingImg} alt="drug tracking" />
        <Divider />
        <img src={howWorksImg} alt="how works" />
      </div>
    </div>
  )
}

export default Introduction
