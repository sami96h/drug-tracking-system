import {
  Typography, Divider, Col, Row,
} from 'antd'
import { FC } from 'react'
import { useParams } from 'react-router-dom'

const init = {
  id: '1',
  medicineName: 'medicineName',
  companyName: 'companyName',
  numberOfBoxes: 30,
  pricePerBox: 50,
  stage: 'stage',
  productionDate: '12/7/2012',
  expiryDate: '13/55/1520',
}

const BatchesDetails:FC = () => {
  const params = useParams()
  console.log(params)
  return (
    <div>
      <Row>
        <Col span={12}>
          <Typography.Title level={4}>ID:</Typography.Title>
          <Typography.Paragraph>{init.id}</Typography.Paragraph>
          <Typography.Title level={4}>Medicine Name:</Typography.Title>
          <Typography.Paragraph>{init.medicineName}</Typography.Paragraph>
          <Typography.Title level={4}>Company Name:</Typography.Title>
          <Typography.Paragraph>{init.companyName}</Typography.Paragraph>
        </Col>
        <Col span={12}>
          <Typography.Title level={4}>Number of Boxes:</Typography.Title>
          <Typography.Paragraph>{init.numberOfBoxes}</Typography.Paragraph>
          <Typography.Title level={4}>Price per Box:</Typography.Title>
          <Typography.Paragraph>
            $
            {init.pricePerBox}
          </Typography.Paragraph>
          <Typography.Title level={4}>Stage:</Typography.Title>
          <Typography.Paragraph>{init.stage}</Typography.Paragraph>
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={12}>
          <Typography.Title level={4}>production Date:</Typography.Title>
          <Typography.Paragraph>{init.productionDate}</Typography.Paragraph>
        </Col>
        <Col span={12}>
          <Typography.Title level={4}>Expiry Date:</Typography.Title>
          <Typography.Paragraph>{init.expiryDate}</Typography.Paragraph>
        </Col>
      </Row>
    </div>
  )
}

export default BatchesDetails
