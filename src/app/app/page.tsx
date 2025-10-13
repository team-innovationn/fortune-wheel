'use client'
import ConfettiEffect from "@/components/ConfettiEffect";
import Header from "@/components/Header";
import { WinnerType } from "@/lib/definitions";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Box, Button, Container, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { HomeView } from "@/components";
import { ProcessingView } from "@/components/Processing";
import { WinnersView } from "@/components/Winners";

export default function Home() {
    // View index to render different views
    const [viewIndex, setViewIndex] = useState<number>(0);


    // Set Category
    const [category, setCategory] = useState<string>("");

    // Data of selected records
    const [randomRecord, setRandomRecord] = useState<WinnerType[]>([]);

    // Handle display of confetti
    const [showConfetti, setShowConfetti] = useState<boolean>(false);

    // Load persisted state on mount
    useEffect(() => {
        try {
            const savedCategory = localStorage.getItem('fw_category');
            const savedWinners = localStorage.getItem('fw_winners');
            if (savedCategory) setCategory(savedCategory);
            if (savedWinners) {
                const parsed: WinnerType[] = JSON.parse(savedWinners);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setRandomRecord(parsed);
                    setViewIndex(2);
                }
            }
        } catch (_) {
            // ignore storage errors
        }
    }, []);

    // Persist state when it changes
    useEffect(() => {
        try {
            if (category) {
                localStorage.setItem('fw_category', category);
            }
            if (Array.isArray(randomRecord) && randomRecord.length > 0) {
                localStorage.setItem('fw_winners', JSON.stringify(randomRecord));
            }
        } catch (_) {
            // ignore storage errors
        }
    }, [category, randomRecord]);

    const handleClearHistory = useCallback(() => {
        try {
            localStorage.removeItem('fw_category');
            localStorage.removeItem('fw_winners');
        } catch (_) {
            // ignore
        }
        setCategory("");
        setRandomRecord([]);
        setShowConfetti(false);
        setViewIndex(0);
    }, []);

    const views: any = [
        <HomeView key={0} category={category} setCategory={setCategory} setViewIndex={setViewIndex} setRandomRecord={setRandomRecord} />,
        <ProcessingView key={1} setViewIndex={setViewIndex} randomRecord={randomRecord} />,
        <WinnersView key={2} randomRecord={randomRecord} setShowConfetti={setShowConfetti} category={category} onClearHistory={handleClearHistory} />
    ];

    return (
        <>
            {showConfetti && (<div className='z-[100] absolute inset-0'><ConfettiEffect /></div>)}
            <Box minH="100vh"  bgGradient="linear(to-b, #046FC0 0%, #004a99 100%)">
                <Container maxW="6xl" py={10}>
                    <HStack justify="space-between">
                        <Header setViewIndex={setViewIndex} onClearHistory={handleClearHistory} />
                        <Box />
                    </HStack>

                    {viewIndex !== 2 && (
                        <Stack align="center" spacing={4} mt={10}>
                            <Image src="/images/raffle_draw.svg" width={220} height={96} alt="raffle draw" />
                            <Heading size="lg" color="white">Super Rewards Raffle</Heading>
                            <Text color="whiteAlpha.800">Upload qualified customers, spin, and download results.</Text>
                        </Stack>
                    )}

                    <Box mt={viewIndex !== 2 ? 12 : 4}>{views[viewIndex]}</Box>
                </Container>
            </Box>
        </>
    )

}