'use client'
import { CSVSVG, GearSVG, ThrashSVG, UploadSVG } from "@/components/svgs";
import { WinnerType } from "@/lib/definitions";
import { parseFileToRecords, selectWinnersByCategory } from "@/lib/utils";
import { MONTHLY_SUBCATEGORIES, GRAND_PRIZE_SUBCATEGORIES } from "@/lib/constants";
import { Modal, Spin } from "antd";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Select } from 'antd';

type HomePageProps = {
    setRandomRecord: Dispatch<SetStateAction<WinnerType[]>>
    setViewIndex: Dispatch<SetStateAction<number>>
    category: string
    setCategory: Dispatch<SetStateAction<string>>
}

const HomePage: React.FunctionComponent<HomePageProps> = ({ setRandomRecord, setViewIndex, category, setCategory }) => {

    const fileInputRef = useRef<HTMLInputElement>(null);

    // CSV file containing all details
    const [file, setFile] = useState<File | null>(null);
    const [categoryError, setCategoryError] = useState<string | null>(null);
    const [subCategoryError, setSubCategoryError] = useState<string | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const [drawMode, setDrawMode] = useState<'per-division' | 'bank-wide'>('bank-wide');
    const [subCategory, setSubCategory] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    // Clean resources
    useEffect(() => {
        return () => {
            setFile(null);
            setCategoryError(null);
            setSubCategoryError(null);
            setFileError(null);
            setLoading(false);
        }
    }, [])

    // Button to accept file
    const handleClick = () => {
        fileInputRef?.current?.click();
    };

    // File change
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }

        // Get File
        const file = e.target.files[0];

        // Validate file extension
        const fileExtension = file.name.toLowerCase();
        
        if (!fileExtension.match(/\.(csv|xlsx|xls)$/)) {
            setFileError("File selected must be a CSV or XLSX file");
            // Reset the file input value
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        setFile(e.target.files[0]);
        setFileError(null); // Clear any existing errors when file is uploaded

        // Reset the file input value
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Upload file
    const handleUpload = async () => {
        // Clear all errors first
        setCategoryError(null);
        setSubCategoryError(null);
        setFileError(null);

        // Validate required fields
        if (!category) {
            setCategoryError("Please select a category");
            return;
        }

        if (category === 'Monthly Draw' && !subCategory) {
            setSubCategoryError("Please select a Monthly Sub-Category");
            return;
        }

        if (!file) {
            setFileError("Upload a CSV/XLSX file");
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setLoading(true);
        try {
            const records = await parseFileToRecords(file);
            if (!records.length) {
                setFileError("No valid rows found in the uploaded file");
                setLoading(false);
                return;
            }
            const winners = selectWinnersByCategory(category, subCategory, records);

            // Store winners in background but don't show them yet
            setRandomRecord(winners);
            // Close the modal and go to spinning wheel view (ProcessingView)
            setIsModalOpen(false);
            setViewIndex(1);
        } catch (e: any) {
            setFileError(e?.message || 'Failed to parse file');
        } finally {
            setLoading(false);
        }
    };

    // Open modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setCategoryError(null);
        setSubCategoryError(null);
        setFileError(null);
        setIsModalOpen(true);
    };

    const handleOk = () => {
        handleUpload();
    };


    const handleCancel = () => {
        // Reset the file input value
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        setCategoryError(null);
        setSubCategoryError(null);
        setFileError(null);
        setIsModalOpen(false);
    };

    return (

        <>
            {/* Main viewing area */}
            <main className="h-full flex justify-center items-center">
                <button
                    className="flex items-center justify-center bg-[#004773] border border-transparent rounded-sm shadow-sm text-[#E5E5E5] cursor-pointer tracking-widest font-medium text-2xl leading-snug px-3 py-3 relative no-underline transition-all duration-250 select-none touch-action-manipulation align-baseline w-[20rem] h-[4rem] hover:bg-[#004773]/80 hover:shadow-lg hover:-translate-y-1 focus:bg-[#0073a1] focus:shadow-lg active:bg-[#004a5e] active:shadow-sm active:translate-y-0 opacity-95" role="button"
                    onClick={showModal}
                >
                    <span className={"font-Killam-Bold"}>Start</span>
                </button>
            </main>

            {/* Modal to Upload CSV File */}
            <Modal 
                title={<>Super Rewards</>} 
                open={isModalOpen} 
                onOk={handleOk} 
                onCancel={handleCancel} 
                okButtonProps={{ 
                    className: 'bg-[#1677ff]',
                    loading: loading,
                    disabled: loading
                }}
                cancelButtonProps={{
                    disabled: loading
                }}
                closable={!loading}
            >
                <Spin 
                    spinning={loading} 
                    tip="Processing your file... This may take a moment for large files."
                    size="large"
                >
                    <div className="flex flex-col gap-y-5" style={{ opacity: loading ? 0.5 : 1 }}>
                    {/* Category */}
                    <div className="flex flex-col gap-y-2">
                        <label htmlFor="input" className="font-medium text-[18px]">Category</label>
                        <Select
                            placeholder="Select Category"
                            style={{ width: "100%", height: 44 }}
                            disabled={loading}
                            onChange={(e) => {
                                setCategory(e);
                                setCategoryError(null); // Clear error when category is selected
                            }}
                            options={[
                                { value: 'Monthly Draw', label: 'Monthly Draw' },
                                { value: 'Quarterly Draw', label: 'Quarterly Draw' },
                                { value: 'Grand Prize', label: 'Grand Prize' },
                            ]}
                        />
                        {categoryError && <p className="text-red-600 text-sm">{categoryError}</p>}
                    </div>

                    {/* Sub-Category (depends on Category) */}
                    {category === 'Monthly Draw' && (
                        <div className="flex flex-col gap-y-2">
                            <label htmlFor="input" className="font-medium text-[18px]">Monthly Sub-Category</label>
                            <Select
                                placeholder="Select Option"
                                style={{ width: "100%", height: 44 }}
                                disabled={loading}
                                onChange={(e) => {
                                    setSubCategory(e);
                                    setSubCategoryError(null); // Clear error when subcategory is selected
                                }}
                                options={MONTHLY_SUBCATEGORIES}
                            />
                            {subCategoryError && <p className="text-red-600 text-sm">{subCategoryError}</p>}
                        </div>
                    )}

                    {category === 'Grand Prize' && (
                        <div className="flex flex-col gap-y-2">
                            <label htmlFor="input" className="font-medium text-[18px]">Grand Prize Sub-Category</label>
                            <Select
                                placeholder="Select Option"
                                style={{ width: "100%", height: 44 }}
                                disabled={loading}
                                onChange={(e) => {
                                    setSubCategory(e);
                                    setSubCategoryError(null); // Clear error when subcategory is selected
                                }}
                                options={GRAND_PRIZE_SUBCATEGORIES}
                            />
                            {subCategoryError && <p className="text-red-600 text-sm">{subCategoryError}</p>}
                        </div>
                    )}

                    {/* Upload file */}
                    <div className="flex flex-col gap-y-3">
                        {/* Files Uploaded */}
                        {file && (
                            <div className="mt-2 border border-gray-200 p-3 flex justify-between items-center rounded-md">
                                <div className="flex gap-x-3 items-center justify-center">
                                    <CSVSVG width={30} height={30} />
                                    <p>{file.name}</p>
                                </div>
                                <button
                                    className="text-red-600 hover:text-red-800"
                                    onClick={() => {
                                        setFile(null);
                                    }}
                                ><ThrashSVG /></button>
                            </div>
                        )}

                        <div className="flex flex-col">
                            {/* Upload button */}
                            {!file && (
                                <div>
                                    <input ref={fileInputRef} onChange={handleFileChange} className="hidden border border-red-600" type="file" id="upload file" accept=".csv,.xlsx,.xls" />
                                    <button
                                        className="p-2 px-3 border border-gray-300 hover:border-gray-400 shadow-sm flex gap-x-3 items-center rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                        type="button"
                                        disabled={loading}
                                        onClick={handleClick}
                                    >
                                        <UploadSVG />
                                        <div>Upload</div>
                                    </button>
                                </div>
                            )}

                            

                        </div>
                        {fileError && <p className="text-red-600 text-sm">{fileError}</p>}
                    </div>
                    </div>
                </Spin>
            </Modal>

        </>
    )
}

function Config() {
    return (
        <div className="flex gap-x-2 items-center">
            <div>Edit configurations </div>
            <div><GearSVG /></div>
        </div>
    )
}

export default HomePage