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

import {
  readTour,
  saveTour,
  stopAppTour,
} from './TourStorage'

import {
  findTarget,
  positionCard,
  rectOf,
} from './TourUtils'

const COLORS = {
  navy: '#0B2A4A',
  blue: '#0B57D0',
  blueSoft: '#E8F0FC',
  overlay: 'rgba(11, 42, 74, 0.48)',
  border: '#DFE7EC',
}

const VIEWPORT_PADDING = 16
const CARD_WIDTH = 360
const TARGET_RETRY_LIMIT = 30
const TARGET_RETRY_DELAY = 150

function getPosition(targetRect, cardElement) {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const isSmallScreen = viewportWidth < 640

  const cardWidth = Math.min(
    cardElement?.getBoundingClientRect().width || CARD_WIDTH,
    viewportWidth - VIEWPORT_PADDING * 2,
  )

  const measuredHeight =
    cardElement?.getBoundingClientRect().height || 300

  const maxLeft = Math.max(
    VIEWPORT_PADDING,
    viewportWidth - cardWidth - VIEWPORT_PADDING,
  )

  const centeredLeft = Math.min(
    Math.max((viewportWidth - cardWidth) / 2, VIEWPORT_PADDING),
    maxLeft,
  )

  if (!targetRect) {
    return {
      left: centeredLeft,
      top: VIEWPORT_PADDING,
      maxHeight: `calc(100dvh - ${VIEWPORT_PADDING * 2}px)`,
    }
  }

  if (isSmallScreen) {
    const gap = 12

    const topSpace = Math.max(
      targetRect.top - VIEWPORT_PADDING - gap,
      0,
    )

    const bottomSpace = Math.max(
      viewportHeight -
        targetRect.bottom -
        VIEWPORT_PADDING -
        gap,
      0,
    )

    // Prefer a side that fits the card; otherwise use the
    // side with more space and constrain the card height.
    const placeBelow =
      bottomSpace >= measuredHeight || bottomSpace >= topSpace

    const availableSpace = placeBelow ? bottomSpace : topSpace

    const maxHeight = Math.max(
      150,
      Math.min(
        availableSpace,
        viewportHeight - VIEWPORT_PADDING * 2,
      ),
    )

    const top = placeBelow
      ? Math.min(
          targetRect.bottom + gap,
          viewportHeight - maxHeight - VIEWPORT_PADDING,
        )
      : Math.max(
          VIEWPORT_PADDING,
          targetRect.top - gap - maxHeight,
        )

    return {
      left: centeredLeft,
      top,
      maxHeight: `${maxHeight}px`,
    }
  }

  const position = positionCard(
    targetRect,
    cardWidth,
    measuredHeight,
  )

  return {
    left: Math.min(
      Math.max(position.left, VIEWPORT_PADDING),
      maxLeft,
    ),
    top: Math.min(
      Math.max(position.top, VIEWPORT_PADDING),
      Math.max(
        VIEWPORT_PADDING,
        viewportHeight - measuredHeight - VIEWPORT_PADDING,
      ),
    ),
  }
}

/**
 * Scroll the active tour target according to the options
 * supplied in the current tours.js step.
 *
 * scrollStart: align the target to the top of its scroll viewport.
 * scrollTop: scroll the window to the top of the page.
 * Default: retain responsive smooth scrolling.
 */
function scrollToStepTarget(element, step) {
  if (!element) return

  if (step?.scrollStart === true) {
    element.scrollIntoView({
      behavior: 'auto',
      block: 'start',
      inline: 'nearest',
    })
    return
  }

  if (step?.scrollTop === true) {
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    })
    return
  }

  element.scrollIntoView({
    behavior: 'smooth',
    block: window.innerWidth < 640 ? 'start' : 'center',
    inline: 'nearest',
  })
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
      if (!current) return current

      const next = {
        ...current,
        phase: 'tour',
      }

      saveTour(next)
      return next
    })
  }, [])

  const goToStep = useCallback(
    (index) => {
      setTour((current) => {
        if (!current) return current

        if (index < 0 || index >= current.steps.length) {
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
    },
    [releaseTarget],
  )

  const goNext = useCallback(() => {
    if (!tour) return

    if (tour.index >= tour.steps.length - 1) {
      closeTour()
      return
    }

    goToStep(tour.index + 1)
  }, [tour, goToStep, closeTour])

  const goBack = useCallback(() => {
    if (!tour || tour.index === 0) return

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
    if (!isRunning) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeTour()
      } else if (event.key === 'ArrowRight' && !isIntro) {
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
   * Locate the active target after route rendering, scroll it
   * according to the step options, then track its position.
   */
  useLayoutEffect(() => {
    if (
      !tour ||
      tour.phase !== 'tour' ||
      !activeStep
    ) {
      releaseTarget()
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
    let observer

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
      setCardPosition(getPosition(rect, cardRef.current))
    }

    const locate = () => {
      if (cancelled) return

      const element = findTarget(activeStep.target)

      if (!element) {
        attempts += 1

        if (attempts < TARGET_RETRY_LIMIT) {
          retryTimerRef.current = window.setTimeout(
            locate,
            TARGET_RETRY_DELAY,
          )
        } else {
          setTargetMissing(true)
          setTargetRect(null)
          setCardPosition(getPosition(null, cardRef.current))
        }

        return
      }

      setTargetMissing(false)
      targetRef.current = element

      // Apply the current step's scroll behavior.
      scrollToStepTarget(element, activeStep)

      // Track position changes caused by scrolling, resizing,
      // and layout changes while the step remains active.
      window.addEventListener('resize', updatePosition)
      window.addEventListener('scroll', updatePosition, true)

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

      // Calculate immediately and again after scrolling/layout updates.
      updatePosition()

      retryTimerRef.current = window.setTimeout(
        updatePosition,
        activeStep.scrollStart === true ||
          activeStep.scrollTop === true
          ? 80
          : 220,
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
    activeStep?.scrollStart,
    activeStep?.scrollTop,
    location.pathname,
    releaseTarget,
  ])

  /*
   * Keep the floating card positioned when its content,
   * target, or viewport dimensions change.
   */
  useLayoutEffect(() => {
    if (!isRunning || isIntro) {
      return undefined
    }

    const update = () => {
      setCardPosition(getPosition(targetRect, cardRef.current))
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
   * Do not render anything when no tour is active.
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
            boxShadow: '0 8px 24px rgba(11, 42, 74, 0.12)',
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