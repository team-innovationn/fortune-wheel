'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, Center } from '@chakra-ui/react'

type WheelProps = {
    labels: string[] // optional; used only to determine segment count if provided
    onFinish: (index: number) => void
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

const Wheel: React.FC<WheelProps> = ({ labels, onFinish }) => {
    const [spinning, setSpinning] = useState(false)
    const [angle, setAngle] = useState(0)

    const segmentCount = Math.max(labels?.length || 12, 6)
    const segmentAngle = 360 / segmentCount

    const rafRef = useRef<number | null>(null)
    const startRef = useRef<number | null>(null)
    const startAngleRef = useRef<number>(0)
    const targetAngleRef = useRef<number>(0)
    const durationMs = 3000

    const animate = useCallback((ts: number) => {
        if (startRef.current == null) startRef.current = ts
        const elapsed = ts - startRef.current
        const t = Math.min(1, elapsed / durationMs)
        const eased = easeOutCubic(t)
        const next = startAngleRef.current + eased * (targetAngleRef.current - startAngleRef.current)
        setAngle(next)
        if (t < 1) {
            rafRef.current = requestAnimationFrame(animate)
        } else {
            setSpinning(false)
            const finalAngle = (next % 360 + 360) % 360
            // pointer is at top (0deg). Convert angle to winning index (clockwise)
            const winningIndex = (segmentCount - Math.floor(finalAngle / segmentAngle)) % segmentCount
            onFinish(winningIndex)
        }
    }, [segmentAngle, segmentCount, onFinish])

    const handleSpin = () => {
        if (spinning) return
        const spins = 6 + Math.floor(Math.random() * 4) // 6-9 full rotations
        const targetIndex = Math.floor(Math.random() * segmentCount)
        const targetCenter = targetIndex * segmentAngle + segmentAngle / 2
        startAngleRef.current = angle
        targetAngleRef.current = angle + spins * 360 + (360 - targetCenter) // align center under pointer (top)
        startRef.current = null
        setSpinning(true)
        rafRef.current = requestAnimationFrame(animate)
    }

    useEffect(() => {
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [])

    return (
        <Center flexDir="column" gap={4}>
            <Box position="relative" w={{ base: '320px', md: '460px' }} h={{ base: '320px', md: '460px' }}>
                <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ transform: `rotate(${angle}deg)` }}>
                    {/* Wheel background */}
                    <circle cx="50" cy="50" r="48" fill="#ffffff" stroke="#0b3a70" strokeWidth="1.5" />
                    {Array.from({ length: segmentCount }).map((_, i) => {
                        const start = (i * segmentAngle - 90) * (Math.PI / 180)
                        const end = ((i + 1) * segmentAngle - 90) * (Math.PI / 180)
                        const x1 = 50 + 48 * Math.cos(start)
                        const y1 = 50 + 48 * Math.sin(start)
                        const x2 = 50 + 48 * Math.cos(end)
                        const y2 = 50 + 48 * Math.sin(end)
                        const largeArc = segmentAngle > 180 ? 1 : 0
                        const fill = i % 2 === 0 ? '#046FC0' : '#FABA02'
                        return (
                            <path key={i} d={`M50,50 L${x1},${y1} A48,48 0 ${largeArc} 1 ${x2},${y2} Z`} fill={fill} stroke="#0b3a70" strokeWidth="0.5" />
                        )
                    })}
                </svg>
                {/* Pointer */}
                <Box position="absolute" top="-10px" left="50%" transform="translateX(-50%)" zIndex={5}
                    borderLeft="10px solid transparent" borderRight="10px solid transparent" borderBottom="18px solid #F05252" />
                {/* Hub */}
                <Box position="absolute" inset="0" display="flex" alignItems="center" justifyContent="center">
                    <Box w="14px" h="14px" bg="white" borderRadius="full" boxShadow="md" />
                </Box>
            </Box>
            <Button onClick={handleSpin} isDisabled={spinning} colorScheme="blue">Spin</Button>
        </Center>
    )
}

export default Wheel


