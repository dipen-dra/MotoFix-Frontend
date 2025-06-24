// const FormInputWithLabel = ({ id, label, type, placeholder, icon, value, onChange }) => (
//     <div>
//         <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//             {label}
//         </label>
//         <div className="relative rounded-md shadow-sm">
//              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
//                 {icon}
//             </div>
//             <input
//                 id={id}
//                 name={id}
//                 type={type}
//                 autoComplete={type === 'password' ? 'current-password' : 'email'}
//                 required
//                 className="block w-full rounded-md border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white py-2.5 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
//                 placeholder={placeholder}
//                 value={value}          // <-- add value here
//                 onChange={onChange}    // <-- add onChange here
//             />
//         </div>
//     </div>
// );
// export { FormInputWithLabel };

import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from '../../assets/icons';

const FormInputWithLabel = ({ id, label, type, placeholder, icon, value, onChange }) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';

    const handleTogglePassword = () => {
        setShowPassword(prevState => !prevState);
    };

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label}
            </label>
            <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    {icon}
                </div>
                <input
                    id={id}
                    name={id}
                    type={isPassword ? (showPassword ? 'text' : 'password') : type}
                    autoComplete={isPassword ? 'current-password' : 'email'}
                    required
                    className="block w-full rounded-md border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white py-2.5 pl-10 pr-10 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
                {isPassword && (
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                        onClick={handleTogglePassword}
                    >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                )}
            </div>
        </div>
    );
};

export { FormInputWithLabel };