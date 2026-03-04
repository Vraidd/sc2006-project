"use client"
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PawPrint } from 'lucide-react';

export default function VideoUpload() {
    const params = useParams<{ token: string }>();
    const token = params.token;

    const [uploadState, setUploadState] = useState<'idle' | 'recording' | 'uploading' | 'success' | 'invalid'>('idle');
    const [videoFile, setVideoFile] = useState<File | null>(null);

    useEffect(() => {
        if (!token) {
            setUploadState('invalid');
        }
        // do this later
        // fetch(`/api/validate-token?token=${token}`).then(...)
    }, [token]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setVideoFile(e.target.files[0]);
            setUploadState('recording');
        }
    };

    const handleUpload = async () => {
        if (!videoFile || !token) return;
        setUploadState('uploading');
        
        /*
        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('token', token);

        // TODO WHEN DONE
        await fetch('/api/upload-evidence', {
            method: 'POST',
            body: formData
        });
        */
        
        // simulating API delay
        setTimeout(() => {
            setUploadState('success');
        }, 2500);
    };

    if (uploadState === 'success') {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mb-6 shadow-sm border border-green-200">
                    ✓
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Upload Complete</h1>
                <p className="text-gray-500 max-w-xs">Your 10-15s video check-in has been securely sent to the owner.</p>
                <p className="text-xs text-gray-400 mt-8">You may now close this window.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* HEADER */}
            <header className="p-4 border-b border-gray-100 flex items-center justify-center gap-2 bg-gray-50">
                <span className="text-xl">
                    <PawPrint/>
                </span>
                <span className="font-bold text-slate-900 tracking-tight">P & P Secure Upload</span>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto w-full">
                <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6 w-full mb-8">
                    <h2 className="text-sm font-bold text-teal-800 uppercase tracking-wide mb-1">Check-in Request</h2>
                    <h1 className="text-2xl font-bold text-slate-900">Show Dawg's Status</h1>
                    <p className="text-sm text-gray-600 mt-2">
                        Please record a quick 10-15 second video showing the pet's current environment and well-being.
                    </p>
                </div>

                {
                    uploadState === 'idle' && (
                        <div className="w-full relative">
                            {/* MOBILE CAMERA INPUT */}
                            <input 
                                type="file" 
                                accept="video/*" 
                                capture="environment" // prompts mobile device to open rear camera directly
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                id="camera-input"
                            />
                            <label 
                                htmlFor="camera-input" 
                                className="w-full bg-teal-600 text-white font-bold py-4 rounded-xl shadow-md hover:bg-teal-700 flex flex-col items-center justify-center gap-2 transition-all"
                            >
                                <span className="text-3xl">📷</span>
                                <span>Open Camera</span>
                            </label>
                            <p className="text-xs text-gray-400 mt-4">Video will not be saved to your camera roll.</p>
                        </div>
                    )
                }

                {
                    uploadState === 'recording' && videoFile && (
                        <div className="w-full">
                            <div className="bg-gray-100 rounded-xl p-4 mb-6 border border-gray-200">
                                <span className="text-xl">🎬</span>
                                <p className="font-medium text-sm text-slate-900 mt-2">Video Recorded: {videoFile.name}</p>
                                <p className="text-xs text-gray-500">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                            <button 
                                onClick={handleUpload}
                                className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-md hover:bg-slate-800 transition-all"
                            >
                                Securely Upload Video
                            </button>
                            <button 
                                onClick={() => setUploadState('idle')}
                                className="w-full mt-3 py-3 text-sm font-medium text-gray-500 hover:text-gray-800"
                            >
                                Retake Video
                            </button>
                        </div>
                    )
                }

                {
                    uploadState === 'uploading' && (
                        <div className="w-full py-10">
                            <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="font-medium text-slate-900">Encrypting & Uploading...</p>
                            <p className="text-xs text-gray-500 mt-1">Please keep this window open.</p>
                        </div>
                    )
                }

                {
                    uploadState === 'invalid' && (
                        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-4xl mb-6 shadow-sm border border-red-200">
                                ✕
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 mb-2">Invalid or Expired Link</h1>
                            <p className="text-gray-500 max-w-xs">This check-in link is no longer valid. Please ask the pet owner to generate a new one.</p>
                        </div>
                    )
                }
            </main>
        </div>
    );
}