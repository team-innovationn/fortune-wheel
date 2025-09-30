'use client'
import ConfettiEffect from "@/components/ConfettiEffect";
import Header from "@/components/Header";
import { WinnerType } from "@/lib/definitions";
import { useState } from "react";
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

    const views: any = [
        <HomeView key={0} category={category} setCategory={setCategory} setViewIndex={setViewIndex} setRandomRecord={setRandomRecord} />,
        <ProcessingView key={1} setViewIndex={setViewIndex} randomRecord={randomRecord} />,
        <WinnersView key={2} randomRecord={randomRecord} setShowConfetti={setShowConfetti} category={category} />
    ];

    return (
        <>
            {showConfetti && (<div className='z-[100] absolute inset-0'><ConfettiEffect /></div>)}
            <Box minH="100vh"  bgGradient="linear(to-b, #046FC0 0%, #004a99 100%)">
                <Container maxW="6xl" py={10}>
                    <HStack justify="space-between">
                        <Header setViewIndex={setViewIndex} />
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