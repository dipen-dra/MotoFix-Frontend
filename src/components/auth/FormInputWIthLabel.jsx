// import React from 'react';

// // export const FormInputWithLabel = ({ id, label, type, placeholder, icon }) => (
// //     <div className="flex flex-col gap-2">
// //         <label htmlFor={id} className="text-gray-800 dark:text-gray-200 font-semibold">{label}</label>
// //         <div className="relative flex items-center border border-gray-200 dark:border-gray-600 rounded-lg h-12 transition-all duration-200 focus-within:border-blue-600">
// //             <span className="pl-3">{icon}</span>
// //             <input
// //                 id={id}
// //                 type={type}
// //                 placeholder={placeholder}
// //                 className="bg-transparent ml-2 rounded-lg border-none w-full h-full focus:outline-none text-gray-800 dark:text-gray-200"
// //                 required
// //             />
// //         </div>
// //     </div>
// // );

// const FormInputWithLabel = ({ id, label, type, placeholder, icon }) => (
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
//             />
//         </div>
//     </div>
// );
// export { FormInputWithLabel };


const FormInputWithLabel = ({ id, label, type, placeholder, icon, value, onChange }) => (
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
                type={type}
                autoComplete={type === 'password' ? 'current-password' : 'email'}
                required
                className="block w-full rounded-md border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white py-2.5 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder={placeholder}
                value={value}          // <-- add value here
                onChange={onChange}    // <-- add onChange here
            />
        </div>
    </div>
);
export { FormInputWithLabel };