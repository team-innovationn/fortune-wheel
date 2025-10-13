'use client'
import Image from "next/image"
import { Dispatch, SetStateAction } from "react"

type HeaderProp = {
    setViewIndex: Dispatch<SetStateAction<number>>
    onClearHistory?: () => void
}

const Header: React.FC<HeaderProp> = ({ setViewIndex, onClearHistory }) => {

    // Reload page
    function reloadPage() {
        setViewIndex(0);
    }

    return (
        <>
            <header className="absolute w-full px-4 z-[20000]">
                <nav className="container mx-auto flex justify-between items-center py-3">

                    {/* Ecobank Logo */}
                    <Image src="/images/super_rewards.svg" className="cursor-pointer" onClick={reloadPage} width={188} height={106} alt="logo" />

                   
                </nav>
            </header>
        </>
    )
}

export default Header