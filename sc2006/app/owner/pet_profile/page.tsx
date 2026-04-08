"use client"
import { Suspense, useEffect, useRef, useState } from 'react';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, Dog, ClipboardList, Upload, X, PawPrint } from 'lucide-react';
import { useToast } from '@/app/context/ToastContext';
import { usePets } from '@/hooks/usePets';

function PetProfileContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const petId = searchParams.get('id');
    const { fetchPet, updatePet, uploadPhoto, loading } = usePets();
    const { fireToast } = useToast();
    
    const [petData, setPetData] = useState({
        name: '',
        type: '',
        breed: '',
        age: '',
        weight: '',
        vaccinationStatus: '',
        specialNeeds: '',
        photo: null as string | null,
    });
    
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const loadPet = async () => {
            if (!petId) return;
            const pet = await fetchPet(petId);
            if (pet) {
                setPetData({
                    name: pet.name || '',
                    type: pet.type || '',
                    breed: pet.breed || '',
                    age: pet.age?.toString() || '',
                    weight: pet.weight?.toString() || '',
                    vaccinationStatus: pet.vaccinationStatus || '',
                    specialNeeds: pet.specialNeeds || '',
                    photo: pet.photo || null,
                });
                setPhotoPreview(pet.photo || null);
            } else {
                fireToast('danger', 'Pet not found', 'Could not load pet data');
            }
        };
        loadPet();
    }, [petId]);

    const handleChange = (field: string, value: string) => {
        setPetData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!petId) return;
        
        setSaving(true);
        try {
            // If there's a new photo selected, upload it first
            if (photoFile && photoPreview !== petData.photo) {
                const photoUrl = await uploadPhoto(petId, photoFile);
                if (photoUrl) {
                    setPhotoFile(null);
                }
            }
            
            const updatedPet = await updatePet(petId, {
                name: petData.name,
                type: petData.type,
                breed: petData.breed,
                age: petData.age ? parseInt(petData.age) : undefined,
                weight: petData.weight ? parseFloat(petData.weight) : undefined,
                vaccinationStatus: petData.vaccinationStatus,
                specialNeeds: petData.specialNeeds,
            });
            
            // Update local state with the returned pet data
            if (updatedPet) {
                setPetData(prev => ({
                    ...prev,
                    name: updatedPet.name || prev.name,
                    type: updatedPet.type || prev.type,
                    breed: updatedPet.breed || prev.breed,
                    age: updatedPet.age?.toString() || prev.age,
                    weight: updatedPet.weight?.toString() || prev.weight,
                    vaccinationStatus: updatedPet.vaccinationStatus || prev.vaccinationStatus,
                    specialNeeds: updatedPet.specialNeeds || prev.specialNeeds,
                    photo: updatedPet.photo || prev.photo,
                }));
            }
            
            fireToast('success', 'Profile Updated', 'Changes saved to the Behavioral Blueprint.');
            
            // Navigate back to my pets list after successful save
            setTimeout(() => {
                router.push('/owner/my_pets');
            }, 1500);
        } catch (err) {
            fireToast('danger', 'Save Failed', 'Could not save changes');
        } finally {
            setSaving(false);
        }
    };

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            fireToast('danger', 'Invalid File', 'Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            fireToast('danger', 'File Too Large', 'File size must be less than 5MB');
            return;
        }

        setPhotoFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPhotoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleUploadPhoto = async () => {
        if (!petId || !photoFile) return;
        
        setUploadingPhoto(true);
        try {
            const photoUrl = await uploadPhoto(petId, photoFile);
            if (photoUrl) {
                setPetData(prev => ({ ...prev, photo: photoUrl }));
                setPhotoFile(null);
                fireToast('success', 'Photo Updated', 'New photo has been uploaded');
            } else {
                fireToast('danger', 'Upload Failed', 'Could not upload photo');
            }
        } catch (err) {
            fireToast('danger', 'Upload Failed', 'Could not upload photo');
        } finally {
            setUploadingPhoto(false);
        }
    };

    const cancelPhotoChange = () => {
        setPhotoFile(null);
        setPhotoPreview(petData.photo);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const hasPhotoChanged = photoPreview !== petData.photo;

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 py-10">
                <div className="mb-6">
                    <Link href="/owner/my_pets" className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1 mb-4">
                        <ChevronLeft size={16} /> Back to My Pets
                    </Link>
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{petData.name || 'Pet'}'s Profile</h1>
                            <p className="text-gray-500 mt-1">Manage behavioral blueprint and care instructions</p>
                        </div>
                        <button 
                            onClick={handleSave} 
                            disabled={saving || loading}
                            className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-medium py-2.5 px-6 rounded-lg transition-colors shadow-sm"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                {/* HIDDEN FILE INPUT */}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handlePhotoSelect}
                    accept="image/*"
                    className="hidden" 
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                            {/* PET PHOTO DISPLAY */}
                            <div className="w-32 h-32 mx-auto bg-teal-50 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-sm overflow-hidden">
                                {photoPreview ? (
                                    <img 
                                        src={photoPreview} 
                                        alt={petData.name || 'Pet'}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Dog size={48} className="text-teal-500" />
                                )}
                            </div>
                            
                            {/* Photo change controls */}
                            {hasPhotoChanged ? (
                                <div className="space-y-2">
                                    <button 
                                        onClick={handleUploadPhoto}
                                        disabled={uploadingPhoto || !photoFile}
                                        className="text-teal-600 hover:text-teal-700 disabled:text-gray-400 text-sm font-medium border border-teal-100 bg-teal-50 hover:bg-teal-100 disabled:bg-gray-50 py-2 px-4 rounded-lg w-full transition-colors flex items-center justify-center gap-2"
                                    >
                                        {uploadingPhoto ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-teal-600/30 border-t-teal-600 rounded-full animate-spin" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload size={14} /> Upload New Photo
                                            </>
                                        )}
                                    </button>
                                    <button 
                                        onClick={cancelPhotoChange}
                                        className="text-gray-500 hover:text-gray-600 text-sm font-medium py-2 px-4 rounded-lg w-full transition-colors flex items-center justify-center gap-2"
                                    >
                                        <X size={14} /> Cancel
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={triggerFileSelect}
                                    className="text-teal-600 hover:text-teal-700 text-sm font-medium border border-teal-100 bg-teal-50 py-2 px-4 rounded-lg w-full transition-colors active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <Upload size={14} /> Change Photo
                                </button>
                            )}
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                            <h3 className="font-bold text-gray-800 border-b border-gray-50 pb-2">Basic Details</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                                <input 
                                    type="text" 
                                    value={petData.name} 
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Type</label>
                                <select 
                                    value={petData.type} 
                                    onChange={(e) => handleChange('type', e.target.value)}
                                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500"
                                >
                                    <option value="">Select type</option>
                                    <option value="DOG">Dog</option>
                                    <option value="CAT">Cat</option>
                                    <option value="BIRD">Bird</option>
                                    <option value="FISH">Fish</option>
                                    <option value="REPTILE">Reptile</option>
                                    <option value="SMALL_ANIMAL">Small Animal</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Breed</label>
                                <input 
                                    type="text" 
                                    value={petData.breed} 
                                    onChange={(e) => handleChange('breed', e.target.value)}
                                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500" 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Age</label>
                                    <input 
                                        type="number" 
                                        value={petData.age} 
                                        onChange={(e) => handleChange('age', e.target.value)}
                                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Weight (kg)</label>
                                    <input 
                                        type="number" 
                                        value={petData.weight} 
                                        onChange={(e) => handleChange('weight', e.target.value)}
                                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Vaccination Status</label>
                                <input 
                                    type="text" 
                                    value={petData.vaccinationStatus} 
                                    onChange={(e) => handleChange('vaccinationStatus', e.target.value)}
                                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500" 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-teal-600">
                                    <ClipboardList size={24} />
                                </span>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Behavioral Blueprint</h2>
                                    <p className="text-sm text-gray-500">This information helps match you with the right caregiver.</p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Special Needs / Allergies</label>
                                    <p className="text-sm text-gray-500 mb-2">List any special needs, allergies, or dietary requirements.</p>
                                    <textarea 
                                        value={petData.specialNeeds}
                                        onChange={(e) => handleChange('specialNeeds', e.target.value)}
                                        rows={4} 
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 resize-none" 
                                        placeholder="e.g., Allergic to chicken, requires grain-free food..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function PetProfile() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 font-sans pb-20" />}>
            <PetProfileContent />
        </Suspense>
    );
}