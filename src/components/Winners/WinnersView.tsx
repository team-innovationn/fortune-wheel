'use client'
import { WinnerType } from '@/lib/definitions';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { maskPhoneNumber } from '@/lib/utils';
import * as XLSX from 'xlsx';
import { downloadBlob } from '@/lib/utils';
import jsPDF from 'jspdf';
import { Button, HStack, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Select, VStack, Heading, Badge } from '@chakra-ui/react';

type WinnrsViewType = {
    randomRecord: WinnerType[]
    category: string
    setShowConfetti: Dispatch<SetStateAction<boolean>>
    onClearHistory?: () => void
}

const WinnersView: React.FC<WinnrsViewType> = ({ randomRecord, category, setShowConfetti, onClearHistory }) => {
    const [downloaded, setDownloaded] = useState<boolean>(false);
    const [selectedDivision, setSelectedDivision] = useState<string>('all');
    
    // Get unique divisions from the records
    const divisions = Array.from(new Set(randomRecord.map(record => record.division).filter(Boolean)));
    
    // Filter records based on selected division
    const filteredRecords = selectedDivision === 'all' 
        ? randomRecord 
        : randomRecord.filter(record => record.division === selectedDivision);

    useEffect(() => {
        setShowConfetti(true);
        const t = setTimeout(() => setShowConfetti(false), 4000);
        return () => {
            clearTimeout(t);
            setShowConfetti(false);
        }
    }, [])

    // Winners download moved to explicit button per request


    return (
        <Box className="relative h-full" p={6}>
            {/* Enhanced Header Section */}
            <VStack spacing={2} my={4}>
                <Box textAlign="center">
                    <Heading 
                        size="lg" 
                        bgGradient="linear(to-r, #FABA02, #FFD700)" 
                        bgClip="text"
                        fontWeight="extrabold"
                        textTransform="uppercase"
                        letterSpacing="wide"
                        mb={1}
                    >
                        🎉 {category} Winners 🎉
                    </Heading>
                    <Text 
                        color="whiteAlpha.900" 
                        fontSize="sm" 
                        fontWeight="semibold"
                        textShadow="2px 2px 4px rgba(0,0,0,0.3)"
                    >
                        Congratulations to all our amazing winners!
                    </Text>
                    <Badge 
                        colorScheme="yellow" 
                        variant="solid" 
                        px={2} 
                        py={0.5} 
                        borderRadius="full" 
                        fontSize="xs"
                        mt={2}
                    >
                        {filteredRecords.length} Winner{filteredRecords.length !== 1 ? 's' : ''}
                    </Badge>
                </Box>
            </VStack>

            {/* Controls Section */}
            <Box 
                bg="whiteAlpha.100" 
                borderRadius="xl" 
                p={3} 
                mb={4}
                backdropFilter="blur(10px)"
                border="1px solid"
                borderColor="whiteAlpha.200"
            >
                <HStack justify="space-between" wrap="wrap" spacing={4}>
                    {/* Division Filter */}
                    <Box>
                        <Text color="white" fontSize="xs" mb={1} fontWeight="medium">Filter by Division:</Text>
                        <Select
                            value={selectedDivision}
                            onChange={(e) => setSelectedDivision(e.target.value)}
                            bg="white"
                            borderRadius="lg"
                            size="sm"
                            fontSize="xs"
                            maxW="220px"
                            boxShadow="md"
                        >
                            <option value="all">All Divisions ({randomRecord.length})</option>
                            {divisions.map(division => {
                                const count = randomRecord.filter(r => r.division === division).length;
                                return (
                                    <option key={division} value={division}>
                                        {division} ({count})
                                    </option>
                                );
                            })}
                        </Select>
                    </Box>

                    {/* Download Buttons */}
                    <HStack spacing={3}>
                        <Button 
                            size="xs"
                            colorScheme="red"
                            color="white"
                            borderRadius="xl"
                            px={3}
                            fontWeight="semibold"
                            _hover={{ filter: 'brightness(0.95)' }}
                            onClick={onClearHistory}
                        >
                            🧹 Clear History
                        </Button>
                        <Button 
                            size="xs" 
                            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            color="white"
                            borderRadius="xl"
                            fontWeight="semibold"
                            px={3}
                            _hover={{
                                transform: "translateY(-2px)",
                                boxShadow: "0 10px 25px rgba(102, 126, 234, 0.3)"
                            }}
                            _active={{
                                transform: "translateY(0)"
                            }}
                            transition="all 0.2s"
                            onClick={() => {
                                const ws = XLSX.utils.json_to_sheet(filteredRecords);
                    const csv = XLSX.utils.sheet_to_csv(ws);
                    const csvBlob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                                downloadBlob(csvBlob, `${category} - winners.csv`);
                            }}
                        >
                            📊 Download CSV
                        </Button>
                        <Button 
                            size="xs"
                            bg="linear-gradient(135deg, #FABA02, #FFD700)"
                            color="white"
                            borderRadius="xl"
                            fontWeight="semibold"
                            px={3}
                            _hover={{
                                transform: "translateY(-2px)",
                                boxShadow: "0 10px 25px rgba(250, 186, 2, 0.3)"
                            }}
                            _active={{
                                transform: "translateY(0)"
                            }}
                            transition="all 0.2s"
                            onClick={() => {
                    const doc = new jsPDF();
                    doc.setFontSize(14);
                                doc.text(`${category} Winners`, 14, 20);
                    doc.setFontSize(10);
                                filteredRecords.forEach((r, idx) => {
                        const y = 30 + idx * 6;
                        if (y > 280) return; // simple single-page cap
                        doc.text(`${idx + 1}. ${r.name} - ${r.branchName}`, 14, y);
                    });
                                doc.save(`${category} - report.pdf`);
                            }}
                        >
                            📄 Download PDF
                        </Button>
                    </HStack>
            </HStack>
            </Box>
            {/* Enhanced Table */}
            <Box 
                bg="white" 
                borderRadius="xl" 
                overflow="hidden" 
                boxShadow="2xl"
                border="1px solid"
                borderColor="gray.200"
            >
                <TableContainer maxH="60vh" overflowY="auto">
                    <Table variant="simple" size="sm">
                        <Thead bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                            <Tr>
                                <Th 
                                    color="white" 
                                    fontWeight="bold" 
                                    fontSize="xs"
                                    textTransform="uppercase"
                                    letterSpacing="wider"
                                    sx={{ position: 'sticky', top: 0, zIndex: 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                                >
                                    S/N
                                </Th>
                                <Th 
                                    color="white" 
                                    fontWeight="bold" 
                                    fontSize="xs"
                                    textTransform="uppercase"
                                    letterSpacing="wider"
                                    sx={{ position: 'sticky', top: 0, zIndex: 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                                >
                                    Account Name
                                </Th>
                                <Th 
                                    color="white" 
                                    fontWeight="bold" 
                                    fontSize="xs"
                                    textTransform="uppercase"
                                    letterSpacing="wider"
                                    sx={{ position: 'sticky', top: 0, zIndex: 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                                >
                                    Phone (Masked)
                                </Th>
                                <Th 
                                    color="white" 
                                    fontWeight="bold" 
                                    fontSize="xs"
                                    textTransform="uppercase"
                                    letterSpacing="wider"
                                    sx={{ position: 'sticky', top: 0, zIndex: 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                                >
                                    Branch Name
                                </Th>
                                <Th 
                                    color="white" 
                                    fontWeight="bold" 
                                    fontSize="xs"
                                    textTransform="uppercase"
                                    letterSpacing="wider"
                                    sx={{ position: 'sticky', top: 0, zIndex: 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                                >
                                    Division
                                </Th>
                                <Th 
                                    color="white" 
                                    fontWeight="bold" 
                                    fontSize="xs"
                                    textTransform="uppercase"
                                    letterSpacing="wider"
                                    sx={{ position: 'sticky', top: 0, zIndex: 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                                >
                                    Region
                                </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                            {filteredRecords.map((record: WinnerType, index) => (
                                <Tr 
                                    key={index} 
                                    _hover={{ 
                                        bg: 'blue.50',
                                        transform: 'scale(1.01)',
                                        boxShadow: 'md'
                                    }}
                                    transition="all 0.2s"
                                    bg={index % 2 === 0 ? 'gray.50' : 'white'}
                                >
                                    <Td fontWeight="bold" color="blue.600" fontSize="xs" py={1}>
                                        {index + 1}
                                    </Td>
                                    <Td fontWeight="semibold" color="gray.800" isTruncated title={record.name} fontSize="xs" py={1}>
                                        {record.name}
                                    </Td>
                                    <Td color="gray.600" fontFamily="mono" fontSize="xs" py={1}>
                                        {maskPhoneNumber(record.phoneNumber)}
                                    </Td>
                                    <Td color="gray.700" isTruncated title={record.branchName} fontSize="xs" py={1}>
                                        {record.branchName}
                                    </Td>
                                    <Td>
                                        <Badge 
                                            colorScheme="blue" 
                                            variant="subtle" 
                                            borderRadius="full"
                                            px={2}
                                            py={0.5}
                                            fontSize="xs"
                                        >
                                            {record.division || 'N/A'}
                                        </Badge>
                                    </Td>
                                    <Td>
                                        <Badge 
                                            colorScheme="green" 
                                            variant="subtle" 
                                            borderRadius="full"
                                            px={2}
                                            py={0.5}
                                            fontSize="xs"
                                        >
                                            {record.region || 'N/A'}
                                        </Badge>
                                    </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            </Box>
        </Box>
    )
}

export default WinnersView