import Footer from 'components/containers/Footer'
import { useToast } from 'components/context/ToastContextProvider'
import Section from 'components/ui/section'
import Toasts from 'components/ui/toasts'
import { useSession } from 'hooks/useSession'
import { useCyfrUserApi } from 'prisma/hooks/useCyfrUserApi'
import React, { useRef, useState } from 'react'

import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import useDebug from 'hooks/useDebug'
import UserBillingDetail from 'components/containers/User/UserBillingDetail'
import { UserNameAndAvatar } from 'components/containers/User/UserNameAndAvatar'

const {debug} = useDebug('user/setup')

const SetupPage = () => {
  useSession({ required: true, redirectTo: '/login' })
  const {cyfrUser, isLoading, error, invalidate, updateUser} = useCyfrUserApi()
  const {notify} = useToast()

  const mainRef = useRef<HTMLElement>(null)
  const [scrollActive, setScrollActive] = useState(false)
  const handleScroll = (e: any) => {
    const position = mainRef?.current?.scrollTop
    setScrollActive((current) => (position && position > 120) || false)
  }

  const [activeStep, setActiveStep] = React.useState(0)

  const handleNext = () => setActiveStep((prevActiveStep) => prevActiveStep + 1)

  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1)

  const handleReset = () => setActiveStep(0)

  const showStep = (step:number) => step === activeStep ? 'inline' : 'hidden'

  const steps = ['Change defaults', 'Choose membership', 'Review']
  return (
    <div className="grad-1">
      <div className="grad-2">
        <div className="grad-3">
          <div className="grad-4">
            <div className="w-full min-h-screen max-h-screen flex flex-col sm:flex-row flex-wrap sm:flex-nowrap flex-grow">
              <main
                role="main"
                className="w-full min-h-screen flex-grow m-0 overflow-auto scrollbar-hide relative"
                onScroll={handleScroll}
                ref={mainRef}
              >
                <Toasts />

                <Section
                  className="box-border snap-y min-h-full"
                  subTitle="Account setup"
                >
                  <div
                    className="
                    mt-4 p-4 
                    bg-neutral-content
                    even:bg-opacity-90 odd:bg-opacity-100
                    rounded-2xl
                    snap-always snap-start
                    "
                  >
                    <Stepper activeStep={activeStep}>
                        {steps.map((label, index) => {
                            return (
                                <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                                </Step>
                            )
                        })}
                    </Stepper>
                        <div className={showStep(0)}>
                            <Box sx={{display: 'inline', pt: 2}}>
                                <h3>Profile</h3>
                                <UserNameAndAvatar />
                            </Box>
                        </div>
                        <div className={showStep(1)}>
                            <Box sx={{display: 'inline', pt: 2}}>
                                <h3>Billing</h3>
                                <UserBillingDetail />
                            </Box>
                        </div>
                        <div className={showStep(2)}>
                            <Typography sx={{ mt: 2, mb: 1 }}>
                                All steps complete!
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                <Box sx={{ flex: '1 1 auto' }} />
                                <Button onClick={handleReset}>Reset</Button>
                            </Box>
                        </div>
                        
                        <div>
                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                <Button
                                color="inherit"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                sx={{ mr: 1 }}
                                >
                                    Back
                                </Button>
                                <Box sx={{ flex: '1 1 auto' }} />
                                <Button onClick={handleNext}>
                                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                </Button>
                            </Box>
                        </div>
                  </div>
                </Section>
                <Footer />
              </main>
              <div className="w-fixed w-full flex-shrink flex-grow-0 px-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SetupPage
