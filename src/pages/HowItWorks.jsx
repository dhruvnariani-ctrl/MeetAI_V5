import { useNavigate, useOutletContext } from 'react-router-dom'

import Box from '@mui/material/Box'

import PageShell from '../components/PageShell'
import HowItWorksFaq from '../components/howItWorks/HowItWorksFaq'
import HowItWorksFeature from '../components/howItWorks/HowItWorksFeature'
import HowItWorksHero from '../components/howItWorks/HowItWorksHero'
import HowItWorksQuickGuide from '../components/howItWorks/HowItWorksQuickGuide'
import HowItWorksSteps from '../components/howItWorks/HowItWorksSteps'
import HowItWorksSupport from '../components/howItWorks/HowItWorksSupport'
import usePageTitle from '../hooks/usePageTitle'

/* Employee guide: hero, four steps, feature, FAQ, support, and printable quick guide. */
export default function HowItWorks() {
  usePageTitle('How It Works')

  const navigate = useNavigate()
  const { openCreate } = useOutletContext() ?? {}

  return (
    <PageShell>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, md: 4 }, width: '100%', minWidth: 0 }}>
        <HowItWorksHero />
        <HowItWorksSteps />
        <HowItWorksFeature />
        <HowItWorksFaq />
        <HowItWorksSupport
          onSchedule={() => openCreate?.()}
          onGoToSchedule={() => navigate('/')}
        />
        <HowItWorksQuickGuide />
      </Box>
    </PageShell>
  )
}