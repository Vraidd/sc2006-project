"use client"
import { useEffect, useRef, useState } from 'react';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { usePets } from '@/hooks/usePets';
import { 
  Plus, 
  PawPrint, 
  Dog, 
  Pencil, 
  Trash2, 
  X, 
  Upload, 
  AlertTriangle 
} from 'lucide-react';

// DUMMY DATA
const dummyPets = [
    {
        id: 1,
        name: "dawg",
        breed: "Poodle",
        age: 3,
        size: "Medium",
        category: "Dogs",
        vaccinationStatus: "Up to date",
        specialNeeds: ""
    }
];

export default function MyPets() {
    const router = useRouter();
    const { user } = useAuth();
    const { fetchPets, createPet, deletePet, uploadPhoto, loading, error } = usePets();
    const [pets, setPets] = useState<any[]>([]);

    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    // Track which pet is selected for Editing or Deleting
    const [selectedPet, setSelectedPet] = useState<any>(null);

    useEffect(() => {
    const loadPets = async () => {
      const data = await fetchPets();
      setPets(data);
    };
    loadPets();
  }, []);

    // Handlers
    const openEditModal = (pet: any) => {
        setSelectedPet(pet);
    };

    const openDeleteModal = (pet: any) => {
        setSelectedPet(pet);
        setIsDeleteModalOpen(true);
    };

    const handleCreatePet = async (formData: any, photoFile?: File) => {
        try {
            const pet = await createPet({
                ...formData,
                age: Number(formData.age) || 0
            });
            // Success handling
            if (pet) {
                setPets(prev => [...prev, pet]);
                
                // Upload photo if provided
                if (photoFile && pet.id) {
                    const photoUrl = await uploadPhoto(pet.id, photoFile);
                    if (photoUrl) {
                        // Update the pet with the photo URL
                        setPets(prev => prev.map(p => 
                            p.id === pet.id ? { ...p, photo: photoUrl } : p
                        ));
                    }
                }
            }
        } catch (err) {
            console.error('Create error:', err); // Log API response
        }
    };

    const handleDeletePet = async (petId: string) => {
        const ok = await deletePet(petId);
        if (ok) {
        setPets(prev => prev.filter(p => p.id !== petId));
        }
        setIsDeleteModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 py-10">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">My Pets</h1>
                        <p className="text-gray-500 mt-1">Manage your furry, feathered, and scaly friends</p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <Plus size={18} /> Add Pet
                    </button>
                </div>
                {pets.length === 0 ? (
                    // EMPTY STATE
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                        <div className="mb-4 text-gray-300 flex justify-center">
                            <PawPrint size={64} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No pets yet</h3>
                        <p className="text-gray-500 mb-6">Add your first pet to get started</p>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors inline-block shadow-sm"
                        >
                            Add Your First Pet
                        </button>
                    </div>
                ) : (
                    // PET LIST
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pets.map(pet => (
                            <div key={pet.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
                                {/* PET PHOTO AREA */}
                                <div className="h-32 bg-teal-50 flex justify-center items-center group-hover:bg-teal-100 transition-colors overflow-hidden">
                                    {pet.photo ? (
                                        <img 
                                            src={pet.photo} 
                                            alt={pet.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Dog size={48} className="text-teal-500" />
                                    )}
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-gray-800">{pet.name}</h3>
                                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-medium">
                                            {pet.type || pet.size || 'N/A'}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-sm">
                                        {pet.breed || 'Unknown breed'} • {pet.age ? `${pet.age} Years Old` : 'Age unknown'}
                                    </p>
                                </div>
                                
                                <div className="p-5 pt-0">
                                    <div className="flex gap-2 mt-auto pt-2 border-t border-gray-50">
                                        <a
                                            href={`/owner/pet_profile?id=${pet.id}`}
                                            className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-600 font-medium py-2 px-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Pencil size={14} /> Edit
                                        </a>
                                        <button 
                                            onClick={() => openDeleteModal(pet)}
                                            className="border border-red-100 text-red-500 hover:bg-red-50 py-2.5 px-3 rounded-lg transition-colors flex items-center justify-center"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* MODALS */}
            {isAddModalOpen && <AddPetModal onSubmit={handleCreatePet} onClose={() => setIsAddModalOpen(false)} />}
            {isDeleteModalOpen && <DeletePetModal onDelete={handleDeletePet} pet={selectedPet} onClose={() => setIsDeleteModalOpen(false)} />}
        </div>
    );
}
// ADD PET MODAL with Photo Upload
function AddPetModal({ onSubmit, onClose }: { onSubmit: (pet: any, photoFile?: File) => void; onClose: () => void }) {
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        breed: '',
        age: '',
        weight: null,
        vaccinationStatus: '',
        specialNeeds: ''
    });
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        setPhotoFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPhotoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const removePhoto = () => {
        setPhotoFile(null);
        setPhotoPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData, photoFile || undefined);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <h3 className="font-bold text-lg text-gray-800">Add New Pet</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                    <div className="p-6 overflow-y-auto space-y-4">
                        {/* Photo Upload Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handlePhotoSelect}
                                className="hidden"
                                accept="image/*"
                            />
                            {photoPreview ? (
                                <div className="relative w-24 h-24 mx-auto">
                                    <img 
                                        src={photoPreview} 
                                        alt="Pet preview" 
                                        className="w-24 h-24 rounded-xl object-cover border border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={removePhoto}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-sm"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-24 h-24 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                                        <PawPrint size={32} />
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()} 
                                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                                    >
                                        <Upload size={14} /> Upload Photo
                                    </button>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                            <input onChange={handleChange} name="name" type="text" placeholder="Pet's name" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                            <select onChange={handleChange} name="type" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:border-teal-500" required>
                                <option value="">Select category</option>
                                <option value="DOG">Dog</option>
                                <option value="CAT">Cat</option>
                                <option value="BIRD">Bird</option>
                                <option value="FISH">Fish</option>
                                <option value="REPTILE">Reptile</option>
                                <option value="SMALL_ANIMAL">Small Animal</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
                                <input onChange={handleChange} name="breed" type="text" placeholder="e.g., Golden Retriever" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Age (years)</label>
                                <input onChange={handleChange} name="age" type="number" placeholder="e.g., 3" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vaccination Status</label>
                            <input onChange={handleChange} name="vaccinationStatus" type="text" placeholder="e.g., Up to date" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Special Needs / Notes</label>
                            <textarea onChange={handleChange} name='specialNeeds' rows={3} placeholder="Any special care requirements..." className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500 resize-none"></textarea>
                        </div>
                    </div>
                    
                    <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 border border-gray-200 bg-white rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                        <button type='submit' className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors">Add Pet</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

interface DeletePetModalProps {
  pet: any;
  onClose: () => void;
  onDelete: (petId: string) => void;  // ← Add this
}

// DELETE PET MODAL
function DeletePetModal({ pet, onClose, onDelete }: DeletePetModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    if (!pet) return null;
    
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
            onClick={handleOverlayClick}
        >
            <div 
                ref={modalRef}
                className="bg-white rounded-4xl w-full max-w-sm shadow-2xl overflow-hidden text-center p-8 animate-in zoom-in-95 duration-200 border border-slate-100"
            >
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={32} />
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-2">Delete {pet.name}?</h3>
                <p className="text-gray-500 text-sm mb-8">
                    Are you sure you want to remove this pet from your profile? This action cannot be undone and will permanently delete their behavioral blueprint.
                </p>
                
                <div className="flex gap-3">
                    <button 
                        onClick={onClose} 
                        className="flex-1 px-4 py-2.5 border border-gray-200 bg-white rounded-xl text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => onDelete(pet.id)} 
                        className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}