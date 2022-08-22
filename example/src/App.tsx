import React, { useState } from 'react'
import { Layout, Typography, InputNumber, Card, Space, Radio, Divider, Descriptions, Checkbox, Switch, Input } from 'antd'
import { useDebounce } from 'use-debounce'
import { TimeUntil, useTimeUntil } from 'react-time-until'
import 'antd/dist/antd.css'

const { Title } = Typography
const { Content, Sider } = Layout

const App = () => {
  const [_delta, setDelta] = useState<number>(60000)
  const [_updateInterval, setUpdateInterval] = useState<number>(50)
  const [format, setFormat] = useState<"text" | "time">("text")
  const [ago, setAgo] = useState<boolean>(false)
  const [countdown, setCountdown] = useState<boolean>(false)
  const [finishText, setFinishText] = useState<string>("Countdown complete")

  const [delta] = useDebounce(_delta, 500)
  const [updateInterval] = useDebounce(_updateInterval, 500)

  const { delta: currentDelta, hours, minutes, seconds } = useTimeUntil({ delta, countdown })

  const timeUntilProps = {
    format,
    ago,
    interval: updateInterval,
    countdown,
    finishText,
    onFinish: () => console.log("Done!")
  }

  return (
    <Layout>
      <Sider width={ 300 } style={{ background: "#fff", padding: 32, borderRight: "1px solid #ccc" }}>
        <Space size="large" direction="vertical" style={{ width: "100%" }}>
          {/* <Card title="My countdown!" style={{ minWidth: 750 }}> */}
            <Space size="middle" direction="vertical" style={{ width: "100%" }}>
              <Title level={ 5 }>General settings</Title>
              <Space size="small" direction="vertical">
                Time delta: <InputNumber value={ _delta } onChange={ setDelta } style={{ width: "100%" }} />
              </Space>
              <Space size="small" direction="vertical">
                Update interval: <InputNumber value={ _updateInterval } onChange={ setUpdateInterval } style={{ width: "100%" }} />
              </Space>
              <Space size="middle">
                In/ago:
                <Switch checked={ ago } onChange={ setAgo } />
              </Space>
              <Space size="small" direction="vertical">
                Format:
                <Radio.Group
                  options={[
                    { label: "Text", value: "text" },
                    { label: "Time string", value: "time" }
                  ]}
                  value={ format }
                  onChange={ ({ target: { value } }) => setFormat(value)  }
                  optionType="button"
                  style={{ width: "100%" }}
                />
              </Space>
              <Divider style={{ margin: 4 }} />
              <Title level={ 5 }>Countdown settings</Title>
              <Space size="middle">
                Countdown:
                <Switch checked={ countdown } onChange={ setCountdown } />
              </Space>
              <Space size="small" direction="vertical">
                Finish text:
                <Input value={ finishText } onChange={ ({ target: { value } }) => setFinishText(value) } />
              </Space>
            </Space>
          </Space>
        </Sider>
        <Content style={{ padding: 32 }}>
          <Space size="large" direction="vertical">
            <Space size="large" direction="vertical" style={{ width: "100%" }}>
              <Space size="middle" direction="vertical">
                <div className="ant-statistic">
                    <div className="ant-statistic-title">
                      Countdown (uncontrolled)
                    </div>
                    <div className="ant-statistic-content">
                      <span className="ant-statistic-content-value">
                        <TimeUntil { ...timeUntilProps } delta={ delta } />
                      </span>
                    </div>
                  </div>
                  <div className="ant-statistic">
                    <div className="ant-statistic-title">
                      Countdown (controlled using hook)
                    </div>
                    <div className="ant-statistic-content">
                      <span className="ant-statistic-content-value">
                        {/* You can use the delta useTimeUntil to use the component with the hook. */}
                        <TimeUntil { ...timeUntilProps } delta={ currentDelta } onFinish={ undefined } />
                      </span>
                    </div>
                  </div>
                  <div className="ant-statistic">
                    <div className="ant-statistic-title">
                      Current delta
                    </div>
                    <div className="ant-statistic-content">
                      <span className="ant-statistic-content-value">
                        { currentDelta }
                      </span>
                      <span className="ant-statistic-content-suffix">ms</span>
                    </div>
                  </div>
                </Space>
                <Descriptions bordered={ true } style={{ background: "#fff" }}>
                  {/* <Descriptions.Item label="Current delta" span={ 3 }>{ currentDelta }</Descriptions.Item> */}
                  <Descriptions.Item label="Hours">{ hours }</Descriptions.Item>
                  <Descriptions.Item label="Minutes">{ minutes }</Descriptions.Item>
                  <Descriptions.Item label="Seconds">{ seconds }</Descriptions.Item>
                </Descriptions>
            </Space>
          {/* </Card> */}
        </Space>
      </Content>
    </Layout>
  )
}

export default App
