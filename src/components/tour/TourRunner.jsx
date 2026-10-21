
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'

import TourCard from './TourCard'
import TourIntro from './TourIntro'
import TourOverlay from './TourOverlay'

import { APP_TOUR_STEPS } from '../../data/tours'
import {
  readTour,
  saveTour,
  startAppTour,
  stopAppTour,
} from './TourStorage'
import {
  findTarget,
  positionCard,
  rectOf,
} from './TourUtils'

const COLORS = {
  navy: '#172437',
  blue: '#1769c2',
  blueSoft: '#eaf2fd',
  overlay: 'rgba(17, 31, 49, 0.48)',
  border: 'rgba(23, 36, 55, 0.12)',
}

const GAP = 18
const VIEWPORT_PADDING = 16
const CARD_WIDTH = 360
const TARGET_RETRY_LIMIT = 30
const TARGET_RETRY_DELAY = 150

function getPosition(targetRect, cardElement) {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  const cardWidth = Math.min(
    cardElement?.getBoundingClientRect().width || CARD_WIDTH,
    viewportWidth - VIEWPORT_PADDING * 2
  )

  const cardHeight =
    cardElement?.getBoundingClientRect().height || 340

  if (!targetRect) {
    return positionCard(null, cardWidth, cardHeight)
  }

  const position = positionCard(
    targetRect,
    cardWidth,
    cardHeight
  )

  return {
    left: Math.min(
      Math.max(position.left, VIEWPORT_PADDING),
      Math.max(
        VIEWPORT_PADDING,
        viewportWidth - cardWidth - VIEWPORT_PADDING
      )
    ),
    top: Math.min(
      Math.max(position.top, VIEWPORT_PADDING),
      Math.max(
        VIEWPORT_PADDING,
        viewportHeight - cardHeight - VIEWPORT_PADDING
      )
    ),
  }
}

export default function TourRunner() {
  const navigate = useNavigate()
  const location = useLocation()

  const cardRef = useRef(null)
  const targetRef = useRef(null)
  const targetCleanupRef = useRef(null)
  const retryTimerRef = useRef(null)

  const [tour, setTour] = useState(() => readTour())
  const [targetRect, setTargetRect] = useState(null)
  const [cardPosition, setCardPosition] = useState({
    top: 100,
    left: 100,
  })
  const [targetMissing, setTargetMissing] = useState(false)

  const activeStep = tour?.steps?.[tour.index] ?? null
  const isRunning = Boolean(tour)
  const isIntro = tour?.phase === 'intro'

  const releaseTarget = useCallback(() => {
    if (retryTimerRef.current) {
      window.clearTimeout(retryTimerRef.current)
      retryTimerRef.current = null
    }

    targetCleanupRef.current?.()
    targetCleanupRef.current = null
    targetRef.current = null
  }, [])

  const closeTour = useCallback(() => {
    releaseTarget()
    stopAppTour()
    setTour(null)
    setTargetRect(null)
    setTargetMissing(false)
  }, [releaseTarget])

  const beginTour = useCallback(() => {
    setTour((current) => {
      if (!current) {
        return current
      }

      const next = {
        ...current,
        phase: 'tour',
      }

      saveTour(next)
      return next
    })
  }, [])

  const goToStep = useCallback((index) => {
    setTour((current) => {
      if (!current) {
        return current
      }

      if (index < 0) {
        return current
      }

      if (index >= current.steps.length) {
        return current
      }

      const next = {
        ...current,
        index,
        phase: 'tour',
      }

      saveTour(next)
      return next
    })

    releaseTarget()
    setTargetRect(null)
    setTargetMissing(false)
  }, [releaseTarget])

  const goNext = useCallback(() => {
    if (!tour) {
      return
    }

    if (tour.index >= tour.steps.length - 1) {
      closeTour()
      return
    }

    goToStep(tour.index + 1)
  }, [tour, goToStep, closeTour])

  const goBack = useCallback(() => {
    if (!tour || tour.index === 0) {
      return
    }

    goToStep(tour.index - 1)
  }, [tour, goToStep])

  /*
   * Listen for tours launched from the account menu or other
   * existing tour entry points.
   */
  useEffect(() => {
    const syncTour = () => {
      releaseTarget()
      setTour(readTour())
      setTargetRect(null)
      setTargetMissing(false)
    }

    window.addEventListener('meetai-tour-start', syncTour)
    window.addEventListener('meetai-tour-stop', syncTour)

    return () => {
      window.removeEventListener('meetai-tour-start', syncTour)
      window.removeEventListener('meetai-tour-stop', syncTour)
    }
  }, [releaseTarget])

  /*
   * Keyboard controls.
   */
  useEffect(() => {
    if (!isRunning) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeTour()
      } else if (
        event.key === 'ArrowRight' &&
        !isIntro
      ) {
        goNext()
      } else if (
        event.key === 'ArrowLeft' &&
        !isIntro &&
        tour?.index > 0
      ) {
        goBack()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    isRunning,
    isIntro,
    tour?.index,
    closeTour,
    goNext,
    goBack,
  ])

  /*
   * Navigate to the route required by the active step.
   */
  useEffect(() => {
    if (
      !tour ||
      tour.phase !== 'tour' ||
      !activeStep?.path
    ) {
      return
    }

    if (location.pathname !== activeStep.path) {
      navigate(activeStep.path)
    }
  }, [
    tour?.phase,
    activeStep?.path,
    location.pathname,
    navigate,
  ])

  /*
   * Locate the current target after route rendering.
   * Missing selectors do not crash the app or trap the user.
   */
  useLayoutEffect(() => {
    if (
      !tour ||
      tour.phase !== 'tour' ||
      !activeStep
    ) {
      releaseTarget()
      setTargetRect(null)
      return undefined
    }

    if (
      activeStep.path &&
      location.pathname !== activeStep.path
    ) {
      return undefined
    }

    let cancelled = false
    let attempts = 0

    const updatePosition = () => {
      const element = targetRef.current

      if (!element?.isConnected) {
        setTargetRect(null)
        return
      }

      const rect = rectOf(element)

      if (!rect || rect.width <= 0 || rect.height <= 0) {
        setTargetRect(null)
        return
      }

      setTargetRect(rect)
      setCardPosition(
        getPosition(rect, cardRef.current)
      )
    }

    const locate = () => {
      if (cancelled) {
        return
      }

      const element = findTarget(activeStep.target)

      if (!element) {
        attempts += 1

        if (attempts < TARGET_RETRY_LIMIT) {
          retryTimerRef.current = window.setTimeout(
            locate,
            TARGET_RETRY_DELAY
          )
        } else {
          setTargetMissing(true)
          setTargetRect(null)
          setCardPosition(
            getPosition(null, cardRef.current)
          )
        }

        return
      }

      setTargetMissing(false)

      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      })

      targetRef.current = element

      // Track layout changes while the step remains active.
      window.addEventListener('resize', updatePosition)
      window.addEventListener('scroll', updatePosition, true)

      let observer

      if (typeof ResizeObserver !== 'undefined') {
        observer = new ResizeObserver(updatePosition)
        observer.observe(element)
      }

      const cleanup = () => {
        window.removeEventListener('resize', updatePosition)
        window.removeEventListener('scroll', updatePosition, true)
        observer?.disconnect()
      }

      targetCleanupRef.current = cleanup

      // Initial update plus a second pass after smooth scrolling starts.
      updatePosition()
      retryTimerRef.current = window.setTimeout(
        updatePosition,
        220
      )
    }

    locate()

    return () => {
      cancelled = true
      releaseTarget()
    }
  }, [
    tour?.index,
    tour?.phase,
    activeStep?.target,
    activeStep?.path,
    location.pathname,
    releaseTarget,
  ])

  /*
   * Keep the floating card in view when its content or viewport changes.
   */
  useLayoutEffect(() => {
    if (!isRunning || isIntro) {
      return undefined
    }

    const update = () => {
      setCardPosition(
        getPosition(targetRect, cardRef.current)
      )
    }

    update()

    if (
      typeof ResizeObserver === 'undefined' ||
      !cardRef.current
    ) {
      return undefined
    }

    const observer = new ResizeObserver(update)
    observer.observe(cardRef.current)

    return () => observer.disconnect()
  }, [
    isRunning,
    isIntro,
    targetRect,
    tour?.index,
    targetMissing,
  ])

  /*
   * Start a tour only when an explicit UI action requests it.
   * Existing App tour menu handlers can call startAppTour(APP_TOUR_STEPS).
   */
  if (!tour) {
    return null
  }

  if (isIntro) {
    return (
      <TourIntro
        onStart={beginTour}
        onSkip={closeTour}
      />
    )
  }

  if (!activeStep) {
    return null
  }

  return (
    <>
      {targetRect ? (
        <TourOverlay targetRect={targetRect} />
      ) : (
        <Fade in>
          <Box
            aria-hidden="true"
            sx={{
              position: 'fixed',
              inset: 0,
              zIndex: 1400,
              bgcolor: COLORS.overlay,
              pointerEvents: 'none',
              transition: 'background-color 180ms ease',
            }}
          />
        </Fade>
      )}

      {targetMissing && (
        <Box
          role="status"
          sx={{
            position: 'fixed',
            zIndex: 1401,
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: 'calc(100vw - 32px)',
            px: 1.75,
            py: 1,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '10px',
            bgcolor: '#fff',
            color: COLORS.navy,
            boxShadow: '0 8px 24px rgba(23, 36, 55, 0.12)',
            fontSize: '0.8125rem',
            fontWeight: 500,
            textAlign: 'center',
          }}
        >
          This section isn't visible yet. You can continue the tour or skip it.
        </Box>
      )}

      <TourCard
        ref={cardRef}
        step={activeStep}
        index={tour.index}
        total={tour.steps.length}
        position={cardPosition}
        onNext={goNext}
        onBack={goBack}
        onClose={closeTour}
      />
    </>
  )
}
