import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { Edit, Camera, MapPin } from 'lucide-react';
import { apiFetchUser } from '../../../services/api';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const UserProfilePage = ({ currentUser, setCurrentUser }) => {
    const [profile, setProfile] = useState({ fullName: '', email: '', phone: '', address: '', profilePicture: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [initialProfile, setInitialProfile] = useState({});
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await apiFetchUser('/profile');
                const data = await response.json();
                const profileData = { ...data.data, address: data.data.address || '' };
                setProfile(profileData);
                setInitialProfile(profileData);
            } catch (error) {
                toast.error(error.message || "Failed to fetch profile.");
            }
        };
        fetchProfile();
    }, []);

    const handleFetchLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser.");
            return;
        }
        setIsFetchingLocation(true);
        toast.info("Fetching your location...");
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    if (!response.ok) throw new Error('Failed to convert location to address.');
                    const data = await response.json();
                    if (data && data.display_name) {
                        setProfile(p => ({ ...p, address: data.display_name }));
                        toast.success("Location fetched successfully!");
                    } else {
                        throw new Error('Could not find address from coordinates.');
                    }
                } catch (error) {
                    toast.error(error.message);
                } finally {
                    setIsFetchingLocation(false);
                }
            },
            (error) => {
                toast.error("Geolocation permission denied. Please enable it in browser settings.");
                setIsFetchingLocation(false);
            }
        );
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('fullName', profile.fullName);
        formData.append('email', profile.email);
        formData.append('phone', profile.phone);
        formData.append('address', profile.address);
        if (profile.newProfilePicture) {
            formData.append('profilePicture', profile.newProfilePicture);
        }
        try {
            const response = await apiFetchUser('/profile', {
                method: 'PUT',
                body: formData
            });
            const data = await response.json();
            const updatedData = { ...data.data, address: data.data.address || '' };
            setProfile(updatedData);
            setInitialProfile(updatedData);
            setCurrentUser(updatedData); // Update parent state
            setIsEditing(false);
            toast.success(data.message || 'Profile updated successfully!');
        } catch (error) {
            toast.error(error.message || 'Failed to update profile.');
        }
    };

    const handleCancel = () => {
        setProfile(initialProfile);
        setIsEditing(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfile(p => ({ ...p, profilePictureUrl: URL.createObjectURL(file), newProfilePicture: file }));
        }
    };

    const handleImageError = (e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName || 'U')}&background=e2e8f0&color=4a5568&size=128`; };
    const profilePictureSrc = profile.profilePictureUrl || (profile.profilePicture ? `http://localhost:5050/${profile.profilePicture}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName || 'U')}&background=e2e8f0&color=4a5568&size=128`);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Profile</h1>
            <Card>
                <div className="flex justify-end mb-4">
                    {!isEditing && <Button onClick={() => setIsEditing(true)}><Edit size={16} /> Edit Profile</Button>}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 flex flex-col items-center text-center">
                        <img key={profilePictureSrc} src={profilePictureSrc} alt="Profile" className="w-32 h-32 rounded-full object-cover mb-4 ring-4 ring-blue-500/50" onError={handleImageError} />
                        {isEditing && (
                            <>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                                <Button variant="secondary" onClick={() => fileInputRef.current.click()}><Camera size={16} /> Change Picture</Button>
                            </>
                        )}
                        <h2 className="text-2xl font-semibold mt-4 text-gray-800 dark:text-white">{profile.fullName}</h2>
                        <p className="text-gray-500 dark:text-gray-400">{profile.email}</p>
                    </div>
                    <div className="lg:col-span-2 space-y-4">
                        <Input id="fullName" label="Full Name" name="fullName" value={profile.fullName || ''} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} disabled={!isEditing} />
                        <Input id="email" label="Email Address" name="email" type="email" value={profile.email || ''} onChange={(e) => setProfile({ ...profile, email: e.target.value })} disabled={!isEditing} />
                        <Input id="phone" label="Phone Number" name="phone" value={profile.phone || ''} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} disabled={!isEditing} />
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                            <div className="flex items-center gap-2">
                                <textarea id="address" name="address" rows="3"
                                    className="flex-grow px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-600"
                                    value={profile.address || ''}
                                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                    disabled={!isEditing || isFetchingLocation}
                                    placeholder="Click button to fetch or enter manually."
                                />
                                {isEditing && (
                                    <Button type="button" variant="secondary" onClick={handleFetchLocation} disabled={isFetchingLocation} className="shrink-0">
                                        <MapPin size={18} className={isFetchingLocation ? 'animate-pulse' : ''} />
                                    </Button>
                                )}
                            </div>
                        </div>
                        {isEditing && (
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                                <Button onClick={handleSave}>Save Changes</Button>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default UserProfilePage;