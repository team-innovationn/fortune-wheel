'use client'
import { ReactNode } from 'react'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
    colors: { brand: { primary: '#046FC0', secondary: '#FABA02' } },
    fonts: { body: 'Inter, system-ui, sans-serif', heading: 'Inter, system-ui, sans-serif' }
})

export default function Providers({ children }: { children: ReactNode }) {
    return <ChakraProvider theme={theme}>{children}</ChakraProvider>
}


