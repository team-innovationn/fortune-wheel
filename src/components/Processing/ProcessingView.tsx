'use client'
import { WinnerType } from '@/lib/definitions';
import { CSSProperties, Dispatch, SetStateAction, useEffect, useState } from 'react';
import BeatLoader from "react-spinners/BeatLoader";
import { maskAccountNumber } from '@/lib/utils';
import Wheel from '@/components/Wheel';

type ProcessingViewType = {
    randomRecord: WinnerType[] | null,
    setViewIndex: Dispatch<SetStateAction<number>>
}

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

const ProcessingView: React.FunctionComponent<ProcessingViewType> = ({ setViewIndex, randomRecord }) => {
    const [dsiplayAccts, setDisplayAccts] = useState<boolean>(true);
    const [currentAccount, setCurrentAccount] = useState<WinnerType | null>(null)

    // Set time to Display changing account numbers
    useEffect(() => {
        const intervalId = setInterval(
            () => {
                setDisplayAccts(true);
                setViewIndex(2)
            },
            15000, // every 10 seconds
        );
        return () => clearTimeout(intervalId);
    }, []);

    useEffect(() => {
        if (!randomRecord) {
            return;
        }

        let currentIndex = 0;

        const interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % randomRecord.length;
            setCurrentAccount(randomRecord[currentIndex]);
        }, 50);

        // Cleanup the interval on component unmount
        return () => clearInterval(interval);
    }, [randomRecord]);


    return (
        <>
            <main className="h-full flex flex-col gap-y-9 justify-center items-center">
                {dsiplayAccts && (
                    <>
                        <Wheel
                            labels={randomRecord?.map(r => r.name) ?? []}
                            onFinish={() => setViewIndex(2)}
                        />
                    </>
                )}
                <div className='flex flex-col items-center gap-3'>
                    {/* <p className='text-xl sm:text-2xl md:text-3xl text-pry font-bold'>Processing</p> */}
                    <BeatLoader
                        color={"#006089"}
                        loading={true}
                        cssOverride={override}
                        size={30}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </div>
                {/* <MyComponent setViewIndex={setViewIndex} /> */}

            </main >

        </>
    )
}

export default ProcessingView;
